import h3
from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation

resolution = 10

def update_driver_location(
        session: Session,
        driver_id: int,
        latitude: float,
        longitude: float
) -> None:
    """
    Update the latitude and longitude of a driver's location in the database.
    """
    statement = (
        select(DriverLocation)
        .where(DriverLocation.driver_id == driver_id)
    )
    result = session.exec(statement).first()
    if not result:
        raise HTTPException(
            status_code=400,
            detail="Driver ID not found"
        )
    try:
        result.latitude = latitude
        result.longitude = longitude
        result.h3_index = h3.latlng_to_cell(
            latitude,
            longitude,
            resolution
        )
        session.add(result)
        session.commit()
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to update driver location"
        ) from exc

def add_driver_location(
        session: Session,
        driver_id: int,
        socket_id: str,
        latitude: float,
        longitude: float
) -> None:
    """
    Add a new driver's location to the database.
    """
    new_location = DriverLocation(
        driver_id=driver_id,
        socket_id=socket_id,
        latitude=latitude,
        longitude=longitude,
        h3_index=h3.latlng_to_cell(latitude, longitude, resolution)
    )
    try:
        session.add(new_location)
        session.commit()
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=400,
            detail="Failed to add driver location"
        ) from exc

def remove_driver_location(
        session: Session,
        driver_id: int
) -> None:
    """
    Remove a driver's location from the database by ID.
    """
    statement = (
        select(DriverLocation)
        .where(DriverLocation.driver_id == driver_id)
    )
    result = session.exec(statement).first()
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Location not found"
        )
    try:
        session.delete(result)
        session.commit()
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to remove driver location"
        ) from exc
