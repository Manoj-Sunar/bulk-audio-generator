# src/utils/middleware.py
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
import uuid
from src.utils.logging import request_id_var, get_logger
from src.utils.settings import settings

logger = get_logger(__name__)

class RequestIDMiddleware:
    """Add request ID to each request"""
    
    async def __call__(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        request_id_var.set(request_id)
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HSTS in production
        if settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests with timing"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path}",
            method=request.method,
            path=request.url.path,
            client_ip=request.client.host if request.client else None
        )
        
        response = await call_next(request)
        
        # Log response
        duration = time.time() - start_time
        logger.info(
            f"Response: {request.method} {request.url.path} - {response.status_code}",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round(duration * 1000, 2)
        )
        
        return response


class RateLimitOverrideMiddleware(BaseHTTPMiddleware):
    """Override rate limiting for specific endpoints"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/ready", "/metrics"]:
            request.state.skip_rate_limit = True
        
        return await call_next(request)