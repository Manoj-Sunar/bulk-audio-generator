# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from src.utils.db import Base, engine
from src.user.routes import user_routes
from src.audio.route import audio_routes

Base.metadata.create_all(engine)
app = FastAPI()

# ✅ FIX: Complete CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-domain.com",
    ],
    allow_credentials=True,  # Critical for cookies
    allow_methods=["*"],
    allow_headers=[
        "*",
        "X-CSRF-Token",
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "User-Agent",
    ],
    expose_headers=[
        "Set-Cookie",
        "X-CSRF-Token",
        "Content-Disposition",
    ],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "your-domain.com"],
)

app.include_router(user_routes)
app.include_router(audio_routes)

@app.get("/")
async def root():
    return {"message": "Bulk Audio Generator API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}