from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.main import TripRequest, Trip, EngagedDriver

INTERNAL_SERVER_ERROR = HTTPException(status_code=500, detail="Internal server error")

class TripService:
    @staticmethod
    def add_trip_request(db: Session, request_data):
        try:
            trip_request = TripRequest(**request_data.dict())
            db.add(trip_request)
            db.commit()
            db.refresh(trip_request)
            return {"req_id": (trip_request.req_id)}

        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def remove_trip_request(db: Session, req_id: int):
        try:
            trip_request = db.get(TripRequest, req_id)
            if not trip_request:
                raise HTTPException(status_code=404, detail="Trip request not found")
            db.delete(trip_request)
            db.commit()
            return {"success": True}

        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def engage_driver(db: Session, req_id: int, driver_id: int):
        try:
            trip = db.get(TripRequest, req_id)

            if not trip:
                raise HTTPException(status_code=404, detail="Trip request not found")

            engagement = EngagedDriver(req_id=req_id, driver_id=driver_id)
            db.add(engagement)
            db.commit()
            return {"success": True}

        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def release_driver(db: Session, driver_id: int):
        try:
            engaged_driver = db.exec(
            select(EngagedDriver).where(EngagedDriver.driver_id == driver_id)
            ).first()
            if not engaged_driver:
                raise HTTPException(status_code=404, detail="Driver not found")

            db.delete(engaged_driver)
            db.commit()
            return {"success": True}
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def add_trip(db: Session, trip_data):
        try:
            trip = Trip(**trip_data.dict())
            db.add(trip)
            db.commit()
            db.refresh(trip)
            return trip.dict()
        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc

    @staticmethod
    def update_trip_status(db: Session, trip_id: int, status: str):
        try:
            trip = db.get(Trip, trip_id)
            if not trip:
                raise HTTPException(status_code=404, detail="Trip not found")
            trip.status = status
            db.commit()
            return {"success": True}

        except Exception as exc:
            db.rollback()
            raise INTERNAL_SERVER_ERROR from exc
