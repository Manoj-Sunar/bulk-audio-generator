# src/auth/model.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from src.utils.db import Base


class UserProvider(Base):
    __tablename__ = "user_providers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # local | google | github | apple | microsoft | facebook
    provider = Column(
        String(30),
        nullable=False,
        index=True,
    )

    # Google sub / Github id / Apple sub
    provider_id = Column(
        String(255),
        nullable=True,
    )

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

    # Relationship
    user = relationship(
        "User",
        back_populates="providers",
    )

    __table_args__ = (
        # A provider ID can exist only once
        UniqueConstraint(
            "provider",
            "provider_id",
            name="uq_provider_provider_id",
        ),

        # A user can link each provider only once
        UniqueConstraint(
            "user_id",
            "provider",
            name="uq_user_provider",
        ),
    )

    def __repr__(self):
        return (
            f"<UserProvider("
            f"user_id={self.user_id}, "
            f"provider='{self.provider}')>"
        )