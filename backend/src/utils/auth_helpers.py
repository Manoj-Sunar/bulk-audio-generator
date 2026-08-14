# src/utils/auth_helpers.py
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import Session
import logging
from src.user.model import User
from src.user.user_provider import UserProvider
from src.utils.jwt_response import build_auth_response

logger = logging.getLogger(__name__)

def oauth_login(oauth_user: dict, db: Session, response: Response):
    email = oauth_user["email"].lower()
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        user = User(
            name=oauth_user["name"],
            email=email,
            avatar=oauth_user["avatar"],
            password=None,
            email_verified=oauth_user["email_verified"],
            is_active=True,
        )
        db.add(user)
        db.flush()
        provider_entry = UserProvider(
            user_id=user.id,
            provider=oauth_user["provider"],
            provider_id=oauth_user["provider_id"],
        )
        db.add(provider_entry)
        db.commit()
        db.refresh(user)
        logger.info("New user created via %s. id=%s email=%s", oauth_user["provider"].title(), user.id, email)
        return build_auth_response(user, f"{oauth_user['provider'].title()} login successful.", response)

    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account has been disabled.")

    provider_entry = db.query(UserProvider).filter(
        UserProvider.user_id == user.id,
        UserProvider.provider == oauth_user["provider"]
    ).first()

    if provider_entry is None:
        new_provider = UserProvider(
            user_id=user.id,
            provider=oauth_user["provider"],
            provider_id=oauth_user["provider_id"],
        )
        db.add(new_provider)
        logger.info("Linked new provider '%s' to user id=%s", oauth_user["provider"], user.id)
    else:
        provider_entry.provider_id = oauth_user["provider_id"]
        logger.info("Updated provider '%s' for user id=%s", oauth_user["provider"], user.id)

    user.name = oauth_user["name"]
    user.avatar = oauth_user["avatar"]
    user.email_verified = oauth_user["email_verified"]
    db.commit()
    db.refresh(user)
    logger.info("%s login successful. id=%s email=%s", oauth_user["provider"].title(), user.id, email)
    return build_auth_response(user, f"{oauth_user['provider'].title()} login successful.", response)