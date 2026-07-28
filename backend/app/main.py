from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.redis import redis_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_client.ping()
    print("✅ Connected to Upstash Redis")

    yield

    await redis_client.aclose()

app = FastAPI(lifespan=lifespan)

app.include_router(api_router)