import pytest
from fastapi.testclient import TestClient

SIGNUP_ENDPOINT = "/api/auth/signup"

def test_user():
    return{
        "name": "Test User",
        "mobile": "01837101866",
        "email": "testuser@gmail.com",
        "password": "securepassword",
        "user_type": "driver"
    }

def test_successful_signup(client: TestClient):
    driver_data = test_user()
    response = client.post(SIGNUP_ENDPOINT, json=driver_data)
    assert response.status_code == 201


def test_successful_signup_rider(client: TestClient):
    rider_data = test_user()
    rider_data["user_type"] = "rider"
    response = client.post(SIGNUP_ENDPOINT, json=rider_data)
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

def test_signup_invalid_email_format(client: TestClient):
    signup_data = test_user()
    signup_data["email"] = "invalid-email-format"
    response = client.post(SIGNUP_ENDPOINT, json=signup_data)
    assert response.status_code == 422

def test_signup_invalid_mobile_format(client: TestClient):
    signup_data = test_user()
    signup_data["mobile"] = "1234532"
    response = client.post(SIGNUP_ENDPOINT, json=signup_data)
    assert response.status_code == 422


def test_signup_email_already_taken(client: TestClient):
    user_data = test_user()
    client.post(SIGNUP_ENDPOINT, json=user_data)  # First request
    response = client.post(SIGNUP_ENDPOINT, json=user_data)  # Second request with same email
    assert response.status_code == 409


def test_signup_phone_number_already_taken(client: TestClient):
    user_data = test_user()
    user_data["mobile"] = "01711111111"
    client.post(SIGNUP_ENDPOINT, json=user_data)  # First request
    response = client.post(SIGNUP_ENDPOINT, json=user_data)  # Second request with same phone number
    assert response.status_code == 409


def test_signup_invalid_password_length(client: TestClient):
    signup_data = test_user()
    signup_data["password"] = "123" 
    response = client.post(SIGNUP_ENDPOINT, json=signup_data)
    assert response.status_code == 422

def test_signup_invalid_user_type(client: TestClient):
    signup_data = test_user()
    signup_data["user_type"] = "xyz" 
    response = client.post(SIGNUP_ENDPOINT, json=signup_data)
    assert response.status_code == 400