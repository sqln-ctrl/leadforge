import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship

from app.core.db import Base


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CLOSED = "closed"


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    website = Column(String)
    industry = Column(String)
    location = Column(String)
    phone = Column(String)
    email = Column(String)
    source = Column(String)

    status = Column(
        Enum(LeadStatus),
        default=LeadStatus.NEW,
        nullable=False,
    )

    lead_score = Column(
        Integer,
        default=0,
        nullable=False,
    )

    qualification = Column(
        String,
        default="unqualified",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    # Notes belong to Business
    notes = relationship(
        "Note",
        back_populates="business",
        cascade="all, delete-orphan",
    )

    # A business can have one qualified lead
    qualified_lead = relationship(
        "QualifiedLead",
        back_populates="business",
        uselist=False,
        cascade="all, delete-orphan",
    )