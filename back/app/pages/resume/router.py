from fastapi import APIRouter, Depends
from typing import List
from app.pages.resume import service
from app.pages.resume.dto import MemberSummaryResponse, ResumeDetailResponse, CreateResumeRequest
from app.common.response import ApiResponse

router = APIRouter()

@router.get("/resumes", response_model=ApiResponse[List[MemberSummaryResponse]])
async def get_member_summaries():
    members = await service.get_member_summary_list()
    return ApiResponse(data=members)

@router.get("/resumes/{member_id}", response_model=ApiResponse[ResumeDetailResponse])
async def get_resume_detail(member_id: int):
    resume = await service.get_resume_detail_by_member_id(member_id)
    return ApiResponse(data=resume)

@router.post("/resumes")
async def create_resume(req: CreateResumeRequest):
    member_id = await service.create_resume(req)
    return ApiResponse(data={"id": member_id})
