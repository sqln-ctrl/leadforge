from pydantic import BaseModel, ConfigDict


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