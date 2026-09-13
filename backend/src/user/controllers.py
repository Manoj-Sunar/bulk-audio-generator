# src/user/controllers.py
from fastapi import HTTPException, status, Response, Request, BackgroundTasks
from sqlalchemy.orm import Session
import logging
import httpx

from src.user.model import User
from src.user.user_provider import UserProvider
from src.user.dtos import (
    UserSchema,
    UserLoginSchema,
    GoogleLoginSchema,
    GithubLoginSchema,
    RequestPasswordResetSchema,
    VerifyOTPSchema,
    ResetPasswordSchema,
)
from src.utils.security import (
    hash_password,
    verify_password,
    validate_password_strength,
    generate_csrf_token,
)
from src.user.google_service import GoogleOAuthService
from src.user.github_service import GithubOAuthService
from src.utils.settings import settings
from src.utils.auth_helpers import oauth_login
from src.utils.jwt_response import build_auth_response
from src.utils.jwt import validate_token_type, refresh_tokens, is_token_expired
from src.utils.email import send_email
from src.utils.otp import create_otp, verify_otp, mark_otp_used


logger = logging.getLogger(__name__)
google_service = GoogleOAuthService(settings.GOOGLE_CLIENT_ID)
github_service = GithubOAuthService(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)


# ────────────────────────────────────────────────────────────────
# REGISTER
# ────────────────────────────────────────────────────────────────
def UserRegister(body: UserSchema, db: Session):
    try:
        # ✅ FIX: unpack tuple returned by validate_password_strength
        is_valid, error = validate_password_strength(body.password)
        if not is_valid:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                error or "Password does not meet security requirements",
            )

        name = body.name.strip()
        email = body.email.strip().lower()

        existing_user = db.query(User).filter(User.email == email).first()
        print(existing_user)
        if existing_user:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "An account with this email already exists.",
            )

        csrf_token = generate_csrf_token()
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
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Registration failed. Please try again.",
        )


# ────────────────────────────────────────────────────────────────
# LOGIN
# ────────────────────────────────────────────────────────────────
def UserLogin(body: UserLoginSchema, db: Session, response: Response):
    try:
        email = body.email.strip().lower()
        print(email)
        print(body.password)
        existing_user = db.query(User).filter(User.email == email).first()
        print(existing_user)
        if not existing_user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

        if not existing_user.is_active:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account has been disabled.")

        local_provider = (
            db.query(UserProvider)
            .filter(
                UserProvider.user_id == existing_user.id,
                UserProvider.provider == "local",
            )
            .first()
        )
        if not local_provider or not existing_user.password:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "This account does not use password login. Please sign in with a linked provider.",
            )

        if not verify_password(body.password, existing_user.password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

        existing_user.csrf_token = generate_csrf_token()
        db.commit()

        logger.info(f"User logged in: {existing_user.email}")
        return build_auth_response(existing_user, "Login successful.", response)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Login error: {str(e)}")
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Login failed. Please try again.")


# ────────────────────────────────────────────────────────────────
# GOOGLE LOGIN
# ────────────────────────────────────────────────────────────────
def GoogleLogin(body: GoogleLoginSchema, db: Session, response: Response):
    try:
        token_res = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": body.token,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": "http://localhost:3000/google/callback",
                "grant_type": "authorization_code",
            },
        )
        token_data = token_res.json()
        if "id_token" not in token_data:
            raise HTTPException(400, "Failed to get ID token from Google")

        google_user = google_service.verify_token(token_data["id_token"])
        if not google_user["email_verified"]:
            raise HTTPException(403, "Google email is not verified.")

        return oauth_login(google_user, db, response)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Google login error: {str(e)}")
        raise HTTPException(500, "Google authentication failed.")


# ────────────────────────────────────────────────────────────────
# GITHUB LOGIN
# ────────────────────────────────────────────────────────────────
async def GithubLogin(body: GithubLoginSchema, db: Session, response: Response):
    try:
        access_token = await github_service.get_access_token(body.code)
        github_user = await github_service.verify_token(access_token)
        if not github_user["email_verified"]:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "GitHub email is not verified.")
        return oauth_login(github_user, db, response)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitHub login error: {str(e)}")
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "GitHub authentication failed.")


