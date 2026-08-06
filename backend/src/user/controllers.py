from fastapi import HTTPException, status,Response
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
import logging

from src.user.model import User
from src.user.user_provider import UserProvider
from src.user.dtos import UserSchema, UserLoginSchema, GoogleLoginSchema, GithubLoginSchema
from src.utils.security import hash_password, verify_password
from src.user.google_service import GoogleOAuthService
from src.user.github_service import GithubOAuthService
from src.utils.settings import settings
from src.utils.auth_helpers import oauth_login
from src.utils.jwt_response import build_auth_response

logger = logging.getLogger(__name__)

google_service = GoogleOAuthService(settings.GOOGLE_CLIENT_ID)
github_service = GithubOAuthService(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)

def UserRegister(body: UserSchema, db: Session):
    """
    Register a new local user (email + password) and create a local provider entry.
    """
    try:
        name = body.name.strip()
        email = body.email.strip().lower()

        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        user = User(
            name=name,
            email=email,
            password=hash_password(body.password),
            email_verified=False,          # set True if you skip email verification
            is_active=True,
            avatar=None,
        )
        db.add(user)
        db.flush()   # get user.id

        # Add local provider
        local_provider = UserProvider(
            user_id=user.id,
            provider="local",
            provider_id=None,
        )
        db.add(local_provider)
        db.commit()
        db.refresh(user)

        logger.info(
            "Local user registered successfully. id=%s email=%s",
            user.id, user.email
        )

        return {
            "success": True,
            "message": "User registered successfully.",
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "email_verified": user.email_verified,
                "is_active": user.is_active,
                "created_at": user.created_at,
            },
        }

    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        logger.exception("Integrity error during registration")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error during registration")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred.",
        )
    except Exception:
        db.rollback()
        logger.exception("Unexpected registration error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )


def UserLogin(body: UserLoginSchema, db: Session,response: Response):
    """
    Authenticate local user using email + password.
    Checks that the user has a 'local' provider.
    """
    try:
        email = body.email.strip().lower()
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been disabled.",
            )

        # Check if user has a local provider
        local_provider = (
            db.query(UserProvider)
            .filter(UserProvider.user_id == user.id, UserProvider.provider == "local")
            .first()
        )
        if not local_provider:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This account does not use password login. Please sign in with a linked provider.",
            )

        if not user.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password login is not available for this account.",
            )

        if not verify_password(body.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        # Optional: check email_verified
        # if not user.email_verified:
        #     raise HTTPException(status_code=403, detail="Please verify your email first.")

        logger.info("User logged in locally. id=%s email=%s", user.id, user.email)
        return build_auth_response(user, "Login successful.",response)

    except HTTPException:
        raise
    except SQLAlchemyError:
        logger.exception("Database error during login")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred.",
        )
    except Exception:
        logger.exception("Unexpected login error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )


def GoogleLogin(body: GoogleLoginSchema, db: Session,response: Response):
    try:
        google_user = google_service.verify_token(body.token)
        if not google_user["email_verified"]:
            raise HTTPException(status_code=403, detail="Google email is not verified.")
        return oauth_login(google_user, db,response)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unexpected Google login error")
        raise HTTPException(status_code=500, detail="Internal server error.")



    
    
    
    # src/user/controllers.py

async def GithubLogin(body: GithubLoginSchema, db: Session, response: Response):
    try:
        
        print(body.code)
        # 1. Use the service to exchange the 'code' for an access token
        access_token = await github_service.get_access_token(body.code)
        
        
        
        # 2. Verify the token and get user info
        github_user = await github_service.verify_token(access_token)
        
        if not github_user["email_verified"]:
            raise HTTPException(status_code=403, detail="GitHub email is not verified.")
        
        # 3. Handle login/linking
        return oauth_login(github_user, db, response)
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Unexpected GitHub login error")
        raise HTTPException(status_code=500, detail="Internal server error.")