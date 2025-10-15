# SK Planet AIOps

> **SK AX가 제공하는 AI 기반 광고 최적화 및 전략 인사이트 플랫폼**

## 🏢 About SK AX
SK AX는 SK그룹의 AI/DX 전문 계열사로, 기업의 디지털 전환과 AI 적용을 선도하고 있습니다.
SK Planet의 광고 사이트 사용자 행동 데이터를 AI가 분석하여 CTR(클릭률) 예측 모델을 통해 마케팅 전략 인사이트를 제공합니다.

- 500+ AI 프로젝트 수행
- 200+ 고객사 파트너십
- 98% 고객 만족도

## 📋 프로젝트 개요
**SK Planet AIOps 서비스**
- SK Planet의 광고 사이트 사용자 행동 데이터 분석
- AI 기반 CTR(클릭률) 예측 모델
- 실시간 마케팅 전략 인사이트 및 액션 플랜 제안
- SK AX가 제공하는 종합 마케팅 분석 플랫폼

### 🎯 핵심 가치
- **LSTM + MLP 모델** 기반 CTR 예측
- **생성형 AI** 기반 인사이트 도출
- **통계적 근거** 기반 피처 중요도 분석
- **실시간 성능 모니터링** 및 자동 알림

## 🏗 기술 스택

### Frontend
- **Vue 3** - Composition API
- **Element Plus** - UI 컴포넌트
- **Chart.js** - 데이터 시각화
- **WebSocket** - 실시간 통신
- **Vite** - 빌드 도구

### Backend
- **FastAPI** - REST API
- **PyTorch** - 딥러닝 모델
- **MLflow** - 실험 추적
- **WebSocket** - 실시간 푸시

### Model
- **LSTM + MLP** (lstm_model.ipynb)
- **데이터**: CTR_60000.csv (renamed)

## 🎨 주요 기능

### 1. 이중 대시보드 시스템

#### 🔧 SI 업체용 대시보드
- **성능 모니터링**
  - 실시간 모델 성능 지표 (Accuracy, Precision, Recall, F1)
  - 성능 히스토리 추적
  - 성능 그래프 시각화
- **시스템 헬스 체크**
  - CPU/메모리 사용률
  - API 응답 시간
  - 에러율 모니터링
- **상세 기술 지표**
  - 학습 Loss 그래프
  - Epoch별 성능 변화
  - 하이퍼파라미터 로그
- **에러 로그 & 추적**
  - 실시간 에러 로그
  - 예외 스택 트레이스
  - 성능 병목 구간 식별
- **자동 알림 시스템**
  - Accuracy < 0.7 자동 경고
  - WebSocket 실시간 푸시
  - 모델 재학습 트리거 제안

#### 📊 고객사용 대시보드
- **생성형 AI 기반 보고서**
  - 자연어로 작성된 인사이트
  - 마케팅 전략 자동 추천
  - 실행 가능한 액션 플랜
- **사용자 행동 패턴 요약**
  - 클릭률이 높은 시간대/세그먼트
  - 효과적인 광고 위치 분석
  - 타겟 고객 프로파일링
- **전환율 & 퍼널 분석**
  - 고객 여정 시각화
  - 이탈 구간 분석
  - 전환율 개선 포인트
- **비즈니스 지표 & ROI**
  - 예상 매출 증대 효과
  - 광고 효율 개선율
  - ROI 시뮬레이션
- **간소화된 UI/UX**
  - 비전문가도 이해 가능한 인터페이스
  - 주요 지표 중심 요약
  - 시각적 인사이트

### 2. 통계적 근거 기반 피처 분석

#### 📈 중요 피처 분석 (High Impact Features)
- **피처 중요도 스코어**
  - Random Forest Feature Importance
  - SHAP (SHapley Additive exPlanations) 값
  - Permutation Importance
- **통계적 유의성 검증**
  - p-value < 0.05
  - 95% 신뢰구간
  - 효과 크기 (Effect Size)
- **상관관계 분석**
  - Correlation Matrix 히트맵
  - 다중공선성 체크 (VIF)
- **비즈니스 임팩트**
  - 각 피처의 CTR 기여도
  - 실제 클릭 수 변화량
  - ROI 증대 효과

