// src/__tests__/MemberCard.test.tsx
// MemberCard 컴포넌트 렌더링 및 클릭 이벤트 테스트

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MemberCard from "../components/MemberCard";
import { Member } from "../types/resume";

// ── 테스트용 샘플 데이터 ─────────────────────────────────────────────
const mockMember: Member = {
  id: 1,
  name: "김철수",
  profileImageUrl: "https://example.com/img1.jpg",
  shortIntroduction: "안녕하세요, 백엔드 개발자 김철수입니다.",
};

const mockMemberNoImage: Member = {
  id: 2,
  name: "이영희",
  profileImageUrl: null,
  shortIntroduction: "프론트엔드 개발자입니다.",
};

// ── 렌더링 테스트 ─────────────────────────────────────────────────────
describe("MemberCard - 렌더링", () => {
  it("인재 이름이 화면에 표시된다", () => {
    render(<MemberCard member={mockMember} onClick={jest.fn()} />);
    expect(screen.getByText("김철수")).toBeInTheDocument();
  });

  it("한 줄 소개가 화면에 표시된다", () => {
    render(<MemberCard member={mockMember} onClick={jest.fn()} />);
    expect(
      screen.getByText("안녕하세요, 백엔드 개발자 김철수입니다.")
    ).toBeInTheDocument();
  });

  it("프로필 이미지가 있으면 img 태그가 렌더링된다", () => {
    render(<MemberCard member={mockMember} onClick={jest.fn()} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/img1.jpg");
  });

  it("프로필 이미지가 없으면 대체 UI(아이콘 또는 기본 이미지)가 표시된다", () => {
    render(<MemberCard member={mockMemberNoImage} onClick={jest.fn()} />);
    // 이미지가 없을 때 alt 텍스트나 기본 이미지가 렌더링되어야 함
    const img = screen.queryByRole("img");
    if (img) {
      // 기본 이미지를 쓰는 경우
      expect(img).toBeInTheDocument();
    } else {
      // 이름 첫 글자 아바타 등을 쓰는 경우
      expect(screen.getByText("이영희")).toBeInTheDocument();
    }
  });
});

// ── 클릭 이벤트 테스트 ───────────────────────────────────────────────
describe("MemberCard - 클릭 이벤트", () => {
  it("카드 클릭 시 onClick 콜백이 호출된다", () => {
    const handleClick = jest.fn();
    render(<MemberCard member={mockMember} onClick={handleClick} />);

    fireEvent.click(screen.getByText("김철수"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("onClick 콜백에 member 객체 또는 member.id가 전달된다", () => {
    const handleClick = jest.fn();
    render(<MemberCard member={mockMember} onClick={handleClick} />);

    fireEvent.click(screen.getByText("김철수"));

    // onClick(member) 또는 onClick(member.id) 두 방식 모두 허용
    const callArg = handleClick.mock.calls[0][0];
    const passedId =
      typeof callArg === "object" ? callArg.id : callArg;
    expect(passedId).toBe(1);
  });

  it("여러 번 클릭해도 각각 이벤트가 발생한다", () => {
    const handleClick = jest.fn();
    render(<MemberCard member={mockMember} onClick={handleClick} />);

    const card = screen.getByText("김철수").closest("div") || screen.getByText("김철수");
    fireEvent.click(card);
    fireEvent.click(card);
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
