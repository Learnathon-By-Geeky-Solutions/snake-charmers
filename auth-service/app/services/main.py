"""
This module handles user authentication and registration for drivers and riders.
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.main import Driver, Rider
from app.utils.security import hash_password, verify_password


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

    # ✅ Wrapped in try-except to handle database errors
    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
    except SQLAlchemyError as exc:
        session.rollback()  # Rollback changes in case of error
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while creating user."
        ) from exc

    return new_user


def authenticate_user(
    session: Session,
    phone_or_email: str,
    password: str,
    user_type: str,
):
    """
    Authenticates a driver or rider using phone or email.
    """
    user = None
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
    return user
