import pytest
from fastapi.testclient import TestClient
import os

LOGIN_ENDPOINT = "/api/auth/login"

test_data = {
    "phone_or_email": "driver1@gmail.com",
    "password": "pass1",
    "user_type": "driver"
}

def test_login_successful_driver(client: TestClient):
    login_data = test_data.copy()
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 200
    assert "id" in response.json()

def test_login_successful_rider(client: TestClient):
    login_data = test_data.copy()
    login_data["phone_or_email"] = "rider1@gmail.com"
    login_data["user_type"] = "rider"
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 200
    assert "id" in response.json()

def test_login_missing_password(client: TestClient):
    login_data = test_data.copy()
    del login_data["password"]
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 422

def test_login_missing_phone_or_email(client: TestClient):
    login_data = test_data.copy()
    del login_data["phone_or_email"]
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 422

def test_login_missing_user_type(client: TestClient):
    login_data = test_data.copy()
    del login_data["user_type"]
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 422

def test_login_invalid_credentials(client: TestClient):
    login_data = test_data.copy()
    login_data["password"] = "wrongpassword"
    login_data["user_type"] = "rider"
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 401

def test_login_invalid_user_type(client: TestClient):
    login_data = test_data.copy()
    login_data["user_type"] = "xyz"
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 400

