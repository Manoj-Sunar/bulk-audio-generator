# src/user/routes.py
from fastapi import APIRouter, Depends, status, Response, Request   # <-- add Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from src.user.dtos import UserSchema, UserLoginSchema, GoogleLoginSchema, GithubLoginSchema
from src.utils.db import get_db
from src.user import controllers
from src.utils.auth import get_current_user
from src.user.model import User

user_routes = APIRouter(prefix="/user")
limiter = Limiter(key_func=get_remote_address)

@user_routes.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(
    request: Request,              # <-- added
    body: UserSchema,
    db: Session = Depends(get_db)
):
    return controllers.UserRegister(body, db)

@user_routes.post("/login", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
def login(
    request: Request,              # <-- added
    body: UserLoginSchema,
    db: Session = Depends(get_db),
    response: Response = None
):
    return controllers.UserLogin(body, db, response)

@user_routes.post("/google", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
def google_login(
    request: Request,              # <-- added
    body: GoogleLoginSchema,
    db: Session = Depends(get_db),
    response: Response = None
):
    return controllers.GoogleLogin(body, db, response)

@user_routes.post("/github", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def github_login(
    request: Request,              # <-- added
    body: GithubLoginSchema,
    db: Session = Depends(get_db),
    response: Response = None
):
    return await controllers.GithubLogin(body, db, response)

   


@user_routes.post("/logout", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
def logout(
    request: Request,
    response: Response
):
    return controllers.Logout(response)

@user_routes.post("/refresh", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    return controllers.RefreshToken(request, db, response)

@user_routes.get("/me", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
def get_current_user_info(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return controllers.GetMe(current_user, db)