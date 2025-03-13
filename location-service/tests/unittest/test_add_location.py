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
    assert response.json() == {
        "driver_id": 1,
        "latitude": 37.7749,
        "longitude": -122.4194
    }
