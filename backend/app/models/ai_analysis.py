from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship

from app.core.db import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(
        Integer,
        primary_key=True,
    )

    qualified_lead_id = Column(
        Integer,
        ForeignKey(
            "qualified_leads.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    ai_score = Column(Integer)

    priority = Column(String)

    summary = Column(Text)

    opportunities = Column(
        JSON,
        default=list,
    )

    recommended_services = Column(
        JSON,
        default=list,
    )

    outreach_angle = Column(Text)

    model = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    qualified_lead = relationship(
        "QualifiedLead",
        back_populates="ai_analysis",
    )