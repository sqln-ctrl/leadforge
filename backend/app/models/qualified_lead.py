from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.core.db import Base


class QualifiedLead(Base):
    __tablename__ = "qualified_leads"

    id = Column(
        Integer,
        primary_key=True,
    )

    business_id = Column(
        Integer,
        ForeignKey(
            "businesses.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    website = Column(String)
    industry = Column(String)
    location = Column(String)
    phone = Column(String)
    email = Column(String)
    source = Column(String)

    lead_score = Column(Integer)

    qualified_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    business = relationship(
        "Business",
        back_populates="qualified_lead",
    )

    ai_analysis = relationship(
        "AIAnalysis",
        back_populates="qualified_lead",
        uselist=False,
        cascade="all, delete-orphan",
    )