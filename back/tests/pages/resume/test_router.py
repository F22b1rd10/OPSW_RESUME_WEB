"""
tests/pages/resume/test_router.py
라우터 통합 테스트 - service를 Mock으로 대체하여 HTTP 엔드포인트 동작 검증
"""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app
from app.common.exceptions import NotFoundException


# ── 테스트용 샘플 데이터 ──────────────────────────────────────────────
MOCK_MEMBER_LIST = [
    {
        "id": 1,
        "name": "김철수",
        "profile_image_url": "https://example.com/img1.jpg",
        "short_introduction": "백엔드 개발자",
    }
]

MOCK_RESUME_DETAIL = {
    "id": 1,
    "name": "김철수",
    "profile_image_url": "https://example.com/img1.jpg",
    "short_introduction": "백엔드 개발자",
    "tech_stacks": "Python, FastAPI",
    "education": "OO대학교",
    "experience": "2년",
}

CREATE_REQUEST_BODY = {
    "name": "신입사원",
    "profile_image_url": "https://example.com/new.jpg",
    "short_introduction": "열심히 하겠습니다.",
    "tech_stacks": "Python",
    "education": "OO대학교 재학",
    "experience": "없음",
}


# ── 테스트 클래스 ─────────────────────────────────────────────────────
class TestResumeRouter:

    @pytest.mark.asyncio
    async def test_get_all_resumes_200(self):
        """GET /api/v1/resumes → 200 OK + 목록 반환"""
        with patch(
            "app.pages.resume.router.resume_service.get_all_resumes",
            new=AsyncMock(return_value=MOCK_MEMBER_LIST),
        ):
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                response = await client.get("/api/v1/resumes")

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert isinstance(body["data"], list)
        assert len(body["data"]) == 1

    @pytest.mark.asyncio
    async def test_get_resume_by_id_200(self):
        """GET /api/v1/resumes/1 → 200 OK + 상세 데이터 반환"""
        with patch(
            "app.pages.resume.router.resume_service.get_resume_by_member_id",
            new=AsyncMock(return_value=MOCK_RESUME_DETAIL),
        ):
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                response = await client.get("/api/v1/resumes/1")

        assert response.status_code == 200
        body = response.json()
        assert body["data"]["name"] == "김철수"
        assert body["data"]["tech_stacks"] == "Python, FastAPI"

    @pytest.mark.asyncio
    async def test_get_resume_by_id_404(self):
        """GET /api/v1/resumes/9999 → 404 Not Found"""
        with patch(
            "app.pages.resume.router.resume_service.get_resume_by_member_id",
            new=AsyncMock(side_effect=NotFoundException("해당 인재를 찾을 수 없습니다.")),
        ):
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                response = await client.get("/api/v1/resumes/9999")

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_create_resume_201(self):
        """POST /api/v1/resumes → 201 Created"""
        with patch(
            "app.pages.resume.router.resume_service.create_resume",
            new=AsyncMock(return_value={**MOCK_RESUME_DETAIL, "id": 2}),
        ):
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                response = await client.post("/api/v1/resumes", json=CREATE_REQUEST_BODY)

        assert response.status_code in (200, 201)
        body = response.json()
        assert body["success"] is True

    @pytest.mark.asyncio
    async def test_create_resume_422_missing_field(self):
        """POST /api/v1/resumes → 422 Unprocessable Entity (필수 필드 누락)"""
        incomplete_body = {"name": "이름만있음"}  # 나머지 필드 없음

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post("/api/v1/resumes", json=incomplete_body)

        assert response.status_code == 422
