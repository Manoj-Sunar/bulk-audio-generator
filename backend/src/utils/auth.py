# src/utils/auth.py
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from src.utils.jwt import decode_token, validate_token_type, is_token_expired
from src.user.model import User
from src.utils.db import getDb
import logging

logger = logging.getLogger(__name__)

async def get_current_user(request: Request, db: Session = Depends(getDb)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = validate_token_type(token, "access")
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled",
            )
        return user
        
    except ValueError as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e) or "Invalid token",
        )
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

def require_csrf_token(request: Request):
    """Validate CSRF token - """
    csrf_token = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    
  
    if not csrf_token:
        return True
    
   
    if not csrf_header or csrf_token != csrf_header:
        logger.warning(f"CSRF validation failed: cookie={csrf_token}, header={csrf_header}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token validation failed",
        )
    return True