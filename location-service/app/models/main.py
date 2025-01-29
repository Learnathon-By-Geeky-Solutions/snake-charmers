from typing import Optional
from sqlmodel import SQLModel, Field


DRIVER_ID_FK = "driver.driver_id"

class Driver(SQLModel, table=True):
    driver_id: Optional[int] = Field(
        default=None, primary_key=True, index=True
    )
    name: str
    mobile: str = Field(unique=True)
    email: Optional[str] = Field(default=None, unique=True)
    password: str
    ratings: Optional[float] = Field(default=None)

class DriverLocation(SQLModel, table=True):
    driver_id: int = Field(
        primary_key=True, foreign_key=DRIVER_ID_FK, index=True
    )
    socket_id: str = Field(index=True)
    latitude: float
    longitude: float
    h3_index: str = Field(index=True)


class Rider(SQLModel, table=True):
    rider_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str
    mobile: str = Field(unique=True)
    email: Optional[str] = Field(default=None, unique=True)
    password: str


class Trip(SQLModel, table=True):
    trip_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    rider_id: int = Field(foreign_key="rider.rider_id", index=True)
    driver_id: int = Field(foreign_key=DRIVER_ID_FK, index=True)
    pickup_location: str
    destination: str
    fare: float
    status: str  # e.g., "completed", "cancelled", etc.


class TripRequest(SQLModel, table=True):
    req_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    rider_id: int = Field(foreign_key="rider.rider_id", index=True)
    pickup_location: str
    destination: str

class EngagedDriver(SQLModel, table=True):
    req_id: int = Field(
        foreign_key="triprequest.req_id", primary_key=True, index=True
    )
    driver_id: int = Field(foreign_key=DRIVER_ID_FK, index=True)
