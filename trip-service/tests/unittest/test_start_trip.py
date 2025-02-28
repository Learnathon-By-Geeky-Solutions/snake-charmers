from fastapi import status
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)
# Success Scenario
def test_add_trip_success():
    # Ensure the rider and driver exist before starting a trip
    response = client.post("/api/trip/new-request", json={
        "rider_id": 1,
        "pickup_location": "Loc A",
        "destination": "Loc B"
    })
    assert response.status_code == status.HTTP_201_CREATED

    # Add the trip
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert "trip_id" in response.json()

# Scenario: Missing Required Field (Status)
def test_start_trip_missing_status():
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "field required" in str(response.json()["detail"])

# Edge Case: Invalid Data Type for Fare
def test_start_trip_invalid_fare_type():
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
    # assert "value is not a valid float" in str(response.json()["detail"])

# Edge Case: Non-existent Rider ID
def test_start_trip_nonexistent_rider():
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
    # assert response.json()["detail"] == "Rider not found"

# Edge Case: Non-existent Driver ID
def test_start_trip_nonexistent_driver():
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
    # assert response.json()["detail"] == "Driver not found"

# Edge Case: Empty Fields
def test_start_trip_empty_fields():
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
    # assert "value_error.any_str.min_length" in str(response.json()["detail"])
