# CTR AIOps Frontend — version1 (Deployed UI, Tailwind removed)

## Overview
This package matches the currently deployed look. Tailwind CSS is removed. Element Plus and custom CSS remain.

## Tech stack
- Vue 3 + Vite
- Vue Router, Pinia
- Element Plus UI

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Output in `dist/`.

## Backend connection
- Dev proxy: configure in `vite.config.js` under `server.proxy['/api']`
- Prod: handled by hosting rewrites as applicable

## Deployment (Vercel)
- Uses `vercel.json` with SPA rewrite to `/index.html`
- No Tailwind/PostCSS required in this package

## Files of note
- `src/main.js`: Ensure there is no `import './style.css'`

# SK AX AIOps Frontend

AI 기반 광고 최적화 플랫폼의 프론트엔드 애플리케이션입니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [백엔드 연결 설정](#백엔드-연결-설정)
- [주요 기능](#주요-기능)
- [API 엔드포인트](#api-엔드포인트)
- [배포 설정](#배포-설정)
- [개발 가이드](#개발-가이드)

## 🛠 기술 스택

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5
- **UI Library**: Element Plus
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Charts**: Chart.js + Vue-Chartjs
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF + html2canvas
- **WebSocket**: Custom composable
- **Animation**: AOS (Animate On Scroll)

## 📁 프로젝트 구조

```
frontend/
├── public/
│   ├── _redirects          # Netlify/Vercel 리다이렉트 설정
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── index.js        # API 클라이언트 설정
│   ├── components/
│   │   └── charts/         # 차트 컴포넌트들
│   │       ├── CorrelationMatrix.vue
│   │       ├── FeatureImportanceChart.vue
│   │       └── PerformanceChart.vue
│   ├── composables/
│   │   └── useWebSocket.js # WebSocket 연결 관리
│   ├── router/
│   │   └── index.js        # 라우터 설정
│   ├── stores/
│   │   └── modules/
│   │       └── notification.js # 알림 상태 관리
│   ├── utils/
│   │   └── pdfGenerator.js # PDF 생성 유틸리티
│   ├── views/              # 페이지 컴포넌트들
│   │   ├── LandingPage.vue     # 랜딩 페이지
│   │   ├── Dashboard.vue       # 메인 대시보드
│   │   ├── SIDashboard.vue     # SI 업체 대시보드
│   │   ├── ClientDashboard.vue # 고객사 대시보드
│   │   ├── DataUpload.vue      # 데이터 업로드
│   │   ├── TrainingMonitor.vue # 학습 모니터링
│   │   ├── AIReport.vue        # AI 보고서
│   │   └── APITester.vue       # API 테스터
│   ├── App.vue             # 루트 컴포넌트
│   └── main.js             # 애플리케이션 진입점
├── index.html              # HTML 템플릿
├── package.json            # 의존성 및 스크립트
├── vite.config.js          # Vite 설정
├── vercel.json             # Vercel 배포 설정
└── README.md               # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 4. 빌드 미리보기

```bash
npm run preview
```

## 🔗 백엔드 연결 설정

### 1. API 엔드포인트 설정

`src/api/index.js` 파일에서 백엔드 URL을 설정합니다:

```javascript
// 개발 환경
const API_BASE_URL = 'http://localhost:8000'

// 프로덕션 환경
const API_BASE_URL = 'https://your-backend-domain.com'
```

### 2. 환경 변수 설정

`.env` 파일을 생성하여 환경별 설정을 관리합니다:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# .env.production
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_WS_URL=wss://your-backend-domain.com
```

### 3. CORS 설정

백엔드에서 CORS를 허용하도록 설정해야 합니다:

```python
# FastAPI 예시
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. WebSocket 연결

WebSocket 연결은 `src/composables/useWebSocket.js`에서 관리됩니다:

```javascript
// 사용 예시
const { isConnected, sendMessage } = useWebSocket('/ws/training/123', {
  onMessage: (data) => {
    console.log('WebSocket 메시지:', data)
  },
  onError: () => {
    console.log('WebSocket 연결 실패')
  }
})
```

## 🎯 주요 기능

### 1. 랜딩 페이지 (`/`)
- SK AX AIOps 서비스 소개
- 인터랙티브 네비게이션
- 반응형 디자인

### 2. 대시보드 (`/dashboard/si`, `/dashboard/client`)
- 실시간 데이터 시각화
- 성능 지표 모니터링
- 차트 및 그래프

### 3. 데이터 업로드 (`/upload`)
- CSV 파일 업로드
- 데이터 검증
- 업로드 진행률 표시

### 4. 학습 모니터링 (`/training/:runId`)
- 실시간 학습 진행률
- WebSocket을 통한 실시간 업데이트
- 성능 메트릭 시각화

### 5. AI 보고서 (`/report/:runId`)
- AI 생성 보고서 표시
- PDF 다운로드 기능
- 인사이트 및 추천사항

## 📡 API 엔드포인트

### 데이터 업로드
```javascript
POST /api/upload
Content-Type: multipart/form-data

// 응답
{
  "run_id": "uuid",
  "status": "success",
  "message": "파일이 성공적으로 업로드되었습니다"
}
```

### 학습 시작
```javascript
POST /api/training/start
{
  "run_id": "uuid",
  "config": {
    "epochs": 100,
    "batch_size": 32
  }
}

// 응답
{
  "status": "started",
  "run_id": "uuid"
}
```

### 학습 상태 조회
```javascript
GET /api/training/status/{run_id}

// 응답
{
  "status": "training",
  "epoch": 25,
  "total_epochs": 100,
  "metrics": {
    "train_loss": 0.45,
    "val_loss": 0.52,
    "train_accuracy": 0.85,
    "val_accuracy": 0.82
  }
}
```

### 보고서 생성
```javascript
POST /api/report/generate
{
  "run_id": "uuid"
}

// 응답
{
  "status": "generated",
  "report_url": "/api/report/{run_id}/download"
}
```

## 🚀 배포 설정

### Vercel 배포

1. **Vercel CLI 설치**
```bash
npm install -g vercel
```

2. **배포**
```bash
vercel --prod
```

3. **환경 변수 설정**
Vercel 대시보드에서 환경 변수를 설정합니다:
- `VITE_API_BASE_URL`: 백엔드 API URL
- `VITE_WS_URL`: WebSocket URL

### Vercel 설정 (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-domain.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🛠 개발 가이드

### 1. 새로운 페이지 추가

1. `src/views/`에 Vue 컴포넌트 생성
2. `src/router/index.js`에 라우트 추가
3. 필요시 `src/api/index.js`에 API 함수 추가

### 2. 새로운 컴포넌트 추가

1. `src/components/`에 컴포넌트 생성
2. 필요한 경우 `src/stores/`에 상태 관리 추가

### 3. API 함수 추가

`src/api/index.js`에 새로운 API 함수를 추가합니다:

```javascript
export const newApiFunction = async (data) => {
  const response = await api.post('/new-endpoint', data)
  return response.data
}
```

### 4. WebSocket 이벤트 추가

`src/composables/useWebSocket.js`를 확장하거나 새로운 composable을 생성합니다.

## 🔧 문제 해결

### 1. CORS 오류
- 백엔드 CORS 설정 확인
- 프록시 설정 확인 (`vite.config.js`)

### 2. WebSocket 연결 실패
- 백엔드 WebSocket 서버 상태 확인
- 방화벽 설정 확인

### 3. 빌드 오류
- Node.js 버전 확인 (18.x 이상 권장)
- 의존성 재설치: `rm -rf node_modules && npm install`

### 4. 라우팅 오류 (404)
- `vercel.json` 설정 확인
- `_redirects` 파일 확인

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. 브라우저 개발자 도구의 콘솔 오류
2. 네트워크 탭의 API 요청 상태
3. 백엔드 서버 로그

## 📄 라이선스

이 프로젝트는 SK AX의 내부 프로젝트입니다.
