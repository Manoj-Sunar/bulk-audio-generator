# src/utils/otp.py
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
from src.user.model import OTPVerification
from src.utils.settings import settings
from src.utils.logging import get_logger

logger = get_logger(__name__)

def generate_otp() -> str:
    """Generate a cryptographically secure numeric OTP"""
    return ''.join([str(secrets.randbelow(10)) for _ in range(settings.OTP_LENGTH)])

def create_otp(db: Session, user_id: int, purpose: str = "reset_password") -> OTPVerification:
    """Create a new OTP, invalidating any previous unused ones"""
    try:
        # Invalidate old unused OTPs
        db.query(OTPVerification).filter(
            OTPVerification.user_id == user_id,
            OTPVerification.purpose == purpose,
            OTPVerification.used == False
        ).update({"used": True})
        
        code = generate_otp()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        
        otp = OTPVerification(
            user_id=user_id,
            otp_code=code,
            purpose=purpose,
            expires_at=expires_at,
            used=False
        )
        db.add(otp)
        db.commit()
        db.refresh(otp)
        
        logger.info(f"OTP created for user {user_id}", user_id=user_id, purpose=purpose)
        return otp
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create OTP: {str(e)}", user_id=user_id)
        raise

def verify_otp(db: Session, user_id: int, otp_code: str, purpose: str = "reset_password") -> bool:
    """Check if OTP is valid (exists, not used, not expired)"""
    try:
        otp = db.query(OTPVerification).filter(
            OTPVerification.user_id == user_id,
            OTPVerification.otp_code == otp_code,
            OTPVerification.purpose == purpose,
            OTPVerification.used == False
        ).first()
        
        if not otp:
            logger.warning(f"OTP not found for user {user_id}", user_id=user_id)
            return False
            
        if datetime.now(timezone.utc) > otp.expires_at:
            logger.warning(f"OTP expired for user {user_id}", user_id=user_id)
            return False
            
        return True
    except Exception as e:
        logger.error(f"Failed to verify OTP: {str(e)}", user_id=user_id)
        return False

def mark_otp_used(db: Session, user_id: int, purpose: str = "reset_password") -> bool:
    """Mark all OTPs as used for a user/purpose combination"""
    try:
        result = db.query(OTPVerification).filter(
            OTPVerification.user_id == user_id,
            OTPVerification.purpose == purpose,
            OTPVerification.used == False
        ).update({"used": True})
        db.commit()
        return result > 0
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to mark OTP as used: {str(e)}", user_id=user_id)
        return False

def cleanup_expired_otps(db: Session) -> int:
    """Delete expired OTPs"""
    try:
        count = db.query(OTPVerification).filter(
            OTPVerification.expires_at < datetime.now(timezone.utc)
        ).delete()
        db.commit()
        return count
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to cleanup expired OTPs: {str(e)}")
        return 0