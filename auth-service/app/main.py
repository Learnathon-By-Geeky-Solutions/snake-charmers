from fastapi import FastAPI
from app.api.main import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://liferide.netlify.app",
    ],  
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(auth_router, prefix="/api",tags=["Auth Service"])


@app.get("/api", tags=["Root"])
def read_root():
    return {"ok"}