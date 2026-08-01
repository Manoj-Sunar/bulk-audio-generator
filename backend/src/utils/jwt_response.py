from src.user.model import User
from src.utils.jwt import (
    create_access_token,
    create_refresh_token,
)


def build_auth_response(
    user: User,
    message: str = "Login successful.",
):
    """
    Generate JWT tokens and return a standardized
    authentication response.
    """

    access_token = create_access_token(
        {
            "id": user.id,
            "email": user.email,
            "provider": user.provider,
        }
    )

    refresh_token = create_refresh_token(
        {
            "id": user.id,
            "email": user.email,
            "provider": user.provider,
        }
    )

    return {
        "success": True,
        "message": message,
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": 1800,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "provider": user.provider,
                "email_verified": user.email_verified,
                "is_active": user.is_active,
                "created_at": user.created_at,
            },
        },
    }