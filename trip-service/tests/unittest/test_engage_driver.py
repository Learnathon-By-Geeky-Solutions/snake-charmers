from fastapi import status
from fastapi.testclient import TestClient
# from sqlmodel import Session
from app.main import app

client = TestClient(app)

def test_engage_driver_success():
    # Seed the database with test data
    # seed_data()

    # Create a new trip request
    response = client.post("/api/trip/new-request", json={
        "rider_id": 1,
        "pickup_location": "Point A",
        "destination": "Point B"
    })
    assert response.status_code == status.HTTP_201_CREATED
    req_id = response.json().get("req_id")

    # Engage the driver with the created trip request
    request_data = {
        "req_id": req_id,
        "driver_id": 2
    }
    response = client.post("/api/trip/engage-driver", json=request_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json() == {"success": True}

def test_engage_driver_trip_not_found():
    request_data = {
        "req_id": 999,  # Non-existent request ID
        "driver_id": 2
    }
    response = client.post("/api/trip/engage-driver", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Trip request not found"




### 🧹 Reza!! make sure to delete the test data after the test is done. Do some GPT on how to get this done. 🧹 ###