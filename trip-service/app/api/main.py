from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.schemas.main import (
   TripRequestCreate,
   TripRequestResponse,
   TripCreate,
   TripResponse,
   EngageDriverRequest,
   UpdateTripStatusRequest
)
from app.services.main import TripService
from app.db import get_session

router = APIRouter(prefix="/api/trip", tags=["Trip Service"])


@router.post("/new-request", response_model=TripRequestResponse, status_code=201)
def add_trip_request(
    request_data: TripRequestCreate,
    db: Session = Depends(get_session)
):
    return TripService.add_trip_request(db, request_data)

@router.delete("/remove-request/{req_id}", status_code=204)
def remove_trip_request(req_id: int, db: Session = Depends(get_session)):
    return TripService.remove_trip_request(db, req_id)

@router.post("/engage-driver", status_code=201)
def engage_driver(request: EngageDriverRequest, db: Session = Depends(get_session)):
    return TripService.engage_driver(db, request.req_id, request.driver_id)

@router.delete("/release-driver/{driver_id}", status_code=204)
def release_driver(driver_id : int, db: Session = Depends(get_session)):
    return TripService.release_driver(db, driver_id)

@router.post("/start", response_model=TripResponse, status_code=201)
def add_trip(trip_data: TripCreate, db: Session = Depends(get_session)):
    return TripService.add_trip(db, trip_data)

@router.put("/update-status", status_code=200)
def update_trip_status(
    request: UpdateTripStatusRequest,
    db: Session = Depends(get_session)
):
    return TripService.update_trip_status(db, request.trip_id, request.status)
