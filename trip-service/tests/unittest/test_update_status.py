from fastapi import status
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)
# Scenario: Successfully update trip status
def test_update_trip_status_success():
    # Ensure the trip exists before updating the status
    response = client.post("/api/trip/start", json={
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    })
    assert response.status_code == status.HTTP_201_CREATED
    trip_id = response.json().get("trip_id")

    # Update the trip status
    request_data = {
        "trip_id": trip_id,
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_200_OK
    # assert response.json() == {"success": True}

# Scenario: Trip not found for updating status
def test_update_status_trip_not_found():
    request_data = {
        "trip_id": 999,  # Non-existent trip ID
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # assert response.json()["detail"] == "Trip not found"

# Scenario: Missing required fields
def test_update_status_missing_fields():
    request_data = {
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "field required" in str(response.json()["detail"])

# Scenario: Invalid data type for trip ID
def test_update_status_invalid_trip_id():
    request_data = {
        "trip_id": "abc",  # Invalid trip ID format
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "value is not a valid integer" in str(response.json()["detail"])

# Scenario: Invalid status value
def test_update_status_invalid_status_value():
    request_data = {
        "trip_id": 1,
        "status": ""  # Invalid status (empty string)
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "value_error.any_str.min_length" in str(response.json()["detail"])
