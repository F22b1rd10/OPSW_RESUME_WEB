from pydantic import BaseModel
from typing import List, Optional

class CreateResumeRequest(BaseModel):
    name: str
    profile_image_url: Optional[str] = None
    short_introduction: Optional[str] = None
    tech_stacks: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None

class MemberSummaryResponse(BaseModel):
    id: int
    name: str
    profile_image_url: Optional[str] = None
    short_introduction: Optional[str] = None

class ResumeDetailResponse(BaseModel):
    name: str
    profile_image_url: str
    short_introduction: str
    tech_stacks: Optional[str] # TEXT 또는 JSONB
    education: Optional[str]
    experience: Optional[str]
