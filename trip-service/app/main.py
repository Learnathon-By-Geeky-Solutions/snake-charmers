from fastapi import FastAPI
from app.api.main import router as trip_router

app = FastAPI()

app.include_router(trip_router)

@app.get("/")
def read_root():
    return {"message": " Welcome to trip-service!"}