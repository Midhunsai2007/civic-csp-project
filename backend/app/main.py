import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.init_db import init_db
from app.api import auth, complaints, citizen, staff, admin, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize and seed DB on start if needed
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Centralized civic complaint management platform with citizen reporting, staff triage, admin oversight, and proposed AI architecture.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(complaints.router, prefix=f"{settings.API_V1_STR}/complaints", tags=["Complaints"])
app.include_router(citizen.router, prefix=f"{settings.API_V1_STR}/citizen", tags=["Citizen"])
app.include_router(staff.router, prefix=f"{settings.API_V1_STR}/staff", tags=["Staff"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["Proposed AI Architecture"])

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "team": "M. Mahitha, C. Sindhu, B. Vijayasankar, D. Rajesh",
        "guide": "Dr M. Vijay",
        "institution": "Kalasalingam Academy of Research and Education",
        "version": "1.0.0",
        "api_docs": "/docs",
        "status": "online"
    }
