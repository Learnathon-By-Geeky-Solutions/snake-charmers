from sqlmodel import Session
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
from app.schemas.main import NearbyDriversRequest
from app.models.main import DriverLocation, Driver
from fastapi import HTTPException

class AmbulanceService:
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
                {
                    "driver_id": driver.driver_id,
                    "name": driver.name,
                    "mobile": driver.mobile
                }
                for driver in results
            ]
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail="Error finding nearby drivers"
            ) from exc