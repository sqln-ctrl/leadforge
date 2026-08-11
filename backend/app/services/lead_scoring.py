def calculate_lead_score(business) -> int:
    score = 0

    # Has website
    if business.website:
        score += 25

    # Has phone
    if business.phone:
        score += 20

    # Has email
    if business.email:
        score += 25

    # Has industry
    if business.industry:
        score += 10

    # Has location
    if business.location:
        score += 10

    # Known source
    if business.source:
        score += 10

    return min(score, 100)


def get_qualification(score: int) -> str:
    if score >= 80:
        return "high_priority"

    if score >= 60:
        return "qualified"

    if score >= 40:
        return "potential"

    return "unqualified"


def qualify_business(business):
    score = calculate_lead_score(business)

    business.lead_score = score
    business.qualification = get_qualification(score)

    return business