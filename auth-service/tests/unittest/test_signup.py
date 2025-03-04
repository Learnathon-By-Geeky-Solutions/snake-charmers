import pytest
from fastapi.testclient import TestClient

SIGNUP_ENDPOINT = "api/auth/signup"

def test_user():
    return {
        "name": "Test User",
        "mobile": "01837101866",
        "email": "testuser@gmail.com",
        "password": "securepassword",
        "user_type": "driver"
    }

def test_successful_signup(client: TestClient):
    response = client.post(SIGNUP_ENDPOINT, json=test_user())
    assert response.status_code == 201

def test_duplicate_signup(client: TestClient):
    client.post(SIGNUP_ENDPOINT, json=test_user())  # First request
    response = client.post(SIGNUP_ENDPOINT, json=test_user())  # Second request
    assert response.status_code == 409

def test_invalid_signup_request(client: TestClient):
    invalid_user = {
        "name": "Test",
        "mobile": "0123456789"
    }
    response = client.post(SIGNUP_ENDPOINT, json=invalid_user)
    assert response.status_code == 422
