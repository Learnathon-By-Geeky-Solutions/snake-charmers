from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.main import Rider, EngagedDriver, TripRequest,Driver
# from app.db import get_session  # Function to get DB session


# Success Scenario
def test_add_trip_success(client: TestClient, session: Session):
   
    # Add new trip 
    request_data = {
        "rider_id": 1,
        "driver_id": 1,  
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)

    print("Start Trip Response:", response.status_code, response.json())  # Debugging

    assert response.status_code == status.HTTP_201_CREATED, f"Unexpected response: {response.json()}"
    assert "trip_id" in response.json()



# Scenario: Missing Required Field (Status)
def test_start_trip_missing_status(client: TestClient):
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Edge Case: Invalid Data Type for Fare
def test_start_trip_invalid_fare_type(client: TestClient):
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": "fifty",  # Invalid type for fare
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Edge Case: Non-existent Rider ID
def test_start_trip_nonexistent_rider(client: TestClient):
    request_data = {
        "rider_id": 999,  # Rider does not exist
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Edge Case: Non-existent Driver ID
def test_start_trip_nonexistent_driver(client: TestClient):
    request_data = {
        "rider_id": 1,
        "driver_id": 999,  # Driver does not exist
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Edge Case: Empty Fields
def test_start_trip_empty_fields(client: TestClient):
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "",
        "destination": "",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
