import asyncpg
from app.common.config import settings

async def get_db_connection():
    conn = None
    try:
        conn = await asyncpg.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME
        )
        yield conn
    finally:
        if conn:
            await conn.close()
