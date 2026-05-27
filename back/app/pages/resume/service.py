from typing import List
from app.pages.resume import repository
from app.pages.resume.dto import MemberSummaryResponse, ResumeDetailResponse, CreateResumeRequest
from app.common.exceptions import NotFoundException

async def get_member_summary_list() -> List[MemberSummaryResponse]:
    members_data = await repository.get_member_summary_list_from_db()
    return [MemberSummaryResponse(**member) for member in members_data]

async def get_resume_detail_by_member_id(member_id: int) -> ResumeDetailResponse:
    resume_data = await repository.get_resume_detail_by_member_id_from_db(member_id)
    if not resume_data:
        raise NotFoundException(detail=f"Resume with member_id {member_id} not found")
    return ResumeDetailResponse(**resume_data)

async def create_resume(req: CreateResumeRequest) -> int:
    return await repository.create_member_and_resume_in_db(
        req.name, req.profile_image_url, req.short_introduction,
        req.tech_stacks, req.education, req.experience
    )
