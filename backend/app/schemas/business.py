from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.business import LeadStatus

class BusinessCreate(BaseModel):
    name: str
    website: str | None = None
    industry: str | None = None
    location: str | None = None
    phone: str | None = None
    email: str | None = None
    source: str | None = None


class BusinessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    website: str | None = None
    industry: str | None = None
    location: str | None = None
    phone: str | None = None
    email: str | None = None
    source: str | None = None


# add `status: LeadStatus` field to BusinessResponse

class BusinessStatusUpdate(BaseModel):
    status: LeadStatus

class NoteCreate(BaseModel):
    text: str

class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    text: str
    created_at: datetime

class BusinessDetailResponse(BusinessResponse):
    notes: list[NoteResponse] = []