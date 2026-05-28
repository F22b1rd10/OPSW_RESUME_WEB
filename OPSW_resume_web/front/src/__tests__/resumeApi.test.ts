// src/__tests__/resumeApi.test.ts
// API 호출 함수 단위 테스트 - axios를 Mock 처리하여 네트워크 없이 검증

import axios from "axios";
import {
  getAllResumes,
  getResumeByMemberId,
  createResume,
} from "../api/resumeApi";
import { CreateResumeRequest } from "../types/resume";

// axios 전체를 Mock으로 교체
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ── 테스트용 샘플 데이터 ─────────────────────────────────────────────
const mockMemberList = [
  {
    id: 1,
    name: "김철수",
    profileImageUrl: "https://example.com/img1.jpg",
    shortIntroduction: "백엔드 개발자입니다.",
  },
  {
    id: 2,
    name: "이영희",
    profileImageUrl: "https://example.com/img2.jpg",
    shortIntroduction: "프론트엔드 개발자입니다.",
  },
];

const mockResumeDetail = {
  id: 1,
  name: "김철수",
  profileImageUrl: "https://example.com/img1.jpg",
  shortIntroduction: "백엔드 개발자입니다.",
  techStacks: "Python, FastAPI, PostgreSQL",
  education: "OO대학교 컴퓨터공학과 졸업",
  experience: "OO회사 백엔드 개발자 2년",
};

// ── 각 테스트 후 mock 초기화 ─────────────────────────────────────────
afterEach(() => {
  jest.clearAllMocks();
});

// ── getAllResumes ─────────────────────────────────────────────────────
describe("getAllResumes", () => {
  it("전체 인재 목록을 정상적으로 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, message: "Success", data: mockMemberList },
    });

    const result = await getAllResumes();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/resumes")
    );
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("김철수");
  });

  it("서버 오류 시 예외를 throw한다", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    await expect(getAllResumes()).rejects.toThrow("Network Error");
  });

  it("빈 목록도 정상적으로 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, message: "Success", data: [] },
    });

    const result = await getAllResumes();
    expect(result).toEqual([]);
  });
});

// ── getResumeByMemberId ───────────────────────────────────────────────
describe("getResumeByMemberId", () => {
  it("특정 인재의 이력서 상세를 정상적으로 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { success: true, message: "Success", data: mockResumeDetail },
    });

    const result = await getResumeByMemberId(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/resumes/1")
    );
    expect(result.name).toBe("김철수");
    expect(result.techStacks).toBe("Python, FastAPI, PostgreSQL");
  });

  it("존재하지 않는 ID 요청 시 404 오류를 throw한다", async () => {
    const error = { response: { status: 404, data: { message: "Not Found" } } };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(getResumeByMemberId(9999)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});

// ── createResume ──────────────────────────────────────────────────────
describe("createResume", () => {
  const newResume: CreateResumeRequest = {
    name: "박민준",
    profileImageUrl: "https://example.com/img3.jpg",
    shortIntroduction: "풀스택 개발자입니다.",
    techStacks: "React, Python",
    education: "OO대학교 졸업",
    experience: "신입",
  };

  it("새 이력서를 정상적으로 생성하고 결과를 반환한다", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Created",
        data: { ...newResume, id: 3 },
      },
    });

    const result = await createResume(newResume);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/resumes"),
      expect.objectContaining({ name: "박민준" })
    );
    expect(result.name).toBe("박민준");
  });

  it("필수 데이터 누락 시 서버 422 오류를 throw한다", async () => {
    const error = {
      response: { status: 422, data: { message: "Validation Error" } },
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(createResume({} as CreateResumeRequest)).rejects.toMatchObject(
      { response: { status: 422 } }
    );
  });
});
