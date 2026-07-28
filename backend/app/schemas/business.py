from pydantic import BaseModel


class BusinessCreate(BaseModel):
    name: str
    website: str | None = None
    industry: str | None = None
    location: str | None = None
    phone: str | None = None
    source: str | None = None


class BusinessResponse(BusinessCreate):
    id: int

    class Config:
        from_attributes = True