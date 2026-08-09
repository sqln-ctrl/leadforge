from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.core.db import Base

import enum
from sqlalchemy import Enum  # add to your existing import line

class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CLOSED = "closed"

# inside Business, add:
status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False)

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

    email = Column(String)

    source = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )