from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.core.db import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True)

    name = Column(
        String,
        nullable=False
    )

    website = Column(String)

    industry = Column(String)

    location = Column(String)

    phone = Column(String)

    source = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )