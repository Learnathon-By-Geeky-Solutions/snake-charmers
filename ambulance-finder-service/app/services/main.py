from sqlmodel import Session
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
from app.schemas.main import DriverLocationCreate, NearbyDriversRequest
from app.models.main import DriverLocation
from fastapi import HTTPException

class AmbulanceService:
    @staticmethod
    def update_driver_location(db: Session, location_data: DriverLocationCreate):
        try:
            # Create WKT (Well-Known Text) point from lat/lon
            point = f'POINT({location_data.lon} {location_data.lat})'
            # print("test point", point)
            # Check if driver location exists
            driver_location = db.query(DriverLocation).filter(
                DriverLocation.driver_id == location_data.driver_id
            ).first()
            # print("test driver_location ", driver_location)   
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
                print("test driver_location ", driver_location)
                db.add(driver_location)
                print("successfully created driver location", driver_location)
            
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
            
            # Query nearby drivers
            nearby_drivers = db.query(DriverLocation).filter(
                ST_Distance(
                    DriverLocation.location,
                    ST_GeomFromText(ref_point, 4326)
                ) <= request.radius * 1000  # Convert km to meters
            ).all()
            
            return [{"driver_id": driver.driver_id} for driver in nearby_drivers]
            
        except Exception as exc:
            raise HTTPException(status_code=500, detail="Error finding nearby drivers") from exc
