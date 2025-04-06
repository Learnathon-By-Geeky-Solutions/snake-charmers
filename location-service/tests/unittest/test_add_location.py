import pytest
from fastapi import status
from app.schemas.main import AddDriverLocationRequest, LocationAddResponse


def test_add_driver_location(client, session):
    """Test adding a driver's location."""
    # Prepare the request payload
    request_payload = AddDriverLocationRequest(
        driver_id=1,
        latitude=37.7749,
        longitude=-122.4194
    )

    # Send the POST request to add the driver's location
    response = client.post("/api/location/add", json=request_payload.dict())

    # Assert the response status code and content
    assert response.status_code == status.HTTP_200_OK


def test_add_duplicate_driver_location(client, session):
    """Test adding a driver's location that already exists."""
    # Add a driver's location first
    request_payload = AddDriverLocationRequest(
        driver_id=1,
        latitude=37.7749,
        longitude=-122.4194
    )
    first_response = client.post("/api/location/add", json=request_payload.dict())
    assert first_response.status_code == status.HTTP_200_OK

    # Try to add the same driver's location again
    second_response = client.post("/api/location/add", json=request_payload.dict())
    
    #API returns an error for duplicates
    assert second_response.status_code == status.HTTP_409_CONFLICT
    

def test_add_driver_location_invalid_coordinates(client, session):
    """Test adding a driver's location with invalid coordinates."""
    # Test with invalid latitude (outside -90 to 90 range)
    invalid_lat_payload = {
        "driver_id": 1,
        "latitude": 100.0,  # Invalid latitude
        "longitude": -122.4194
    }
    response = client.post("/api/location/add", json=invalid_lat_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Test with invalid longitude (outside -180 to 180 range)
    invalid_lon_payload = {
        "driver_id": 1,
        "latitude": 37.7749,
        "longitude": 200.0  # Invalid longitude
    }
    response = client.post("/api/location/add", json=invalid_lon_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_add_driver_location_missing_fields(client, session):
    """Test adding a driver's location with missing required fields."""
    # Missing driver_id
    missing_id_payload = {
        "latitude": 37.7749,
        "longitude": -122.4194
    }
    response = client.post("/api/location/add", json=missing_id_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    # Missing latitude
    missing_lat_payload = {
        "driver_id": 1,
        "longitude": -122.4194
    }
    response = client.post("/api/location/add", json=missing_lat_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    # Missing longitude
    missing_lon_payload = {
        "driver_id": 1,
        "latitude": 37.7749
    }
    response = client.post("/api/location/add", json=missing_lon_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY