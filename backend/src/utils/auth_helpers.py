from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging
from src.user.model import User
from src.user.user_provider import UserProvider
from src.utils.jwt_response import build_auth_response

logger = logging.getLogger(__name__)

def oauth_login(oauth_user: dict, db: Session):
    """
    Handle OAuth login with automatic provider linking.

    - If user does not exist: create user and add provider.
    - If user exists and provider already linked: update user info.
    - If user exists but provider not linked: link the new provider.
    """
    email = oauth_user["email"].lower()
    user = db.query(User).filter(User.email == email).first()

    # 1. New user
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
        db.flush()  # get user.id

        # Add provider
        provider_entry = UserProvider(
            user_id=user.id,
            provider=oauth_user["provider"],
            provider_id=oauth_user["provider_id"],
        )
        db.add(provider_entry)
        db.commit()
        db.refresh(user)

        logger.info(
            "New user created via %s. id=%s email=%s",
            oauth_user["provider"].title(), user.id, email
        )
        return build_auth_response(user, f"{oauth_user['provider'].title()} login successful.")

    # 2. Disabled account
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been disabled.",
        )

    # 3. Check if this provider is already linked
    provider_entry = (
        db.query(UserProvider)
        .filter(
            UserProvider.user_id == user.id,
            UserProvider.provider == oauth_user["provider"]
        )
        .first()
    )

    if provider_entry is None:
        # Link new provider
        new_provider = UserProvider(
            user_id=user.id,
            provider=oauth_user["provider"],
            provider_id=oauth_user["provider_id"],
        )
        db.add(new_provider)
        logger.info(
            "Linked new provider '%s' to user id=%s",
            oauth_user["provider"], user.id
        )
    else:
        # Update provider_id (in case it changed) and user info
        provider_entry.provider_id = oauth_user["provider_id"]
        logger.info(
            "Updated provider '%s' for user id=%s",
            oauth_user["provider"], user.id
        )

    # Always update user info from OAuth (name, avatar)
    user.name = oauth_user["name"]
    user.avatar = oauth_user["avatar"]
    user.email_verified = oauth_user["email_verified"]

    db.commit()
    db.refresh(user)

    logger.info(
        "%s login successful. id=%s email=%s",
        oauth_user["provider"].title(), user.id, email
    )

    return build_auth_response(user, f"{oauth_user['provider'].title()} login successful.")