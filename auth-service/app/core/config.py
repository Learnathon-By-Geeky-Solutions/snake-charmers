"""
Configuration settings for the application.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Defines application settings loaded from environment variables.
    """
    APP_NAME: str
    ADMIN_EMAIL: str
    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool

    class Config:
        env_file = ".env"


settings = Settings()
