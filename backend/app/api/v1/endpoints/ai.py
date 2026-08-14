from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.qualified_lead import QualifiedLead
from app.models.ai_analysis import AIAnalysis
from app.services.gemini_service import analyze_lead


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/analyze/{qualified_lead_id}")
def analyze_qualified_lead(
    qualified_lead_id: int,
    db: Session = Depends(get_db),
):

    # ----------------------------------------
    # 1. Find qualified lead
    # ----------------------------------------

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
            detail=(
                f"Qualified lead with ID "
                f"{qualified_lead_id} not found"
            ),
        )

    # ----------------------------------------
    # 2. Check for existing AI analysis
    # ----------------------------------------

    existing_analysis = (
        db.query(AIAnalysis)
        .filter(
            AIAnalysis.qualified_lead_id
            == qualified_lead.id
        )
        .first()
    )

    if existing_analysis:

        return {
            "qualified_lead_id": qualified_lead.id,
            "cached": True,
            "ai_analysis": {
                "id": existing_analysis.id,
                "score": existing_analysis.ai_score,
                "priority": existing_analysis.priority,
                "summary": existing_analysis.summary,
                "opportunities": (
                    existing_analysis.opportunities
                    or []
                ),
                "recommended_services": (
                    existing_analysis.recommended_services
                    or []
                ),
                "outreach_angle": (
                    existing_analysis.outreach_angle
                ),
                "model": existing_analysis.model,
            },
        }

    # ----------------------------------------
    # 3. Prepare qualified lead data
    # ----------------------------------------

    lead_data = {
        "id": qualified_lead.id,
        "business_id": qualified_lead.business_id,
        "name": qualified_lead.name,
        "website": qualified_lead.website,
        "industry": qualified_lead.industry,
        "location": qualified_lead.location,
        "phone": qualified_lead.phone,
        "email": qualified_lead.email,
        "source": qualified_lead.source,
        "lead_score": qualified_lead.lead_score,
        "qualified_at": (
            qualified_lead.qualified_at.isoformat()
            if qualified_lead.qualified_at
            else None
        ),
    }

    # ----------------------------------------
    # 4. Analyze with Gemini
    # ----------------------------------------

    try:

        analysis = analyze_lead(
            lead_data
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Gemini analysis failed: {str(e)}"
            ),
        )

    # ----------------------------------------
    # 5. Save AI analysis
    # ----------------------------------------

    ai_analysis = AIAnalysis(
        qualified_lead_id=qualified_lead.id,

        ai_score=analysis.get("score"),

        priority=analysis.get("priority"),

        summary=analysis.get("summary"),

        opportunities=analysis.get(
            "opportunities",
            []
        ),

        recommended_services=analysis.get(
            "recommended_services",
            []
        ),

        outreach_angle=analysis.get(
            "outreach_angle"
        ),

        model=MODEL_NAME,
    )

    db.add(ai_analysis)
    db.commit()
    db.refresh(ai_analysis)

    # ----------------------------------------
    # 6. Return result
    # ----------------------------------------

    return {
        "qualified_lead_id": qualified_lead.id,

        "cached": False,

        "ai_analysis": {
            "id": ai_analysis.id,
            "score": ai_analysis.ai_score,
            "priority": ai_analysis.priority,
            "summary": ai_analysis.summary,
            "opportunities": (
                ai_analysis.opportunities
                or []
            ),
            "recommended_services": (
                ai_analysis.recommended_services
                or []
            ),
            "outreach_angle": (
                ai_analysis.outreach_angle
            ),
            "model": ai_analysis.model,
        },
    }