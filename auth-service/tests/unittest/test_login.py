import pytest
from fastapi.testclient import TestClient
import os

LOGIN_ENDPOINT = "api/auth/login"


def test_login_invalid_credentials(client: TestClient):
    login_data = {
        "phone_or_email": "wrong@example.com",
        "password": "wrongpassword",
        "user_type": "driver"
    }
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 401

def test_login_without_user_type(client: TestClient):
    login_data = {
        "phone_or_email": "testuser@example.com",
        "password": "securepassword"
    }
    response = client.post(LOGIN_ENDPOINT, json=login_data)
    assert response.status_code == 422
