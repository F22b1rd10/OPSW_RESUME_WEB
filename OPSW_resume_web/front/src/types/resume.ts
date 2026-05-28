export interface Member {
  id: number;
  name: string;
  profile_image_url: string;
  short_introduction: string;
}

export interface ResumeDetail {
  name: string;
  profile_image_url: string;
  short_introduction: string;
  tech_stacks: string | null;
  education: string | null;
  experience: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
