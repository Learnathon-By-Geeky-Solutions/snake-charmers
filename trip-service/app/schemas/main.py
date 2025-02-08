from pydantic import BaseModel
from typing import Optional


class TripRequestCreate(BaseModel):
    rider_id: int
    pickup_location: str
    destination: str


class TripRequestResponse(TripRequestCreate):
    req_id: int

    class Config:
        orm_mode = True


class TripCreate(BaseModel):
    rider_id: int
    driver_id: int
    pickup_location: str
    destination: str
    fare: float
    status: str


class TripResponse(TripCreate):
    trip_id: int

    class Config:
        orm_mode = True
