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
    return create_user(session, user_data=user.dict())  


@router.post(
    "/auth/login",
    response_model=LoginResponse,
    status_code=200
)
async def login(credentials: LoginRequest, session: Session = Depends(get_session)):
    """
    Handles login for drivers or riders.
    """
    return authenticate_user(
        session,
        credentials.phone_or_email,
        credentials.password,
        credentials.user_type,
    )

