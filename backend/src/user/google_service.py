from typing import Dict, Any

from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token


class GoogleOAuthService:
    """
    Google OAuth Token Verification Service
    """

    def __init__(self, client_id: str):
        self.client_id = client_id

    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify Google ID Token.

        Returns:
            {
                "provider_id": "...",
                "email": "...",
                "name": "...",
                "picture": "...",
                "email_verified": True
            }
        """

        try:
            payload = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                self.client_id,
            )

            if payload.get("iss") not in (
                "accounts.google.com",
                "https://accounts.google.com",
            ):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Google token issuer.",
                )

            if not payload.get("email"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Google account has no email.",
                )

            return {
                "provider": "google",
                "provider_id": payload["sub"],
                "email": payload["email"].lower(),
                "name": payload.get("name", ""),
                "avatar": payload.get("picture"),
                "email_verified": payload.get(
                    "email_verified",
                    False,
                ),
            }

        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google token.",
            )

        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google authentication failed.",
            )