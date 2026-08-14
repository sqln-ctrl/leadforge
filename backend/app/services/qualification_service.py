from datetime import datetime

from sqlalchemy.orm import Session

from app.models.business import Business
from app.models.qualified_lead import QualifiedLead


def calculate_lead_score(business: Business) -> int:
    """
    Calculate the LeadForge qualification score.

    Score range: 0-100.
    """

    score = 0

    # ----------------------------------------
    # Website
    # ----------------------------------------

    if business.website:
        score += 25

    # ----------------------------------------
    # Phone
    # ----------------------------------------

    if business.phone:
        score += 15

    # ----------------------------------------
    # Email
    # ----------------------------------------

    if business.email:
        score += 15

    # ----------------------------------------
    # Industry
    # ----------------------------------------

    if business.industry:
        score += 15

    # ----------------------------------------
    # Location
    # ----------------------------------------

    if business.location:
        score += 10

    # ----------------------------------------
    # Business name
    # ----------------------------------------

    if business.name:
        score += 10

    # ----------------------------------------
    # Source
    # ----------------------------------------

    if business.source:
        score += 10

    return min(score, 100)


def qualify_business(
    business: Business,
    db: Session,
    qualification_threshold: int = 60,
) -> Business:
    """
    Qualify a business and create a QualifiedLead record
    if it passes the qualification threshold.

    Gemini is NOT called here.
    """

    # ----------------------------------------
    # 1. Calculate score
    # ----------------------------------------

    score = calculate_lead_score(business)

    business.lead_score = score

    # ----------------------------------------
    # 2. Determine qualification
    # ----------------------------------------

    if score >= qualification_threshold:

        business.qualification = "qualified"

        # ----------------------------------------
        # 3. Check if already qualified
        # ----------------------------------------

        existing_qualified_lead = (
            db.query(QualifiedLead)
            .filter(
                QualifiedLead.business_id
                == business.id
            )
            .first()
        )

        # ----------------------------------------
        # 4. Create QualifiedLead
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

        business.qualification = "unqualified"

    # ----------------------------------------
    # 5. Save Business changes
    # ----------------------------------------

    db.commit()

    db.refresh(business)

    return business