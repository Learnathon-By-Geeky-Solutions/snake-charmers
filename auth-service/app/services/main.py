from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.main import Driver, Rider
from app.utils.security import hash_password, verify_password


def create_user(session: Session, name: str, mobile: str, email: str, password: str, user_type: str):
    """
    Registers a new driver or rider.
    """
    if user_type == "driver":
        existing_user = session.query(Driver).filter((Driver.email == email) | (Driver.mobile == mobile)).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="Driver with this email or mobile already exists")
        hashed_password = hash_password(password)
        new_driver = Driver(name=name, mobile=mobile, email=email, password=hashed_password)
        session.add(new_driver)
        session.commit()
        session.refresh(new_driver)
        return new_driver
    elif user_type == "rider":
        existing_user = session.query(Rider).filter((Rider.email == email) | (Rider.mobile == mobile)).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="Rider with this email or mobile already exists")
        hashed_password = hash_password(password)
        new_rider = Rider(name=name, mobile=mobile, email=email, password=hashed_password)
        session.add(new_rider)
        session.commit()
        session.refresh(new_rider)
        return new_rider
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")


def authenticate_user(session: Session, phone_or_email: str, password: str, user_type: str):
    """
    Authenticates a driver or rider using phone or email.
    """
    if user_type == "driver":
        user = session.query(Driver).filter(
            (Driver.email == phone_or_email) | (Driver.mobile == phone_or_email)
        ).first()
    elif user_type == "rider":
        user = session.query(Rider).filter(
            (Rider.email == phone_or_email) | (Rider.mobile == phone_or_email)
        ).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return user
