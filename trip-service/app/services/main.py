from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.main import TripRequest, Trip, EngagedDriver

class TripService:
    @staticmethod
    def add_trip_request(db: Session, request_data):
        try:
            trip_request = TripRequest(**request_data.dict())
            db.add(trip_request)
            db.commit()
            db.refresh(trip_request)
            return {"req_id": (trip_request.req_id)}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    @staticmethod
    def remove_trip_request(db: Session, req_id: int):
        try:
            trip_request = db.get(TripRequest, req_id)
            if not trip_request:
                raise HTTPException(status_code=404, detail="Trip request not found")
            db.delete(trip_request)
            db.commit()
            return {"success": True}
        except HTTPException:
            raise
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

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
        except HTTPException:
            raise
        except Exception as e:
            print(e)
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    @staticmethod
    def release_driver(db: Session, driver_id: int):
        try:
            engaged_driver = db.exec(select(EngagedDriver).where(EngagedDriver.driver_id == driver_id)).first()
            if not engaged_driver:
                raise HTTPException(status_code=404, detail="Driver not found")

            db.delete(engaged_driver)
            db.commit()
            return {"success": True}
        except HTTPException:
            raise
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    

    @staticmethod
    def add_trip(db: Session, trip_data):
        try:
            # TripService.validate_trip_data(trip_data)

            trip = Trip(**trip_data.dict())
            db.add(trip)
            db.commit()
            db.refresh(trip)
            return {"trip_id": trip.trip_id, "rider_id": trip.rider_id, "driver_id":trip.driver_id,"pickup_location":trip.pickup_location,"destination":trip.destination,"fare":trip.fare,"status":trip.status}

        except HTTPException as e :
            raise e 

        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    @staticmethod
    def update_trip_status(db: Session, trip_id: int, status: str):
        try:
            trip = db.get(Trip, trip_id)
            if not trip:
                raise HTTPException(status_code=404, detail="Trip not found")
            trip.status = status
            db.commit()
            return {"success": True}
        except HTTPException:
            raise
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")
