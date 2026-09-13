import uuid
from enum import Enum as PyEnum

from sqlalchemy import Boolean, Column, DateTime, String, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID

from app.core.db import Base


class UserRole(str, PyEnum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(
    Integer,
    primary_key=True,
    autoincrement=True
)

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    email_verified = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    email_verification_token_hash = Column(
        String,
        nullable=True,
    )

    email_verification_expires_at = Column(
        DateTime,
        nullable=True,
    )
