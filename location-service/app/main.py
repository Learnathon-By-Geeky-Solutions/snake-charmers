from fastapi import FastAPI
from app.api.main import router as location_router

app = FastAPI()

app.include_router(location_router)

@app.get("/")
def read_root():
    return {"message": " Welcome to my FastAPI project!"}