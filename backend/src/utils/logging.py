# src/utils/logging.py
import logging
import json
import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from contextvars import ContextVar
from src.utils.settings import settings

request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)

class StructuredLogger:
    """Structured logging with request_id context"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self._setup_logger()

    def _setup_logger(self):
        # ✅ Check if LOG_FORMAT exists in settings
        log_format = getattr(settings, 'LOG_FORMAT', 'text')
        if log_format == "json":
            handler = logging.StreamHandler()
            handler.setFormatter(JSONFormatter())
            self.logger.addHandler(handler)
            self.logger.propagate = False

    def _get_request_id(self) -> str:
        return request_id_var.get() or "N/A"

    def _log(self, level: int, message: str, **kwargs):
        request_id = self._get_request_id()
        extra = {
            "request_id": request_id,
            **kwargs
        }
        self.logger.log(level, message, extra=extra)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log(logging.ERROR, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)

    def exception(self, message: str, **kwargs):
        self._log(logging.ERROR, message, exc_info=True, **kwargs)


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "N/A"),
        }
        
        if hasattr(record, "extra"):
            log_entry.update(record.extra)
        
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry)


class RequestIDFilter(logging.Filter):
    """Filter to add request_id to log records"""
    
    def filter(self, record):
        record.request_id = request_id_var.get() or "N/A"
        return True


# Configure logging
def setup_logging():
    """Initialize logging configuration"""
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(settings, 'LOG_LEVEL', 'INFO'))
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Add request ID filter
    root_logger.addFilter(RequestIDFilter())
    
    # Console handler
    console_handler = logging.StreamHandler()
    log_format = getattr(settings, 'LOG_FORMAT', 'text')
    
    if log_format == "json":
        console_handler.setFormatter(JSONFormatter())
    else:
        console_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s [%(levelname)s] %(name)s (request_id=%(request_id)s): %(message)s"
            )
        )
    root_logger.addHandler(console_handler)
    
    # File handler for errors (optional)
    try:
        if getattr(settings, 'ENVIRONMENT', 'development') == "production":
            import os
            os.makedirs("logs", exist_ok=True)
            file_handler = logging.FileHandler("logs/error.log")
            file_handler.setLevel(logging.ERROR)
            if log_format == "json":
                file_handler.setFormatter(JSONFormatter())
            root_logger.addHandler(file_handler)
    except Exception:
        pass  # Ignore file handler errors


def get_logger(name: str) -> StructuredLogger:
    """Get a structured logger instance"""
    return StructuredLogger(name)