from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation

def update_driver_location(session: Session, id: str, latitude: float, longitude: float) -> None:
    """
    Update the latitude and longitude of a driver's location in the database.
    """
    statement = select(DriverLocation).where(DriverLocation.id == id)
    result = session.exec(statement).first()
    if not result:
        raise HTTPException(status_code=400, detail="Driver ID not found")
    
    result.latitude = latitude
    result.longitude = longitude
    session.add(result)
    session.commit()

def add_driver_location(session: Session, id: str, socket_id: str, latitude: float, longitude: float) -> None:
    """
    Add a new driver's location to the database.
    """
    new_location = DriverLocation(id=id, socket_id=socket_id, latitude=latitude, longitude=longitude)
    try:
        session.add(new_location)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Driver ID already exists")

def remove_driver_location(session: Session, id: str) -> None:
    """
    Remove a driver's location from the database by ID.
    """
    statement = select(DriverLocation).where(DriverLocation.id == id)
    result = session.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="Location not found")
    
    session.delete(result)
    session.commit()
