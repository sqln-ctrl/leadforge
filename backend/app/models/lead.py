from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.core.db import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(
        Integer,
        primary_key=True
    )

    business_id = Column(
        Integer,
        ForeignKey("businesses.id")
    )

    email = Column(String)

    status = Column(
        String,
        default="new"
    )

    score = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )