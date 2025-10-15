import axios from 'axios'

const API_BASE_URL = 'https://ctr-aiops-backend.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default {
  // 데이터 업로드
  uploadData(formData) {
    return api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 모델 학습 시작
  startTraining(fileId, config = {}) {
    return api.post('/api/train', { file_id: fileId, config })
  },

  // 학습 상태 조회
  getTrainingStatus(runId) {
    return api.get(`/api/train/status/${runId}`)
  },

  // 모든 학습 기록 조회
  getAllRuns() {
    return api.get('/api/train/runs')
  },

  // 고객사 보고서 조회
  getClientReport(runId) {
    return api.get(`/api/report/client/${runId}`)
  },

  // SI사 보고서 조회
  getSIReport(runId) {
    return api.get(`/api/report/si/${runId}`)
  },

  // 모델 평가 메트릭 조회
  getModelMetrics(runId) {
    return api.get(`/api/metrics/${runId}`)
  },

  // Feature Importance 조회
  getFeatureImportance(runId) {
    return api.get(`/api/features/${runId}`)
  },

  // AI 생성 보고서 전체 데이터 조회
  getAIReport(runId) {
    return api.get(`/api/report/ai/${runId}`)
  },

  // PDF 보고서 생성 요청 (백엔드 AI 생성)
  generatePDFReport(runId, options = {}) {
    return api.post(`/api/report/generate-pdf/${runId}`, options)
  },

  // PDF 보고서 다운로드
  downloadPDFReport(runId) {
    return api.get(`/api/report/pdf/${runId}`, {
      responseType: 'blob'
    })
  }
}

