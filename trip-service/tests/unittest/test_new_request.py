from fastapi import status
from fastapi.testclient import TestClient
from fastapi.testclient import TestClient

# Success Scenario
def test_add_trip_request(client: TestClient):
    request_data = {
        "rider_id": 1,  
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert "req_id" in response.json()

# Validation Errors
def test_new_request_missing_rider_id(client: TestClient):
    request_data = {
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_new_request_invalid_rider_id(client: TestClient):
    request_data = {
        "rider_id": "abc",  # Invalid data type for rider_id (should be int)
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


# Edge Cases
def test_new_request_nonexistent_rider(client: TestClient):
    request_data = {
        "rider_id": 9999,  # Assuming this rider ID does not exist
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_new_request_empty_fields(client: TestClient):
    request_data = {
        "rider_id": 1,
        "pickup_location": "",
        "destination": ""
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_new_request_extra_fields(client: TestClient):
    request_data = {
        "rider_id": 1,
        "pickup_location": "Point A",
        "destination": "Point B",
        "extra_field": "not_allowed"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
