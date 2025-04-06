import pytest
from fastapi import status
from app.schemas.main import LocationGetResponse


def test_get_driver_location_success(client, session):
    """Test successfully retrieving a driver's location."""
    # First add a driver location to retrieve
    add_response = client.post(
        "/api/location/add",
        json={
            "driver_id": 1,
            "latitude": 37.7749,
            "longitude": -122.4194
        }
    )
    assert add_response.status_code == status.HTTP_200_OK

    # Now retrieve the driver's location
    response = client.get(f"/api/location/{1}")
    
    # Assert the response status code and content
    assert response.status_code == status.HTTP_200_OK
    location_data = response.json()
    assert "latitude" in location_data
    assert "longitude" in location_data
    assert location_data["latitude"] == pytest.approx(37.7749)
    assert location_data["longitude"] == pytest.approx(-122.4194)


def test_get_driver_location_not_found(client, session):
    """Test retrieving a non-existent driver's location."""
    # Use a driver ID that doesn't exist
    non_existent_driver_id = 99999
    
    response = client.get(f"/api/location/{non_existent_driver_id}")
    
    # Assert the response status code for not found
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_driver_location_invalid_id(client, session):
    """Test retrieving a driver's location with invalid ID format."""
    # Try to get location with invalid ID (string instead of integer)
    response = client.get("/api/location/invalid_id")
    
    # Assert the response indicates a validation error
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY