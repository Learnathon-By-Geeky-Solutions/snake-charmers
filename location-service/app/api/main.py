from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_session
from app.services.main import (
    update_driver_location,
    add_driver_location,
    remove_driver_location
)
from app.schemas.main import (
    UpdateDriverLocationRequest,
    AddDriverLocationRequest,
    LocationUpdateResponse,
    LocationAddResponse,
    LocationRemoveResponse,
    ErrorResponse
)

router = APIRouter()

UNEXPECTED_ERROR_MESSAGE = "An unexpected error occurred"


@router.put(
    "/location/update",
    response_model=LocationUpdateResponse,
    status_code=200
)
async def update_location(
    location: UpdateDriverLocationRequest,
    session: Session = Depends(get_session)
):
    """
    Updates a driver's location based on their ID.
    """
    # try:
    return update_driver_location(
            session,
            location.driver_id,
            location.latitude,
            location.longitude
        )


@router.post(
    "/location/add",
    response_model=LocationAddResponse,
    status_code=200
)
async def add_location(
    location: AddDriverLocationRequest,
    session: Session = Depends(get_session)
):
    """
    Adds a new driver's location.
    """
    # try:
    return add_driver_location(
        session,
        location.driver_id,
        location.latitude,
        location.longitude
    )


@router.delete(
    "/location/remove",
    status_code=204
)
async def remove_location(
    driver_id: int = Query(
        ...,
        description="The ID of the driver to delete location"
    ),
    session: Session = Depends(get_session)
):
    """
    Removes a driver's location by ID.
    """
    return remove_driver_location(session, driver_id)