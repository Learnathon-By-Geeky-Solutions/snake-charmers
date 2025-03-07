from fastapi import FastAPI
from app.api.main import router as location_router

app = FastAPI()

app.include_router(location_router, prefix="/api", tags=["Location Service"])


@app.get("/api", tags=["Root"])
def read_root():
    return {"message": "Welcome to the location-service"}
