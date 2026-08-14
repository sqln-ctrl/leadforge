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

    id = Column(Integer, primary_key=True)

    business_id = Column(
        Integer,
        ForeignKey("businesses.id"),
        nullable=False,
        unique=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # Relationship with Business
    business = relationship(
        "Business",
        back_populates="qualified_lead",
    )

    # Relationship with AIAnalysis
    ai_analysis = relationship(
        "AIAnalysis",
        back_populates="qualified_lead",
        uselist=False,
        cascade="all, delete-orphan",
    )