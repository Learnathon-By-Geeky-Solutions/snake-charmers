import os
from sqlmodel import create_engine, Session
# from app.core.config import settings

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True
)

def get_session():
    """
    Dependency function to get a new database session.
    """
    with Session(engine) as session:
        yield session