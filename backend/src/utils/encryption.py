import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from src.utils.settings import settings

# A fixed salt – you may change it, but keep it consistent across restarts.
# In production, generate a random salt and store it in environment (ENCRYPTION_SALT).
SALT = b"bulk_audio_salt_16"  # Must be at least 16 bytes

def derive_fernet_key(passphrase: str) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=SALT,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))
    return key

fernet = Fernet(derive_fernet_key(settings.ENCRYPTION_KEY))

def encrypt_api_keys(keys: list) -> str:
    """Encrypt a list of API keys to a base64 string."""
    import json
    data = json.dumps(keys).encode()
    return fernet.encrypt(data).decode()

def decrypt_api_keys(encrypted: str) -> list:
    """Decrypt base64 string back to a list."""
    if not encrypted:
        return []
    import json
    data = fernet.decrypt(encrypted.encode())
    return json.loads(data.decode())