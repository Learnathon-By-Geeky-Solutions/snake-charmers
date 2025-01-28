from pydantic import BaseModel, EmailStr
from typing import Union


# Request Models
class SignupRequest(BaseModel):
    name: str  # Mandatory
    mobile: str  # Mandatory
    email: EmailStr  # Now Mandatory
    password: str
    user_type: str  # Either "driver" or "rider"


class LoginRequest(BaseModel):
    phone_or_email: Union[str, EmailStr]  # Accepts either phone number or email
    password: str
    user_type: str  # Either "driver" or "rider"


# Response Models
class SignupResponse(BaseModel):
    success: bool
    message: str  # Mandatory


class LoginResponse(BaseModel):
    success: bool
    name: str
    id: int
    user_type: str


class ErrorResponse(BaseModel):
    error: str
