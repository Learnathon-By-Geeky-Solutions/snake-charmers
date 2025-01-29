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
        responses={
            400: {"model": ErrorResponse},
            500: {"model": ErrorResponse}
        }
)
async def update_location(
    location: UpdateDriverLocationRequest,
    session: Session = Depends(get_session)
):
    """
    Updates a driver's location based on their ID.
    """
    try:
        update_driver_location(
            session,
            location.driver_id,
            location.latitude,
            location.longitude
        )
        return {"success": True}
    except HTTPException as e:
        raise e
    except Exception as exc:
        raise HTTPException(
            detail=UNEXPECTED_ERROR_MESSAGE,
            status_code=500,
        ) from exc


@router.post(
        "/location/add",
        response_model=LocationAddResponse,
        responses={
            400: {"model": ErrorResponse},
            500: {"model": ErrorResponse}
        }
)
async def add_location(
    location: AddDriverLocationRequest,
    session: Session = Depends(get_session)
):
    """
    Adds a new driver's location.
    """
    try:
        add_driver_location(
            session,
            location.driver_id,
            location.socket_id,
            location.latitude,
            location.longitude
        )
        return {
                "success": True,
                "message": "Location added successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=UNEXPECTED_ERROR_MESSAGE
        ) from exc

@router.delete(
        "/location/remove",
        response_model=LocationRemoveResponse,
        responses={
            404: {"model": LocationRemoveResponse},
            500: {"model": ErrorResponse}
        }
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
    try:
        remove_driver_location(session, driver_id)
        return {
            "success": True,
            "message": "Location removed successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=UNEXPECTED_ERROR_MESSAGE
        ) from exc
