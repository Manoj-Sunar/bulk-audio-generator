from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
import logging

from src.user.model import User
from src.user.dtos import UserSchema,UserLoginSchema,GoogleLoginSchema,GithubLoginSchema
from src.utils.security import hash_password, verify_password
from src.user.google_service import GoogleOAuthService
from src.user.github_service import GithubOAuthService
from src.utils.settings import settings
from src.utils.auth_helpers import oauth_login
from src.utils.jwt_response import build_auth_response

logger = logging.getLogger(__name__)


def UserRegister(body: UserSchema, db: Session):
    """
    Register a new local user.
    """

    try:
        name = body.name.strip()
        email = body.email.strip().lower()

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        user = User(
            name=name,
            email=email,
            password=hash_password(body.password),

            # Local Authentication
            provider="local",
            provider_id=None,

            # Local users are not automatically verified.
            # Change to True if you don't implement email verification.
            email_verified=False,

            is_active=True,

            avatar=None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(
            "Local user registered successfully. id=%s email=%s",
            user.id,
            user.email,
        )

        return {
            "success": True,
            "message": "User registered successfully.",
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "provider": user.provider,
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
        
        
def UserLogin(body: UserLoginSchema, db: Session):
    """
    Authenticate a local (email/password) user and
    return access & refresh tokens.
    """

    try:
        email = body.email.strip().lower()

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        # Account disabled
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been disabled.",
            )

        # Only local users can login with password
        if user.provider != "local":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This account uses {user.provider.title()} Sign-In. Please continue with {user.provider.title()}.",
            )

        # Optional email verification check
        # Uncomment if email verification is implemented.
        #
        # if not user.email_verified:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Please verify your email before logging in.",
        #     )

        if not user.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password login is not available for this account.",
            )

        if not verify_password(
            body.password,
            user.password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
            
        logger.info(
    "User logged in successfully. id=%s email=%s",
    user.id,
    user.email,
)

        return build_auth_response(
            user=user,
            message="Login successful.",
        )

    except HTTPException:
        raise

    except SQLAlchemyError:
        logger.exception("Database error during login.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred.",
        )

    except Exception:
        logger.exception("Unexpected login error.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )
        
        
        
    

google_service = GoogleOAuthService(settings.GOOGLE_CLIENT_ID)
github_service = GithubOAuthService()


def GoogleLogin(body: GoogleLoginSchema, db: Session):
    try:
        google_user = google_service.verify_token(body.token)

        if not google_user["email_verified"]:
            raise HTTPException(
                status_code=403,
                detail="Google email is not verified.",
            )

        return oauth_login(
            oauth_user=google_user,
            db=db,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Unexpected Google login error.")

        raise HTTPException(
            status_code=500,
            detail="Internal server error.",
        )


async def GithubLogin(body: GithubLoginSchema, db: Session):
    try:
        github_user = await github_service.verify_token(
            body.access_token
        )

        if not github_user["email_verified"]:
            raise HTTPException(
                status_code=403,
                detail="GitHub email is not verified.",
            )

        return oauth_login(
            oauth_user=github_user,
            db=db,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Unexpected GitHub login error.")

        raise HTTPException(
            status_code=500,
            detail="Internal server error.",
        )

