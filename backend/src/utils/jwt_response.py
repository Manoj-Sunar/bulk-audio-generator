# src/utils/jwt_response.py
from fastapi import Response
from src.user.model import User
from src.utils.jwt import create_access_token, create_refresh_token
from src.utils.settings import settings

def build_auth_response(
    user: User,
    message: str = "Login successful.",
    response: Response = None,
):
    token_data = {"id": user.id, "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    if response:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=900,
            path="/",
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=604800,
            path="/",
        )
        response.set_cookie(
            key="csrf_token",
            value=user.csrf_token or "",
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=900,
            path="/",
        )

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar,
        "email_verified": user.email_verified,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
    return {
        "success": True,
        "message": message,
        "data": {"user": user_data},
    }