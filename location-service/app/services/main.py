from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.main import DriverLocation
from geoalchemy2.functions import ST_GeomFromText

INTERNAL_SERVER_ERROR_MSG = HTTPException(status_code=500, detail="Internal server error")


def add_driver_location(
        session: Session,
        driver_id: int,
        latitude: float,
        longitude: float
):
    """
    Add a new driver's location to the database.
    """
    point = f'POINT({longitude} {latitude})'
    # Create new driver location
    driver_location = DriverLocation(
        driver_id=driver_id,
        location=ST_GeomFromText(point, 4326)
    )
    try:
        session.add(driver_location)
        session.commit()
        return {"success": True}

    except HTTPException as e:
        print(e)
        session.rollback()
        raise
    
    except Exception as exc:
        print(exc)
        session.rollback()
        raise INTERNAL_SERVER_ERROR_MSG from exc

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
        if not driver_location:
            raise HTTPException(
                status_code=404, detail="Driver location not found"
            )
        driver_location.location = ST_GeomFromText(point, 4326)
        session.merge(driver_location)
        session.commit()
        return {"success": True}

    except HTTPException:
        session.rollback()
        raise
    
    except Exception as exc:
        session.rollback()
        raise INTERNAL_SERVER_ERROR from exc

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
        
    except HTTPException:
        session.rollback()
        raise
    
    except Exception as exc:
        session.rollback()
        raise INTERNAL_SERVER_ERROR from exc
