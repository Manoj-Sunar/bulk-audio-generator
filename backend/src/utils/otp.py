# src/utils/otp.py
import random
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from src.user.model import OTPVerification
from src.utils.settings import settings

def generate_otp() -> str:
    """Generate a numeric OTP of specified length."""
    return ''.join([str(random.randint(0,9)) for _ in range(settings.OTP_LENGTH)])

def create_otp(db: Session, user_id: int, purpose: str = "reset_password") -> OTPVerification:
    """Create a new OTP, invalidating any previous unused ones for the same user/purpose."""
    # Invalidate old unused OTPs (optional but recommended)
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
    return otp

def verify_otp(db: Session, user_id: int, otp_code: str, purpose: str = "reset_password") -> bool:
    """Check if the OTP is valid (exists, not used, not expired)."""
    otp = db.query(OTPVerification).filter(
        OTPVerification.user_id == user_id,
        OTPVerification.otp_code == otp_code,
        OTPVerification.purpose == purpose,
        OTPVerification.used == False
    ).first()
    if not otp:
        return False
    if datetime.now(timezone.utc) > otp.expires_at:
        return False
    return True

def mark_otp_used(db: Session, otp_code: str, user_id: int, purpose: str = "reset_password") -> bool:
    """Mark the OTP as used after successful password reset."""
    otp = db.query(OTPVerification).filter(
        OTPVerification.user_id == user_id,
        OTPVerification.otp_code == otp_code,
        OTPVerification.purpose == purpose,
        OTPVerification.used == False
    ).first()
    if otp:
        otp.used = True
        db.commit()
        return True
    return False