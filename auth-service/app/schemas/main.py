from pydantic import BaseModel, EmailStr, validator
import re


# Request Models
class SignupRequest(BaseModel):
    name: str
    mobile: str
    email: EmailStr
    password: str
    user_type: str

    @validator("mobile")
    def validate_mobile(cls, mobile):
        # Bangladeshi phone number regex: Starts with +880 or 01, followed by 9 digits
        if not re.fullmatch(r"(\+8801|01)[3-9][0-9]{8}", mobile):
            raise ValueError("Invalid Bangladeshi phone number format. Example: +88017XXXXXXXX or 017XXXXXXXX")
        return mobile

    @validator("email")
    def validate_google_email(cls, email):
        # Allow only Gmail addresses
        if not email.endswith("@gmail.com"):
            raise ValueError("Only Google email addresses (@gmail.com) are allowed for signup")
        return email

    @validator("password")
    def validate_password(cls, password):
        # Ensure password is at least 6 characters long
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return password


class LoginRequest(BaseModel):
    phone_or_email: str
    password: str
    user_type: str


# Response Models
class SignupResponse(BaseModel):
    success: bool
    message: str


class LoginResponse(BaseModel):
    success: bool
    name: str
    id: int
    user_type: str


class ErrorResponse(BaseModel):
    detail: str
