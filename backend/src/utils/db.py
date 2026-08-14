# src/utils/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.utils.settings import settings

Base = declarative_base()

engine = create_engine(
    settings.DB_CONNECTION,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
    pool_recycle=3600,
)

LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    session = LocalSession()
    try:
        yield session
    finally:
        session.close()