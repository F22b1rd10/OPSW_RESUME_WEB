"""
tests/pages/resume/test_service.py
서비스 단위 테스트 - repository를 Mock으로 대체하여 비즈니스 로직만 검증
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from app.pages.resume.service import ResumeService
from app.pages.resume.dto import CreateResumeRequest
from app.common.exceptions import NotFoundException


# ── 테스트용 샘플 데이터 ──────────────────────────────────────────────
SAMPLE_MEMBER_LIST = [
    {
        "id": 1,
        "name": "김철수",
        "profile_image_url": "https://example.com/img1.jpg",
        "short_introduction": "백엔드 개발자입니다.",
    },
    {
        "id": 2,
        "name": "이영희",
        "profile_image_url": "https://example.com/img2.jpg",
        "short_introduction": "프론트엔드 개발자입니다.",
    },
]

SAMPLE_RESUME_DETAIL = {
    "id": 1,
    "name": "김철수",
    "profile_image_url": "https://example.com/img1.jpg",
    "short_introduction": "백엔드 개발자입니다.",
    "tech_stacks": "Python, FastAPI, PostgreSQL",
    "education": "OO대학교 컴퓨터공학과 졸업",
    "experience": "OO회사 백엔드 개발자 2년",
}


# ── Fixture ───────────────────────────────────────────────────────────
@pytest.fixture
def mock_repository():
    """가짜 Repository 객체를 생성하는 fixture"""
    repo = MagicMock()
    repo.find_all = AsyncMock()
    repo.find_by_member_id = AsyncMock()
    repo.create = AsyncMock()
    return repo


@pytest.fixture
def service(mock_repository):
    """테스트용 ResumeService 인스턴스"""
    return ResumeService(repository=mock_repository)


# ── 테스트 클래스 ─────────────────────────────────────────────────────
class TestResumeService:

    @pytest.mark.asyncio
    async def test_get_all_resumes_returns_list(self, service, mock_repository):
        """전체 이력서 목록을 정상적으로 반환하는지 테스트"""
        mock_repository.find_all.return_value = SAMPLE_MEMBER_LIST

        result = await service.get_all_resumes()

        mock_repository.find_all.assert_called_once()
        assert len(result) == 2
        assert result[0]["name"] == "김철수"

    @pytest.mark.asyncio
    async def test_get_all_resumes_empty(self, service, mock_repository):
        """인재가 없을 때 빈 리스트를 반환하는지 테스트"""
        mock_repository.find_all.return_value = []

        result = await service.get_all_resumes()

        assert result == []

    @pytest.mark.asyncio
    async def test_get_resume_by_id_success(self, service, mock_repository):
        """특정 member_id로 이력서 상세를 정상 조회하는지 테스트"""
        mock_repository.find_by_member_id.return_value = SAMPLE_RESUME_DETAIL

        result = await service.get_resume_by_member_id(1)

        mock_repository.find_by_member_id.assert_called_once_with(1)
        assert result["name"] == "김철수"
        assert result["tech_stacks"] == "Python, FastAPI, PostgreSQL"

    @pytest.mark.asyncio
    async def test_get_resume_by_id_not_found(self, service, mock_repository):
        """존재하지 않는 member_id 조회 시 NotFoundException이 발생하는지 테스트"""
        mock_repository.find_by_member_id.return_value = None

        with pytest.raises(NotFoundException):
            await service.get_resume_by_member_id(999)

    @pytest.mark.asyncio
    async def test_create_resume_success(self, service, mock_repository):
        """새 이력서를 정상적으로 생성하는지 테스트"""
        mock_repository.create.return_value = {**SAMPLE_RESUME_DETAIL, "id": 3}

        request = CreateResumeRequest(
            name="박민준",
            profile_image_url="https://example.com/img3.jpg",
            short_introduction="풀스택 개발자입니다.",
            tech_stacks="React, FastAPI",
            education="OO대학교 졸업",
            experience="신입",
        )

        result = await service.create_resume(request)

        mock_repository.create.assert_called_once()
        assert result is not None

    @pytest.mark.asyncio
    async def test_create_resume_missing_name_raises(self, service, mock_repository):
        """이름이 없을 때 생성이 실패하는지 테스트 (DTO 검증)"""
        with pytest.raises((ValueError, Exception)):
            CreateResumeRequest(
                name="",  # 빈 이름
                profile_image_url="",
                short_introduction="",
                tech_stacks="",
                education="",
                experience="",
            )
