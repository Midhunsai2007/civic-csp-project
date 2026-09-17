import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

def is_vercel() -> bool:
    return bool(
        os.environ.get("VERCEL")
        or os.environ.get("VERCEL_ENV")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or os.path.exists("/var/task")
    )

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Community Complaint & Smart Civic Issue Management System"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "development_secret_key_change_in_production_civic_platform_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    DATABASE_URL: str = "sqlite:////tmp/civic_complaints.db" if is_vercel() else "sqlite:///./civic_complaints.db"
    UPLOAD_DIR: str = "/tmp/uploads" if is_vercel() else "./uploads"
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://civic-csp-project.vercel.app"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()

# Ensure upload directory exists safely without crashing on read-only environments
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
except Exception as e:
    pass
