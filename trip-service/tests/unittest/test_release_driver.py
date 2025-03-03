from fastapi import status
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from fastapi.testclient import TestClient
from app.models.main import TripRequest, EngagedDriver, Rider


# Success Scenario
def test_release_driver_success(client: TestClient, session: Session):

    # Create a trip request first
    trip_request = TripRequest(
        rider_id=1,  # ✅ Use the existing rider_id
        pickup_location="Test Pickup",
        destination="Test Destination"
    )
    session.add(trip_request)
    session.commit()
    session.refresh(trip_request)


    # Engage a driver to the trip request
    engaged_driver = EngagedDriver(req_id=trip_request.req_id, driver_id=2)
    session.add(engaged_driver)
    session.commit()
    session.refresh(engaged_driver)
   

    # ✅ Step 4: Test releasing the driver
    response = client.delete(f"/api/trip/release-driver/{engaged_driver.driver_id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT



# Scenario: Driver Not Found
def test_release_driver_not_found(client: TestClient):
    response = client.delete("/api/trip/release-driver/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND

# Edge Case: Invalid Driver ID Format
def test_release_driver_invalid_id_format(client: TestClient):
    response = client.delete("/api/trip/release-driver/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Edge Case: Missing Driver ID
def test_release_driver_missing_id(client: TestClient):
    response = client.delete("/api/trip/release-driver/")
    assert response.status_code == status.HTTP_404_NOT_FOUND 
