from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.main import Trip, Rider, EngagedDriver


# Success Scenario: Update Trip Status Successfully
def test_update_trip_status_success(client: TestClient, session: Session):
    
    # Create a trip first
    trip = Trip(
        rider_id=1,
        driver_id=2,
        pickup_location="Loc A",
        destination="Loc B",
        fare=50.0,
        status="ongoing"
    )
    session.add(trip)
    session.commit()
    session.refresh(trip)


    # Update the trip status
    request_data = {
        "trip_id": trip.trip_id,  # Using the generated trip_id
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)

    # Step 5: Validate response
    assert response.status_code == status.HTTP_200_OK


# Scenario: Trip not found for updating status
def test_update_status_trip_not_found(client: TestClient):
    request_data = {
        "trip_id": 999,  # Non-existent trip ID
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Scenario: Missing required fields
def test_update_status_missing_fields(client: TestClient):
    request_data = {
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


# Scenario: Invalid data type for trip ID
def test_update_status_invalid_trip_id(client: TestClient):
    request_data = {
        "trip_id": "abc",  # Invalid trip ID format
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


# Scenario: Invalid status value
def test_update_status_invalid_status_value(client: TestClient, session: Session):
   
    trip = Trip(
        rider_id=1,
        driver_id=2,
        pickup_location="Point A",
        destination="Point B",
        fare=100.0,
        status="ongoing"
    )
    session.add(trip)
    session.commit()
    session.refresh(trip)

    request_data = {
        "trip_id": trip.trip_id,  # Using the generated trip_id
        "status": ""  # Invalid status (empty string)
    }
    response = client.put("/api/trip/update-status", json=request_data)

    # ✅ Validate response
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY