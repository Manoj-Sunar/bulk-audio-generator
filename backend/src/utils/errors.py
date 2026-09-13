# src/utils/errors.py
from enum import Enum
from fastapi import HTTPException

class ErrorCode(str, Enum):
    # Authentication & Authorization
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    CSRF_INVALID = "CSRF_INVALID"
    
    # Input Validation
    INVALID_SCRIPT = "INVALID_SCRIPT"
    SCRIPT_TOO_LONG = "SCRIPT_TOO_LONG"
    EMPTY_SCRIPT = "EMPTY_SCRIPT"
    
    # API Key Issues
    INVALID_API_KEY = "INVALID_API_KEY"
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED"
    
    # Provider Errors
    PROVIDER_ERROR = "PROVIDER_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
    RATE_LIMIT = "RATE_LIMIT"
    
    # Generation Errors
    GENERATION_FAILED = "GENERATION_FAILED"
    NOT_FOUND = "NOT_FOUND"
    
    # Internal
    INTERNAL_ERROR = "INTERNAL_ERROR"

class AppException(Exception):
    """
    Custom exception for user-friendly error responses.
    """
    def __init__(
        self,
        status_code: int,
        message: str,
        error_code: ErrorCode = None,
        details: dict = None
    ):
        self.status_code = status_code
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(message)