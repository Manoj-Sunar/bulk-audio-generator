# src/utils/security.py
import secrets
import re
import base64  # ✅ Added this import
from typing import Optional, Tuple
from pwdlib import PasswordHash
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from src.utils.settings import settings
from src.utils.logging import get_logger

logger = get_logger(__name__)

password_hash = PasswordHash.recommended()

def derive_fernet_key(passphrase: str) -> bytes:
    """Derive Fernet key from passphrase"""
    salt = settings.ENCRYPTION_SALT.encode()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=310000,
    )
    return base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))

def get_fernet() -> Fernet:
    """Get Fernet instance with derived key"""
    return Fernet(derive_fernet_key(settings.ENCRYPTION_KEY))

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return password_hash.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        return password_hash.verify(password, hashed)
    except Exception as e:
        # ✅ ADD THIS: Log the actual error so you can see why it fails
        logger.error(f"Password verification failed: {str(e)}")
        return False

def validate_password_strength(password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate password strength.
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    # Check against common passwords
    common_passwords = ["password123", "admin123", "qwerty123", "12345678", "Password@123"]
    if password.lower() in common_passwords:
        return False, "Password is too common"
    
    return True, None

def generate_csrf_token() -> str:
    """Generate cryptographically secure CSRF token"""
    return secrets.token_urlsafe(32)

def sanitize_script_input(script: str) -> str:
    """Sanitize script input"""
    # Remove HTML tags
    script = re.sub(r'<[^>]*>', '', script)
    
    # Remove potentially dangerous content
    script = re.sub(r'[<>{}]', '', script)
    
    if len(script) > settings.MAX_SCRIPT_LENGTH:
        raise ValueError(f"Script exceeds maximum length of {settings.MAX_SCRIPT_LENGTH}")
    
    return script.strip()

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    # Remove path traversal
    filename = filename.replace("/", "_").replace("\\", "_")
    
    # Remove special characters
    filename = re.sub(r'[^a-zA-Z0-9\-_.]', '', filename)
    
    # Limit length
    return filename[:100]

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data"""
    try:
        return get_fernet().encrypt(data.encode()).decode()
    except Exception as e:
        logger.error(f"Encryption failed: {str(e)}")
        raise

def decrypt_data(encrypted: str) -> str:
    """Decrypt sensitive data"""
    try:
        return get_fernet().decrypt(encrypted.encode()).decode()
    except Exception as e:
        logger.error(f"Decryption failed: {str(e)}")
        raise

def generate_api_key() -> str:
    """Generate a secure API key"""
    return secrets.token_urlsafe(32)