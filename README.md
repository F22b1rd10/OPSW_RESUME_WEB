# 인재 이력서 조회 서비스

인재들의 이력서를 등록하고 조회할 수 있는 풀스택 웹 서비스입니다.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Axios |
| **Backend** | FastAPI, Python 3.12, asyncpg |
| **Database** | PostgreSQL 15 (Docker) |
| **테스트** | pytest, pytest-asyncio, Jest, React Testing Library |

---

## 프로젝트 구조

```
resume_project/
├── back/                        # FastAPI 백엔드
│   ├── app/
│   │   ├── common/              # 공통 유틸리티
│   │   │   ├── config.py        # 환경변수 설정
│   │   │   ├── exceptions.py    # 커스텀 예외
│   │   │   ├── response.py      # 공통 응답 모델
│   │   │   └── sql_loader.py    # XML SQL 파서
│   │   ├── pages/
│   │   │   └── resume/
│   │   │       ├── dto.py       # 요청/응답 스키마
│   │   │       ├── repository.py# DB 접근 계층
│   │   │       ├── router.py    # API 엔드포인트
│   │   │       └── service.py   # 비즈니스 로직
│   │   ├── sql/
│   │   │   └── resume.xml       # SQL 쿼리 관리
│   │   ├── database.py          # DB 연결 설정
│   │   └── main.py              # 앱 진입점
│   ├── tests/
│   │   ├── pages/resume/
│   │   │   ├── test_router.py   # 라우터 통합 테스트
│   │   │   └── test_service.py  # 서비스 단위 테스트
│   │   └── test_sql_loader.py   # SQL 로더 단위 테스트
│   ├── .env                     # 환경변수 (git 제외)
│   ├── Dockerfile
│   ├── pytest.ini
│   └── requirements.txt
│
└── front/                       # React 프론트엔드
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── __tests__/           # 테스트 파일
    │   │   ├── resumeApi.test.ts
    │   │   ├── MemberCard.test.tsx
    │   │   ├── ResumeModal.test.tsx
    │   │   └── CreateResumeModal.test.tsx
    │   ├── api/
    │   │   └── resumeApi.ts     # API 호출 함수
    │   ├── components/
    │   │   ├── MemberCard.tsx   # 인재 카드
    │   │   ├── MemberList.tsx   # 메인 목록 페이지
    │   │   ├── ResumeModal.tsx  # 이력서 상세 모달
    │   │   └── CreateResumeModal.tsx # 이력서 작성 모달
    │   ├── types/
    │   │   └── resume.ts        # TypeScript 타입 정의
    │   ├── index.css            # Tailwind 진입점
    │   └── index.tsx            # React 진입점
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

---

## 시작하기

### 사전 요구사항

- Node.js 18+
- Python 3.12+
- Docker Desktop

### 1. 데이터베이스 실행

```bash
# 이미 생성된 컨테이너 시작/정지
docker start my-postgres-db
docker stop my-postgres-db
```

### 2. DB 테이블 생성

DataGrip 또는 psql로 아래 SQL 실행:

```sql
CREATE TABLE members (
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR NOT NULL,
    profile_image_url  VARCHAR,
    short_introduction VARCHAR,
    created_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resumes (
    id          SERIAL PRIMARY KEY,
    member_id   INTEGER REFERENCES members(id),
    tech_stacks VARCHAR,
    education   VARCHAR,
    experience  VARCHAR
);
```

### 3. 백엔드 실행

```bash
cd back

# 가상환경 생성 및 활성화 (최초 1회)
python -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate       # Windows

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload
# → http://localhost:8000
```



### 4. 프론트엔드 실행

```bash
cd front

# 패키지 설치 (최초 1회)
npm install

# 개발 서버 실행
npm start
# → http://localhost:3000
```

---

## API 명세

Base URL: `http://localhost:8000/api/v1`

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/resumes` | 전체 인재 목록 조회 |
| `GET` | `/resumes/{member_id}` | 특정 인재 이력서 상세 조회 |
| `POST` | `/resumes` | 새 이력서 등록 |

### POST /resumes 요청 바디

```json
{
  "name": "홍길동",
  "profile_image_url": "https://...",
  "short_introduction": "백엔드 개발자입니다.",
  "tech_stacks": "Python, FastAPI, PostgreSQL",
  "education": "OO대학교 컴퓨터공학과 졸업",
  "experience": "OO회사 백엔드 개발자 2년"
}
```

### 공통 응답 형식

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

---

## 테스트 실행

### 백엔드

```bash
cd back
pytest -v
```

| 파일 | 설명 |
|------|------|
| `tests/test_sql_loader.py` | SQL 로더 단위 테스트 |
| `tests/pages/resume/test_service.py` | 서비스 단위 테스트 (repository 모킹) |
| `tests/pages/resume/test_router.py` | 라우터 통합 테스트 (service 모킹) |

### 프론트엔드

```bash
cd front
npm test
```

| 파일 | 설명 |
|------|------|
| `__tests__/resumeApi.test.ts` | API 함수 (axios 모킹) |
| `__tests__/MemberCard.test.tsx` | 카드 컴포넌트 렌더링/클릭 |
| `__tests__/ResumeModal.test.tsx` | 상세 모달 조건부 렌더링 |
| `__tests__/CreateResumeModal.test.tsx` | 이력서 작성 폼 유효성 검사 |

---

