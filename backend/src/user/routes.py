from fastapi import APIRouter,Depends,status
from src.user.dtos import UserSchema,UserLoginSchema
from src.utils.db import getDb
from sqlalchemy.orm import Session
from src.user import controllers

user_routes=APIRouter(prefix="/user")

@user_routes.post("/user-register",status_code=status.HTTP_201_CREATED)
def register(body:UserSchema,db:Session=Depends(getDb)):
    return controllers.UserRegister(body,db);

@user_routes.post("/user-login",status_code=status.HTTP_201_CREATED)
def login(body:UserLoginSchema,db:Session=Depends(getDb)):
    return controllers.UserLogin(body,db)
    