# 🚀 배포 가이드

## 준비사항
- GitHub 계정
- Vercel 계정 (GitHub로 가입)
- Render 계정 (GitHub로 가입)

---

## 1️⃣ 프론트엔드 배포 (Vercel)

### 단계별 가이드

1. **Vercel 접속**
   - https://vercel.com 접속
   - "Sign Up" → GitHub로 로그인

2. **새 프로젝트 생성**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 `ctr_aiops` 선택
   - "Import" 클릭

3. **프로젝트 설정** (중요!)
   ```
   Project Name: ctr-aiops-frontend
   Framework Preset: Vite
   Root Directory: frontend        ⭐ 이거 꼭 설정!
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **환경 변수 (선택사항)**
   ```
   VITE_API_BASE_URL = https://your-backend-url.onrender.com
   ```

5. **Deploy 클릭**
   - 빌드 완료까지 약 2-3분 소요
   - 완료되면 자동으로 URL 생성 (예: https://ctr-aiops-frontend.vercel.app)

---

## 2️⃣ 백엔드 배포 (Render.com)

### 단계별 가이드

1. **Render 접속**
   - https://render.com 접속
   - "Get Started" → GitHub로 로그인

2. **새 Web Service 생성**
   - Dashboard에서 "New +" 클릭
   - "Web Service" 선택
   - GitHub 저장소 `ctr_aiops` 연결

3. **서비스 설정**
   ```
   Name: ctr-aiops-backend
   Region: Singapore (가장 가까운 지역)
   Branch: main
   Root Directory: backend         ⭐ 이거 꼭 설정!
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **플랜 선택**
   - Instance Type: Free (개발/테스트용)
   - 또는 Starter ($7/월) - 프로덕션용

5. **환경 변수 설정**
   ```
   ENV = production
   PYTHON_VERSION = 3.11.0
   OPENAI_API_KEY = sk-... (선택사항, AI 보고서용)
   ```

6. **Create Web Service 클릭**
   - 빌드 완료까지 약 5-10분 소요
   - 완료되면 URL 생성 (예: https://ctr-aiops-backend.onrender.com)

---

## 3️⃣ 프론트엔드 ↔️ 백엔드 연결

백엔드 배포 완료 후 **백엔드 URL**을 복사합니다.

### 방법 1: Vercel 환경 변수로 설정

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. 추가:
   ```
   VITE_API_BASE_URL = https://ctr-aiops-backend.onrender.com
   ```
4. Redeploy 버튼 클릭

### 방법 2: vercel.json 수정 (이미 설정됨)

`frontend/vercel.json` 파일의 `destination`을 실제 백엔드 URL로 변경:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ctr-aiops-backend.onrender.com/api/:path*"
    }
  ]
}
```

---

## 4️⃣ 배포 확인

### 프론트엔드 테스트
1. Vercel URL 접속 (예: https://ctr-aiops-frontend.vercel.app)
2. 랜딩 페이지가 제대로 로드되는지 확인
3. "시작하기" 버튼 클릭하여 대시보드 접근

### 백엔드 테스트
1. Render URL 접속 (예: https://ctr-aiops-backend.onrender.com)
2. API 문서 확인: https://ctr-aiops-backend.onrender.com/docs
3. Health check: https://ctr-aiops-backend.onrender.com/api/health

### 통합 테스트
1. 프론트엔드에서 "데이터 업로드" 페이지로 이동
2. CSV 파일 업로드 시도
3. 브라우저 개발자 도구(F12) → Network 탭에서 API 요청 확인

---

## 🔧 트러블슈팅

### Render 빌드 실패
- **원인**: Python 버전 또는 패키지 호환성
- **해결**: Environment Variables에 `PYTHON_VERSION=3.11.0` 추가

### Vercel 빌드 실패
- **원인**: Node modules 설치 실패
- **해결**: Root Directory가 `frontend`로 설정되었는지 확인

### CORS 에러
- **원인**: 백엔드에서 프론트엔드 URL 허용 안 됨
- **해결**: `backend/main.py`의 CORS 설정 확인 (현재는 모든 origin 허용)

### API 요청 실패
- **원인**: 백엔드 URL이 제대로 연결 안 됨
- **해결**: 
  1. `frontend/vercel.json` 확인
  2. 또는 환경 변수 `VITE_API_BASE_URL` 설정

---

## 📊 배포 후 설정

### Custom Domain (선택사항)

**Vercel**:
1. Project Settings → Domains
2. 도메인 추가 (예: ctr-aiops.yourdomain.com)

**Render**:
1. Settings → Custom Domain
2. 도메인 추가 (예: api.yourdomain.com)

### 자동 배포

- GitHub의 `main` 브랜치에 push하면 자동으로 재배포됨
- Vercel과 Render 모두 자동 배포 지원

---

## ✅ 최종 체크리스트

- [ ] Vercel에 프론트엔드 배포 완료
- [ ] Render에 백엔드 배포 완료
- [ ] 백엔드 URL을 프론트엔드에 연결
- [ ] 프론트엔드 페이지 정상 로드 확인
- [ ] 백엔드 API 문서(/docs) 접근 가능
- [ ] 파일 업로드 테스트 성공
- [ ] 모델 학습 시작 가능
- [ ] (선택) Custom domain 설정

---

## 🎉 완료!

배포된 URL:
- **프론트엔드**: https://your-frontend.vercel.app
- **백엔드**: https://your-backend.onrender.com
- **API 문서**: https://your-backend.onrender.com/docs

이제 링크를 공유하여 누구나 접근 가능합니다! 🚀





