# src/utils/jwt.py
from datetime import datetime, timedelta, timezone
import secrets
from typing import Dict, Any, Optional
from jwt import encode, decode, PyJWTError
from src.utils.settings import settings

class TokenType:
    ACCESS = "access"
    REFRESH = "refresh"
    CSRF = "csrf"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    exp_delta = expires_delta or timedelta(minutes=15)
    payload.update({
        "type": TokenType.ACCESS,
        "exp": datetime.now(timezone.utc) + exp_delta,
        "iat": datetime.now(timezone.utc),
        "jti": secrets.token_urlsafe(16),
    })
    return encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    exp_delta = expires_delta or timedelta(days=7)
    payload.update({
        "type": TokenType.REFRESH,
        "exp": datetime.now(timezone.utc) + exp_delta,
        "iat": datetime.now(timezone.utc),
        "jti": secrets.token_urlsafe(16),
    })
    return encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    try:
        return decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except PyJWTError as e:
        raise ValueError(f"Invalid token: {str(e)}")

def validate_token_type(token: str, expected_type: str) -> Dict[str, Any]:
    payload = decode_token(token)
    if payload.get("type") != expected_type:
        raise ValueError(f"Invalid token type. Expected {expected_type}")
    return payload

def is_token_expired(token: str) -> bool:
    try:
        payload = decode_token(token)
        exp = payload.get("exp")
        if exp:
            return datetime.fromtimestamp(exp, timezone.utc) < datetime.now(timezone.utc)
        return True
    except:
        return True

def refresh_tokens(user_id: int, email: str) -> Dict[str, str]:
    token_data = {"id": user_id, "email": email}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
    }

def get_token_expiry(token: str) -> Optional[datetime]:
    try:
        payload = decode_token(token)
        exp = payload.get("exp")
        if exp:
            return datetime.fromtimestamp(exp, timezone.utc)
    except:
        pass
    return None