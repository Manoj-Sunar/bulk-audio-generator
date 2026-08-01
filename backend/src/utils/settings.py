from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config=SettingsConfigDict(env_file=".env",extra="ignore")
    DB_CONNECTION:str
    SECREAT_KEY:str
    ALGORITHEM:str
    GOOGLE_CLIENT_ID: str
    
settings=Settings()
    