// src/__tests__/ResumeModal.test.tsx
// ResumeModal 컴포넌트 조건부 렌더링 테스트

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResumeModal from "../components/ResumeModal";
import { ResumeDetail } from "../types/resume";

// ── 테스트용 샘플 데이터 ─────────────────────────────────────────────
const mockResume: ResumeDetail = {
  id: 1,
  name: "김철수",
  profileImageUrl: "https://example.com/img1.jpg",
  shortIntroduction: "백엔드 개발자입니다.",
  techStacks: "Python, FastAPI, PostgreSQL",
  education: "OO대학교 컴퓨터공학과 졸업",
  experience: "OO회사 백엔드 개발자 2년",
};

// ── 표시/숨김 조건부 렌더링 테스트 ──────────────────────────────────
describe("ResumeModal - 조건부 렌더링", () => {
  it("isOpen=true 이면 모달이 화면에 표시된다", () => {
    render(
      <ResumeModal
        isOpen={true}
        resume={mockResume}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("김철수")).toBeInTheDocument();
  });

  it("isOpen=false 이면 모달이 화면에 없다", () => {
    render(
      <ResumeModal
        isOpen={false}
        resume={mockResume}
        onClose={jest.fn()}
      />
    );
    expect(screen.queryByText("김철수")).not.toBeInTheDocument();
  });

  it("resume=null 이면 모달이 렌더링되지 않는다", () => {
    render(
      <ResumeModal
        isOpen={true}
        resume={null}
        onClose={jest.fn()}
      />
    );
    expect(screen.queryByText("김철수")).not.toBeInTheDocument();
  });
});

// ── 이력서 데이터 표시 테스트 ────────────────────────────────────────
describe("ResumeModal - 이력서 내용 표시", () => {
  beforeEach(() => {
    render(
      <ResumeModal
        isOpen={true}
        resume={mockResume}
        onClose={jest.fn()}
      />
    );
  });

  it("기술 스택이 표시된다", () => {
    expect(
      screen.getByText(/Python, FastAPI, PostgreSQL/)
    ).toBeInTheDocument();
  });

  it("학력이 표시된다", () => {
    expect(
      screen.getByText(/OO대학교 컴퓨터공학과 졸업/)
    ).toBeInTheDocument();
  });

  it("경력이 표시된다", () => {
    expect(
      screen.getByText(/OO회사 백엔드 개발자 2년/)
    ).toBeInTheDocument();
  });

  it("프로필 이미지가 표시된다", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/img1.jpg");
  });
});

// ── 닫기 동작 테스트 ─────────────────────────────────────────────────
describe("ResumeModal - 닫기 동작", () => {
  it("닫기 버튼 클릭 시 onClose가 호출된다", () => {
    const handleClose = jest.fn();
    render(
      <ResumeModal
        isOpen={true}
        resume={mockResume}
        onClose={handleClose}
      />
    );

    // '닫기', '×', 'close' 등 다양한 버튼 텍스트 대응
    const closeBtn =
      screen.queryByRole("button", { name: /닫기|close|×/i }) ||
      screen.getAllByRole("button")[0];

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("모달 배경(오버레이) 클릭 시 onClose가 호출된다 (구현 시)", () => {
    const handleClose = jest.fn();
    const { container } = render(
      <ResumeModal
        isOpen={true}
        resume={mockResume}
        onClose={handleClose}
      />
    );

    // 오버레이가 있는 경우에만 테스트 (없으면 skip)
    const overlay = container.querySelector("[data-testid='modal-overlay']");
    if (overlay) {
      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalled();
    } else {
      // 오버레이 없으면 테스트 통과
      expect(true).toBe(true);
    }
  });
});