#### 📉 저영향 피처 분석 (Low Impact Features)
- **불필요한 피처 식별**
  - 낮은 중요도 스코어 (< 0.05)
  - 통계적 유의성 없음 (p-value > 0.05)
- **개선 방안 제시**
  - 피처 엔지니어링 제안
  - 데이터 수집 개선 방향
- **리소스 재배치 제안**
  - 불필요한 데이터 수집 중단
  - 중요 피처에 리소스 집중

#### 🔄 상호작용 효과 분석
- **피처 간 시너지 효과**
  - 2차 상호작용 항 분석
  - 조합 효과 시각화
- **세그먼트별 차별화**
  - 연령대별 중요 피처
  - 시간대별 패턴 차이
  - 디바이스별 차이점

#### 🎯 예측 시뮬레이션
- **What-If 분석**
  - 피처 값 변경 시 CTR 변화 예측
  - 최적 조합 탐색
- **액션 플랜 우선순위**
  - 빠른 성과를 낼 수 있는 개선 사항
  - 장기적 전략적 개선 사항

### 3. 성능 모니터링 & 자동 알림

#### ⚠️ 성능 경고 시스템
- **자동 경고 트리거**
  - Accuracy < 0.7
  - F1 Score 급락 (> 10% 하락)
  - 추론 지연 (> 500ms)
- **알림 방식**
  - WebSocket 실시간 푸시
  - Element Plus Notification
  - 지속적 알림 (수동 닫기)
  - 알림 히스토리 저장
- **자동 대응 제안**
  - 모델 재학습 트리거
  - 데이터 품질 체크
  - 성능 저하 원인 분석

#### 📊 모니터링 지표
- **모델 성능**
  - Accuracy (정확도)
  - Precision (정밀도)
  - Recall (재현율)
  - F1 Score
  - AUC-ROC
- **시스템 성능**
  - 추론 속도 (ms)
  - API 처리량 (req/s)
  - 에러율 (%)
- **실시간 그래프**
  - 시계열 성능 추이
  - 히스토리 추적 (30일)
  - 이상 탐지

### 4. 서비스 소개 랜딩 페이지

#### 🎨 디자인 컨셉 (HS애드 스타일)
- **세련되고 현대적인 디자인**
  - 깔끔한 레이아웃
  - 프리미엄 느낌
  - 브랜드 컬러 활용
- **애니메이션 효과**
  - Scroll Reveal Animation
  - Hover Effects
  - Smooth Transitions
- **반응형 레이아웃**
  - Mobile First
  - Tablet/Desktop 최적화

#### 📄 구성 요소
1. **Hero Section**
   - 임팩트 있는 메인 비주얼
   - 핵심 가치 제안
   - CTA 버튼 (데모 시작)

2. **서비스 소개**
   - AI 기반 자동화
   - 통계적 근거 제공
   - 실시간 모니터링

3. **주요 기능 섹션**
   - 이중 대시보드
   - AI 보고서 생성
   - 성능 알림 시스템
   - 각 기능별 상세 설명

4. **기술 스택 소개**
   - Vue 3, PyTorch, MLflow
   - 아이콘과 함께 시각화

5. **성능 지표**
   - 87.5% 평균 정확도
   - < 100ms 추론 속도
   - 99.9% 가용성

6. **고객 사례** (Mock)
   - 업계별 성공 사례
   - ROI 증대 사례

7. **CTA (Call-to-Action)**
   - 무료 데모 신청
   - 문의하기

8. **Footer**
   - 회사 정보
   - 연락처
   - 소셜 미디어 링크

## 📁 프로젝트 구조

