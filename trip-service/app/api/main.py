from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.schemas.trip_schemas import TripRequestCreate, TripRequestResponse
from app.models.main import TripRequest, Trip
from app.services.main import TripService
from app.dependencies import get_db

router = APIRouter(prefix="/api/trip", tags=["Trip Service"])


@router.post("/request/add", response_model=TripRequestResponse, status_code=201)
def add_trip_request(request_data: TripRequestCreate, db: Session = Depends(get_db)):
    return TripService.add_trip_request(db, request_data)


@router.delete("/request/remove/{req_id}", status_code=204)
def remove_trip_request(req_id: int, db: Session = Depends(get_db)):
    TripService.remove_trip_request(db, req_id)
    return {"message": "Trip request removed successfully"}


@router.post("/engage", status_code=201)
def engage_driver(req_id: int, driver_id: int, db: Session = Depends(get_db)):
    return TripService.engage_driver(db, req_id, driver_id)


@router.post("/release", status_code=200)
def release_driver(req_id: int, db: Session = Depends(get_db)):
    return TripService.release_driver(db, req_id)


@router.post("/add", status_code=201)
def add_trip(trip_data: Trip, db: Session = Depends(get_db)):
    return TripService.add_trip(db, trip_data)


@router.put("/status/{trip_id}", status_code=200)
def update_trip_status(trip_id: int, status: str, db: Session = Depends(get_db)):
    return TripService.update_trip_status(db, trip_id, status)
