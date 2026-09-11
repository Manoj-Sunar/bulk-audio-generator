# src/utils/settings.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # ─────────────────────────────────────────────────────────────
    # Database
    # ─────────────────────────────────────────────────────────────
    DB_CONNECTION: str
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_ECHO: bool = False

    # ─────────────────────────────────────────────────────────────
    # Security
    # ─────────────────────────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ENCRYPTION_KEY: str
    ENCRYPTION_SALT: str
    COOKIE_SECURE: bool = True
    # Use "lax" if frontend proxies through Vercel (same-site).
    # Use "none" if the browser calls Render directly (cross-site) — requires COOKIE_SECURE=True.
    COOKIE_SAMESITE: str = "lax"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ─────────────────────────────────────────────────────────────
    # OAuth
    # ─────────────────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str

    # Redirect URIs used by the backend when exchanging the OAuth code.
    # MUST exactly match the URIs registered in Google Cloud Console
    # and GitHub OAuth App settings, and match what the frontend sent
    # in the initial authorize request.
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/google/callback"
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/github/callback"

    # Where to send the user after a successful login
    FRONTEND_URL: str = "http://localhost:3000"

    # ─────────────────────────────────────────────────────────────
    # CORS / Hosts
    # ALLOWED_ORIGINS: comma-separated, each with scheme (http:// or https://)
    # ALLOWED_HOSTS:   comma-separated, hostnames ONLY (no scheme, no trailing slash)
    # ─────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = (
        "http://localhost:3000,"
        "https://bulk-audio-generator-sigma.vercel.app"
    )
    ALLOWED_HOSTS: str = (
        "localhost,"
        "127.0.0.1,"
        "bulk-audio-generator-sigma.vercel.app,"
        "bulk-audio-generator.onrender.com"
    )

    # ─────────────────────────────────────────────────────────────
    # Rate Limiting
    # ─────────────────────────────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60

    # ─────────────────────────────────────────────────────────────
    # Logging / Environment
    # Set ENVIRONMENT=production on Render.
    # ─────────────────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "text"
    ENVIRONMENT: str = "development"

    # ─────────────────────────────────────────────────────────────
    # Audio
    # ─────────────────────────────────────────────────────────────
    MAX_SCRIPT_LENGTH: int = 100000
    MAX_CHUNKS: int = 1000
    AUDIO_TIMEOUT: int = 60
    MAX_AUDIO_PREVIEWS: int = 3

    # ─────────────────────────────────────────────────────────────
    # Email
    # ─────────────────────────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    SMTP_TLS: bool = True

    # ─────────────────────────────────────────────────────────────
    # OTP
    # ─────────────────────────────────────────────────────────────
    OTP_EXPIRY_MINUTES: int = 10
    OTP_LENGTH: int = 6

    # ─────────────────────────────────────────────────────────────
    # Monitoring
    # ─────────────────────────────────────────────────────────────
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True

    # ─────────────────────────────────────────────────────────────
    # Derived properties
    # ─────────────────────────────────────────────────────────────
    @property
    def cors_origins(self) -> List[str]:
        """Return ALLOWED_ORIGINS as a clean list of strings."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_hosts_list(self) -> List[str]:
        """Return ALLOWED_HOSTS as a clean list of hostnames."""
        return [h.strip() for h in self.ALLOWED_HOSTS.split(",") if h.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"


settings = Settings()