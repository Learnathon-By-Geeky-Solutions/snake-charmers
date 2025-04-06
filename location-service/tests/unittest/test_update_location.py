import pytest
from fastapi import status
from app.schemas.main import UpdateDriverLocationRequest, LocationUpdateResponse


def test_update_driver_location_success(client, session):
    """Test successfully updating a driver's location."""
    # First add a driver location
    add_response = client.post(
        "/api/location/add",
        json={
            "driver_id": 1,
            "latitude": 37.7749,
            "longitude": -122.4194
        }
    )
    assert add_response.status_code == status.HTTP_200_OK

    # Prepare the request payload for update
    update_payload = UpdateDriverLocationRequest(
        driver_id=1,
        latitude=40.7128,
        longitude=-74.0060
    )

    # Send the PUT request to update the driver's location
    response = client.put("/api/location/update", json=update_payload.dict())

    # Assert the response status code and content
    assert response.status_code == status.HTTP_200_OK
    update_data = response.json()
    assert update_data["success"] is True

    # Verify the update by retrieving the location
    get_response = client.get(f"/api/location/{1}")
    assert get_response.status_code == status.HTTP_200_OK
    location_data = get_response.json()
    assert location_data["latitude"] == pytest.approx(40.7128)
    assert location_data["longitude"] == pytest.approx(-74.0060)


def test_update_driver_location_not_found(client, session):
    """Test updating a non-existent driver's location."""
    # Use a driver ID that doesn't exist
    update_payload = UpdateDriverLocationRequest(
        driver_id=9999,
        latitude=40.7128,
        longitude=-74.0060
    )

    # Send the PUT request to update the driver's location
    response = client.put("/api/location/update", json=update_payload.dict())

    # Assert the response status code for not found
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_driver_location_invalid_coordinates(client, session):
    """Test updating a driver's location with invalid coordinates."""
    # First add a driver location
    add_response = client.post(
        "/api/location/add",
        json={
            "driver_id": 1,
            "latitude": 37.7749,
            "longitude": -122.4194
        }
    )
    assert add_response.status_code == status.HTTP_200_OK

    # Try to update with invalid latitude (outside -90 to 90 range)
    response = client.put(
        "/api/location/update",
        json={
            "driver_id": 1,
            "latitude": 100.0,  # Invalid latitude
            "longitude": -74.0060
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Try to update with invalid longitude (outside -180 to 180 range)
    response = client.put(
        "/api/location/update",
        json={
            "driver_id": 1,
            "latitude": 40.7128,
            "longitude": 200.0  # Invalid longitude
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY