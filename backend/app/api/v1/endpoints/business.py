from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.business import (
    BusinessCreate,
    BusinessResponse,
    BusinessDetailResponse,
    BusinessStatusUpdate,
    NoteCreate,
    NoteResponse,
)
from app.services.business_service import (
    create_business,
    get_businesses,
    get_business,
    update_business_status,
    add_note,
)


router = APIRouter(
    prefix="/businesses",
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


@router.get("/{business_id}", response_model=BusinessDetailResponse)
def get_one(business_id: int, db: Session = Depends(get_db)):
    business = get_business(db, business_id)
    if business is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Business not found")
    return business


@router.patch("/{business_id}", response_model=BusinessResponse)
def update_status(business_id: int, payload: BusinessStatusUpdate, db: Session = Depends(get_db)):
    business = update_business_status(db, business_id, payload.status)
    if business is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Business not found")
    return business


@router.post("/{business_id}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(business_id: int, payload: NoteCreate, db: Session = Depends(get_db)):
    note = add_note(db, business_id, payload.text)
    if note is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Business not found")
    return note