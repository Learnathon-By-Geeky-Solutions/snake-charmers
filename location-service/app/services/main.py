from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation
from geoalchemy2.functions import ST_GeomFromText



def get_driver_location(
    session: Session,
    driver_id: int
):
    """
    Retrieve the latitude and longitude of a driver's location from the database.
    """
    try:
    # Query the driver's location
        driver_location = session.query(DriverLocation).filter(
            DriverLocation.driver_id == driver_id
        ).first()
        if not driver_location:
            raise HTTPException(
            status_code=404, detail="Driver location not found"
        )
        # Extract latitude and longitude from the location
        latitude = driver_location.latitude
        longitude = driver_location.longitude
        return {"latitude": latitude, "longitude": longitude}
    
    except Exception as exc:
        print(exc)
        raise 


def add_driver_location(
    session: Session,
    driver_id: int,
    latitude: float,
    longitude: float
):
    """
    Add a new driver's location to the database after checking if the driver exists.
    """
    point = f'POINT({longitude} {latitude})'
    try:
        # Check if driver location already exists
        existing_driver_location = session.query(DriverLocation).filter(
            DriverLocation.driver_id == driver_id
        ).first()
        if existing_driver_location:
            raise HTTPException(
            status_code=409,
            detail="Driver location already exists"
            )

        # Create new driver location
        driver_location = DriverLocation(
            driver_id=driver_id,
            latitude=latitude,
            longitude=longitude,
            location=ST_GeomFromText(point, 4326)
        )
        session.add(driver_location)
        session.commit()
        return {"success": True}
    
    except Exception as exc:
        print(exc)
        session.rollback()
        raise

def update_driver_location(
        session: Session,
        driver_id: int,
        latitude: float,
        longitude: float
):
    """
    Update the latitude and longitude of a driver's location in the database.
    """
    try:
        point = f'POINT({longitude} {latitude})'
        # Check if driver location exists
        driver_location = session.query(DriverLocation).filter(
            DriverLocation.driver_id == driver_id
        ).first()
        print(driver_location)
        if not driver_location:
            raise HTTPException(
                status_code=404, detail="Driver location not found"
            )
        driver_location.location = ST_GeomFromText(point, 4326)
        driver_location.latitude = latitude
        driver_location.longitude = longitude
        session.merge(driver_location)
        session.commit()
        return {"success": True}
    
    except Exception as exc:
        print(exc)
        session.rollback()
        raise 

def remove_driver_location(
        session: Session,
        driver_id: int
):
    """
    Remove a driver's location from the database by ID.
    """
    try:
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
        session.delete(result)
        session.commit()
        return {"success": True}
        
    
    except Exception as exc:
        print(exc)
        session.rollback()
        raise 