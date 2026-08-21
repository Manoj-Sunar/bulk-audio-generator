# src/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
import logging
import uuid
from src.utils.db import Base, engine
from src.user.routes import user_routes
from src.audio.route import audio_routes
from src.utils.settings import settings

# ─── Logging with request ID ───────────────────────────────
class RequestIDFilter(logging.Filter):
    def filter(self, record):
        # Ensure request_id is present; if not, set to 'N/A'
        if not hasattr(record, 'request_id'):
            record.request_id = 'N/A'
        return True

# Configure basic logging with the format including request_id
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s (request_id=%(request_id)s): %(message)s",
)

# Add the filter to the root logger and all existing handlers
root_logger = logging.getLogger()
root_logger.addFilter(RequestIDFilter())
for handler in root_logger.handlers:
    handler.addFilter(RequestIDFilter())

# Now create the module logger (it will inherit the filter from root)
logger = logging.getLogger(__name__)

# ─── Rate Limiter ───────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Bulk Audio Generator API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# ─── Middleware (order matters) ────────────────────────────
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Trusted Hosts (from env) – filter out empty strings
allowed_hosts = ["localhost", "127.0.0.1"] + [h for h in settings.ALLOWED_ORIGINS.split(",") if h.strip()]
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie", "X-CSRF-Token", "X-Request-ID"],
)

# Rate limiting middleware (after CORS)
app.add_middleware(SlowAPIMiddleware)

# ─── Global Exception Handler ──────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"Unhandled error: {exc}", exc_info=True, extra={"request_id": request_id})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal error occurred. Please try again later.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "request_id": request_id,
        }
    )

# ─── Health Checks ──────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "Bulk Audio Generator API", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/ready")
async def ready_check():
    # Optional: check DB connectivity here
    return {"status": "ready"}

# ─── Routers ────────────────────────────────────────────────
app.include_router(user_routes)
app.include_router(audio_routes)