from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.schemas.main import TripRequestCreate, TripRequestResponse, TripCreate,TripResponse, EngageDriverRequest, UpdateTripStatusRequest
from app.services.main import TripService
from app.dependencies import get_db

router = APIRouter(prefix="/api/trip", tags=["Trip Service"])


@router.post("/request/add", response_model=TripRequestResponse, status_code=201)
def add_trip_request(request_data: TripRequestCreate, db: Session = Depends(get_db)):
    return TripService.add_trip_request(db, request_data)



@router.delete("/request/remove/{req_id}", status_code=200)
def remove_trip_request(req_id: int, db: Session = Depends(get_db)):
    TripService.remove_trip_request(db, req_id)
    return {"message": "Trip request removed successfully"}



@router.post("/engage", status_code=201)
def engage_driver(request: EngageDriverRequest, db: Session = Depends(get_db)):
    return TripService.engage_driver(db, request.req_id, request.driver_id)


@router.post("/release/{driver_id}", status_code=200)
def release_driver(driver_id : int, db: Session = Depends(get_db)):
    return TripService.release_driver(db, driver_id)

@router.post("/add", response_model=TripResponse, status_code=201)
def add_trip(trip_data: TripCreate, db: Session = Depends(get_db)): 
    return TripService.add_trip(db, trip_data)


@router.put("/status/{trip_id}", status_code=200)
def update_trip_status(request: UpdateTripStatusRequest, db: Session = Depends(get_db)):
    return TripService.update_trip_status(db, request.trip_id, request.status)
