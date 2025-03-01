from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.main import app
from app.models.main import TripRequest, EngagedDriver, Rider
from app.db import get_session 

client = TestClient(app)

# Success Scenario
def test_release_driver_success():
    session = next(get_session())  # ✅ Get the session properly

    # ✅ Step 1: Ensure Rider exists
    existing_rider = session.exec(select(Rider).where(Rider.rider_id == 10)).first()
    if not existing_rider:
        rider = Rider(
            rider_id=10,
            name="Test Rider",
            mobile="1234567890",  # ✅ Provide a default value
            email="testrider@example.com",  # ✅ Provide a default value
            password="testpassword"  # ✅ Provide a default value
        )
        session.add(rider)
        session.commit()
        session.refresh(rider)
    else:
        rider = existing_rider  # Use existing rider

    # ✅ Step 2: Ensure Trip Request exists
    existing_trip_request = session.exec(select(TripRequest).where(TripRequest.req_id == 1)).first()
    if not existing_trip_request:
        trip_request = TripRequest(
            req_id=1,  # Ensuring req_id exists
            rider_id=rider.rider_id,  # ✅ Use the existing rider_id
            pickup_location="Test Pickup",
            destination="Test Destination"
        )
        session.add(trip_request)
        session.commit()
        session.refresh(trip_request)
    else:
        trip_request = existing_trip_request

    # ✅ Step 3: Ensure Driver is Engaged
    existing_driver = session.exec(select(EngagedDriver).where(EngagedDriver.driver_id == 2)).first()
    if not existing_driver:
        engaged_driver = EngagedDriver(req_id=trip_request.req_id, driver_id=2)
        session.add(engaged_driver)
        session.commit()
        session.refresh(engaged_driver)
    else:
        engaged_driver = existing_driver  # Use existing engaged driver

    response = client.post("/api/trip/engage-driver", json={
        "req_id": trip_request.req_id,
        "driver_id": engaged_driver.driver_id  # Use dynamically assigned driver_id
    })  
    assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_409_CONFLICT]

    # ✅ Step 4: Test releasing the driver
    response = client.delete(f"/api/trip/release-driver/{engaged_driver.driver_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT



# Scenario: Driver Not Found
def test_release_driver_not_found():
    response = client.delete("/api/trip/release-driver/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # assert response.json()["detail"] == "Driver not found"

# Edge Case: Invalid Driver ID Format
def test_release_driver_invalid_id_format():
    response = client.delete("/api/trip/release-driver/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # assert "value is not a valid integer" in str(response.json()["detail"])

# Edge Case: Missing Driver ID
def test_release_driver_missing_id():
    response = client.delete("/api/trip/release-driver/")
    assert response.status_code == status.HTTP_404_NOT_FOUND  # FastAPI treats this as a route not found
