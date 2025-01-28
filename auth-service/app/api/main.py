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


@router.post("/auth/signup", response_model=SignupResponse, responses={
    201: {"model": SignupResponse},
    400: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    500: {"model": ErrorResponse}
})
async def signup(user: SignupRequest, session: Session = Depends(get_session)):
    """
    Handles user signup for drivers or riders.
    """
    try:
        create_user(session, user.name, user.mobile, user.email, user.password, user.user_type)
        return {"success": True, "message": f"{user.user_type.capitalize()} registered successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.post("/auth/login", response_model=LoginResponse, responses={
    200: {"model": LoginResponse},
    401: {"model": ErrorResponse},
    500: {"model": ErrorResponse}
})
async def login(credentials: LoginRequest, session: Session = Depends(get_session)):
    """
    Handles login for drivers or riders.
    """
    try:
        user = authenticate_user(session, credentials.phone_or_email, credentials.password, credentials.user_type)
        return {"success": True, "name": user.name, "id": user.driver_id if credentials.user_type == "driver" else user.rider_id, "user_type": credentials.user_type}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
