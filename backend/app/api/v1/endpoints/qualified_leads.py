from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.qualified_lead import QualifiedLead


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