from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DB_CONNECTION: str
    SECRET_KEY: str                     # fixed typo
    ALGORITHM: str                      # fixed typo
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    ENCRYPTION_KEY: str
    # GitHub doesn't need client credentials if you only verify the access token
    # but you can add them if you plan to implement the full OAuth flow on backend

settings = Settings()