from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.qualified_lead import QualifiedLead
from app.models.business import Business, LeadStatus

router = APIRouter(
    prefix="/qualified-leads",
    tags=["Qualified Leads"],
)


@router.get("/")
def get_qualified_leads(
    db: Session = Depends(get_db),
):
    """
    Return ONLY leads stored in qualified_leads.
    """

    qualified_leads = (
        db.query(QualifiedLead)
        .order_by(
            QualifiedLead.qualified_at.desc()
        )
        .all()
    )

    return qualified_leads


@router.get("/{qualified_lead_id}")
def get_qualified_lead(
    qualified_lead_id: int,
    db: Session = Depends(get_db),
):
    """
    Return one QualifiedLead by its QualifiedLead ID.
    """

    qualified_lead = (
        db.query(QualifiedLead)
        .filter(
            QualifiedLead.id == qualified_lead_id
        )
        .first()
    )

    if not qualified_lead:
        raise HTTPException(
            status_code=404,
            detail="Qualified lead not found.",
        )

    return qualified_lead

@router.delete("/{qualified_lead_id}")
def remove_from_qualified(
    qualified_lead_id: int,
    db: Session = Depends(get_db),
):
    qualified_lead = (
        db.query(QualifiedLead)
        .filter(
            QualifiedLead.id == qualified_lead_id
        )
        .first()
    )

    if not qualified_lead:
        raise HTTPException(
            status_code=404,
            detail="Qualified lead not found.",
        )

    db.delete(qualified_lead)
    db.commit()

    return {
        "message": "Lead removed from qualified leads"
    }