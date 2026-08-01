from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging
from src.user.model import User
from src.utils.jwt_response import build_auth_response
logger = logging.getLogger(__name__)

def oauth_login(  
    oauth_user: dict,
    db: Session,
):
    """
    Shared OAuth login helper.

    Handles:

    - Google
    - Github
    - Apple
    - Facebook
    - Microsoft
    - LinkedIn

    or any OAuth provider that returns the normalized
    user object.
    """

    user = (
        db.query(User)
        .filter(
            User.email == oauth_user["email"]
        )
        .first()
    )

    # -----------------------------
    # First Login
    # -----------------------------

    if user is None:

        user = User(
            name=oauth_user["name"],
            email=oauth_user["email"],
            avatar=oauth_user["avatar"],
            provider=oauth_user["provider"],
            provider_id=oauth_user["provider_id"],
            password=None,
            email_verified=oauth_user["email_verified"],
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # -----------------------------
    # Disabled
    # -----------------------------

    elif not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been disabled.",
        )

    # -----------------------------
    # Different Provider
    # -----------------------------

    elif user.provider != oauth_user["provider"]:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"This account is registered using "
                f"{user.provider.title()} Sign-In."
            ),
        )

    # -----------------------------
    # Existing OAuth User
    # -----------------------------

    else:

        user.name = oauth_user["name"]
        user.avatar = oauth_user["avatar"]
        user.provider_id = oauth_user["provider_id"]

        db.commit()
        db.refresh(user)
       
        logger.info(
    "%s login successful. id=%s email=%s",
    user.provider.title(),
    user.id,
    user.email,
  )

    return build_auth_response(user)
    
       