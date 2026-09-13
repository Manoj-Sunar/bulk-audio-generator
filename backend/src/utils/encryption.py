# src/utils/encryption.py
import json
from src.utils.security import get_fernet
from src.utils.logging import get_logger

logger = get_logger(__name__)

def get_fernet_instance():
    """Get Fernet instance with error handling"""
    try:
        return get_fernet()
    except Exception as e:
        logger.error(f"Failed to initialize Fernet: {str(e)}")
        raise

def encrypt_api_keys(keys: list) -> str:
    """Encrypt API keys list"""
    try:
        fernet = get_fernet_instance()
        data = json.dumps(keys).encode()
        return fernet.encrypt(data).decode()
    except Exception as e:
        logger.error(f"Failed to encrypt API keys: {str(e)}")
        raise

def decrypt_api_keys(encrypted: str) -> list:
    """Decrypt API keys list"""
    if not encrypted:
        return []
    try:
        fernet = get_fernet_instance()
        data = fernet.decrypt(encrypted.encode())
        return json.loads(data.decode())
    except Exception as e:
        logger.error(f"Failed to decrypt API keys: {str(e)}")
        return []