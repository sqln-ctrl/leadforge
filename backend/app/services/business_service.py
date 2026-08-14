from sqlalchemy.orm import Session

from app.models.business import Business
from app.schemas.business import BusinessCreate
from sqlalchemy.orm import Session, joinedload
from app.models.business import Business, LeadStatus
from app.models.note import Note
from app.schemas.business import BusinessCreate
from app.services.lead_scoring import qualify_lead
from app.services.qualification_service import qualify_business

# ...keep create_business, get_businesses, find_existing_business as-is, add:

def get_business(db: Session, business_id: int) -> Business | None:
    return db.query(Business).options(joinedload(Business.notes)).filter(Business.id == business_id).first()

def update_business_status(db: Session, business_id: int, status: LeadStatus) -> Business | None:
    business = db.query(Business).filter(Business.id == business_id).first()
    if business is None:
        return None
    business.status = status
    db.commit()
    db.refresh(business)
    return business

def add_note(db: Session, business_id: int, text: str) -> Note | None:
    business = db.query(Business).filter(Business.id == business_id).first()
    if business is None:
        return None
    note = Note(business_id=business_id, text=text)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def create_business(db: Session, business: BusinessCreate) -> Business:
    db_business = Business(**business.model_dump())

    qualify_lead(db_business)
    
    qualify_business(
    business,
    db,
    qualification_threshold=60
    )

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


def delete_business(db: Session, business_id: int) -> bool:
    business = db.query(Business).filter(Business.id == business_id).first()

    if business is None:
        return False

    db.delete(business)
    db.commit()

    return True