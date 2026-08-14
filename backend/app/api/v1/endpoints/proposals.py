import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.db import get_db

from app.models.qualified_lead import QualifiedLead
from app.models.proposal import Proposal

from app.services.proposal_service import (
    generate_proposal,
)


router = APIRouter(
    prefix="/proposals",
    tags=["Proposals"],
)


# ==================================================
# AVAILABLE SERVICES
# ==================================================

AVAILABLE_SERVICES = [
    "Website Development",
    "Website Redesign",
    "SEO",
    "Social Media Management",
    "AI Automation",
]


# ==================================================
# GENERATE PROPOSAL
# ==================================================

@router.post(
    "/generate/{qualified_lead_id}"
)
def generate_lead_proposal(
    qualified_lead_id: int,
    db: Session = Depends(get_db),
):

    # ----------------------------------------------
    # 1. Find ONLY qualified lead
    # ----------------------------------------------

    qualified_lead = (
        db.query(QualifiedLead)
        .filter(
            QualifiedLead.id
            == qualified_lead_id
        )
        .first()
    )

    if not qualified_lead:

        raise HTTPException(
            status_code=404,
            detail=(
                "Qualified lead not found."
            ),
        )

    # ----------------------------------------------
    # 2. Check existing proposal
    # ----------------------------------------------

    existing_proposal = (
        db.query(Proposal)
        .filter(
            Proposal.qualified_lead_id
            == qualified_lead.id
        )
        .first()
    )

    if existing_proposal:

        return {
            "qualified_lead_id":
                qualified_lead.id,

            "cached": True,

            "proposal": {
                "id":
                    existing_proposal.id,

                "subject":
                    existing_proposal.subject,

                "greeting":
                    existing_proposal.greeting,

                "introduction":
                    existing_proposal.introduction,

                "identified_problem":
                    existing_proposal.identified_problem,

                "proposed_solution":
                    existing_proposal.proposed_solution,

                "services":
                    json.loads(
                        existing_proposal.services
                    )
                    if existing_proposal.services
                    else [],

                "benefits":
                    json.loads(
                        existing_proposal.benefits
                    )
                    if existing_proposal.benefits
                    else [],

                "call_to_action":
                    existing_proposal.call_to_action,

                "closing":
                    existing_proposal.closing,

                "full_proposal":
                    existing_proposal.full_proposal,

                "model":
                    existing_proposal.model,

                "created_at":
                    existing_proposal.created_at,
            },
        }

    # ----------------------------------------------
    # 3. Prepare lead data
    # ----------------------------------------------

    lead_data = {
        "id": qualified_lead.id,

        "business_id":
            qualified_lead.business_id,

        "name":
            qualified_lead.name,

        "website":
            qualified_lead.website,

        "industry":
            qualified_lead.industry,

        "location":
            qualified_lead.location,

        "phone":
            qualified_lead.phone,

        "email":
            qualified_lead.email,

        "source":
            qualified_lead.source,

        "lead_score":
            qualified_lead.lead_score,

        "qualified_at":
            (
                qualified_lead.qualified_at.isoformat()
                if qualified_lead.qualified_at
                else None
            ),
    }

    # ----------------------------------------------
    # 4. Generate with Gemini
    # ----------------------------------------------

    try:

        result = generate_proposal(
            lead_data=lead_data,
            services=AVAILABLE_SERVICES,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Proposal generation failed: "
                f"{str(exc)}"
            ),
        )

    # ----------------------------------------------
    # 5. Save proposal
    # ----------------------------------------------

    proposal = Proposal(

        qualified_lead_id=
            qualified_lead.id,

        subject=
            result["subject"],

        greeting=
            result["greeting"],

        introduction=
            result["introduction"],

        identified_problem=
            result["identified_problem"],

        proposed_solution=
            result["proposed_solution"],

        services=json.dumps(
            result.get(
                "services",
                [],
            )
        ),

        benefits=json.dumps(
            result.get(
                "benefits",
                [],
            )
        ),

        call_to_action=
            result["call_to_action"],

        closing=
            result["closing"],

        full_proposal=
            result["full_proposal"],

        model=
            "gemini-3.5-flash",
    )

    db.add(proposal)

    db.commit()

    db.refresh(proposal)

    # ----------------------------------------------
    # 6. Return proposal
    # ----------------------------------------------

    return {

        "qualified_lead_id":
            qualified_lead.id,

        "cached": False,

        "proposal": {

            "id":
                proposal.id,

            "subject":
                proposal.subject,

            "greeting":
                proposal.greeting,

            "introduction":
                proposal.introduction,

            "identified_problem":
                proposal.identified_problem,

            "proposed_solution":
                proposal.proposed_solution,

            "services":
                result.get(
                    "services",
                    [],
                ),

            "benefits":
                result.get(
                    "benefits",
                    [],
                ),

            "call_to_action":
                proposal.call_to_action,

            "closing":
                proposal.closing,

            "full_proposal":
                proposal.full_proposal,

            "model":
                proposal.model,

            "created_at":
                proposal.created_at,
        },
    }