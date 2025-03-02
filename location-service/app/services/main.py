from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation
from geoalchemy2.functions import  ST_GeomFromText
resolution = 10

def add_driver_location(
        session: Session,
        driver_id: int,
        latitude: float,
        longitude: float
) -> None:
    """
    Add a new driver's location to the database.
    """
    try:   
             point = f'POINT({longitude} {latitude})'
             # Create new driver location
             driver_location = DriverLocation(
                     driver_id=driver_id,
                     location=ST_GeomFromText(point, 4326)
                 )
             session.add(driver_location)
             session.commit()
        
    except Exception as exc:
             session.rollback()
             raise HTTPException(status_code=500, detail="Internal server error") from exc
def update_driver_location(
        session: Session,
        driver_id: int,
        latitude: float,
        longitude: float
) -> None:
    """
    Update the latitude and longitude of a driver's location in the database.
    """
    try:
       point = f'POINT({longitude} {latitude})'
       #Check if driver location exists
       driver_location = session.query(DriverLocation).filter(
       DriverLocation.driver_id == driver_id
       ).first()  
       driver_location.location = ST_GeomFromText(point, 4326)
       session.merge(driver_location)
    except Exception as exc:
       session.rollback()
       raise HTTPException(status_code=500, detail="Internal server error") from exc

