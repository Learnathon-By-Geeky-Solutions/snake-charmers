"""
Schema definitions for user authentication and validation.
"""

import re  # ✅ Fixed Import Order
from pydantic import BaseModel, EmailStr, validator  # ✅ Fixed Import Order


# Request Models
class SignupRequest(BaseModel):
    """
    Schema for user signup.
    Ensures only valid Bangladeshi mobile numbers and Gmail addresses are allowed.
    """
    name: str
    mobile: str
    email: EmailStr
    password: str
    user_type: str

    @classmethod
    @validator("mobile")
    def validate_mobile(cls, mobile: str) -> str:
        """
        Validates Bangladeshi phone numbers:
        Must start with +880 or 01 and be followed by 9 digits.
        """
        pattern = r"(\+8801|01)[3-9][0-9]{8}"
        if not re.fullmatch(pattern, mobile):
            raise ValueError(
                "Invalid Bangladeshi phone number format. "
                "Example: +88017XXXXXXXX or 017XXXXXXXX"
            )
        return mobile

    @classmethod
    @validator("email")
    def validate_google_email(cls, email: str) -> str:
        """
        Ensures only Google (Gmail) email addresses are allowed.
        """
        if not email.endswith("@gmail.com"):
            raise ValueError(
                "Only Google email addresses (@gmail.com) are allowed for signup"
            )
        return email

    @classmethod
    @validator("password")
    def validate_password(cls, password: str) -> str:
        """
        Ensures password is at least 6 characters long.
        """
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return password


class LoginRequest(BaseModel):
    """
    Schema for user login.
    """
    phone_or_email: str
    password: str
    user_type: str


# Response Models
class SignupResponse(BaseModel):
    """
    Response schema for successful signup.
    """
    success: bool
    message: str


class LoginResponse(BaseModel):
    """
    Response schema for successful login.
    """
    success: bool
    name: str
    id: int
    user_type: str


class ErrorResponse(BaseModel):
    """
    Response schema for errors.
    """
    detail: str
