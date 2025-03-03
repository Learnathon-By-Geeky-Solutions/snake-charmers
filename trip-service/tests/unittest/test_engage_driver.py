from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session
from app.main import app
from app.models.main import TripRequest
from fastapi.testclient import TestClient

client = TestClient(app)

def test_engage_driver_success(client: TestClient, session: Session):

    # Create a new trip request
    trip_request = TripRequest(
        rider_id=1,  # ✅ Use the existing rider_id
        pickup_location="Test Pickup",
        destination="Test Destination"
    )
    session.add(trip_request)
    session.commit()
    session.refresh(trip_request)

    # Engage the driver with the created trip request
    request_data = {
        "req_id": trip_request.req_id,
        "driver_id": 2
    }
    response = client.post("/api/trip/engage-driver", json=request_data)
    assert response.status_code == status.HTTP_201_CREATED

def test_engage_driver_trip_not_found(client: TestClient):
    request_data = {
        "req_id": 999,  # Non-existent request ID
        "driver_id": 2
    }
    response = client.post("/api/trip/engage-driver", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND



