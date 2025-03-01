from pydantic import BaseModel, Field, validator
from fastapi import HTTPException

class TripRequestCreate(BaseModel):
    rider_id: int = Field(..., gt=0, description="Rider ID must be greater than 0")
    pickup_location: str = Field(..., min_length=1, description="Pickup location cannot be empty")
    destination: str = Field(..., min_length=1, description="Destination cannot be empty")

    @validator("pickup_location", "destination")
    def check_empty_strings(cls, value):
        if not value.strip():
            raise ValueError("Field cannot be an empty string")
        return value

    class Config:
        extra = "forbid"  # Rejects requests with additional fields

class TripRequestResponse(BaseModel):
    req_id: int

    class Config:
        orm_mode = True


class TripCreate(BaseModel):
    rider_id: int = Field(..., gt=0, description="Rider ID must be greater than 0")
    driver_id: int = Field(..., gt=0, description="Driver ID must be greater than 0")
    pickup_location: str = Field(..., min_length=1, description="Pickup location cannot be empty")
    destination: str = Field(..., min_length=1, description="Destination cannot be empty")
    fare: float = Field(..., gt=0, description="Fare must be greater than 0")
    status: str

    @validator("pickup_location", "destination")
    def check_empty_strings(cls, value):
        if not value.strip():
            raise ValueError("Field cannot be an empty string")
        return value

    class Config:
        extra = "forbid"  # Rejects requests with additional fields


class TripResponse(TripCreate):
    trip_id: int

    class Config:
        orm_mode = True


class EngageDriverRequest(BaseModel):
    driver_id: int
    req_id: int


class UpdateTripStatusRequest(BaseModel):
    trip_id: int = Field(..., gt=0, description="Trip ID must be greater than 0")
    status: str = Field(..., min_length=1, description="Status cannot be empty")

    @validator("status")
    def check_empty_status(cls, value):
        if not value.strip():
            raise ValueError("Status cannot be an empty string")
        return value