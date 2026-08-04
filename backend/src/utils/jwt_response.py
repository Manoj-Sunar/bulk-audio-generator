from fastapi import Response
from src.user.model import User
from src.utils.jwt import create_access_token, create_refresh_token
from src.utils.settings import settings

def build_auth_response(
    user: User,
    message: str = "Login successful.",
    response: Response = None,  # Optional, but we'll always pass it
):
    """
    Generate JWT tokens, set them as HTTP-only cookies, and return a minimal JSON response.
    """
    access_token = create_access_token({"id": user.id, "email": user.email})
    refresh_token = create_refresh_token({"id": user.id, "email": user.email})

    # Set cookies (HttpOnly, Secure, SameSite=Lax)
    if response:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,          # Set to False if not using HTTPS in dev
            samesite="lax",
            max_age=1800,         # 30 minutes
            path="/",
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=604800,       # 7 days
            path="/",
        )

    # Return minimal JSON (no tokens in body)
    return {
        "success": True,
        "message": message,
        "data": {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "email_verified": user.email_verified,
                "is_active": user.is_active,
                "created_at": user.created_at,
            }
        },
    }