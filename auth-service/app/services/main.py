"""
This module handles user authentication and registration for drivers and riders.
"""

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, Response, Request, HTTPException
from jose import JWTError
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.main import Driver, Rider
from app.utils.security import hash_password, verify_password, create_access_token, verify_token
from app.schemas.main import TokenData

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

# Token retrieval functions
def get_token_from_cookie(request: Request) -> str:
    """
    Get JWT token from cookies only.
    """
    # Check for token in cookies
    token = request.cookies.get("auth_token")
    if token:
        return token
    
    # No token found
    raise credentials_exception


# User existence check functions
def check_email_exists(session: Session, email: str):
    """
    Check if the email is already registered.
    """
    return (
        session.query(Driver).filter(Driver.email == email).first() or
        session.query(Rider).filter(Rider.email == email).first()
    )


def check_mobile_exists(session: Session, mobile: str):
    """
    Check if the mobile number is already registered.
    """
    return (
        session.query(Driver).filter(Driver.mobile == mobile).first() or
        session.query(Rider).filter(Rider.mobile == mobile).first()
    )


def is_email_or_mobile_taken(session: Session, email: str, mobile: str):
    """
    Checks if the given email or mobile is already registered
    for either a driver or a rider.
    """
    email_exists = check_email_exists(session, email)
    mobile_exists = check_mobile_exists(session, mobile)
    
    return email_exists, mobile_exists


# User creation functions
def validate_unique_user_data(session: Session, email: str, mobile: str):
    """
    Validates that email and mobile are not already taken.
    Raises appropriate exceptions if they are.
    """
    email_exists, mobile_exists = is_email_or_mobile_taken(session, email, mobile)
    
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


def create_user_instance(user_type: str, user_data: dict, hashed_password: str):
    """
    Creates a new user instance based on user type.
    """
    if user_type == "driver":
        return Driver(
            name=user_data["name"],
            mobile=user_data["mobile"],
            email=user_data["email"],
            password=hashed_password,
        )
    elif user_type == "rider":
        return Rider(
            name=user_data["name"],
            mobile=user_data["mobile"],
            email=user_data["email"],
            password=hashed_password,
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")


def create_user(session: Session, user_data: dict):
    """
    Registers a new driver or rider.
    Ensures that an email and mobile number cannot be used for both 
    driver and rider roles.
    """
    try:
        # Validate uniqueness of email and mobile
        validate_unique_user_data(session, user_data["email"], user_data["mobile"])
        
        # Hash the password
        hashed_password = hash_password(user_data["password"])
        
        # Create new user instance
        new_user = create_user_instance(user_data["user_type"], user_data, hashed_password)
        
        # Add to database
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


# User authentication functions
def find_user_by_credential(session: Session, phone_or_email: str, user_type: str):
    """
    Find a user by phone or email based on user type.
    """
    if user_type == "driver":
        return (
            session.query(Driver)
            .filter(
                (Driver.email == phone_or_email) |
                (Driver.mobile == phone_or_email)
            )
            .first()
        )
    elif user_type == "rider":
        return (
            session.query(Rider)
            .filter(
                (Rider.email == phone_or_email) |
                (Rider.mobile == phone_or_email)
            )
            .first()
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")


def get_user_id(user, user_type: str):
    """
    Get the appropriate ID field based on user type.
    """
    if user_type == "driver":
        return user.driver_id
    else:
        return user.rider_id


def set_auth_cookie(response: Response, user, user_type: str):
    """
    Set the authentication cookie with JWT token.
    """
    # Get appropriate user ID
    user_id = get_user_id(user, user_type)
    
    # Create token data
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
        expires_delta=timedelta(minutes=7200)
    )
    
    # Set JWT as HTTP-only cookie
    response.set_cookie(
        key="auth_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=432000,
        path="/"
    )


def authenticate_user(
    session: Session,
    phone_or_email: str,
    password: str,
    user_type: str,
    response: Response,
):
    """
    Authenticates a driver or rider using phone or email.
    Sets JWT token as HTTP-only cookie and returns user data.
    """
    try:
        # Find user by credential
        user = find_user_by_credential(session, phone_or_email, user_type)
        
        # Verify user credentials
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Set auth cookie
        set_auth_cookie(response, user, user_type)
        
        # Get user ID
        user_id = get_user_id(user, user_type)
        
        # Return user information
        return {
            "success": True,
            "name": user.name,
            "id": user_id,
            "role": user_type,
            "mobile": user.mobile,
            "email": user.email
        }

    except Exception as exc:
        print(exc)
        session.rollback()
        raise


def get_current_user(token: str = Depends(get_token_from_cookie)):
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
        print(f"JWT Error: {exc}")
        raise credentials_exception