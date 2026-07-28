import asyncio

from app.core.redis import redis_client

async def main():
    await redis_client.set("project", "LeadForge")
    value = await redis_client.get("project")
    print(value)

    await redis_client.aclose()

asyncio.run(main())