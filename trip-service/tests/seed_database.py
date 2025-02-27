import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from app.tests.conftest import override_get_session

# Add the 'app' directory to the system path for FastAPI app and models imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app.main import app

# Dynamically import models from the 'app/models' directory
import importlib
models = importlib.import_module("app.models.main")

# Access models dynamically
Driver = getattr(models, "Driver")
Rider = getattr(models, "Rider")

# Function to populate the database with dummy data
def seed_data():
    with Session(override_get_session()) as session:
        # Create a dummy rider
        rider = Rider(
            rider_id=1,
            name="Test Rider",
            mobile="1234567890",
            email="rider@test.com",
            password="password123"
        )
        session.add(rider)

        # Create a dummy driver
        driver = Driver(
            driver_id=2,
            name="Test Driver",
            mobile="0987654321",
            email="driver@test.com",
            password="password123",
            ratings=4.5
        )
        session.add(driver)

        session.commit()

# Run the seeder
if __name__ == "__main__":
    seed_data()
    print("Database seeded successfully!")
