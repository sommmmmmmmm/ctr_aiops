# ✅ Vercel 배포 체크리스트

## 🎯 배포 준비 완료!

모든 필요한 설정 파일이 생성되었습니다. 아래 단계를 따라 배포하세요.

---

## 📦 생성된 파일들

### Frontend 관련
- ✅ `vercel.json` - Vercel 배포 설정
- ✅ `.vercelignore` - 배포 제외 파일 목록
- ✅ `deploy.sh` - 자동 배포 스크립트
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 자동 배포

### Backend 관련
- ✅ `backend/render.yaml` - Render 배포 설정
- ✅ `backend/Procfile` - Heroku/Railway 배포 설정
- ✅ `backend/runtime.txt` - Python 버전 명시
- ✅ `backend/main.py` - CORS 설정 업데이트

### 문서
- ✅ `DEPLOYMENT_GUIDE.md` - 상세 배포 가이드
- ✅ `README_DEPLOYMENT.md` - 빠른 시작 가이드
- ✅ `VERCEL_DEPLOYMENT_CHECKLIST.md` - 이 파일

---

## 🚀 배포 단계

### Step 1: Vercel CLI 설치 및 로그인

```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 계정 로그인
vercel login
```

### Step 2: Frontend 배포 (선택 1 - 자동 스크립트)

```bash
# 프로젝트 루트에서 실행
cd /Users/jangsomin/workspace/ctr_aiops

# Preview 배포
./deploy.sh preview

# Production 배포
./deploy.sh production
```

### Step 2: Frontend 배포 (선택 2 - 수동)

```bash
# Preview 배포
vercel

# Production 배포  
vercel --prod
```

### Step 3: Backend 배포 (Render 추천)

#### Render.com 사용
1. https://render.com 접속 및 가입
2. **New → Web Service** 클릭
3. GitHub 저장소 연결
4. 다음 설정 입력:

```
Name: ctr-aiops-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. **Environment Variables** 추가:
   - `OPENAI_API_KEY`: (OpenAI API 키)
   - `ENV`: `production`
   - `PYTHON_VERSION`: `3.11.0`

6. **Create Web Service** 클릭

#### 배포 완료 시 URL 확인
예: `https://ctr-aiops-backend.onrender.com`

### Step 4: Frontend-Backend 연결

1. Vercel Dashboard 접속: https://vercel.com/dashboard
2. 프로젝트 선택 → **Settings → Environment Variables**
3. 환경변수 추가:

| 변수명 | 값 |
|--------|-----|
| `VITE_API_BASE_URL` | `https://ctr-aiops-backend.onrender.com` |
| `VITE_WS_URL` | `wss://ctr-aiops-backend.onrender.com` |
| `NODE_ENV` | `production` |

4. **Deployments → Redeploy** 클릭 (환경변수 적용)

### Step 5: Backend CORS 업데이트

`backend/main.py`에서 실제 Vercel URL로 변경:

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://your-actual-app.vercel.app",  # 여기를 실제 URL로 변경
]
```

변경 후 git push → Render 자동 재배포

---

## 🧪 배포 후 테스트

### Frontend 테스트
- [ ] 랜딩 페이지 접속: `https://your-app.vercel.app`
- [ ] 페이지 라우팅 동작 확인
- [ ] 이미지/아이콘 로드 확인
- [ ] 모바일 반응형 확인

### Backend 테스트
- [ ] Health Check: `GET https://your-backend.onrender.com/api/health`
- [ ] API 응답 확인
- [ ] WebSocket 연결 테스트

### 통합 테스트
- [ ] Frontend → Backend API 호출
- [ ] 데이터 업로드 테스트
- [ ] 모델 학습 시작
- [ ] 실시간 WebSocket 통신

---

## 🎨 커스텀 도메인 연결 (선택)

### Vercel 도메인 설정
1. Vercel Dashboard → Settings → Domains
2. **Add Domain** 클릭
3. 도메인 입력 (예: `ctr-aiops.com`)
4. DNS 레코드 업데이트 (Vercel 안내 따르기)

### 무료 도메인 옵션
- **Vercel 기본**: `your-project.vercel.app`
- **Freenom**: 무료 도메인 (`.tk`, `.ml`, `.ga` 등)

---

## 🐛 문제 해결

### 빌드 실패
```bash
# 로컬 빌드 테스트
cd frontend
npm install
npm run build
```

### CORS 에러
Backend `main.py`에서 Frontend URL 추가 확인

### 환경변수 미적용
Vercel Dashboard에서 환경변수 변경 후 **반드시 Redeploy**

### 404 에러 (라우팅)
`vercel.json`의 rewrites 설정 확인

---

## 📊 예상 결과

### 배포 URL
- **Frontend**: `https://ctr-aiops-xxxxx.vercel.app`
- **Backend**: `https://ctr-aiops-backend.onrender.com`

### 배포 시간
- **Frontend**: ~2분
- **Backend**: ~5분 (첫 배포)

### 비용
- **Vercel**: 무료 (Hobby Plan)
- **Render**: 무료 티어 사용 가능

---

## 📞 지원 및 문서

### 상세 가이드
- **전체 가이드**: `DEPLOYMENT_GUIDE.md`
- **빠른 시작**: `README_DEPLOYMENT.md`

### 공식 문서
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app

### 추가 도움
- Vercel Community: https://vercel.com/support
- Render Community: https://community.render.com

---

## 🎉 배포 완료!

모든 단계를 완료하셨나요? 축하합니다!

### 다음 단계
1. ✅ 배포 완료 확인
2. 📊 성능 모니터링 설정
3. 🔒 보안 설정 강화
4. 📈 분석 도구 연동 (Google Analytics 등)

**성공적인 배포를 기원합니다! 🚀**

---

## 📝 참고사항

### Vercel 무료 플랜 제한
- 빌드 시간: 월 100시간
- 대역폭: 월 100GB
- Serverless Functions: 12초 타임아웃

### Render 무료 플랜 제한
- 15분 비활성화 시 슬립 모드
- 월 750시간 무료
- 512MB RAM

### 프로덕션 운영 시
무료 플랜으로 시작하여 트래픽 증가 시 유료 플랜으로 업그레이드 권장

