from typing import Optional
from pydantic import BaseModel, Field


class BaseDriverLocationRequest(BaseModel):
    driver_id: int
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

# Request Models


class UpdateDriverLocationRequest(BaseDriverLocationRequest):
    pass


class AddDriverLocationRequest(BaseDriverLocationRequest):
    pass
# Response Models


class LocationUpdateResponse(BaseModel):
    success: bool


class LocationAddResponse(BaseModel):
    success: bool
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    error: str


class LocationRemoveResponse(BaseModel):
    success: bool
    message: Optional[str] = None
