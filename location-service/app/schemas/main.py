from typing import Optional
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class BaseDriverLocationRequest(Coordinates):
    driver_id: int
    

# Request Models
class UpdateDriverLocationRequest(BaseDriverLocationRequest):
    pass


class AddDriverLocationRequest(BaseDriverLocationRequest):
    pass


# Response Models


class LocationGetResponse(Coordinates):
    pass

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