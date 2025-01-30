from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str
    ADMIN_EMAIL: str
    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool

    class Config:
        env_file = ".env"

settings = Settings()