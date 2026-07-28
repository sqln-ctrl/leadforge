from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.business import BusinessCreate, BusinessResponse
from app.services.business_service import (
    create_business,
    get_businesses
)


router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"]
)


@router.post("/", response_model=BusinessResponse)
def create(
    business: BusinessCreate,
    db: Session = Depends(get_db)
):
    return create_business(db, business)


@router.get("/", response_model=list[BusinessResponse])
def get_all(
    db: Session = Depends(get_db)
):
    return get_businesses(db)