import os
from passlib.context import CryptContext
import pytest
from sqlmodel import SQLModel, create_engine, Session, select, delete
from app.main import app
from fastapi.testclient import TestClient
from app.db import get_session
from app.models.main import (
    Rider, 
    Driver,
    DriverLocation,
    Trip,
    TripRequest,
    EngagedDriver
) 

# Initialize database engine
engine = create_engine(os.getenv("DATABASE_URL"))


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def populate_test_data(session):
    """Prepopulate the test database with riders and drivers."""

    riders = [
        Rider(rider_id=1, name="Test Rider 1", mobile="01711111111", email="rider1@gmail.com", password=hash_password(os.getenv("RIDER_PASSWORD_1"))),
        Rider(rider_id=2, name="Test Rider 2", mobile="01722222222", email="rider2@gmail.com", password=hash_password(os.getenv("RIDER_PASSWORD_2"))),
    ]
    
    drivers = [
        Driver(driver_id=1, name="Test Driver 1", mobile="01733333333", email="driver1@gmail.com", password=hash_password(os.getenv("DRIVER_PASSWORD_1"))),
        Driver(driver_id=2, name="Test Driver 2", mobile="01744444444", email="driver2@gmail.com", password=hash_password(os.getenv("DRIVER_PASSWORD_2"))),
    ]

    session.add_all(riders + drivers)
    session.commit()

def delete_test_data(session):

    session.exec(delete(Rider))
    session.exec(delete(Driver))
    session.exec(delete(DriverLocation))
    session.exec(delete(Trip))
    session.exec(delete(TripRequest))
    session.exec(delete(EngagedDriver))
    session.commit()


@pytest.fixture(name="session")
def db_session():
    """Provide a test database session after each test."""
    with Session(engine) as session:

        populate_test_data(session)  # ✅ Call function to add test data
        yield session
        delete_test_data(session)



@pytest.fixture(name="client")
def test_client(session):
    """Provide a FastAPI TestClient using the test database session."""
    
    # Override FastAPI's dependency to use the test session
    def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session 

    client = TestClient(app)
    yield client
    
    # Clear dependency overrides after test
    app.dependency_overrides.clear()