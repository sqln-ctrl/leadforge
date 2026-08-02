print(">>> LOADED app/api/v1/router.py")
from fastapi import APIRouter
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.business import router as business_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(business_router, prefix="/business")

print(">>> Registered auth router with prefix /auth")
