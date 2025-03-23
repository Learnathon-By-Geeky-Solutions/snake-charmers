from typing import Optional
from sqlmodel import SQLModel, Field, Column, Integer, ForeignKey
from geoalchemy2 import Geography
from sqlalchemy import PrimaryKeyConstraint

DRIVER_ID_FK = "driver.driver_id"


class Driver(SQLModel, table=True):
    driver_id: Optional[int] = Field(
        default=None, primary_key=True, index=True)
    name: str
    mobile: str = Field(unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)  # Mandatory and unique
    password: str
    ratings: Optional[float] = Field(default=None)


class Rider(SQLModel, table=True):
    rider_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str
    mobile: str = Field(unique=True, nullable=False)
    email: str = Field(unique=True, nullable=False)  # Mandatory and unique
    password: str


class DriverLocation(SQLModel, table=True):
    driver_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(DRIVER_ID_FK, ondelete="CASCADE"),
            primary_key=True,
            index=True
        )
    )
    location: Geography = Field(sa_column=Column(
        Geography(geometry_type="POINT", srid=4326), nullable=False))
    model_config = {
        "arbitrary_types_allowed": True
    }


class Trip(SQLModel, table=True):
    trip_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    rider_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("rider.rider_id", ondelete="CASCADE"),
            index=True
        )
    )
    driver_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(DRIVER_ID_FK, ondelete="CASCADE"),
            index=True
        )
    )
    pickup_location: str
    destination: str
    fare: float
    status: str  # e.g., "completed", "cancelled", etc.


class TripRequest(SQLModel, table=True):
    req_id: Optional[int] = Field(default=None, primary_key=True, index=True)
    rider_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("rider.rider_id", ondelete="CASCADE"),
            index=True
        )
    )
    pickup_location: str
    destination: str


class EngagedDriver(SQLModel, table=True):

    __table_args__ = (
        PrimaryKeyConstraint("req_id", "driver_id"),
    )

    req_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("triprequest.req_id", ondelete="CASCADE"),
            index=True
        )
    )
    driver_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(DRIVER_ID_FK, ondelete="CASCADE"),
            index=True
        )
    )
