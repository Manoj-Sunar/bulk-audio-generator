from datetime import datetime, timedelta, timezone
from jwt import encode, decode

from src.utils.settings import settings


def create_access_token(data: dict):
    payload = data.copy()

    payload.update(
        {
            "type": "access",
            "exp": datetime.now(timezone.utc)
            + timedelta(minutes=30),
        }
    )

    return encode(
        payload,
        settings.SECREAT_KEY,
        algorithm=settings.ALGORITHEM,
    )


def create_refresh_token(data: dict):
    payload = data.copy()

    payload.update(
        {
            "type": "refresh",
            "exp": datetime.now(timezone.utc)
            + timedelta(days=7),
        }
    )

    return encode(
        payload,
        settings.SECREAT_KEY,
        algorithm=settings.ALGORITHEM,
    )


def decode_token(token: str):
    return decode(
        token,
        settings.SECREAT_KEY,
        algorithms=[settings.ALGORITHEM],
    )