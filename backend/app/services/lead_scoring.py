def calculate_lead_score(business) -> int:
    score = 0

    # -----------------------------------------
    # Website
    # -----------------------------------------
    # No website is GOOD for LeadForge because
    # these businesses are potential web clients.
    if not business.website:
        score += 60

    # -----------------------------------------
    # Contact information
    # -----------------------------------------
    # Phone and email are both valuable.
    if business.phone:
        score += 20

    if business.email:
        score += 20

    # -----------------------------------------
    # Additional information
    # -----------------------------------------
    if business.industry:
        score += 5

    if business.location:
        score += 5

    if business.source:
        score += 5

    return min(score, 100)


def get_qualification(business) -> str:
    """
    A business is qualified only when:

    1. It does NOT have a website
    2. It has at least one contact method:
       - phone OR
       - email
    """

    has_no_website = not business.website
    has_contact = bool(
        business.phone or business.email
    )

    # -----------------------------------------
    # Hot lead
    # -----------------------------------------
    if has_no_website and business.phone and business.email:
        return "hot"

    # -----------------------------------------
    # Qualified lead
    # -----------------------------------------
    if has_no_website and has_contact:
        return "qualified"

    # -----------------------------------------
    # Potential
    # -----------------------------------------
    if has_no_website:
        return "potential"

    # -----------------------------------------
    # Not qualified
    # -----------------------------------------
    return "unqualified"


def qualify_lead(business):
    score = calculate_lead_score(business)

    business.lead_score = score
    business.qualification = get_qualification(business)

    return business