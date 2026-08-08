from sqlalchemy.orm import Session

from app.models.business import Business
from app.schemas.business import BusinessCreate


def create_business(db: Session, business: BusinessCreate) -> Business:
    db_business = Business(**business.model_dump())
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    return db_business


def get_businesses(db: Session) -> list[Business]:
    return db.query(Business).all()


def find_existing_business(db: Session, name: str, location: str | None) -> Business | None:
    """
    Simple dedup check so re-running the same discovery search doesn't
    create duplicate rows. Matches on name + location -- not perfect (two
    different businesses could share a name in different parts of a city),
    but good enough until Phase 4's audit step can dedup on website/domain
    too.
    """
    query = db.query(Business).filter(Business.name == name)
    if location:
        query = query.filter(Business.location == location)
    return query.first()