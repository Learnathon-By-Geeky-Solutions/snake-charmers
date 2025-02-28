from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.schemas.main import NearbyDriversRequest, DriverLocationResponse
from app.services.main import AmbulanceService
from app.db import get_session

router = APIRouter(prefix="/api/ambulance", tags=["Ambulance Finder Service"])

@router.get(
    "/nearby", 
    response_model=list[DriverLocationResponse],
    status_code=200
)
def find_nearby_drivers(
    request: NearbyDriversRequest = Depends(),
    db: Session = Depends(get_session)
):
    return AmbulanceService.find_nearby_drivers(db, request)