print(">>> LOADED app/api/v1/router.py")
from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.business import router as business_router

from app.api.v1.endpoints.discovery import router as discovery_router
from app.api.v1.endpoints import ai
from app.api.v1.endpoints import qualified_leads
from app.api.v1.endpoints import proposals

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(business_router, tags=["business"])
api_router.include_router(discovery_router, tags=["discovery"])
api_router.include_router(ai.router, tags=["ai"])
api_router.include_router(qualified_leads.router, tags=["qualified-leads"])
api_router.include_router(proposals.router, tags=["proposals"])

print(">>> Registered qualified leads router")
