from fastapi import APIRouter

router = APIRouter()

@router.get("/example")
async def read_example():
    return {"message": "This is an example endpoint."}
