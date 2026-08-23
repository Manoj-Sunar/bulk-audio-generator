# src/utils/auth.py
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from src.utils.jwt import decode_token, validate_token_type
from src.user.model import User
from src.utils.db import get_db
from src.utils.logging import get_logger

logger = get_logger(__name__)

async def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current authenticated user from token"""
    token = request.cookies.get("access_token")
    
    if not token:
        logger.warning("No access token found", client_ip=request.client.host if request.client else None)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = validate_token_type(token, "access")
        user_id = payload.get("id")
        
        if not user_id:
            logger.warning("Invalid token payload - missing user ID")
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            logger.warning(f"User not found: {user_id}")
            raise HTTPException(status.HTTP_403_FORBIDDEN, "User not found")
            
        if not user.is_active:
            logger.warning(f"User disabled: {user_id}")
            raise HTTPException(status.HTTP_403_FORBIDDEN, "User account is disabled")
        
        return user
        
    except ValueError as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(e) or "Invalid token")
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

def require_csrf_token(request: Request):
    """Require CSRF token for non-GET, non-HEAD, non-OPTIONS requests"""
    # Skip CSRF for safe methods
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
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, 
            "CSRF token validation failed: token missing"
        )
    
    if csrf_token != csrf_header:
        logger.warning(
            "CSRF token mismatch",
            method=request.method,
            path=request.url.path
        )
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, 
            "CSRF token validation failed: token mismatch"
        )
    
    return True

def optional_csrf_token(request: Request):
    """
    Optional CSRF validation for streaming endpoints.
    Still validates if token is present, but doesn't require it.
    """
    # Skip CSRF for safe methods
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return True
    
    csrf_token = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    
    # If both are present, validate them
    if csrf_token and csrf_header:
        if csrf_token != csrf_header:
            logger.warning(
                "CSRF mismatch in optional validation",
                method=request.method,
                path=request.url.path
            )
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, 
                "CSRF token validation failed"
            )
        return True
    
    # Log missing CSRF but allow for streaming
    if not csrf_token or not csrf_header:
        logger.info(
            f"CSRF token missing in streaming request - allowing",
            method=request.method,
            path=request.url.path,
            has_cookie=bool(csrf_token),
            has_header=bool(csrf_header)
        )
    
    return True