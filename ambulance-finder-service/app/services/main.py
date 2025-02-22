from sqlmodel import Session
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
from app.schemas.main import DriverLocationCreate, NearbyDriversRequest
from app.models.main import DriverLocation,Driver
from fastapi import HTTPException

class AmbulanceService:
    @staticmethod
    def update_driver_location(db: Session, location_data: DriverLocationCreate):
        try:
            point = f'POINT({location_data.lon} {location_data.lat})'
            # Check if driver location exists
            driver_location = db.query(DriverLocation).filter(
                DriverLocation.driver_id == location_data.driver_id
            ).first()  
            if driver_location:
                # Update existing location
                driver_location.location = ST_GeomFromText(point, 4326)
                db.merge(driver_location)
            else:
                # Create new driver location
                driver_location = DriverLocation(
                    driver_id=location_data.driver_id,
                    location=ST_GeomFromText(point, 4326)
                )
                db.add(driver_location)
            db.commit()
            return {"driver_id": location_data.driver_id}
        
        except Exception as exc:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error") from exc

    @staticmethod
    def find_nearby_drivers(db: Session, request: NearbyDriversRequest):
     try:
        # Create reference point
        ref_point = f'POINT({request.lon} {request.lat})'
        
        # Query nearby drivers with a join to the Driver table
        results = db.query(
            DriverLocation.driver_id,
            Driver.name,
            Driver.mobile
        ).join(
            Driver, Driver.driver_id == DriverLocation.driver_id
        ).filter(
            ST_Distance(
                DriverLocation.location,
                ST_GeomFromText(ref_point, 4326)
            ) <= request.radius * 1000  # Convert km to meters
        ).all()
        
        # Format the results
        return [
            {"driver_id": driver.driver_id, "name": driver.name, "mobile": driver.mobile}
            for driver in results
        ]
        
     except Exception as exc:
        raise HTTPException(status_code=500, detail="Error finding nearby drivers") from exc

