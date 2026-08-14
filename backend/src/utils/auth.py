# src/utils/auth.py
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from src.utils.jwt import decode_token, validate_token_type
from src.user.model import User
from src.utils.db import get_db
import logging

logger = logging.getLogger(__name__)

async def get_current_user(request: Request, db: Session = Depends(get_db)):
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
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "User not found or disabled")
        return user
    except ValueError as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(e) or "Invalid token")
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

def require_csrf_token(request: Request):
    csrf_token = request.cookies.get("csrf_token")
    csrf_header = request.headers.get("X-CSRF-Token")
    if not csrf_token or not csrf_header or csrf_token != csrf_header:
        logger.warning(f"CSRF mismatch: cookie={csrf_token}, header={csrf_header}")
        raise HTTPException(status.HTTP_403_FORBIDDEN, "CSRF token validation failed")
    return True