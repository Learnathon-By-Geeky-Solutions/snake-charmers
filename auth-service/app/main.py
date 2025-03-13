from fastapi import FastAPI
from app.api.main import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origins
    allow_credentials=True,  # Allows cookies (useful for authentication)
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router, prefix="/api",tags=["Auth Service"])
