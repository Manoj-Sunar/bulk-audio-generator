# src/utils/settings.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, model_validator
from typing import List, Optional, Literal


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
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

    # Cookie behaviour.
    #   SameSite=None  → required for cross-site (e.g. Vercel ↔ Render) auth.
    #                    MUST be paired with Secure=True or browsers drop the cookie.
    #   SameSite=Lax   → fine for same-site dev (localhost).
    COOKIE_SECURE: bool = True
    COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    COOKIE_DOMAIN: Optional[str] = None  # e.g. ".example.com"; leave None for default

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── OAuth ───────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str

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
        """
        Browsers will silently drop cookies that violate these rules:

          1. SameSite=None  →  Secure MUST be True
          2. Secure=True    →  requires HTTPS (handled by the platform)

        Rather than crash the whole app, we log a warning and coerce
        the safest combination so cross-domain auth still works.
        """
        import logging
        log = logging.getLogger(__name__)

        if self.COOKIE_SAMESITE == "none" and not self.COOKIE_SECURE:
            log.warning(
                "COOKIE_SAMESITE=none requires COOKIE_SECURE=True. "
                "Forcing COOKIE_SECURE=True to keep cross-domain auth working."
            )
            object.__setattr__(self, "COOKIE_SECURE", True)

        if self.ENVIRONMENT == "production" and self.COOKIE_SAMESITE != "none":
            log.warning(
                "ENVIRONMENT=production but COOKIE_SAMESITE=%s. "
                "Cross-domain frontend↔backend auth will FAIL unless the "
                "frontend is served from the same site as the API. "
                "Set COOKIE_SAMESITE=none in production for cross-origin setups.",
                self.COOKIE_SAMESITE,
            )

        if self.ENVIRONMENT == "production" and not self.COOKIE_SECURE:
            log.warning(
                "ENVIRONMENT=production but COOKIE_SECURE=False. "
                "Cookies will be sent over plain HTTP — insecure."
            )

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
        """
        True when the API and the frontend live on different registrable
        domains (e.g. onrender.com vs vercel.app). In that case cookies
        MUST use SameSite=None; Secure.
        """
        return self.COOKIE_SAMESITE == "none"


settings = Settings()