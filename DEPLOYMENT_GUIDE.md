# 🚀 Vercel 배포 가이드

## 📋 목차
1. [Frontend 배포 (Vercel)](#frontend-배포-vercel)
2. [Backend 배포 옵션](#backend-배포-옵션)
3. [환경변수 설정](#환경변수-설정)
4. [배포 후 확인사항](#배포-후-확인사항)

---

## 🎨 Frontend 배포 (Vercel)

### 방법 1: Vercel CLI 사용 (추천)

#### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2. Vercel 로그인
```bash
vercel login
```

#### 3. 프로젝트 배포
```bash
# 프로젝트 루트 디렉토리에서 실행
cd /Users/jangsomin/workspace/ctr_aiops
vercel
```

첫 배포 시 질문에 답변:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → ctr-aiops (또는 원하는 이름)
- **In which directory is your code located?** → `./`

#### 4. Production 배포
```bash
vercel --prod
```

---

### 방법 2: Vercel Dashboard 사용

#### 1. Vercel 가입
- https://vercel.com 접속
- GitHub 계정으로 로그인

#### 2. GitHub 저장소 연결
1. **New Project** 클릭
2. GitHub 저장소 선택 (ctr_aiops)
3. Import

#### 3. 프로젝트 설정
```
Framework Preset: Other
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: cd frontend && npm install
Root Directory: ./
```

#### 4. 환경변수 설정 (Dashboard)
- **VITE_API_BASE_URL**: 백엔드 API URL
- **VITE_WS_URL**: 백엔드 WebSocket URL
- **NODE_ENV**: production

#### 5. Deploy 클릭

---

## 🔧 Backend 배포 옵션

Vercel은 Serverless Functions를 지원하지만, FastAPI는 전통적인 서버가 필요합니다.
아래 옵션 중 하나를 선택하세요:

### 옵션 1: Render.com (무료, 추천)

#### 장점
- ✅ 무료 티어 제공
- ✅ FastAPI/Python 완벽 지원
- ✅ 자동 배포 (GitHub 연동)
- ✅ HTTPS 자동 설정

#### 배포 단계
1. **Render 가입**: https://render.com
2. **New → Web Service** 클릭
3. **GitHub 저장소 연결**
4. **설정**:
   ```
   Name: ctr-aiops-backend
   Region: Singapore (한국과 가까움)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **환경변수 추가**:
   - `OPENAI_API_KEY`: OpenAI API 키
   - `PYTHON_VERSION`: 3.11.0
6. **Create Web Service** 클릭

#### 배포 URL 예시
- https://ctr-aiops-backend.onrender.com

---

### 옵션 2: Railway.app (유료, 고성능)

#### 장점
- ✅ 빠른 성능
- ✅ 간단한 설정
- ✅ $5 무료 크레딧

#### 배포 단계
1. **Railway 가입**: https://railway.app
2. **New Project → Deploy from GitHub**
3. **저장소 선택**
4. **설정**:
   ```
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **환경변수 추가** (Render와 동일)

---

### 옵션 3: AWS EC2 / GCP Compute Engine (프로덕션)

#### EC2 배포 스크립트
```bash
# EC2 인스턴스에서 실행
sudo apt update
sudo apt install python3.11 python3-pip nginx -y

# 프로젝트 클론
git clone <your-repo-url>
cd ctr_aiops/backend

# 가상환경 생성
python3 -m venv venv
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt

# Gunicorn으로 실행
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Nginx 설정
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 🌐 환경변수 설정

### Frontend 환경변수 (Vercel)

Vercel Dashboard → Project Settings → Environment Variables

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_WS_URL=wss://your-backend-url.com
NODE_ENV=production
```

### Backend 환경변수 (Render/Railway)

```
OPENAI_API_KEY=sk-...
PYTHON_VERSION=3.11.0
PORT=8000
```

---

## 🔗 Frontend-Backend 연결

### 1. Backend 배포 완료 후 URL 복사
예: `https://ctr-aiops-backend.onrender.com`

### 2. Frontend 환경변수 업데이트
Vercel Dashboard에서:
```
VITE_API_BASE_URL=https://ctr-aiops-backend.onrender.com
VITE_WS_URL=wss://ctr-aiops-backend.onrender.com
```

### 3. Frontend 재배포
```bash
vercel --prod
```

또는 Vercel Dashboard에서 **Redeploy** 클릭

---

## ✅ 배포 후 확인사항

### Frontend 체크리스트
- [ ] 랜딩 페이지 접속 확인
- [ ] 라우팅 동작 확인 (새로고침 시에도 정상 작동)
- [ ] 이미지/아이콘 로드 확인
- [ ] 반응형 디자인 확인 (모바일)

### Backend 체크리스트
- [ ] API Health Check: `GET /api/health`
- [ ] CORS 설정 확인
- [ ] WebSocket 연결 확인
- [ ] 파일 업로드 테스트
- [ ] 모델 학습 테스트

### 통합 테스트
- [ ] Frontend → Backend API 호출 확인
- [ ] WebSocket 실시간 통신 확인
- [ ] 데이터 업로드 → 학습 → 보고서 생성 플로우 테스트
- [ ] 성능 알림 수신 확인

---

## 🐛 문제 해결

### CORS 에러
Backend `main.py`의 CORS 설정 수정:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### WebSocket 연결 실패
- Backend가 WebSocket을 지원하는지 확인 (Render는 지원)
- WSS (WebSocket Secure) 프로토콜 사용 확인
- Nginx 사용 시 WebSocket 설정 추가

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
cd frontend
npm install
npm run build
```

### 환경변수 미적용
- Vercel: 환경변수 변경 후 반드시 **Redeploy** 필요
- 변수명이 `VITE_`로 시작하는지 확인 (Vue/Vite 프로젝트)

---

## 📊 배포 결과 예시

### Frontend (Vercel)
- **URL**: https://ctr-aiops.vercel.app
- **배포 시간**: ~2분
- **자동 HTTPS**: ✅
- **커스텀 도메인**: 설정 가능

### Backend (Render)
- **URL**: https://ctr-aiops-backend.onrender.com
- **배포 시간**: ~5분 (첫 배포)
- **자동 HTTPS**: ✅
- **무료 티어**: ✅ (단, 15분 비활성화 시 슬립 모드)

---

## 🚀 빠른 배포 스크립트

### 전체 배포 (Frontend + Backend)

```bash
#!/bin/bash

echo "🚀 CTR AIOps 배포 시작..."

# 1. Backend 배포 (Render/Railway에 푸시하면 자동 배포)
echo "📦 Backend: Git Push로 자동 배포"
git add .
git commit -m "Deploy backend"
git push origin main

# 2. Frontend 배포 (Vercel)
echo "🎨 Frontend: Vercel 배포"
cd frontend
npm install
npm run build
cd ..
vercel --prod

echo "✅ 배포 완료!"
echo "Frontend: https://ctr-aiops.vercel.app"
echo "Backend: https://ctr-aiops-backend.onrender.com"
```

---

## 📞 지원

배포 중 문제가 발생하면:
1. Vercel 로그 확인: `vercel logs`
2. Render 로그 확인: Dashboard → Logs
3. GitHub Issues에 질문 등록

---

## 🔗 유용한 링크

- **Vercel 공식 문서**: https://vercel.com/docs
- **Render 공식 문서**: https://render.com/docs
- **Railway 공식 문서**: https://docs.railway.app
- **FastAPI 배포 가이드**: https://fastapi.tiangolo.com/deployment

---

**배포 성공을 기원합니다! 🎉**

