from fastapi import status
from fastapi.testclient import TestClient

# Scenario: Successfully remove a trip request
def test_remove_trip_request_success(client: TestClient):
    # Step 1: Create a new trip request to ensure the request exists
    response = client.post("/api/trip/new-request", json={
        "rider_id": 1,
        "pickup_location": "Point A",
        "destination": "Point B"
    })
    assert response.status_code == status.HTTP_201_CREATED
    req_id = response.json().get("req_id")

    # Step 2: Remove the created trip request
    response = client.delete(f"/api/trip/remove-request/{req_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Step 3: Verify the request no longer exists
    response = client.delete(f"/api/trip/remove-request/{req_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Scenario: Attempt to remove a non-existent trip request
def test_remove_trip_request_not_found(client: TestClient):
    response = client.delete("/api/trip/remove-request/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Scenario: Invalid trip request ID format
def test_remove_trip_request_invalid_id(client: TestClient):
    response = client.delete("/api/trip/remove-request/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Edge Case: Attempt to delete with missing ID in the URL
def test_remove_trip_request_missing_id(client: TestClient):
    response = client.delete("/api/trip/remove-request/")
    assert response.status_code == status.HTTP_404_NOT_FOUND
