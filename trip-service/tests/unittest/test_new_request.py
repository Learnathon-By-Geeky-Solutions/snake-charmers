from fastapi import status

# Success Scenario
def test_add_trip_request(client):
    request_data = {
        "rider_id": 1,  # Ensure this rider exists in the seeded database
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert "req_id" in response.json()

# Validation Errors
def test_new_request_missing_rider_id(client):
    request_data = {
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["msg"] == "field required"

def test_new_request_invalid_rider_id(client):
    request_data = {
        "rider_id": "abc",  # Invalid data type for rider_id (should be int)
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["msg"] == "value is not a valid integer"

# Edge Cases
def test_new_request_nonexistent_rider_id(client):
    request_data = {
        "rider_id": 9999,  # Assuming this rider ID does not exist
        "pickup_location": "Point A",
        "destination": "Point B"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Rider not found"

def test_new_request_empty_fields(client):
    request_data = {
        "rider_id": 1,
        "pickup_location": "",
        "destination": ""
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "value_error.any_str.min_length" in str(response.json()["detail"])

def test_new_request_extra_fields(client):
    request_data = {
        "rider_id": 1,
        "pickup_location": "Point A",
        "destination": "Point B",
        "extra_field": "not_allowed"
    }
    response = client.post("/api/trip/new-request", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "extra fields not permitted" in str(response.json()["detail"])