# ────────────────────────────────────────────────────────────────
# LOGOUT
# ────────────────────────────────────────────────────────────────
def Logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("csrf_token", path="/")
    return {"success": True, "message": "Logged out successfully"}


# ────────────────────────────────────────────────────────────────
# GET ME
# ────────────────────────────────────────────────────────────────
def GetMe(user: User, db: Session):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar,
        "email_verified": user.email_verified,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


# ────────────────────────────────────────────────────────────────
# REFRESH TOKEN
# ────────────────────────────────────────────────────────────────
def RefreshToken(request: Request, db: Session, response: Response):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token not found")

        payload = validate_token_type(refresh_token, "refresh")
        if is_token_expired(refresh_token):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token expired. Please login again.")

        user_id = payload.get("id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found or disabled")

        new_tokens = refresh_tokens(user.id, user.email)

        # ✅ FIX: use settings.COOKIE_SAMESITE, not hardcoded "lax"
        response.set_cookie(
            key="access_token",
            value=new_tokens["access_token"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            max_age=900,
            path="/",
        )
        response.set_cookie(
            key="refresh_token",
            value=new_tokens["refresh_token"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            max_age=604800,
            path="/",
        )

        user.csrf_token = generate_csrf_token()
        db.commit()

        response.set_cookie(
            key="csrf_token",
            value=user.csrf_token,
            secure=settings.COOKIE_SECURE,
            samesite=settings.COOKIE_SAMESITE,
            max_age=900,
            path="/",
        )
        return {"success": True, "message": "Tokens refreshed successfully"}
    except ValueError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Token refresh error: {str(e)}")
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Token refresh failed")


# ────────────────────────────────────────────────────────────────
# REQUEST PASSWORD RESET (Step 1: Send OTP)
# ────────────────────────────────────────────────────────────────
def request_password_reset(
    body: RequestPasswordResetSchema,
    db: Session,
    background_tasks: BackgroundTasks,
):
    """Step 1: Generate OTP and send email."""
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal whether email exists
        return {
            "success": True,
            "message": "If your email is registered, you will receive an OTP.",
        }

    otp_obj = create_otp(db, user.id, "reset_password")

    subject = "Password Reset OTP"
    html_body = f"""
    <html>
    <body>
        <p>Hello {user.name},</p>
        <p>You requested to reset your password. Use the following OTP to proceed:</p>
        <h2 style="color: #2d3748;">{otp_obj.otp_code}</h2>
        <p>This OTP is valid for {settings.OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br>Your App Team</p>
    </body>
    </html>
    """

    background_tasks.add_task(send_email, user.email, subject, html_body)

    return {
        "success": True,
        "message": "If your email is registered, you will receive an OTP.",
    }


# ────────────────────────────────────────────────────────────────
# VERIFY OTP (Step 2)
# ────────────────────────────────────────────────────────────────
def verify_otp_controller(body: VerifyOTPSchema, db: Session):
    """Step 2: Verify OTP."""
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if not verify_otp(db, user.id, body.otp, "reset_password"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")

    return {"success": True, "message": "OTP verified successfully"}


# ────────────────────────────────────────────────────────────────
# RESET PASSWORD (Step 3)
# ────────────────────────────────────────────────────────────────
def reset_password_controller(body: ResetPasswordSchema, db: Session):
    """Step 3: Reset password using OTP and new password."""
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    if not verify_otp(db, user.id, body.otp, "reset_password"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")

    # Update password
    user.password = hash_password(body.new_password)

    # ✅ FIX: mark_otp_used signature is (db, user_id, purpose)
    mark_otp_used(db, user.id, "reset_password")
    db.commit()

    logger.info(f"Password reset successfully for user: {user.email}")

    return {
        "success": True,
        "message": "Password reset successfully. You can now login with your new password.",
    }