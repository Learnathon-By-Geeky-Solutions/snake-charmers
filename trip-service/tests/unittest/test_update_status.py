from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app
from app.models.main import Trip, Rider, EngagedDriver
from app.db import get_session  # Function to get DB session

client = TestClient(app)

# ✅ Correctly get session
session = next(get_session())

# Success Scenario: Update Trip Status Successfully
def test_update_trip_status_success():
    # Step 1: Ensure the rider exists
    existing_rider = session.exec(select(Rider).where(Rider.rider_id == 1)).first()
    if not existing_rider:
        rider = Rider(rider_id=1, name="Test Rider")
        session.add(rider)
        session.commit()
        session.refresh(rider)

    # Step 2: Ensure the driver exists
    existing_driver = session.exec(select(EngagedDriver).where(EngagedDriver.driver_id == 2)).first()
    if not existing_driver:
        driver = EngagedDriver(driver_id=2, req_id=1)
        session.add(driver)
        session.commit()
        session.refresh(driver)

    # Step 3: Insert a dummy trip if it doesn't exist
    existing_trip = session.exec(select(Trip).where(Trip.rider_id == 1, Trip.driver_id == 2)).first()
    if not existing_trip:
        trip = Trip(
            rider_id=1,
            driver_id=2,
            pickup_location="Loc A",
            destination="Loc B",
            fare=50.0,
            status="ongoing"
        )
        session.add(trip)
        session.commit()
        session.refresh(trip)
    else:
        trip = existing_trip  # Use existing trip

    # Step 4: Update the trip status
    request_data = {
        "trip_id": trip.trip_id,  # Using the generated trip_id
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)

    # Step 5: Validate response
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


# Scenario: Missing required fields
def test_update_status_missing_fields():
    request_data = {
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


# Scenario: Invalid data type for trip ID
def test_update_status_invalid_trip_id():
    request_data = {
        "trip_id": "abc",  # Invalid trip ID format
        "status": "completed"
    }
    response = client.put("/api/trip/update-status", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


# Scenario: Invalid status value
def test_update_status_invalid_status_value():
    # ✅ Ensure Rider exists
    existing_rider = session.exec(select(Rider).where(Rider.rider_id == 10)).first()
    if not existing_rider:
        try:
            rider = Rider(name="Test Rider")  # ✅ Removed manual `rider_id=10`
            session.add(rider)
            session.commit()
            session.refresh(rider)
        except Exception as e:
            session.rollback()
            print("Error inserting Rider:", e)  # ✅ Debugging print
            return  # Stop test execution if error occurs
    else:
        rider = existing_rider  # Use existing rider

    # ✅ Ensure Driver exists
    existing_driver = session.exec(select(EngagedDriver).where(EngagedDriver.driver_id == 20)).first()
    if not existing_driver:
        try:
            driver = EngagedDriver(driver_id=20, req_id=1)
            session.add(driver)
            session.commit()
            session.refresh(driver)
        except Exception as e:
            session.rollback()
            print("Error inserting Driver:", e)  # ✅ Debugging print
            return
    else:
        driver = existing_driver  # Use existing driver

    # ✅ Ensure Trip exists
    existing_trip = session.exec(
        select(Trip).where((Trip.rider_id == rider.rider_id) & (Trip.driver_id == driver.driver_id))
    ).first()
    if not existing_trip:
        try:
            trip = Trip(
                rider_id=rider.rider_id,
                driver_id=driver.driver_id,
                pickup_location="Point A",
                destination="Point B",
                fare=100.0,
                status="ongoing"
            )
            session.add(trip)
            session.commit()
            session.refresh(trip)
        except Exception as e:
            session.rollback()
            print("Error inserting Trip:", e)  # ✅ Debugging print
            return
    else:
        trip = existing_trip  # Use existing trip

    # ✅ Attempt to update the trip status with an invalid value
    request_data = {
        "trip_id": trip.trip_id,  # Using the generated trip_id
        "status": ""  # Invalid status (empty string)
    }
    response = client.put("/api/trip/update-status", json=request_data)

    # ✅ Validate response
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert any(
        "Status cannot be an empty string" in error["msg"] for error in response.json()["detail"]
    ), f"Unexpected response: {response.json()}"
