"""
API routes for user authentication and signup.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_session
from app.services.main import create_user, authenticate_user
from app.schemas.main import (
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginResponse,
    ErrorResponse
)

router = APIRouter()


@router.post(
    "/auth/signup",
    response_model=SignupResponse,
    status_code=201
)
async def signup(user: SignupRequest, session: Session = Depends(get_session)):
    """
    Handles user signup for drivers or riders.
    """
    try:
        create_user(session, user_data=user.dict())  # ✅ Pass as dictionary
        return {
            "success": True,
            "message": f"{user.user_type.capitalize()} registered successfully",
        }
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred",
        ) from exc


@router.post(
    "/auth/login",
    response_model=LoginResponse,
    status_code=200
)
async def login(credentials: LoginRequest, session: Session = Depends(get_session)):
    """
    Handles login for drivers or riders.
    """
    try:
        user = authenticate_user(
            session,
            credentials.phone_or_email,
            credentials.password,
            credentials.user_type,
        )
        return {
            "success": True,
            "name": user.name,
            "id": (
                user.driver_id
                if credentials.user_type == "driver"
                else user.rider_id
            ),
            "user_type": credentials.user_type,
        }
    except HTTPException as exc:
        raise exc
    except Exception as exc:
        print(exc)
        raise HTTPException(
            status_code=500,
            detail=exc
        ) from exc
