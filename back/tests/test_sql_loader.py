"""
tests/test_sql_loader.py
SQL 로더 단위 테스트 - XML에서 SQL 쿼리를 올바르게 파싱하는지 검증
"""

import pytest
from unittest.mock import patch, mock_open
from app.common.sql_loader import SqlLoader


# 테스트용 가짜 XML 내용
SAMPLE_XML = """<?xml version="1.0" encoding="UTF-8"?>
<sqls>
    <sql id="selectAllResumes">
        SELECT m.id, m.name, m.profile_image_url, m.short_introduction
        FROM members m
        ORDER BY m.created_at DESC
    </sql>
    <sql id="selectResumeByMemberId">
        SELECT m.id, m.name, r.tech_stacks, r.education, r.experience
        FROM members m
        LEFT JOIN resumes r ON m.id = r.member_id
        WHERE m.id = $1
    </sql>
    <sql id="insertMember">
        INSERT INTO members (name, profile_image_url, short_introduction)
        VALUES ($1, $2, $3)
        RETURNING id
    </sql>
</sqls>
"""


class TestSqlLoader:
    """SqlLoader 클래스 단위 테스트"""

    def test_load_existing_query(self):
        """존재하는 SQL ID로 쿼리를 정상 로드하는지 테스트"""
        with patch("builtins.open", mock_open(read_data=SAMPLE_XML)):
            loader = SqlLoader("app/sql/resume.xml")
            query = loader.get("selectAllResumes")

        assert query is not None
        assert "SELECT" in query
        assert "members" in query

    def test_load_query_with_parameter(self):
        """파라미터($1)가 포함된 쿼리를 올바르게 로드하는지 테스트"""
        with patch("builtins.open", mock_open(read_data=SAMPLE_XML)):
            loader = SqlLoader("app/sql/resume.xml")
            query = loader.get("selectResumeByMemberId")

        assert "$1" in query
        assert "WHERE m.id = $1" in query

    def test_load_insert_query(self):
        """INSERT 쿼리를 정상적으로 로드하는지 테스트"""
        with patch("builtins.open", mock_open(read_data=SAMPLE_XML)):
            loader = SqlLoader("app/sql/resume.xml")
            query = loader.get("insertMember")

        assert "INSERT INTO" in query
        assert "RETURNING id" in query

    def test_missing_query_raises_error(self):
        """존재하지 않는 SQL ID 조회 시 예외가 발생하는지 테스트"""
        with patch("builtins.open", mock_open(read_data=SAMPLE_XML)):
            loader = SqlLoader("app/sql/resume.xml")

        with pytest.raises((KeyError, ValueError)):
            loader.get("nonExistentQuery")

    def test_query_whitespace_stripped(self):
        """쿼리의 앞뒤 공백이 제거되어 반환되는지 테스트"""
        with patch("builtins.open", mock_open(read_data=SAMPLE_XML)):
            loader = SqlLoader("app/sql/resume.xml")
            query = loader.get("selectAllResumes")

        assert not query.startswith(" ")
        assert not query.startswith("\n")
