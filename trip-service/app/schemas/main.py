"""
Schemas for Trip Service API.

Defines Pydantic models for request validation and response serialization.
"""

# pylint: disable=too-few-public-methods
from pydantic import BaseModel, Field, validator # type: ignore


class TripRequestCreate(BaseModel):
    """Schema for creating a trip request."""
    rider_id: int = Field(..., gt=0, description="Rider ID must be greater than 0")
    pickup_location: str = Field(..., min_length=1,
        description="Pickup location cannot be empty"
    )
    destination: str = Field(..., min_length=1, 
        description="Destination cannot be empty"
    )

    @classmethod
    @validator("pickup_location", "destination", pre=True, always=True)
    def check_empty_strings(cls, value: str) -> str:
        """Ensures location and destination fields are not empty."""
        if not value.strip():
            raise ValueError("Field cannot be an empty string")
        return value

    class Config:
        """Config class for Pydantic."""
        extra = "forbid"


class TripRequestResponse(BaseModel):
    """Schema for trip request response."""
    req_id: int

    class Config:
        """Config class for Pydantic."""
        orm_mode = True


class TripCreate(BaseModel):
    """Schema for creating a trip."""
    rider_id: int = Field(..., gt=0, description="Rider ID must be greater than 0")
    driver_id: int = Field(..., gt=0, description="Driver ID must be greater than 0")
    pickup_location: str = Field(..., min_length=1, 
        description="Pickup location cannot be empty"
    )
    destination: str = Field(..., min_length=1, 
        description="Destination cannot be empty"
    )
    fare: int = Field(..., gt=0, description="Fare must be greater than 0")
    status: str = Field(..., min_length=1, description="Trip status cannot be empty")

    @classmethod
    @validator("pickup_location", "destination", pre=True, always=True)
    def check_empty_strings(cls, value: str) -> str:
        """Ensures pickup and destination are not empty."""
        if not value.strip():
            raise ValueError("Field cannot be an empty string")
        return value

    # class Config:
    #     """Config class for Pydantic."""
    #     extra = "allow"


class TripResponse(TripCreate):
    """Schema for trip response."""
    trip_id: int

    class Config:
        """Config class for Pydantic."""
        orm_mode = True


class EngageDriverRequest(BaseModel):
    """Schema for engaging a driver."""
    driver_id: int
    req_id: int


class UpdateTripStatusRequest(BaseModel):
    """Schema for updating trip status."""
    trip_id: int = Field(..., gt=0, description="Trip ID must be greater than 0")
    status: str = Field(..., min_length=1, description="Status cannot be empty")

    @classmethod
    @validator("status", pre=True, always=True)
    def check_empty_status(cls, value: str) -> str:
        """Ensures status field is not empty."""
        if not value.strip():
            raise ValueError("Status cannot be an empty string")
        return value