```
ctr_aiops/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── LandingPage.vue          # 랜딩 페이지
│   │   │   ├── SIDashboard.vue          # SI 업체용 대시보드
│   │   │   ├── ClientDashboard.vue      # 고객사용 대시보드
│   │   │   ├── DataUpload.vue           # 데이터 업로드
│   │   │   ├── TrainingMonitor.vue      # 실시간 학습 모니터링
│   │   │   └── AIReport.vue             # AI 생성 보고서
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── PerformanceChart.vue    # 성능 그래프
│   │   │   │   ├── FeatureImportance.vue   # 피처 중요도
│   │   │   │   ├── CorrelationMatrix.vue   # 상관관계 매트릭스
│   │   │   │   └── FunnelChart.vue         # 퍼널 분석
│   │   │   ├── NotificationSystem.vue      # 알림 시스템
│   │   │   ├── HealthMonitor.vue           # 시스템 헬스
│   │   │   └── AIInsights.vue              # AI 인사이트
│   │   ├── composables/
│   │   │   ├── useWebSocket.js          # WebSocket 훅
│   │   │   ├── useNotification.js       # 알림 훅
│   │   │   └── usePerformanceMonitor.js # 모니터링 훅
│   │   ├── stores/
│   │   │   ├── notification.js          # 알림 상태
│   │   │   ├── performance.js           # 성능 데이터
│   │   │   └── auth.js                  # 인증 (SI/Client 구분)
│   │   ├── router/
│   │   ├── api/
│   │   └── App.vue
│   └── package.json
├── backend/ (다른 팀원)
│   ├── main.py
│   ├── model/
│   │   ├── lstm_model.py
│   │   └── feature_analyzer.py
│   ├── analysis/
│   │   ├── feature_importance.py
│   │   ├── correlation.py
│   │   └── shap_analysis.py
│   ├── monitoring/
│   │   ├── performance_monitor.py
│   │   └── alert_system.py
│   └── report/
│       ├── ai_report_generator.py
│       └── templates/
├── models/
│   └── model.pth
└── data/
    └── CTR_60000_renamed.csv
```

## 🚀 API 엔드포인트

### 데이터 & 학습
- `POST /api/upload` - 데이터 업로드
- `POST /api/train` - 모델 학습 시작
- `GET /api/train/status/{run_id}` - 학습 상태 조회
- `WS /ws/training/{run_id}` - 실시간 학습 모니터링

### 보고서 생성
- `GET /api/report/ai/{run_id}` - AI 생성 보고서
- `GET /api/report/feature-importance/{run_id}` - 피처 중요도
- `GET /api/report/correlation/{run_id}` - 상관관계 분석
- `GET /api/report/shap/{run_id}` - SHAP 분석

### 성능 모니터링
- `GET /api/performance/{run_id}` - 성능 지표
- `GET /api/performance/history` - 성능 히스토리
- `WS /ws/alerts` - 실시간 알림
- `GET /api/alerts/history` - 알림 히스토리

### 대시보드 데이터
- `GET /api/dashboard/si` - SI 업체 대시보드 데이터
- `GET /api/dashboard/client` - 고객사 대시보드 데이터
- `GET /api/health` - 시스템 헬스 체크

## 🎯 분석 방법론

### 1. 상관관계 분석 (Correlation Analysis)
- Pearson 상관계수
- Spearman 순위 상관계수
- 히트맵 시각화

### 2. 피처 중요도 분석
- **Random Forest Feature Importance**
- **XGBoost Feature Importance**
- **SHAP (SHapley Additive exPlanations)**
- **Permutation Importance**

