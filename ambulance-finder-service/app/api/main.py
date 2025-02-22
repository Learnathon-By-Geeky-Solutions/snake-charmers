from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.schemas.main import DriverLocationCreate, NearbyDriversRequest, DriverLocationResponse
from app.services.main import AmbulanceService
from app.db import get_session

router = APIRouter(prefix="/api/ambulance", tags=["Ambulance Finder Service"])

# for testing purposes
@router.post("/", response_model=DriverLocationResponse,status_code=201)  
def update_driver_location(location_data: DriverLocationCreate, db: Session = Depends(get_session)):
    # print("test in update_driver_location api")
    return AmbulanceService.update_driver_location(db, location_data)

@router.get("/nearby", response_model=list[DriverLocationResponse],status_code=200)
def find_nearby_drivers(request: NearbyDriversRequest = Depends(), db: Session = Depends(get_session)):
    return AmbulanceService.find_nearby_drivers(db, request)
