# src/utils/auth.py
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from src.utils.jwt import decode_token, validate_token_type
from src.user.model import User
from src.utils.db import get_db
from src.utils.logging import get_logger
from src.utils.errors import AppException, ErrorCode

logger = get_logger(__name__)

async def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    
    if not token:
        logger.warning("No access token found", client_ip=request.client.host if request.client else None)
        raise AppException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated. Please log in.",
            error_code=ErrorCode.UNAUTHORIZED
        )
    
    try:
        payload = validate_token_type(token, "access")
        user_id = payload.get("id")
        
        if not user_id:
            raise AppException(
                status.HTTP_401_UNAUTHORIZED,
                "Invalid token payload.",
                ErrorCode.UNAUTHORIZED
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise AppException(
                status.HTTP_403_FORBIDDEN,
                "User not found.",
                ErrorCode.FORBIDDEN
            )
            
        if not user.is_active:
            raise AppException(
                status.HTTP_403_FORBIDDEN,
                "Your account has been disabled.",
                ErrorCode.FORBIDDEN
            )
        
        return user
        
    except ValueError as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise AppException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid or expired token. Please log in again.",
            ErrorCode.UNAUTHORIZED
        )
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise AppException(
            status.HTTP_401_UNAUTHORIZED,
            "Authentication failed. Please try again.",
            ErrorCode.UNAUTHORIZED
        )

def require_csrf_token(request: Request):
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return True
    
    csrf_token = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    
    if not csrf_token or not csrf_header:
        logger.warning(
            f"CSRF token missing - cookie={bool(csrf_token)}, header={bool(csrf_header)}",
            method=request.method,
            path=request.url.path
        )
        raise AppException(
            status.HTTP_403_FORBIDDEN,
            "Security validation failed. Please refresh the page and try again.",
            ErrorCode.CSRF_INVALID
        )
    
    if csrf_token != csrf_header:
        logger.warning(
            "CSRF token mismatch",
            method=request.method,
            path=request.url.path
        )
        raise AppException(
            status.HTTP_403_FORBIDDEN,
            "Security validation failed. Please refresh the page and try again.",
            ErrorCode.CSRF_INVALID
        )
    
    return True

def optional_csrf_token(request: Request):
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return True
    
    csrf_token = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    
    if csrf_token and csrf_header:
        if csrf_token != csrf_header:
            raise AppException(
                status.HTTP_403_FORBIDDEN,
                "Security validation failed.",
                ErrorCode.CSRF_INVALID
            )
        return True
    
    # Allow streaming without CSRF but log
    logger.info(
        "CSRF token missing in streaming request - allowing",
        method=request.method,
        path=request.url.path,
        has_cookie=bool(csrf_token),
        has_header=bool(csrf_header)
    )
    return True