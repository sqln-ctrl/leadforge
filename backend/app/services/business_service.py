from sqlalchemy.orm import Session

from app.models.business import Business
from app.schemas.business import BusinessCreate


def create_business(
    db: Session,
    business_data: BusinessCreate
):

    business = Business(
        **business_data.model_dump()
    )

    db.add(business)
    db.commit()
    db.refresh(business)

    return business


def get_businesses(db: Session):

    return db.query(Business).all()

