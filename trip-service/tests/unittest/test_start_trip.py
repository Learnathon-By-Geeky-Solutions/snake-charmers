from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app
from app.models.main import Rider, EngagedDriver, TripRequest,Driver
from app.db import get_session  # Function to get DB session


client = TestClient(app)
# Success Scenario
def test_add_trip_success():
    session = next(get_session())  # ✅ Get session

    # ✅ Step 1: Ensure rider exists
    existing_rider = session.exec(select(Rider).limit(1)).first()
    if not existing_rider:
        rider = Rider(name="Test Rider")
        session.add(rider)
        session.commit()
        session.refresh(rider)
        rider_id = rider.rider_id
    else:
        rider_id = existing_rider.rider_id

    # ✅ Step 2: Ensure driver exists in the correct table
    existing_driver = session.exec(select(Driver).where(Driver.driver_id == 2)).first()
    if not existing_driver:
        driver = Driver(driver_id=2, name="Test Driver")  # ✅ Insert into the correct table
        session.add(driver)
        session.commit()
        session.refresh(driver)
        driver_id = driver.driver_id
    else:
        driver_id = existing_driver.driver_id

    # ✅ Step 3: Engage the driver (if applicable)
    existing_engaged_driver = session.exec(select(EngagedDriver).where(EngagedDriver.driver_id == driver_id)).first()
    if not existing_engaged_driver:
        engaged_driver = EngagedDriver(driver_id=driver_id, req_id=1)
        session.add(engaged_driver)
        session.commit()
        session.refresh(engaged_driver)

    # ✅ Step 4: Ensure the rider has an active trip request
    existing_request = session.exec(select(TripRequest).where(TripRequest.rider_id == rider_id)).first()
    if not existing_request:
        response = client.post("/api/trip/new-request", json={
            "rider_id": rider_id,
            "pickup_location": "Loc A",
            "destination": "Loc B"
        })
        print("New Request Response:", response.json())  # Debugging
        assert response.status_code == status.HTTP_201_CREATED

    # ✅ Step 5: Start a trip with valid IDs
    request_data = {
        "rider_id": rider_id,
        "driver_id": driver_id,  # ✅ Now correctly assigned from the `Driver` table
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)

    print("Start Trip Response:", response.status_code, response.json())  # Debugging

    # ✅ Step 6: Validate response
    assert response.status_code == status.HTTP_201_CREATED, f"Unexpected response: {response.json()}"
    assert "trip_id" in response.json()



# Scenario: Missing Required Field (Status)
def test_start_trip_missing_status():
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "field required" in str(response.json()["detail"])

# Edge Case: Invalid Data Type for Fare
def test_start_trip_invalid_fare_type():
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": "fifty",  # Invalid type for fare
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "value is not a valid float" in str(response.json()["detail"])

# Edge Case: Non-existent Rider ID
def test_start_trip_nonexistent_rider():
    request_data = {
        "rider_id": 999,  # Rider does not exist
        "driver_id": 2,
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # assert response.json()["detail"] == "Rider not found"

# Edge Case: Non-existent Driver ID
def test_start_trip_nonexistent_driver():
    request_data = {
        "rider_id": 1,
        "driver_id": 999,  # Driver does not exist
        "pickup_location": "Loc A",
        "destination": "Loc B",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # assert response.json()["detail"] == "Driver not found"

# Edge Case: Empty Fields
def test_start_trip_empty_fields():
    request_data = {
        "rider_id": 1,
        "driver_id": 2,
        "pickup_location": "",
        "destination": "",
        "fare": 50.0,
        "status": "ongoing"
    }
    response = client.post("/api/trip/start", json=request_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "value_error.any_str.min_length" in str(response.json()["detail"])
