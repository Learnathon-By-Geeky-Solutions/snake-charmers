from typing import Optional
from pydantic import BaseModel

class BaseDriverLocationRequest(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

# Request Models
class UpdateDriverLocationRequest(BaseDriverLocationRequest):
    pass

class AddDriverLocationRequest(BaseDriverLocationRequest):
    socket_id: str


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
