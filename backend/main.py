# src/main.py
from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
import asyncio
from contextlib import asynccontextmanager

from src.utils.settings import settings
from src.utils.logging import setup_logging, get_logger
from src.utils.middleware import (
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    RateLimitOverrideMiddleware
)
from src.utils.db import engine, check_db_health
from src.user.routes import user_routes
from src.audio.route import audio_routes

# Setup logging
setup_logging()
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events"""
    # Startup
    logger.info("🚀 Starting Bulk Audio Generator API v2.0.0")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Check database connectivity
    if not check_db_health():
        logger.error("Database connection failed on startup")
        # Don't exit, but log critical error
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down application...")
    engine.dispose()
    logger.info("✓ Database connections closed")

# Initialize FastAPI
app = FastAPI(
    title="Bulk Audio Generator API",
    version="2.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan
)

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware (order matters!)
app.add_middleware(RateLimitOverrideMiddleware)  # First
app.add_middleware(RequestLoggingMiddleware)     # Second
app.add_middleware(SecurityHeadersMiddleware)    # Third

# Add request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    middleware = RequestIDMiddleware()
    return await middleware(request, call_next)

# Trusted Hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts_list + ["*"] if settings.ENVIRONMENT == "development" else settings.allowed_hosts_list,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie", "X-CSRF-Token", "X-Request-ID"],
    max_age=3600,
)

# Rate limiting middleware (after CORS)
app.add_middleware(SlowAPIMiddleware)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    
    if isinstance(exc, RateLimitExceeded):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": "Rate limit exceeded. Please try again later.",
                "error_code": "RATE_LIMIT_EXCEEDED",
                "request_id": request_id,
            }
        )
    
    logger.error(
        f"Unhandled error: {exc}",
        exc_info=True,
        extra={"request_id": request_id}
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal error occurred. Please try again later.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "request_id": request_id,
        }
    )

# Health Checks
@app.get("/")
async def root():
    return {
        "message": "Bulk Audio Generator API",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

@app.get("/ready")
async def ready_check():
    db_status = check_db_health()
    if not db_status:
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "database": "disconnected"}
        )
    return {"status": "ready", "database": "connected"}

# Metrics endpoint (if enabled)
if settings.ENABLE_METRICS:
    from src.utils.metrics import metrics_router
    app.include_router(metrics_router)

# Routers
app.include_router(user_routes)
app.include_router(audio_routes)

# Startup log
logger.info(f"✓ API initialized. Environment: {settings.ENVIRONMENT}")