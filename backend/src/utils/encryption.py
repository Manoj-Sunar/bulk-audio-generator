# src/utils/encryption.py
import json
from src.utils.security import get_fernet

fernet = get_fernet()

def encrypt_api_keys(keys: list) -> str:
    data = json.dumps(keys).encode()
    return fernet.encrypt(data).decode()

def decrypt_api_keys(encrypted: str) -> list:
    if not encrypted:
        return []
    data = fernet.decrypt(encrypted.encode())
    return json.loads(data.decode())