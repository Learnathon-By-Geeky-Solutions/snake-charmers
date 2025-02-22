from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.schemas.main import DriverLocationCreate, NearbyDriversRequest, DriverLocationResponse
from app.services.main import AmbulanceService
from app.db import get_session

router = APIRouter(prefix="/ambulances", tags=["Ambulance Service"])

@router.post("/", response_model=DriverLocationResponse)
def update_driver_location(location_data: DriverLocationCreate, db: Session = Depends(get_session)):
    # print("test in update_driver_location api")
    return AmbulanceService.update_driver_location(db, location_data)

@router.get("/nearby", response_model=list[DriverLocationResponse])
def find_nearby_drivers(request: NearbyDriversRequest = Depends(), db: Session = Depends(get_session)):
    return AmbulanceService.find_nearby_drivers(db, request)
