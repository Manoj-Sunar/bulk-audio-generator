# src/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from src.utils.db import Base, engine
from src.user.routes import user_routes
from src.audio.route import audio_routes
from src.elevenLabs.route import elevenlabs_routes
import logging

# Setup logger
logger = logging.getLogger(__name__)

# ⚠️ PRODUCTION CRITICAL: DO NOT RUN create_all ON STARTUP!
# In production, multiple worker processes will try to create tables simultaneously,
# causing database crashes. Use Alembic migrations instead.
# Base.metadata.create_all(engine)  <-- ❌ REMOVE OR COMMENT OUT THIS LINE

app = FastAPI(
    title="Bulk Audio Generator API",
    version="1.0.0",
    docs_url="/docs",  # Keep docs for API testing
    redoc_url="/redoc"
)

# ✅ PRODUCTION CORS CONFIGURATION
# We set allow_origins to an environment variable so it works on Vercel + Render.
# For local dev, we allow localhost.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # ✅ Add your Vercel production domain here or use env var
    # "https://your-app.vercel.app", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    max_age=600,
)

# ✅ PRODUCTION TRUSTED HOSTS
# In production, do NOT allow "*". We restrict to known domains.
allowed_hosts = [
    "localhost", 
    "127.0.0.1", 
    # ✅ Add your Render backend domain here
    # "your-app.onrender.com",
    # "your-vercel-domain.com"
]

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts,
)

# ✅ GLOBAL EXCEPTION HANDLER (Already correct)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )

# ✅ Health Check (Required for Render)
@app.get("/")
async def root():
    return {"message": "Bulk Audio Generator API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Register your routers
app.include_router(user_routes)
app.include_router(audio_routes)
app.include_router(elevenlabs_routes)