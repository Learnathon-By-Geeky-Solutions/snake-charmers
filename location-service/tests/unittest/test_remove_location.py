import pytest
from fastapi import status


def test_remove_driver_location_success(client, session):
    """Test successfully removing a driver's location."""
    # First add a driver location to remove
    driver_id = 1
    add_response = client.post(
        "/api/location/add",
        json={
            "driver_id": driver_id,
            "latitude": 37.7749,
            "longitude": -122.4194
        }
    )
    assert add_response.status_code == status.HTTP_200_OK

    # Verify the location exists
    get_response = client.get(f"/api/location/{driver_id}")
    assert get_response.status_code == status.HTTP_200_OK

    # Send the DELETE request to remove the driver's location
    response = client.delete(f"/api/location/remove?driver_id={driver_id}")

    # Assert the response status code
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Verify the location no longer exists
    get_after_delete = client.get(f"/api/location/{driver_id}")
    assert get_after_delete.status_code == status.HTTP_404_NOT_FOUND


def test_remove_nonexistent_driver_location(client, session):
    """Test removing a non-existent driver's location."""
    # Use a driver ID that doesn't exist
    non_existent_driver_id = 99999
    
    # Send the DELETE request to remove the driver's location
    response = client.delete(f"/api/location/remove?driver_id={non_existent_driver_id}")
    
    # Assert the response status code for not found
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_remove_driver_location_missing_id(client, session):
    """Test removing a driver's location without providing driver_id."""
    # Send DELETE request without driver_id
    response = client.delete("/api/location/remove")
    
    # Assert the response indicates a validation error
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    

def test_remove_driver_location_invalid_id_format(client, session):
    """Test removing a driver's location with invalid ID format."""
    # Send DELETE request with invalid ID format
    response = client.delete("/api/location/remove?driver_id=invalid_id")
    
    # Assert the response indicates a validation error
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY