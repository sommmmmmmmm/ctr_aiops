# 🚀 빠른 배포 가이드 (Vercel)

## 🎯 5분 안에 배포하기

### 1️⃣ Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 로그인
vercel login
```

### 2️⃣ 프로젝트 배포

```bash
# 프로젝트 루트로 이동
cd /Users/jangsomin/workspace/ctr_aiops

# 배포 스크립트 실행 권한 부여
chmod +x deploy.sh

# Preview 배포 (테스트용)
./deploy.sh preview

# Production 배포
./deploy.sh production
```

### 3️⃣ 또는 Vercel CLI로 직접 배포

```bash
# Preview 배포
vercel

# Production 배포
vercel --prod
```

---

## 📋 배포 전 체크리스트

### ✅ Frontend 준비사항
- [x] `vercel.json` 생성 완료
- [x] `.vercelignore` 생성 완료
- [x] `package.json` 빌드 스크립트 확인
- [ ] 백엔드 URL 환경변수 설정 필요

### ⚙️ 설정 확인

#### vercel.json (이미 생성됨)
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [...]
}
```

#### Frontend 환경변수
Vercel Dashboard → Settings → Environment Variables에서 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://your-backend-url.com` | 백엔드 API URL |
| `VITE_WS_URL` | `wss://your-backend-url.com` | WebSocket URL |
| `NODE_ENV` | `production` | 환경 설정 |

---

## 🔧 Backend 배포 (선택)

Frontend만 Vercel에 배포하고, Backend는 아래 서비스 중 선택:

### 추천 1: Render.com (무료)
```bash
# 1. https://render.com 가입
# 2. New Web Service 클릭
# 3. GitHub 저장소 연결
# 4. 설정:
#    - Root Directory: backend
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 추천 2: Railway.app
```bash
# 1. https://railway.app 가입
# 2. New Project → Deploy from GitHub
# 3. backend 디렉토리 선택
# 4. 환경변수 추가 (OPENAI_API_KEY 등)
```

---

## 🌐 도메인 설정 (선택)

### Vercel 커스텀 도메인
1. Vercel Dashboard → Settings → Domains
2. 도메인 추가 (예: `ctr-aiops.com`)
3. DNS 레코드 업데이트 (Vercel이 자동 안내)

### 무료 도메인 옵션
- Vercel 자동 도메인: `your-project.vercel.app`
- Freenom (무료): `ctr-aiops.tk`
- GitHub Pages 연동 가능

---

## 🐛 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
cd frontend
npm install
npm run build

# 빌드 성공 시 dist 폴더 확인
ls -la dist/
```

### CORS 에러
Backend `main.py` 수정:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 환경변수 미적용
- Vercel Dashboard에서 환경변수 변경 후 **반드시 Redeploy**
- 변수명이 `VITE_`로 시작하는지 확인

### 라우팅 404 에러
- `vercel.json`의 rewrites 설정 확인
- SPA 모드 설정 필요

---

## 📊 배포 후 확인

### 자동 생성된 URL 확인
```bash
# 배포 완료 후 터미널에 표시되는 URL 클릭
# 예: https://ctr-aiops-xxxx.vercel.app
```

### 테스트 체크리스트
- [ ] 랜딩 페이지 접속
- [ ] 라우팅 동작 (페이지 이동)
- [ ] 이미지/아이콘 로드
- [ ] 반응형 디자인 (모바일)
- [ ] API 연결 테스트 (Backend 배포 후)

---

## 🎉 배포 완료!

### 예상 결과
- **Frontend URL**: https://ctr-aiops.vercel.app
- **Backend URL**: https://ctr-aiops-backend.onrender.com
- **배포 시간**: Frontend ~2분, Backend ~5분

### 다음 단계
1. ✅ Frontend Vercel 배포
2. ⏳ Backend Render/Railway 배포
3. 🔗 Frontend-Backend 연결
4. 🧪 통합 테스트
5. 🚀 Production 배포

---

## 📞 지원

더 자세한 내용은 `DEPLOYMENT_GUIDE.md`를 참조하세요.

**배포 성공을 기원합니다! 🎉**

