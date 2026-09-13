# src/utils/settings.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, model_validator
from typing import List, Optional, Literal


# ENVIRONMENT=production → .env.production, otherwise .env.local
_env_name = os.getenv("ENVIRONMENT", "development").lower()
_env_file = ".env.production" if _env_name == "production" else ".env.local"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_env_file,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Database ────────────────────────────────────────────────
    DB_CONNECTION: str
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_ECHO: bool = False

    # ── Security ────────────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ENCRYPTION_KEY: str
    ENCRYPTION_SALT: str

    COOKIE_SECURE: bool = True
    COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    COOKIE_DOMAIN: Optional[str] = None

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── OAuth ───────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str

    FRONTEND_URL: str
    GOOGLE_REDIRECT_URI: str
    GITHUB_REDIRECT_URI: str

    # ── CORS ────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    ALLOWED_HOSTS: str = "localhost,127.0.0.1"

    # ── Rate Limiting ───────────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60

    # ── Logging ─────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "text"
    ENVIRONMENT: str = "development"

    # ── Audio ───────────────────────────────────────────────────
    MAX_SCRIPT_LENGTH: int = 100000
    MAX_CHUNKS: int = 1000
    AUDIO_TIMEOUT: int = 60
    MAX_AUDIO_PREVIEWS: int = 3

    # ── Email ───────────────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    SMTP_TLS: bool = True

    # ── OTP ─────────────────────────────────────────────────────
    OTP_EXPIRY_MINUTES: int = 10
    OTP_LENGTH: int = 6

    # ── Monitoring ──────────────────────────────────────────────
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True

    # ── Validators ──────────────────────────────────────────────

    @field_validator("COOKIE_SAMESITE", mode="before")
    @classmethod
    def _normalise_samesite(cls, v):
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @model_validator(mode="after")
    def _enforce_cookie_safety(self):
        import logging
        log = logging.getLogger(__name__)

        if self.COOKIE_SAMESITE == "none" and not self.COOKIE_SECURE:
            log.warning(
                "COOKIE_SAMESITE=none requires COOKIE_SECURE=True. "
                "Forcing COOKIE_SECURE=True."
            )
            object.__setattr__(self, "COOKIE_SECURE", True)

        if self.ENVIRONMENT == "production" and not self.COOKIE_SECURE:
            log.warning("COOKIE_SECURE=False in production — insecure.")

        return self

    # ── Derived helpers ─────────────────────────────────────────

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_hosts_list(self) -> List[str]:
        return [h.strip() for h in self.ALLOWED_HOSTS.split(",") if h.strip()]

    @property
    def is_cross_site(self) -> bool:
        return self.COOKIE_SAMESITE == "none"


settings = Settings()