"""
Trip Service - Business Logic Layer.

This module contains service logic for handling trip requests, 
driver engagement, and trip updates.
"""

# ✅ Third-Party Imports
from fastapi import HTTPException
from sqlmodel import Session, select

# ✅ Local Imports (Project Modules)
from app.schemas.main import TripRequestCreate
from app.models.main import TripRequest, Trip, EngagedDriver, Rider, Driver

# ✅ Define Internal Server Error Constant
INTERNAL_SERVER_ERROR = HTTPException(status_code=500, detail="Internal server error")


class TripService:
    """Service class for handling trip-related business logic."""

    @staticmethod
    def add_trip_request(db: Session, request_data: TripRequestCreate):
        """Adds a new trip request to the database."""
        try:
            if (
                not request_data.rider_id or 
                not request_data.pickup_location.strip() or 
                not request_data.destination.strip()
            ):
                raise HTTPException(status_code=422, detail="Fields cannot be empty")

            rider = db.get(Rider, request_data.rider_id)
            if not rider:
                raise HTTPException(status_code=404, detail="Rider not found")

            trip_request = TripRequest(**request_data.dict())
            db.add(trip_request)
            db.commit()
            db.refresh(trip_request)
            return {"req_id": trip_request.req_id}

        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def remove_trip_request(db: Session, req_id: int):
        """Removes an existing trip request."""
        trip_request = db.get(TripRequest, req_id)
        if not trip_request:
            raise HTTPException(status_code=404, detail="Trip request not found")
        try:
            db.delete(trip_request)
            db.commit()
            return {"success": True}

        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def engage_driver(db: Session, req_id: int, driver_id: int):
        """Engages a driver for a trip request."""
        trip = db.get(TripRequest, req_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip request not found")
        try:
            engagement = EngagedDriver(req_id=req_id, driver_id=driver_id)
            db.add(engagement)
            db.commit()
            return {"success": True}
        
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            print(exc)
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def release_driver(db: Session, driver_id: int):
        """Releases a driver from an engagement."""
        engaged_driver = db.exec(
            select(EngagedDriver).where(EngagedDriver.driver_id == driver_id)
        ).first()

        if not engaged_driver:
            raise HTTPException(status_code=404, detail="Driver not found")
        try:
            db.delete(engaged_driver)
            db.commit()
            return {"success": True}

        except HTTPException:
            db.rollback()
            raise

        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def add_trip(db: Session, trip_data):
        """Adds a new trip to the database."""
        try:
            rider = db.get(Rider, trip_data.rider_id)
            if not rider:
                raise HTTPException(status_code=404, detail="Rider not found")

            driver = db.get(Driver, trip_data.driver_id)
            if not driver:
                raise HTTPException(status_code=404, detail="Driver not found")

            trip = Trip(**trip_data.dict())
            db.add(trip)
            db.commit()
            db.refresh(trip)
            return trip.dict()
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def update_trip_status(db: Session, trip_id: int, status: str):
        """Updates the status of an existing trip."""
        trip = db.get(Trip, trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        try:
            trip.status = status
            db.commit()
            return {"success": True}
        except HTTPException:
            db.rollback()
            raise
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc
