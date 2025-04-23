"""
API routes for user authentication and signup.
"""

from fastapi import Response, APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.db import get_session
from app.services.main import create_user, authenticate_user, get_current_user
from app.schemas.main import (
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginResponse,
    ErrorResponse,
)
from app.schemas.main import TokenData


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
async def login(
    credentials: LoginRequest, 
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Handles login for drivers or riders.
    Returns JWT token on successful authentication.
    """
    return authenticate_user(
        session,
        credentials.phone_or_email,
        credentials.password,
        credentials.user_type,
        response
    )


@router.get("/auth/validate-token")
async def validate_token(current_user: TokenData = Depends(get_current_user)):
    """
    Validates a JWT token and returns user info.
    This endpoint can be called by the WebSocket server to validate tokens.
    """
    return {
        "valid": True,
        "id": int(current_user.sub),
        "name": current_user.name,
        "role": current_user.role,
        "email": current_user.email,
        "mobile": current_user.mobile
    }


@router.delete("/auth/logout")
async def logout(response: Response):
    """
    Logout endpoint that clears the authentication cookie.
    """
    # Create a response that clears the access_token cookie
    response.delete_cookie(
        key="auth_token",
        path="/",  
        secure=False,  
        httponly=True,  
        samesite="lax"
    )
    
    return {"message": "Successfully logged out"}