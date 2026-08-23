# src/utils/metrics.py
from fastapi import APIRouter, Response, Request
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import time
from src.utils.logging import get_logger

logger = get_logger(__name__)

# Metrics
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"]
)

REQUEST_DURATION = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint"]
)

ACTIVE_REQUESTS = Gauge(
    "http_active_requests",
    "Active HTTP requests"
)

AUDIO_GENERATIONS = Counter(
    "audio_generations_total",
    "Total audio generations",
    ["provider", "status"]
)

API_KEY_VALIDATIONS = Counter(
    "api_key_validations_total",
    "Total API key validations",
    ["provider", "result"]
)

metrics_router = APIRouter(prefix="/metrics", tags=["Metrics"])

@metrics_router.get("")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

async def track_request(request: Request, response):
    """Track request metrics"""
    endpoint = request.url.path
    method = request.method
    status = response.status_code
    
    REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status).inc()

async def track_duration(request: Request, duration: float):
    """Track request duration"""
    endpoint = request.url.path
    method = request.method
    
    REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)

def track_generation(provider: str, status: str):
    """Track audio generation"""
    AUDIO_GENERATIONS.labels(provider=provider, status=status).inc()

def track_api_key_validation(provider: str, result: str):
    """Track API key validation"""
    API_KEY_VALIDATIONS.labels(provider=provider, result=result).inc()