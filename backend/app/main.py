import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.exceptions import RedisError
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router
from app.core.db import SessionLocal
from app.core.redis import redis_client
from app.services.business_service import delete_expired_businesses


async def remove_expired_crm_records() -> None:
    """Delete businesses more than 24 hours old, once per hour."""
    while True:
        try:
            with SessionLocal() as db:
                deleted_count = delete_expired_businesses(db)
                if deleted_count:
                    print(f"Removed {deleted_count} expired CRM record(s)")
        except SQLAlchemyError as exc:
            print(f"Could not remove expired CRM records: {exc}")

        await asyncio.sleep(60 * 60)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await redis_client.ping()
        print("Connected to Redis")
    except RedisError as exc:
        print(f"Redis is unavailable; continuing without it: {exc}")

    cleanup_task = asyncio.create_task(remove_expired_crm_records())
    yield
    cleanup_task.cancel()
    with suppress(asyncio.CancelledError):
        await cleanup_task
    await redis_client.aclose()


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
