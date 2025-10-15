# SK Planet AIOps - Backend 개발 가이드

## 🎯 개발 담당 사항

Frontend가 완성되어 있으므로, **Backend API만 구현하시면 됩니다!**

### 🎨 UI/UX 가이드라인
- **브랜드 컬러**: 모던 블루-퍼플 그라디언트 (#2563eb - #7c3aed) 중심
- **고객사**: SK Planet AIOps 서비스
- **서비스 제공**: SK AX

### ✅ Frontend에서 이미 구현된 것
- Vue 3 기반 완전한 UI/UX
- 라우팅, 상태 관리
- API 호출 로직 (axios)
- WebSocket 클라이언트
- PDF 생성 (클라이언트 측)
- Chart.js 시각화

### 🔧 Backend에서 구현할 것
1. REST API 엔드포인트 (FastAPI)
2. LSTM 모델 학습 및 추론
3. 피처 중요도 분석 (LIME model 사용)
4. 생성형 AI 보고서 생성
5. WebSocket 실시간 통신
6. 성능 모니터링 및 알림

## 🚀 Quick Start

### 1. 가상환경 생성 및 활성화

#### macOS (Apple Silicon - M1/M2/M3)
```bash
# ARM64 네이티브 모드로 가상환경 생성
arch -arm64 python3 -m venv venv

# 패키지 설치
arch -arm64 ./venv/bin/pip install --upgrade pip
arch -arm64 ./venv/bin/pip install -r requirements.txt

# 서버 실행 (간편 스크립트)
./start.sh
```

#### macOS (Intel) / Linux
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Windows
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 패키지 설치 (이미 위에서 완료)

### 3. 환경 변수 설정
`.env` 파일 생성:
```env
# Server
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# MLflow
MLFLOW_TRACKING_URI=./mlruns
MLFLOW_EXPERIMENT_NAME=ctr_prediction

# Model
MODEL_PATH=../models/model.pth
DATA_PATH=../data/CTR_60000_renamed.csv

# AI (Optional)
OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
```

### 4. 서버 실행
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📡 구현할 API 엔드포인트

### 필수 엔드포인트

#### 1. 데이터 업로드
```python
POST /api/upload
- Request: FormData (file: CSV)
- Response: {
    "file_id": "uuid",
    "filename": "data.csv",
    "rows": 60000,
    "columns": 119,
    "validation": {
      "isValid": true,
      "errors": [],
      "warnings": []
    },
    "info": {
      "totalRows": 60000,
      "clickedOne": 1150,
      "ctr": 1.92
    },
    "preview": [...],  # 처음 10행
    "columns": [...]
  }
```

#### 2. 모델 학습 시작
```python
POST /api/train
- Request: {
    "file_id": "uuid",
    "config": {
      "epochs": 10,
      "batch_size": 4096,
      "learning_rate": 0.001,
      "lstm_hidden": 64,
      "mlp_hidden": [256, 128],
      "dropout": 0.2
    }
  }
- Response: {
    "run_id": "mlflow_run_id",
    "status": "training"
  }
```

#### 3. 학습 상태 조회
```python
GET /api/train/status/{run_id}
- Response: {
    "status": "training|completed|failed",
    "current_epoch": 5,
    "total_epochs": 10,
    "metrics": {
      "train_loss": 0.23,
      "val_loss": 0.25,
      "train_accuracy": 0.85,
      "val_accuracy": 0.83
    }
  }
```

#### 4. 전체 학습 기록
```python
GET /api/train/runs
- Response: [
    {
      "run_id": "...",
      "created_at": "2025-10-15T10:30:00",
      "status": "completed",
      "accuracy": 0.875,
      "file_id": "..."
    },
    ...
  ]
```

#### 5. AI 생성 보고서 데이터
```python
GET /api/report/ai/{run_id}
- Response: {
    "summary": "AI 생성 텍스트...",
    "accuracy": 87.5,
    "roiIncrease": 25,
    "additionalRevenue": 1.25,
    "topFeatures": [...],
    "aiInsights": [...],
    "actionPlan": [...]
  }
```

#### 6. 피처 중요도 분석
```python
GET /api/report/feature-importance/{run_id}
- Response: [
    {
      "feature": "hour",
      "importance": 0.342,
      "pValue": 0.0001,
      "ci": [0.31, 0.37],
      "description": "시간대 (한글명)"
    },
    ...
  ]
```

#### 7. 상관관계 분석
```python
GET /api/report/correlation/{run_id}
- Response: {
    "features": ["hour", "age_group", ...],
    "matrix": [
      [1.0, 0.12, ...],
      [0.12, 1.0, ...],
      ...
    ]
  }
```

#### 8. AI 생성 PDF
```python
POST /api/report/generate-pdf/{run_id}
- Request: {
    "includeCharts": true,
    "includeInsights": true,
    "includeActionPlan": true
  }
- Response: {
    "pdf_url": "/api/report/pdf/{run_id}",
    "status": "generated"
  }

GET /api/report/pdf/{run_id}
- Response: Binary PDF file (application/pdf)
```

#### 9. 성능 모니터링
```python
GET /api/performance/{run_id}
- Response: {
    "accuracy": 0.875,
    "precision": 0.851,
    "recall": 0.843,
    "f1_score": 0.847,
    "response_time": 85
  }

GET /api/dashboard/si
- Response: SI 대시보드용 데이터

GET /api/dashboard/client
- Response: 고객사 대시보드용 데이터
```

### WebSocket 엔드포인트

#### 1. 학습 실시간 모니터링
```python
WS /ws/training/{run_id}

# 서버 → 클라이언트 메시지
{
  "type": "epoch_update",
  "epoch": 5,
  "metrics": {
    "train_loss": 0.23,
    "val_loss": 0.25,
    "train_accuracy": 0.85,
    "val_accuracy": 0.83
  }
}

{
  "type": "training_complete",
  "metrics": {...}
}

{
  "type": "log",
  "message": "Epoch 5/10 완료"
}
```

#### 2. 성능 알림
```python
WS /ws/performance

{
  "type": "metrics_update",
  "metrics": {
    "accuracy": 0.68,  # < 0.7이면 경고
    "response_time": 520  # > 500이면 경고
  }
}

{
  "type": "system_health",
  "health": {
    "cpu_usage": 45,
    "memory_usage": 62,
    "api_success_rate": 99.2,
    "error_rate": 0.8
  }
}
```

## 🧪 모델 학습 로직 (lstm_model.ipynb 기반)

`/Users/jangsomin/workspace/lstm_model.ipynb` 파일을 Python 스크립트로 변환하세요.

**핵심 클래스:**
```python
class TabularSeqModel(nn.Module):
    def __init__(self, d_features, lstm_hidden=64, hidden_units=[256, 128], dropout=0.2):
        # LSTM + MLP 구조
        
class ClickDataset(Dataset):
    # 데이터셋 정의
    
def train_model(train_df, config):
    # 학습 로직
```

**사용할 데이터:**
- 파일: `CTR_60000.csv` (이미 압축 해제됨)
- 피처 매핑: `/Users/jangsomin/workspace/sample/feature_name_mapping.csv`

## 📊 피처 분석 구현

### 1. Feature Importance (Random Forest)
```python
from sklearn.ensemble import RandomForestClassifier

def calculate_feature_importance(X, y, feature_names):
    rf = RandomForestClassifier(n_estimators=100)
    rf.fit(X, y)
    
    importance = pd.DataFrame({
        'feature': feature_names,
        'importance': rf.feature_importances_
    }).sort_values('importance', ascending=False)
    
    return importance
```

### 2. SHAP Analysis
```python
import shap

def calculate_shap_values(model, X, feature_names):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    
    return shap_values, feature_names
```

### 3. Statistical Significance
```python
from scipy import stats

def calculate_statistical_significance(feature_values, target):
    # t-test
    t_stat, p_value = stats.ttest_ind(
        feature_values[target == 1],
        feature_values[target == 0]
    )
    
    # 신뢰구간
    ci = stats.t.interval(0.95, len(feature_values)-1, 
                          loc=np.mean(feature_values), 
                          scale=stats.sem(feature_values))
    
    return {
        'p_value': p_value,
        'ci': ci,
        'is_significant': p_value < 0.05
    }
```

## 🤖 생성형 AI 보고서 (선택사항)

OpenAI API 또는 Claude API를 사용하여 자연어 인사이트 생성:

```python
import openai

def generate_ai_insights(feature_importance, metrics):
    prompt = f"""
    다음 CTR 예측 모델 분석 결과를 바탕으로 마케팅 인사이트를 작성하세요:
    
    - 모델 정확도: {metrics['accuracy']}%
    - 상위 3개 중요 피처: {feature_importance[:3]}
    
    다음 형식으로 작성:
    1. 핵심 인사이트 (3-5개)
    2. 실행 가능한 마케팅 전략 (3개)
    3. 예상 ROI 증대 효과
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

## 📄 PDF 생성 (ReportLab)

```python
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf_report(report_data, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # 제목
    story.append(Paragraph("SK AX - CTR AI Analysis Report", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Executive Summary
    story.append(Paragraph("Executive Summary", styles['Heading1']))
    story.append(Paragraph(report_data['summary'], styles['BodyText']))
    
    # ... 나머지 섹션
    
    doc.build(story)
```

## 🔔 실시간 알림 시스템

```python
from fastapi import WebSocket

async def performance_monitor(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        # 성능 지표 체크
        metrics = get_current_metrics()
        
        if metrics['accuracy'] < 0.7:
            await websocket.send_json({
                "type": "performance_alert",
                "severity": "high",
                "message": "Accuracy dropped below 0.7",
                "metrics": metrics
            })
        
        await asyncio.sleep(10)  # 10초마다 체크
```

## 📂 Frontend API 호출 위치

Frontend에서 API를 호출하는 파일:
- `/frontend/src/api/index.js` - 모든 API 함수 정의됨
- `/frontend/src/views/*.vue` - 각 페이지에서 API 사용

**Frontend 코드를 참고**하여 Response 형식을 맞추시면 됩니다!

## 🧪 테스트

```bash
# API 테스트
pytest tests/

# 특정 엔드포인트 테스트
curl http://localhost:8000/api/health

# WebSocket 테스트
wscat -c ws://localhost:8000/ws/training/test-run-id
```

## 📌 중요 참고 사항

1. **모델 파일 위치**: `/Users/jangsomin/workspace/lstm_model.ipynb`
2. **데이터 파일**: `/Users/jangsomin/workspace/CTR_60000.csv`
3. **피처 매핑**: `/Users/jangsomin/workspace/sample/feature_name_mapping.csv`
4. **Frontend 실행 중**: http://localhost:3000
5. **Backend 포트**: 8000 (vite.config.js에서 proxy 설정됨)

## 🤝 Frontend-Backend 협업

1. **CORS 설정 필수**
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Response 형식 통일**
   - Frontend의 `/frontend/src/api/index.js` 참고
   - 각 API 함수의 기대 Response 형식이 명시되어 있음

3. **WebSocket 프로토콜**
   - Frontend는 `/composables/useWebSocket.js`에서 자동 재연결 구현됨
   - JSON 형식으로 통신

## 💡 개발 팁

1. **단계별 구현 권장 순서**:
   - ① Health Check API (`GET /api/health`)
   - ② 데이터 업로드 (`POST /api/upload`)
   - ③ 모델 학습 (`POST /api/train`)
   - ④ 학습 상태 조회 (`GET /api/train/status`)
   - ⑤ WebSocket 학습 모니터링
   - ⑥ 보고서 데이터 API
   - ⑦ PDF 생성
   - ⑧ 피처 분석 API
   - ⑨ 대시보드 데이터 API

2. **Mock 데이터로 시작**:
   - 먼저 Mock 데이터로 API 구조 완성
   - 이후 실제 모델/분석 로직 연결

3. **Frontend 확인**:
   ```bash
   # Frontend가 실행 중인지 확인
   curl http://localhost:3000
   
   # Backend API 호출 테스트
   curl http://localhost:8000/api/health
   ```

## 🆘 문의

Frontend 개발자와 협업 필요시:
- API 명세 변경: `/frontend/src/api/index.js` 참고
- Response 형식: Vue 컴포넌트에서 사용 방식 확인
- WebSocket: `/frontend/src/composables/useWebSocket.js` 참고

화이팅! 🚀

