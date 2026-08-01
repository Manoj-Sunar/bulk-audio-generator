# src/user/model.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    func,
)

from sqlalchemy.orm import relationship

from src.utils.db import Base


class User(Base):
    __tablename__ = "users"

    # Primary Key
    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # User Information
    name = Column(
        String(150),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    avatar = Column(
        String(500),
        nullable=True,
    )

    # Local password (nullable for OAuth-only users)
    password = Column(
        String(255),
        nullable=True,
    )

    # Account Status
    email_verified = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Relationship
    providers = relationship(
        "UserProvider",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Timestamp
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self):
        return (
            f"<User("
            f"id={self.id}, "
            f"email='{self.email}'"
            f")>"
        )