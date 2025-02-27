import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

# Add the 'app' directory to the system path for FastAPI app and models imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../app')))

from app.main import app

# Dynamically import models from the 'app/models' directory
import importlib
models = importlib.import_module("app.models.main")

# Access models dynamically
Driver = getattr(models, "Driver")
Rider = getattr(models, "Rider")

# Use an in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, echo=True)

# Function to provide a database session
def override_get_session():
    with Session(engine) as session:
        yield session

# Ensure all tables are created before the session is used
def init_db():
    SQLModel.metadata.create_all(engine)

# Override FastAPI's dependency to use the in-memory test database
app.dependency_overrides['get_session'] = override_get_session

# Initialize the database before tests
@pytest.fixture(scope="session", autouse=True)
def setup_database():
    print("Initializing the test database...")
    init_db()  # Create all necessary tables
    yield
    print("Dropping the test database...")
    SQLModel.metadata.drop_all(engine)

# Provide a reusable TestClient for all tests
@pytest.fixture
def client():
    return TestClient(app)
