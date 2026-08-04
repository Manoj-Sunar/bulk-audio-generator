from fastapi import APIRouter, Depends, status,HTTPException,Response
from sqlalchemy.orm import Session
from src.user.dtos import UserSchema, UserLoginSchema, RefreshTokenSchema
from src.utils.db import getDb
from src.user import controllers
from src.utils.jwt import decode_token
from src.user.model import User
from src.utils.jwt_response import build_auth_response


user_routes = APIRouter(prefix="/user")

@user_routes.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: UserSchema, db: Session = Depends(getDb)):
    return controllers.UserRegister(body, db)

@user_routes.post("/login", status_code=status.HTTP_200_OK)
def login(body: UserLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return controllers.UserLogin(body, db, response)

@user_routes.post("/google", status_code=status.HTTP_200_OK)
def google_login(body: controllers.GoogleLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return controllers.GoogleLogin(body, db, response)

@user_routes.post("/github", status_code=status.HTTP_200_OK)
async def github_login(body: controllers.GithubLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return await controllers.GithubLogin(body, db, response)

@user_routes.post("/refresh", status_code=status.HTTP_200_OK)
def refresh_token(body: RefreshTokenSchema, db: Session = Depends(getDb)):
    """
    Exchange a valid refresh token for a new access + refresh token pair.
    """
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type. Use a refresh token.",
            )

        user = db.query(User).filter(User.id == payload["id"]).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or disabled.",
            )

        # Build new tokens
        return build_auth_response(user, "Tokens refreshed successfully.")

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )