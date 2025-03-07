from sqlmodel import Session
from geoalchemy2.functions import ST_Distance, ST_GeomFromText
from app.schemas.main import NearbyDriversRequest
from app.models.main import DriverLocation, Driver, EngagedDriver
from fastapi import HTTPException
from sqlalchemy.orm import aliased


class AmbulanceService:
    @staticmethod
    def find_nearby_drivers(db: Session, request: NearbyDriversRequest):
        try:
            # Create reference point
            ref_point = f'POINT({request.lon} {request.lat})'

            # Subquery to get engaged drivers
            engaged_drivers_subquery = db.query(
                EngagedDriver.driver_id).subquery()

            # Query nearby drivers with a join to the Driver table and exclude engaged drivers
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
            ).filter(
                DriverLocation.driver_id.notin_(engaged_drivers_subquery)
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
