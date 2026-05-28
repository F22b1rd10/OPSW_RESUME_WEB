import axios from 'axios';
import { ApiResponse, Member, ResumeDetail } from '../types/resume';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const getMemberSummaries = async (): Promise<ApiResponse<Member[]>> => {
  const response = await axios.get(`${API_BASE_URL}/resumes`);
  return response.data;
};

export const getResumeDetail = async (memberId: number): Promise<ApiResponse<ResumeDetail>> => {
  const response = await axios.get(`${API_BASE_URL}/resumes/${memberId}`);
  return response.data;
};

export const createResume = async (data: {
  name: string;
  profile_image_url?: string;
  short_introduction?: string;
  tech_stacks?: string;
  education?: string;
  experience?: string;
}): Promise<ApiResponse<{ id: number }>> => {
  const response = await axios.post(`${API_BASE_URL}/resumes`, data);
  return response.data;
};
