from datetime import datetime

from sqlalchemy.orm import Session

from app.models.business import Business
from app.models.qualified_lead import QualifiedLead


QUALIFICATION_THRESHOLD = 60


def calculate_lead_score(business: Business) -> int:
    """
    Calculate LeadForge qualification score.

    Score range: 0-100.
    """

    score = 0

    if business.website:
        score += 25

    if business.phone:
        score += 15

    if business.email:
        score += 15

    if business.industry:
        score += 15

    if business.location:
        score += 10

    if business.name:
        score += 10

    if business.source:
        score += 10

    return min(score, 100)


def qualify_business(
    business: Business,
    db: Session,
    qualification_threshold: int = QUALIFICATION_THRESHOLD,
) -> Business:
    """
    Calculate the business score.

    If qualified:
        Business.qualification = "qualified"
        Create a QualifiedLead record.

    Gemini is NOT called here.
    """

    # ----------------------------------------
    # 1. Calculate score
    # ----------------------------------------

    score = calculate_lead_score(business)

    business.lead_score = score

    # ----------------------------------------
    # 2. Qualified
    # ----------------------------------------

    if score >= qualification_threshold:

        business.qualification = "qualified"

        # ----------------------------------------
        # Check existing QualifiedLead
        # ----------------------------------------

        existing_qualified_lead = (
            db.query(QualifiedLead)
            .filter(
                QualifiedLead.business_id == business.id
            )
            .first()
        )

        # ----------------------------------------
        # Create QualifiedLead
        # ----------------------------------------

        if not existing_qualified_lead:

            qualified_lead = QualifiedLead(
                business_id=business.id,
                name=business.name,
                website=business.website,
                industry=business.industry,
                location=business.location,
                phone=business.phone,
                email=business.email,
                source=business.source,
                lead_score=business.lead_score,
                qualified_at=datetime.utcnow(),
            )

            db.add(qualified_lead)

        else:
            # Keep the QualifiedLead data synchronized
            existing_qualified_lead.name = business.name
            existing_qualified_lead.website = business.website
            existing_qualified_lead.industry = business.industry
            existing_qualified_lead.location = business.location
            existing_qualified_lead.phone = business.phone
            existing_qualified_lead.email = business.email
            existing_qualified_lead.source = business.source
            existing_qualified_lead.lead_score = business.lead_score

    # ----------------------------------------
    # 3. Not qualified
    # ----------------------------------------

    else:

        business.qualification = "unqualified"

    # ----------------------------------------
    # 4. Save
    # ----------------------------------------

    db.commit()
    db.refresh(business)

    return business