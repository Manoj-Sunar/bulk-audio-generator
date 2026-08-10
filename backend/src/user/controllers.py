# src/user/controllers.py
from fastapi import HTTPException, status, Response, Request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
import logging
import httpx 

from src.user.model import User
from src.user.user_provider import UserProvider
from src.user.dtos import UserSchema, UserLoginSchema, GoogleLoginSchema, GithubLoginSchema, RefreshTokenSchema
from src.utils.security import hash_password, verify_password, validate_password_strength, generate_csrf_token
from src.user.google_service import GoogleOAuthService
from src.user.github_service import GithubOAuthService
from src.utils.settings import settings
from src.utils.auth_helpers import oauth_login
from src.utils.jwt_response import build_auth_response
from src.utils.jwt import validate_token_type, refresh_tokens, is_token_expired

logger = logging.getLogger(__name__)

google_service = GoogleOAuthService(settings.GOOGLE_CLIENT_ID)
github_service = GithubOAuthService(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)

def UserRegister(body: UserSchema, db: Session):
    """Register a new local user"""
    try:
        # Validate password strength
        if not validate_password_strength(body.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password does not meet security requirements"
            )
        
        name = body.name.strip()
        email = body.email.strip().lower()
        
        # Check existing user
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )
        
        # Generate CSRF token
        csrf_token = generate_csrf_token()
        
        # Create user
        user = User(
            name=name,
            email=email,
            password=hash_password(body.password),
            email_verified=False,
            is_active=True,
            avatar=None,
            csrf_token=csrf_token,
        )
        db.add(user)
        db.flush()
        
        # Add local provider
        local_provider = UserProvider(
            user_id=user.id,
            provider="local",
            provider_id=None,
        )
        db.add(local_provider)
        db.commit()
        db.refresh(user)
        
        logger.info(f"Local user registered: {user.email}")
        
        return {
            "success": True,
            "message": "User registered successfully. Please verify your email.",
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "email_verified": user.email_verified,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
            },
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again.",
        )

def UserLogin(body: UserLoginSchema, db: Session, response: Response):
    """Authenticate local user"""
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
        
        # Check local provider
        local_provider = db.query(UserProvider).filter(
            UserProvider.user_id == user.id,
            UserProvider.provider == "local"
        ).first()
        
        if not local_provider or not user.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This account does not use password login. Please sign in with a linked provider.",
            )
        
        if not verify_password(body.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
        
        # Update CSRF token on login
        user.csrf_token = generate_csrf_token()
        db.commit()
        
        logger.info(f"User logged in: {user.email}")
        return build_auth_response(user, "Login successful.", response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again.",
        )



def GoogleLogin(body: GoogleLoginSchema, db: Session, response: Response):
    """Authenticate with Google (Backend exchanges code)"""
    try:
        # Exchange code for token
        token_res = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": body.token,  # This is actually the authorization code now
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": "http://localhost:3000/google/callback", # Use env var in prod
                "grant_type": "authorization_code",
            }
        )
        token_data = token_res.json()
        if "id_token" not in token_data:
            raise HTTPException(400, detail="Failed to get ID token from Google")
        
        google_user = google_service.verify_token(token_data["id_token"])
        if not google_user["email_verified"]:
            raise HTTPException(403, detail="Google email is not verified.")
            
        return oauth_login(google_user, db, response)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Google login error: {str(e)}")
        raise HTTPException(500, detail="Google authentication failed.")





async def GithubLogin(body: GithubLoginSchema, db: Session, response: Response):
    """Authenticate with GitHub"""
    try:
        access_token = await github_service.get_access_token(body.code)
        github_user = await github_service.verify_token(access_token)
        
        if not github_user["email_verified"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="GitHub email is not verified."
            )
        
        return oauth_login(github_user, db, response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitHub login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub authentication failed."
        )

def Logout(response: Response):
    """Logout user by clearing cookies"""
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("csrf_token", path="/")
    
    return {
        "success": True,
        "message": "Logged out successfully"
    }

def GetMe(user: User, db: Session):
    """Get current user profile"""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar,
        "email_verified": user.email_verified,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
    
    


# src/user/controllers.py (Excerpt - ONLY keep this RefreshToken)
def RefreshToken(request: Request, db: Session, response: Response):
    """Refresh access token using refresh token cookie"""
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )
        
        payload = validate_token_type(refresh_token, "refresh")
        if is_token_expired(refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired. Please login again."
            )
        
        user_id = payload.get("id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or disabled"
            )
        
        new_tokens = refresh_tokens(user.id, user.email)
        
        # Set Secure Cookies
        response.set_cookie(
            key="access_token",
            value=new_tokens["access_token"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=900,
            path="/",
        )
        response.set_cookie(
            key="refresh_token",
            value=new_tokens["refresh_token"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=604800,
            path="/",
        )
        
        # Rotate CSRF token
        user.csrf_token = generate_csrf_token()
        db.commit()
        
        response.set_cookie(
            key="csrf_token",
            value=user.csrf_token,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=900,
            path="/",
        )
        
        return {
            "success": True,
            "message": "Tokens refreshed successfully"
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )