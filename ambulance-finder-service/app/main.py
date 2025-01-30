from fastapi import FastAPI
from app.api.endpoints.example import router as example_router

app = FastAPI()

app.include_router(example_router)

@app.get("/")
def read_root():
    return {"message": " Welcome to my FastAPI project!"}