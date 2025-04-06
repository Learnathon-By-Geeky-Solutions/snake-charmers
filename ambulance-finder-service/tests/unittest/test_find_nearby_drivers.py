import pytest
from fastapi import status
from app.schemas.main import NearbyDriversRequest, DriverLocationResponse, DriverLocationCreate
from app.models.main import Driver, DriverLocation, EngagedDriver
from geoalchemy2.functions import ST_GeomFromText


def setup_test_data(session):
    """Setup test drivers and their locations in the database."""
    # Add driver locations around San Francisco (37.7749, -122.4194)
    locations = [
        # Close to reference point (within 5km)
        {"driver_id": 3, "latitude": 37.7649, "longitude": -122.4294, "location": ST_GeomFromText('POINT(-122.4294 37.7649)', 4326)},
        # Also close (within 5km)
        {"driver_id": 4, "latitude": 37.7849, "longitude": -122.4094, "location": ST_GeomFromText('POINT(-122.4094 37.7849)', 4326)},
        # Further away (more than 10km)
        {"driver_id": 5, "latitude": 37.8749, "longitude": -122.6194, "location": ST_GeomFromText('POINT(-122.6194 37.8749)', 4326)},
        # Also far (more than 10km)
        {"driver_id": 6, "latitude": 37.5749, "longitude": -122.1194, "location": ST_GeomFromText('POINT(-122.1194 37.5749)', 4326)}
    ]
    
    for loc in locations:
        driver_location = DriverLocation(**loc)
        session.add(driver_location)
    


def test_find_nearby_drivers_success(client, session):
    """Test successfully finding nearby drivers."""
    # Setup test data
    setup_test_data(session)
    
    # Define search parameters
    params = {
        "lat": 37.7749,
        "lon": -122.4194,
        "radius": 5.0  # 5km radius
    }
    
    # Send the GET request
    response = client.get("/api/ambulance/nearby", params=params)
    
    # Assert response status code
    assert response.status_code == status.HTTP_200_OK
    
    # Parse response
    drivers = response.json()
    
    assert len(drivers) >= 1
    
    # Check that we got the correct driver
    driver_ids = [driver["driver_id"] for driver in drivers]
    assert 3 in driver_ids
    assert 4 in driver_ids  # engaged
    assert 5 not in driver_ids  # too far
    assert 6 not in driver_ids  # too far
    
    # Check driver details
    driver = next(d for d in drivers if d["driver_id"] == 3)
    assert driver["name"] == "John Doe"
    assert driver["mobile"] == "01761234567"


def test_find_nearby_drivers_larger_radius(client, session):
    """Test finding nearby drivers with a larger radius."""
    setup_test_data(session)

    # Define search parameters with larger radius
    params = {
        "lat": 37.7749,
        "lon": -122.4194,
        "radius": 35.0  # 35km radius
    }
    
    # Send the GET request
    response = client.get("/api/ambulance/nearby", params=params)
    
    # Assert response status code
    assert response.status_code == status.HTTP_200_OK
    
    # Parse response
    drivers = response.json()
    
    assert len(drivers) >= 3
    
    # Check that we got the correct drivers
    driver_ids = [driver["driver_id"] for driver in drivers]
    assert 3 in driver_ids
    assert 4 in driver_ids  # engaged
    assert 5 in driver_ids
    assert 6 in driver_ids


def test_find_nearby_drivers_no_results(client, session):
    """Test finding nearby drivers with no results."""
    # Define search parameters for a location with no nearby drivers
    params = {
        "lat": 40.7128,  # New York City coordinates
        "lon": -74.0060,
        "radius": 1.0
    }
    
    # Send the GET request
    response = client.get("/api/ambulance/nearby", params=params)
    
    # Assert response status code (should still be 200, just with empty array)
    assert response.status_code == status.HTTP_200_OK
    
    # Parse response
    drivers = response.json()
    
    # Should be an empty list
    assert len(drivers) == 0
    assert drivers == []


def test_find_nearby_drivers_invalid_parameters(client, session):
    """Test finding nearby drivers with invalid parameters."""
    # Test with invalid latitude
    params = {
        "lat": 100.0,  # Invalid latitude (beyond -90 to 90)
        "lon": -122.4194,
        "radius": 5.0
    }
    response = client.get("/api/ambulance/nearby", params=params)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    # Test with invalid longitude
    params = {
        "lat": 37.7749,
        "lon": -200.0,  # Invalid longitude (beyond -180 to 180)
        "radius": 5.0
    }
    response = client.get("/api/ambulance/nearby", params=params)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    # Test with invalid radius
    params = {
        "lat": 37.7749,
        "lon": -122.4194,
        "radius": -1.0  # Invalid radius (must be positive)
    }
    response = client.get("/api/ambulance/nearby", params=params)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    # Test with missing parameters
    params = {
        "lat": 37.7749,
        "lon": -122.4194
        # Missing radius
    }
    response = client.get("/api/ambulance/nearby", params=params)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY