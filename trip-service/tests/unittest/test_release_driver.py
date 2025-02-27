from fastapi import status

# Success Scenario
def test_release_driver_success(client):
    # Pre-condition: Ensure the driver with ID 2 exists
    response = client.post("/api/trip/engage-driver", json={
        "req_id": 1,
        "driver_id": 2
    })
    assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_409_CONFLICT]

    # Test the release of the driver
    response = client.delete("/api/trip/release-driver/2")
    assert response.status_code == status.HTTP_204_NO_CONTENT

# Scenario: Driver Not Found
def test_release_driver_not_found(client):
    response = client.delete("/api/trip/release-driver/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Driver not found"

# Edge Case: Invalid Driver ID Format
def test_release_driver_invalid_id_format(client):
    response = client.delete("/api/trip/release-driver/abc")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "value is not a valid integer" in str(response.json()["detail"])

# Edge Case: Missing Driver ID
def test_release_driver_missing_id(client):
    response = client.delete("/api/trip/release-driver/")
    assert response.status_code == status.HTTP_404_NOT_FOUND  # FastAPI treats this as a route not found
