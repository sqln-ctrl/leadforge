from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.business import Business
from app.services.gemini_service import analyze_lead


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/analyze/{lead_id}")
def analyze_business_lead(
    lead_id: int,
    db: Session = Depends(get_db),
):
    # Find the business
    business = (
        db.query(Business)
        .filter(Business.id == lead_id)
        .first()
    )

    if not business:
        raise HTTPException(
            status_code=404,
            detail=f"Lead with ID {lead_id} not found",
        )

    # Data that actually exists in your Business model
    business_data = {
        "id": business.id,
        "name": business.name,
        "website": business.website,
        "industry": business.industry,
        "location": business.location,
        "phone": business.phone,
        "email": business.email,
        "source": business.source,
        "status": business.status.value if business.status else None,
        "current_lead_score": business.lead_score,
        "qualification": business.qualification,
        "created_at": (
            business.created_at.isoformat()
            if business.created_at
            else None
        ),
    }

    try:
        # Send business data to Gemini
        analysis = analyze_lead(business_data)

        # Update LeadForge's existing lead score
        if "score" in analysis:
            business.lead_score = analysis["score"]

        # Update qualification based on Gemini priority
        if "priority" in analysis:
            business.qualification = analysis["priority"]

        db.commit()
        db.refresh(business)

        return {
            "lead_id": business.id,
            "analysis": analysis,
            "updated": {
                "lead_score": business.lead_score,
                "qualification": business.qualification,
            },
        }

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Gemini analysis failed: {str(e)}",
        )