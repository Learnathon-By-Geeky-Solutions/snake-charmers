from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
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
