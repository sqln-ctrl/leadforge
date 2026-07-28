from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from enum import Enum
from app.core.db import Base

class UserRole(str, Enum):
    ADMIN = "admin"
    AGENCY_OWNER = "agency_owner"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )