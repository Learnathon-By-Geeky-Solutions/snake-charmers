from fastapi import FastAPI
from app.api.main import router as finder_router

app = FastAPI()

app.include_router(finder_router)

@app.get("/")
def read_root():
    return {"message": " Welcome to my FastAPI project!"}