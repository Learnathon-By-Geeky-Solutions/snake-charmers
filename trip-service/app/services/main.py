from sqlmodel import Session, select
from app.models.main import TripRequest, Trip, EngagedDriver
from app.schemas.trip_schemas import TripCreate

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
    def release_driver(db: Session, driver_id: int):
        engaged_driver = db.exec(select(EngagedDriver).where(EngagedDriver.driver_id == driver_id)).first()
        if not engaged_driver:
            raise HTTPException(status_code=404, detail="Engaged driver is not found")
        db.delete(engaged_driver)
        db.commit()
        return {"message": "Driver released successfully"}

    
    @staticmethod
    def validate_trip_data(trip_data: TripCreate):
        """ Validate trip data fields before adding to the database. """
        # Define required fields and their validation rules
        required_fields = {
            "rider_id": (int, lambda x: x > 0),
            "driver_id": (int, lambda x: x > 0),
            "pickup_location": (str, lambda x: x.strip() != ""),
            "destination": (str, lambda x: x.strip() != ""),
            "status": (str, lambda x: x.strip() != ""),
            "fare": ((int, float), lambda x: x > 0)
        }

        for field, (expected_type, condition) in required_fields.items():
            value = getattr(trip_data, field, None)
            if not isinstance(value, expected_type) or not condition(value):
                raise HTTPException(status_code=400, detail=f"Invalid {field}")

    @staticmethod
    def add_trip(db: Session, trip_data: TripCreate):
        try:
            # ✅ Validate input using the extracted function
            TripService.validate_trip_data(trip_data)

            # ✅ Add trip to database
            trip = Trip(**trip_data.dict())
            db.add(trip)
            db.commit()
            db.refresh(trip)
            return trip

        except HTTPException:
            raise  # ✅ Keep 400 errors unchanged

        except (ValueError, KeyError, TypeError) as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Bad Request: {str(e)}")

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

    @staticmethod
    def update_trip_status(db: Session, trip_id: int, status: str):
        trip = db.get(Trip, trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip.status = status
        db.commit()
        return {"message": "Trip status updated successfully"}