### 3. 통계적 유의성 검증
- **t-test** / **ANOVA**
- **p-value** 계산
- **95% 신뢰구간**
- **효과 크기** (Cohen's d)

### 4. 예측 시뮬레이션
- What-If 분석
- 민감도 분석
- 최적화 시뮬레이션

## 📊 보고서 구성

### Executive Summary
- 핵심 인사이트 3-5개
- 주요 개선 포인트
- 예상 ROI

### High Impact Features
- 상위 10개 중요 피처
- 각 피처의 통계적 근거
- 비즈니스 임팩트

### Low Impact Features
- 하위 피처 목록
- 개선/제거 제안
- 리소스 재배치 방안

### 상호작용 효과
- 시너지 효과 분석
- 세그먼트별 차이

### 예측 시뮬레이션
- What-If 시나리오
- 최적 조합 제안

### 액션 플랜
- 단기 실행 과제 (Quick Wins)
- 중장기 전략적 과제
- 우선순위 매트릭스

## 🔔 알림 시스템

### 알림 조건
| 지표 | 임계값 | 우선순위 |
|------|--------|----------|
| Accuracy | < 0.7 | 높음 |
| F1 Score 하락 | > 10% | 높음 |
| 추론 지연 | > 500ms | 중간 |
| 에러율 | > 5% | 높음 |
| 데이터 drift | 감지 | 중간 |

### 알림 방식
- **실시간 푸시** (WebSocket)
- **팝업 알림** (Element Plus)
- **이메일** (선택사항)
- **Slack 연동** (선택사항)

## 🚀 시작하기

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

**접속 URL:** http://localhost:3000

### Backend 실행 (다른 팀원 담당)

#### 1. Python 가상환경 생성
```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

#### 2. 필수 패키지 설치
```bash
pip install -r requirements.txt
```

#### 3. 서버 실행
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**API 접속 URL:** http://localhost:8000

## 📦 필수 패키지

### Frontend Dependencies
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0",
  "element-plus": "^2.5.0",
  "@element-plus/icons-vue": "^2.3.0",
  "axios": "^1.6.0",
  "chart.js": "^4.4.0",
  "vue-chartjs": "^5.3.0",
  "aos": "^2.3.4",
  "jspdf": "^2.5.2",
  "html2canvas": "^1.4.1"
}
```

### Backend Dependencies (requirements.txt)
```txt
# Web Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
websockets==12.0

# ML/DL
torch==2.1.2
numpy==1.26.3
pandas==2.1.4
scikit-learn==1.4.0

# MLOps
mlflow==2.10.0

# Data Processing
pyarrow==15.0.0

# Feature Analysis
shap==0.44.1
scipy==1.12.0

# PDF Generation (AI)
reportlab==4.0.9
matplotlib==3.8.2
seaborn==0.13.1

# Utils
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0

# CORS
python-cors==1.0.0
```

### Backend 폴더 구조 (참고용)
```
backend/
├── main.py                    # FastAPI 메인 엔트리포인트
├── requirements.txt           # 위 패키지 목록
├── config.py                  # 설정 (환경변수)
├── models/
│   ├── lstm_model.py         # LSTM + MLP 모델 정의
│   ├── trainer.py            # 학습 로직
│   └── predictor.py          # 추론 로직
├── analysis/
│   ├── feature_importance.py # Random Forest, XGBoost
│   ├── correlation.py        # 상관관계 분석
│   ├── shap_analysis.py      # SHAP 값 계산
│   └── statistical_test.py   # p-value, 신뢰구간
├── report/
│   ├── ai_generator.py       # 생성형 AI 보고서 (OpenAI/Claude)
│   ├── pdf_generator.py      # PDF 생성 (ReportLab)
│   └── templates/
│       └── report_template.html
├── monitoring/
│   ├── performance_tracker.py # 성능 추적
│   ├── alert_system.py       # 알림 시스템
│   └── websocket_handler.py  # WebSocket 핸들러
├── routers/
│   ├── upload.py             # 데이터 업로드 API
│   ├── training.py           # 학습 API
│   ├── report.py             # 보고서 API
│   └── monitoring.py         # 모니터링 API
└── utils/
    ├── data_validator.py     # 데이터 검증
    └── logger.py             # 로깅
```

## 📝 개발 가이드

### 컴포넌트 네이밍
- 페이지: `{Name}Page.vue` 또는 `{Name}Dashboard.vue`
- 컴포넌트: `{Feature}{Type}.vue` (예: `PerformanceChart.vue`)
- Composables: `use{Feature}.js`

### 상태 관리
- Pinia Store 사용
- 모듈별 분리 (notification, performance, auth)

### API 통신
- Axios Interceptor 활용
- 에러 핸들링 일관성

### WebSocket
- 자동 재연결
- 메시지 큐잉
- 에러 핸들링

## 🎨 디자인 시스템

### 컬러 팔레트
- Primary: #3498db (Blue)
- Success: #67c23a (Green)
- Warning: #e6a23c (Orange)
- Danger: #f56c6c (Red)
- Info: #909399 (Gray)

### 타이포그래피
- Heading: 'Helvetica Neue', Bold
- Body: 'Helvetica Neue', Regular
- Code: 'Monaco', Monospace

## 📄 라이선스
Proprietary - All Rights Reserved by SK AX

## 👥 Contact
- **회사**: SK AX (SK AI eXperience)
- **Email**: contact@sk-ax.com
- **전화**: 02-6400-0000
- **주소**: 서울특별시 중구 을지로 SK서린빌딩

## 🔗 Links
- [SK AX 공식 홈페이지](https://www.sk.com)
- [AI 솔루션 소개](https://www.sk.com/ai)
- [고객 문의](mailto:contact@sk-ax.com)
