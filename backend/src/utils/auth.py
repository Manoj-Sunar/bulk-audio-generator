from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from src.utils.jwt import decode_token
from src.user.model import User
from src.utils.db import getDb

def get_current_user(request: Request, db: Session = Depends(getDb)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")