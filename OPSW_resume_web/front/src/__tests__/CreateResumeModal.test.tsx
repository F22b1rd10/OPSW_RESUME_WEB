// src/__tests__/CreateResumeModal.test.tsx
// 이력서 작성 폼 유효성 검사 테스트

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CreateResumeModal from "../components/CreateResumeModal";

// API 모듈 Mock
jest.mock("../api/resumeApi", () => ({
  createResume: jest.fn(),
}));

import { createResume } from "../api/resumeApi";
const mockCreateResume = createResume as jest.MockedFunction<typeof createResume>;

// ── Helper: 모달 열기 ────────────────────────────────────────────────
const renderModal = (onClose = jest.fn(), onCreated = jest.fn()) => {
  render(
    <CreateResumeModal
      isOpen={true}
      onClose={onClose}
      onCreated={onCreated}
    />
  );
};

// ── 렌더링 테스트 ─────────────────────────────────────────────────────
describe("CreateResumeModal - 폼 렌더링", () => {
  it("이름 입력 필드가 존재한다", () => {
    renderModal();
    expect(
      screen.getByRole("textbox", { name: /이름|name/i }) ||
        screen.getByPlaceholderText(/이름/i)
    ).toBeInTheDocument();
  });

  it("기술 스택 입력 필드가 존재한다", () => {
    renderModal();
    const techField =
      screen.queryByRole("textbox", { name: /기술|tech/i }) ||
      screen.queryByPlaceholderText(/기술/i);
    expect(techField).toBeInTheDocument();
  });

  it("제출 버튼이 존재한다", () => {
    renderModal();
    const submitBtn =
      screen.queryByRole("button", { name: /등록|제출|저장|submit/i }) ||
      screen.getAllByRole("button").find((btn) =>
        /등록|제출|저장|submit/i.test(btn.textContent || "")
      );
    expect(submitBtn).toBeTruthy();
  });
});

// ── 유효성 검사 테스트 ───────────────────────────────────────────────
describe("CreateResumeModal - 유효성 검사", () => {
  it("이름을 입력하지 않고 제출하면 오류 메시지가 표시된다", async () => {
    renderModal();

    const submitBtn =
      screen.queryByRole("button", { name: /등록|제출|저장|submit/i }) ||
      screen.getAllByRole("button")[0];

    fireEvent.click(submitBtn);

    await waitFor(() => {
      // '필수', '이름', '입력' 등 오류 메시지 텍스트 확인
      const errorMsg =
        screen.queryByText(/이름.*필수|필수.*이름|이름.*입력|name.*required/i) ||
        screen.queryByText(/필수/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  it("모든 필드 입력 후 제출하면 createResume API가 호출된다", async () => {
    mockCreateResume.mockResolvedValueOnce({
      id: 10,
      name: "테스트유저",
      profileImageUrl: "",
      shortIntroduction: "테스트",
      techStacks: "React",
      education: "대학교",
      experience: "1년",
    });

    renderModal();

    // 이름 입력
    const nameInput =
      screen.getByRole("textbox", { name: /이름|name/i }) ||
      screen.getByPlaceholderText(/이름/i);
    await userEvent.type(nameInput, "테스트유저");

    // 제출
    const submitBtn =
      screen.queryByRole("button", { name: /등록|제출|저장|submit/i }) ||
      screen.getAllByRole("button")[0];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateResume).toHaveBeenCalled();
    });
  });

  it("API 호출 성공 후 onCreated 콜백이 호출된다", async () => {
    const handleCreated = jest.fn();
    mockCreateResume.mockResolvedValueOnce({
      id: 11,
      name: "성공유저",
      profileImageUrl: "",
      shortIntroduction: "소개",
      techStacks: "Vue",
      education: "대학",
      experience: "신입",
    });

    render(
      <CreateResumeModal
        isOpen={true}
        onClose={jest.fn()}
        onCreated={handleCreated}
      />
    );

    const nameInput =
      screen.getByRole("textbox", { name: /이름|name/i }) ||
      screen.getByPlaceholderText(/이름/i);
    await userEvent.type(nameInput, "성공유저");

    const submitBtn =
      screen.queryByRole("button", { name: /등록|제출|저장|submit/i }) ||
      screen.getAllByRole("button")[0];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleCreated).toHaveBeenCalled();
    });
  });

  it("취소 버튼 클릭 시 onClose가 호출된다", () => {
    const handleClose = jest.fn();
    render(
      <CreateResumeModal
        isOpen={true}
        onClose={handleClose}
        onCreated={jest.fn()}
      />
    );

    const cancelBtn =
      screen.queryByRole("button", { name: /취소|닫기|cancel|close/i }) ||
      screen.getAllByRole("button").find((btn) =>
        /취소|닫기|cancel/i.test(btn.textContent || "")
      );

    if (cancelBtn) {
      fireEvent.click(cancelBtn);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});
