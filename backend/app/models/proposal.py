from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.core.db import Base


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    qualified_lead_id = Column(
        Integer,
        ForeignKey(
            "qualified_leads.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    subject = Column(
        String,
        nullable=False,
    )

    greeting = Column(
        String,
        nullable=False,
    )

    introduction = Column(
        Text,
        nullable=False,
    )

    identified_problem = Column(
        Text,
        nullable=True,
    )

    proposed_solution = Column(
        Text,
        nullable=False,
    )

    services = Column(
        Text,
        nullable=True,
    )

    benefits = Column(
        Text,
        nullable=True,
    )

    call_to_action = Column(
        Text,
        nullable=False,
    )

    closing = Column(
        Text,
        nullable=False,
    )

    full_proposal = Column(
        Text,
        nullable=False,
    )

    model = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    qualified_lead = relationship(
        "QualifiedLead",
        back_populates="proposal",
    )