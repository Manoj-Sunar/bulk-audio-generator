from typing import Dict, Any

import httpx
from fastapi import HTTPException, status


class GithubOAuthService:
    GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
    GITHUB_USER_URL = "https://api.github.com/user"
    GITHUB_EMAILS_URL = "https://api.github.com/user/emails"

    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret

    async def get_access_token(self, code: str) -> str:
        """Exchange authorization code for an access token."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                self.GITHUB_TOKEN_URL,
                data={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "accept": "application/json",
                },
                headers={"Accept": "application/json"},
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange GitHub code for token.",
                )
            data = response.json()
            if "access_token" not in data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="GitHub code invalid or expired.",
                )
            return data["access_token"]


    async def verify_token(self, access_token: str) -> Dict[str, Any]:
        """
        Verify GitHub access token and return normalized user data.

        Returns:
            {
                "provider": "github",
                "provider_id": "12345678",
                "email": "john@example.com",
                "name": "John Doe",
                "avatar": "https://avatars.githubusercontent.com/u/...",
                "email_verified": True
            }
        """

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "FastAPI-App",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:

                # Fetch GitHub profile
                user_response = await client.get(
                    self.GITHUB_USER_URL,
                    headers=headers,
                )

                if user_response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid or expired GitHub access token.",
                    )

                user = user_response.json()

                # Fetch user emails
                email_response = await client.get(
                    self.GITHUB_EMAILS_URL,
                    headers=headers,
                )

                if email_response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Unable to retrieve GitHub email address.",
                    )

                emails = email_response.json()

            # Select primary verified email
            primary_email = None
            email_verified = False

            for email in emails:
                if email.get("primary"):
                    primary_email = email.get("email")
                    email_verified = email.get("verified", False)
                    break

            # Fallback if no primary email
            if not primary_email and emails:
                primary_email = emails[0].get("email")
                email_verified = emails[0].get("verified", False)

            if not primary_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="GitHub account does not have a public/verified email.",
                )

            return {
                "provider": "github",
                "provider_id": str(user["id"]),
                "email": primary_email.lower(),
                "name": user.get("name")
                or user.get("login")
                or "GitHub User",
                "avatar": user.get("avatar_url"),
                "email_verified": email_verified,
            }

        except HTTPException:
            raise

        except httpx.RequestError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to reach GitHub authentication service.",
            )

        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GitHub authentication failed.",
            )