# src/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from src.utils.errors import AppException, ErrorCode
from src.utils.settings import settings
from src.utils.logging import setup_logging, get_logger
from src.utils.middleware import (
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    RateLimitOverrideMiddleware,
)
from src.utils.db import engine, check_db_health
from src.user.routes import user_routes
from src.audio.route import audio_routes

# ── Setup logging ───────────────────────────────────────────────
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Bulk Audio Generator API v2.0.0")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    logger.info(f"Allowed hosts: {settings.allowed_hosts_list}")
    logger.info(
        f"COOKIE_SECURE={settings.COOKIE_SECURE} "
        f"COOKIE_SAMESITE={settings.COOKIE_SAMESITE}"
    )

    if not check_db_health():
        logger.error("Database connection failed on startup")

    yield

    logger.info("🛑 Shutting down application...")
    engine.dispose()
    logger.info("✓ Database connections closed")


# ── App ─────────────────────────────────────────────────────────
app = FastAPI(
    title="Bulk Audio Generator API",
    version="2.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# ── Rate limiter ────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ────────────────────────────────────────────────────────────────
# MIDDLEWARE ORDER (Starlette = LIFO: last added = first executed)
#
# Request path (outermost → innermost):
#   1. CORSMiddleware          ← handles OPTIONS preflight first
#   2. SlowAPIMiddleware
#   3. TrustedHostMiddleware
#   4. RequestIDMiddleware
#   5. SecurityHeadersMiddleware
#   6. RequestLoggingMiddleware
#   7. RateLimitOverrideMiddleware
#   8. Route
#
# So we add them in REVERSE order below.
# ────────────────────────────────────────────────────────────────

# 7 — innermost
app.add_middleware(RateLimitOverrideMiddleware)

# 6
app.add_middleware(RequestLoggingMiddleware)

# 5
app.add_middleware(SecurityHeadersMiddleware)

# 4
app.add_middleware(RequestIDMiddleware)

# 3
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=(
        settings.allowed_hosts_list + ["*"]
        if settings.ENVIRONMENT == "development"
        else settings.allowed_hosts_list
    ),
)

# 2
app.add_middleware(SlowAPIMiddleware)

# 1 — outermost: CORS must run before anything else
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # NOTE: "Set-Cookie" is a forbidden response header; browsers ignore it.
    # Only expose what the frontend actually needs to read.
    expose_headers=["X-Request-ID"],
    max_age=3600,
)


# ── Exception handlers ──────────────────────────────────────────
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error_code": exc.error_code.value if exc.error_code else None,
            "details": exc.details,
            "request_id": request_id,
        },
    )


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
            },
        )

    logger.error(
        f"Unhandled error: {exc}",
        exc_info=True,
        extra={"request_id": request_id},
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal error occurred. Please try again later.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "request_id": request_id,
        },
    )


# ── Health checks ───────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "message": "Bulk Audio Generator API",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}


@app.get("/ready")
async def ready_check():
    if not check_db_health():
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "database": "disconnected"},
        )
    return {"status": "ready", "database": "connected"}


# ── Metrics ─────────────────────────────────────────────────────
if settings.ENABLE_METRICS:
    from src.utils.metrics import metrics_router
    app.include_router(metrics_router)


# ── Routers ─────────────────────────────────────────────────────
app.include_router(user_routes)
app.include_router(audio_routes)

logger.info(f"✓ API initialized. Environment: {settings.ENVIRONMENT}")