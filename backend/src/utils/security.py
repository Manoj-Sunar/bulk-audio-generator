# src/utils/security.py
import secrets
import base64
import re
from pwdlib import PasswordHash
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from src.utils.settings import settings

password_hash = PasswordHash.recommended()

def derive_fernet_key(passphrase: str) -> bytes:
    salt = settings.ENCRYPTION_SALT.encode()  # Must be set in .env
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=310000,
    )
    return base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))

def get_fernet() -> Fernet:
    return Fernet(derive_fernet_key(settings.ENCRYPTION_KEY))

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)

def validate_password_strength(password: str) -> bool:
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
    return secrets.token_urlsafe(32)

def sanitize_script_input(script: str) -> str:
    script = re.sub(r'<[^>]*>', '', script)
    if len(script) > settings.MAX_SCRIPT_LENGTH:
        raise ValueError("Script too large")
    return script.strip()

def encrypt_data(data: str) -> str:
    return get_fernet().encrypt(data.encode()).decode()

def decrypt_data(encrypted: str) -> str:
    return get_fernet().decrypt(encrypted.encode()).decode()

def sanitize_filename(filename: str) -> str:
    filename = filename.replace("/", "_").replace("\\", "_")
    filename = re.sub(r'[^a-zA-Z0-9\-_.]', '', filename)
    return filename[:100]