from sqlmodel import SQLModel
from pydantic import BaseModel, Field, validator
from typing import List

class DriverLocationCreate(BaseModel):
    driver_id: int
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

class DriverLocationResponse(BaseModel):
    driver_id: int
    name: str
    mobile: str

class NearbyDriversRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    radius: float = Field(..., gt=0)  # radius in kilometers