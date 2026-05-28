from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.pages.resume import router as resume_router

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost",
    "http://localhost:3000", # 프론트엔드 개발 서버 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Resume Directory Web Service Backend"}
