from pydantic import BaseModel, Field
from typing import Optional

# Request Models
class UpdateDriverLocationRequest(BaseModel):
    id: str
    latitude: float
    longitude: float

class AddDriverLocationRequest(BaseModel):
    id: str
    socket_id: str
    latitude: float
    longitude: float


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
