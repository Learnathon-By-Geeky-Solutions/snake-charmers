from pydantic import BaseModel, EmailStr
from typing import Optional


# Request Models
class SignupRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    phoneOrEmail: str
    password: str
    role: str


# Response Models
class SignupResponse(BaseModel):
    success: bool
    message: Optional[str] = None


class LoginResponse(BaseModel):
    success: bool
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    error: str
