import asyncpg
from app.database import get_db_connection
from app.common.sql_loader import SQLLoader
from typing import List, Dict, Any

SQL_FILE = "app/sql/resume.xml"
NAMESPACE = "resume"

async def get_member_summary_list_from_db() -> List[Dict[str, Any]]:
    sql = SQLLoader.load_sql(SQL_FILE, NAMESPACE, "get_member_summary_list")
    async for conn in get_db_connection():
        return await conn.fetch(
            sql
        )

async def get_resume_detail_by_member_id_from_db(member_id: int) -> Dict[str, Any] | None:
    sql = SQLLoader.load_sql(SQL_FILE, NAMESPACE, "get_resume_detail_by_member_id")
    async for conn in get_db_connection():
        return await conn.fetchrow(
            sql, member_id
        )

async def create_member_and_resume_in_db(name: str, profile_image_url: str | None, short_introduction: str | None, tech_stacks: str | None, education: str | None, experience: str | None) -> int:
    insert_member_sql = SQLLoader.load_sql(SQL_FILE, NAMESPACE, "insert_member")
    insert_resume_sql = SQLLoader.load_sql(SQL_FILE, NAMESPACE, "insert_resume")
    async for conn in get_db_connection():
        member_id = await conn.fetchval(insert_member_sql, name, profile_image_url, short_introduction)
        await conn.execute(insert_resume_sql, member_id, tech_stacks, education, experience)
        return member_id
