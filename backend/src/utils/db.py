# src/utils/db.py

from contextlib import contextmanager

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.pool import QueuePool

from src.utils.settings import settings
from src.utils.logging import get_logger


logger = get_logger(__name__)

Base = declarative_base()


# ============================================================
# DATABASE ENGINE
# ============================================================

engine = create_engine(
    settings.DB_CONNECTION,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.DB_ECHO,

    # PostgreSQL connection settings
    connect_args={
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 60,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    } if "postgresql" in settings.DB_CONNECTION else {},
)


# ============================================================
# SESSION FACTORY
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# FASTAPI DATABASE DEPENDENCY
# ============================================================

def get_db() -> Session: 
    """
    Get a database session for FastAPI dependencies.

    The session is automatically rolled back if an exception
    occurs and is always closed afterward.
    """

    session = SessionLocal()

    try:
        yield session

    except Exception:
        session.rollback()
        raise

    finally:
        session.close()


# ============================================================
# DATABASE CONTEXT MANAGER
# ============================================================

@contextmanager
def get_db_context():
    """
    Context manager for database sessions.

    Automatically commits when successful.
    Automatically rolls back when an exception occurs.
    Always closes the session.
    """

    session = SessionLocal()

    try:
        yield session
        session.commit()

    except Exception:
        session.rollback()
        raise

    finally:
        session.close()


# ============================================================
# DATABASE HEALTH CHECK
# ============================================================

def check_db_health() -> bool:
    """
    Check whether the PostgreSQL database is reachable.

    SQLAlchemy 2.x requires raw SQL expressions to be wrapped
    with sqlalchemy.text().
    """

    try:
        with get_db_context() as session:
            session.execute(text("SELECT 1"))

        logger.info("✓ Database health check passed")
        return True

    except Exception as e:
        logger.error(
            f"Database health check failed: {str(e)}"
        )
        return False


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def init_db():
    """
    Initialize database tables.

    Intended for development only.
    """

    if settings.ENVIRONMENT == "development":
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("✓ Database tables created")

        except Exception as e:
            logger.error(
                f"Database initialization failed: {str(e)}"
            )
            raise