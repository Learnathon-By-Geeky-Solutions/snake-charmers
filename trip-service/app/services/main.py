from sqlmodel import Session, select
from app.models.main import TripRequest, Trip, EngagedDriver


class TripService:
    @staticmethod
    def add_trip_request(db: Session, request_data):
        trip_request = TripRequest(**request_data.dict())
        db.add(trip_request)
        db.commit()
        db.refresh(trip_request)
        return trip_request

    @staticmethod
    def remove_trip_request(db: Session, req_id: int):
        trip_request = db.get(TripRequest, req_id)
        if not trip_request:
            raise HTTPException(status_code=404, detail="Trip request not found")
        db.delete(trip_request)
        db.commit()

    @staticmethod
    def engage_driver(db: Session, req_id: int, driver_id: int):
        engagement = EngagedDriver(req_id=req_id, driver_id=driver_id)
        db.add(engagement)
        db.commit()
        return {"message": "Driver engaged successfully"}

    @staticmethod
    def release_driver(db: Session, req_id: int):
        engagement = db.exec(select(EngagedDriver).where(EngagedDriver.req_id == req_id)).first()
        if not engagement:
            raise HTTPException(status_code=404, detail="Engagement not found")
        db.delete(engagement)
        db.commit()
        return {"message": "Driver released successfully"}

    @staticmethod
    def add_trip(db: Session, trip_data):
        trip = Trip(**trip_data.dict())
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def update_trip_status(db: Session, trip_id: int, status: str):
        trip = db.get(Trip, trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip.status = status
        db.commit()
        return {"message": "Trip status updated successfully"}
