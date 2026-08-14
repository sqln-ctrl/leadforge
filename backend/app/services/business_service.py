from sqlalchemy.orm import Session, joinedload

from app.models.business import Business, LeadStatus
from app.models.note import Note
from app.schemas.business import BusinessCreate
from app.services.qualification_service import qualify_business


def get_business(
    db: Session,
    business_id: int
) -> Business | None:
    return (
        db.query(Business)
        .options(joinedload(Business.notes))
        .filter(Business.id == business_id)
        .first()
    )


def update_business_status(
    db: Session,
    business_id: int,
    status: LeadStatus
) -> Business | None:

    business = (
        db.query(Business)
        .filter(Business.id == business_id)
        .first()
    )

    if business is None:
        return None

    business.status = status

    db.commit()
    db.refresh(business)

    return business


def add_note(
    db: Session,
    business_id: int,
    text: str
) -> Note | None:

    business = (
        db.query(Business)
        .filter(Business.id == business_id)
        .first()
    )

    if business is None:
        return None

    note = Note(
        business_id=business_id,
        text=text
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


def create_business(
    db: Session,
    business: BusinessCreate
) -> Business:

    # Convert Pydantic schema → SQLAlchemy model
    db_business = Business(
        **business.model_dump()
    )

    # Add to session first
    db.add(db_business)

    # Get database-generated ID before qualification
    db.flush()

    # Qualify the SQLAlchemy Business object
    qualify_business(
        db_business,
        db,
        qualification_threshold=60
    )

    # Save everything
    db.commit()

    # Refresh from database
    db.refresh(db_business)

    return db_business


def get_businesses(db: Session) -> list[Business]:
    return db.query(Business).all()


def find_existing_business(
    db: Session,
    name: str,
    location: str | None
) -> Business | None:

    query = (
        db.query(Business)
        .filter(Business.name == name)
    )

    if location:
        query = query.filter(
            Business.location == location
        )

    return query.first()


def delete_business(
    db: Session,
    business_id: int
) -> bool:

    business = (
        db.query(Business)
        .filter(Business.id == business_id)
        .first()
    )

    if business is None:
        return False

    db.delete(business)
    db.commit()

    return True