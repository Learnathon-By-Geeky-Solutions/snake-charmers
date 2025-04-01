"""
This module handles user authentication and registration for drivers and riders.
"""

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from jose import JWTError
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.main import Driver, Rider
from app.utils.security import hash_password, verify_password, create_access_token, verify_token
from app.schemas.main import TokenData

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def is_email_or_mobile_taken(session: Session, email: str, mobile: str):
    """
    Checks if the given email or mobile is already registered
    for either a driver or a rider.
    """
    email_exists = (
        session.query(Driver)
        .filter(Driver.email == email)
        .first()
        or session.query(Rider)
        .filter(Rider.email == email)
        .first()
    )

    mobile_exists = (
        session.query(Driver)
        .filter(Driver.mobile == mobile)
        .first()
        or session.query(Rider)
        .filter(Rider.mobile == mobile)
        .first()
    )

    return email_exists, mobile_exists


def create_user(session: Session, user_data: dict):
    """
    Registers a new driver or rider.
    Ensures that an email and mobile number cannot be used for both 
    driver and rider roles.
    """
    email_exists, mobile_exists = is_email_or_mobile_taken(
        session,
        user_data["email"],
        user_data["mobile"],
    )

    try:
        if email_exists:
            raise HTTPException(
                status_code=409,
                detail="This email is already registered. Use a different email."
            )
        if mobile_exists:
            raise HTTPException(
                status_code=409,
                detail="This mobile number is already registered. Use a different mobile."
            )

        hashed_password = hash_password(user_data["password"])

        if user_data["user_type"] == "driver":
            new_user = Driver(
                name=user_data["name"],
                mobile=user_data["mobile"],
                email=user_data["email"],
                password=hashed_password,
            )
        elif user_data["user_type"] == "rider":
            new_user = Rider(
                name=user_data["name"],
                mobile=user_data["mobile"],
                email=user_data["email"],
                password=hashed_password,
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")

        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {
            "success": True,
            "message": f"{user_data['user_type']} {new_user.name} registered successfully",
        }

    except Exception as exc:
        print(exc)
        session.rollback()
        raise 
  

def authenticate_user(
    session: Session,
    phone_or_email: str,
    password: str,
    user_type: str,
):
    """
    Authenticates a driver or rider using phone or email.
    Returns user data with JWT token.
    """
    user = None

    try:
        if user_type == "driver":
            user = (
                session.query(Driver)
                .filter(
                    (Driver.email == phone_or_email)
                    | (Driver.mobile == phone_or_email)
                )
                .first()
            )
        elif user_type == "rider":
            user = (
                session.query(Rider)
                .filter(
                    (Rider.email == phone_or_email)
                    | (Rider.mobile == phone_or_email)
                )
                .first()
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")

        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create token data
        user_id = user.driver_id if user_type == "driver" else user.rider_id
        token_data = {
            "sub": str(user_id),
            "email": user.email,
            "mobile": user.mobile,
            "name": user.name,
            "role": user_type
        }
        
        # Generate JWT token
        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=60)  # Token valid for 1 hour
        )

        return {
            "success": True,
            "name": user.name,
            "id": user_id,
            "role": user_type,
            "mobile": user.mobile,
            "email": user.email,
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as exc:
        print(exc)
        session.rollback()
        raise


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current user from JWT token.
    """
    try:
        # Verify the token
        payload = verify_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        # Create token data
        token_data = TokenData(
            sub=payload.get("sub"),
            email=payload.get("email"),
            mobile=payload.get("mobile"),
            name=payload.get("name"),
            role=payload.get("role")
        )
        
        return token_data

    except JWTError as exc:
        print(exc)
        raise credentials_exception
