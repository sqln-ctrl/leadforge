from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.business import BusinessCreate, BusinessResponse
from app.services import business_service
from app.services.geoapify import search_places, GeoapifyError


router = APIRouter(prefix="/discovery")


class DiscoveryRequest(BaseModel):
    city: str
    category: str
    country: str | None = None
    limit: int = Field(default=10, ge=1, le=20)


class DiscoveryResult(BaseModel):
    created: list[BusinessResponse]
    skipped_existing: int


@router.post(
    "/search",
    response_model=DiscoveryResult,
)
def run_discovery(
    payload: DiscoveryRequest,
    db: Session = Depends(get_db),
) -> DiscoveryResult:

    try:
        found = search_places(
            city=payload.city,
            category=payload.category,
            country=payload.country,
            limit=payload.limit,
        )

    except GeoapifyError as exc:
        print("GEOAPIFY ERROR:", exc)

        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    created = []
    skipped = 0

    for raw in found:

        if not raw.get("name"):
            continue

        existing = business_service.find_existing_business(
            db,
            raw["name"],
            raw.get("location"),
        )

        if existing:
            skipped += 1
            continue

        business = business_service.create_business(
            db,
            BusinessCreate(
                name=raw["name"],
                website=raw.get("website"),
                industry=raw.get("industry"),
                location=raw.get("location"),
                phone=raw.get("phone"),
                source=raw.get("source"),
            ),
        )

        created.append(business)

    return DiscoveryResult(
        created=created,
        skipped_existing=skipped,
    )