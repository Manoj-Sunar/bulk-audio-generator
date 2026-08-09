# src/user/routes.py
from fastapi import APIRouter, Depends, status, Response, Request
from sqlalchemy.orm import Session
from src.user.dtos import UserSchema, UserLoginSchema, GoogleLoginSchema, GithubLoginSchema
from src.utils.db import getDb
from src.user import controllers
from src.utils.auth import get_current_user
from src.user.model import User

user_routes = APIRouter(prefix="/user")

@user_routes.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: UserSchema, db: Session = Depends(getDb)):
    return controllers.UserRegister(body, db)

@user_routes.post("/login", status_code=status.HTTP_200_OK)
def login(body: UserLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return controllers.UserLogin(body, db, response)

@user_routes.post("/google", status_code=status.HTTP_200_OK)
def google_login(body: GoogleLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return controllers.GoogleLogin(body, db, response)

@user_routes.post("/github", status_code=status.HTTP_200_OK)
async def github_login(body: GithubLoginSchema, db: Session = Depends(getDb), response: Response = None):
    return await controllers.GithubLogin(body, db, response)



@user_routes.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    return controllers.Logout(response)

@user_routes.get("/me", status_code=status.HTTP_200_OK)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(getDb)):
    return controllers.GetMe(user, db)


@user_routes.post("/refresh", status_code=status.HTTP_200_OK)
def refresh_token(
    request: Request, 
    db: Session = Depends(getDb),
    response: Response = None  # ✅ Response थप्नुहोस्
):
    return controllers.RefreshToken(request, db, response)