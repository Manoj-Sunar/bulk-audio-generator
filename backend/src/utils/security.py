# src/utils/security.py
import secrets
import hashlib
import base64
import re
from datetime import datetime, timedelta, timezone
from typing import Optional
from pwdlib import PasswordHash
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from src.utils.settings import settings

password_hash = PasswordHash.recommended()

# Generate secure salt from settings
def get_encryption_salt() -> bytes:
    """Get or generate encryption salt from environment"""
    salt = settings.ENCRYPTION_SALT
    if not salt:
        # Generate new salt if not set (for development only)
        salt = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()
    return salt.encode()

def derive_fernet_key(passphrase: str) -> bytes:
    """Derive Fernet key from passphrase using PBKDF2"""
    salt = get_encryption_salt()
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=310000,  # OWASP recommended
    )
    key = base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))
    return key

def get_fernet() -> Fernet:
    """Get Fernet instance with derived key"""
    return Fernet(derive_fernet_key(settings.ENCRYPTION_KEY))

def hash_password(password: str) -> str:
    """Hash password using pwdlib"""
    return password_hash.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return password_hash.verify(password, hashed)

def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def generate_csrf_token() -> str:
    """Generate CSRF token for form protection"""
    return secrets.token_urlsafe(32)

def sanitize_script_input(script: str) -> str:
    """Sanitize user input for scripts"""
    # Remove potential XSS vectors
    script = re.sub(r'<[^>]*>', '', script)
    # Limit length
    if len(script) > 100000:  # 100KB limit
        raise ValueError("Script too large")
    return script.strip()

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data with Fernet"""
    fernet = get_fernet()
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(encrypted: str) -> str:
    """Decrypt sensitive data with Fernet"""
    fernet = get_fernet()
    return fernet.decrypt(encrypted.encode()).decode()

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe filesystem operations"""
    # Remove any path traversal attempts
    filename = filename.replace("/", "_").replace("\\", "_")
    # Keep only alphanumeric, dash, underscore, dot
    filename = re.sub(r'[^a-zA-Z0-9\-_.]', '', filename)
    # Limit length
    return filename[:100]