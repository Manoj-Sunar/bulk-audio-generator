# src/utils/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.pool import NullPool, QueuePool
from src.utils.settings import settings
from contextlib import contextmanager
from src.utils.logging import get_logger

logger = get_logger(__name__)

Base = declarative_base()

# Create engine with production-ready settings
engine = create_engine(
    settings.DB_CONNECTION,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.DB_ECHO,
    connect_args={
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 60,
        "keepalives_interval": 10,
        "keepalives_count": 5
    } if "postgresql" in settings.DB_CONNECTION else {}
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

def get_db() -> Session:
    """Get database session with proper error handling"""
    session = SessionLocal()
    try:
        yield session
    except Exception as e:
        session.rollback()
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        session.close()

@contextmanager
def get_db_context():
    """Context manager for database sessions"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database error in context: {str(e)}")
        raise
    finally:
        session.close()

def check_db_health() -> bool:
    """Check if database is healthy"""
    try:
        with get_db_context() as session:
            session.execute("SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return False

def init_db():
    """Initialize database (for development only)"""
    if settings.ENVIRONMENT == "development":
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created")