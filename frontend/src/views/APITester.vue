<template>
  <div class="api-tester">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>🔧 API 테스터 & 문서</span>
          <el-tag type="info">Backend: {{ backendUrl }}</el-tag>
        </div>
      </template>

      <!-- Swagger UI 임베드 -->
      <div class="swagger-container">
        <iframe 
          :src="swaggerUrl" 
          frameborder="0"
          width="100%"
          height="800px"
        ></iframe>
      </div>

      <!-- 직접 API 테스트 섹션 -->
      <el-divider>또는 직접 테스트</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <span>📤 데이터 업로드 테스트</span>
            </template>
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleTestUpload"
              accept=".csv"
            >
              <el-button type="primary">파일 선택</el-button>
            </el-upload>
            <el-button 
              v-if="testFile"
              type="success" 
              @click="testUploadAPI"
              style="margin-top: 10px; width: 100%"
            >
              업로드 API 테스트
            </el-button>
            <div v-if="uploadResult" class="result-box">
              <pre>{{ JSON.stringify(uploadResult, null, 2) }}</pre>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <span>🏃 학습 시작 테스트</span>
            </template>
            <el-form label-width="100px">
              <el-form-item label="File ID">
                <el-input v-model="testFileId" placeholder="파일 ID 입력" />
              </el-form-item>
              <el-form-item label="Epochs">
                <el-input-number v-model="testEpochs" :min="1" :max="50" />
              </el-form-item>
            </el-form>
            <el-button 
              type="success" 
              @click="testTrainingAPI"
              style="width: 100%"
            >
              학습 시작 API 테스트
            </el-button>
            <div v-if="trainingResult" class="result-box">
              <pre>{{ JSON.stringify(trainingResult, null, 2) }}</pre>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <span>📊 학습 목록 조회</span>
            </template>
            <el-button 
              type="primary" 
              @click="testGetRuns"
              style="width: 100%"
            >
              학습 목록 API 테스트
            </el-button>
            <div v-if="runsResult" class="result-box">
              <pre>{{ JSON.stringify(runsResult, null, 2) }}</pre>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <span>💊 Health Check</span>
            </template>
            <el-button 
              type="success" 
              @click="testHealthAPI"
              style="width: 100%"
            >
              Health Check API 테스트
            </el-button>
            <div v-if="healthResult" class="result-box">
              <pre>{{ JSON.stringify(healthResult, null, 2) }}</pre>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const backendUrl = 'https://ctr-aiops-backend.onrender.com'
const swaggerUrl = computed(() => `${backendUrl}/docs`)

// 테스트 데이터
const testFile = ref(null)
const testFileId = ref('')
const testEpochs = ref(10)

// 결과 데이터
const uploadResult = ref(null)
const trainingResult = ref(null)
const runsResult = ref(null)
const healthResult = ref(null)

// 파일 업로드 테스트
const handleTestUpload = (file) => {
  testFile.value = file.raw
  ElMessage.info(`파일 선택됨: ${file.name}`)
}

const testUploadAPI = async () => {
  try {
    const formData = new FormData()
    formData.append('file', testFile.value)
    
    uploadResult.value = { status: 'loading...' }
    const response = await api.uploadData(formData)
    uploadResult.value = response
    testFileId.value = response.file_id
    ElMessage.success('업로드 성공!')
  } catch (error) {
    uploadResult.value = { error: error.message, details: error.response?.data }
    ElMessage.error('업로드 실패: ' + error.message)
  }
}

// 학습 시작 테스트
const testTrainingAPI = async () => {
  try {
    if (!testFileId.value) {
      ElMessage.warning('먼저 파일 ID를 입력하세요')
      return
    }
    
    trainingResult.value = { status: 'loading...' }
    const response = await api.startTraining(testFileId.value, {
      experimentName: 'API_Test',
      epochs: testEpochs.value,
      batchSize: 4096,
      learningRate: 0.001
    })
    trainingResult.value = response
    ElMessage.success('학습 시작 성공!')
  } catch (error) {
    trainingResult.value = { error: error.message, details: error.response?.data }
    ElMessage.error('학습 시작 실패: ' + error.message)
  }
}

// 학습 목록 조회 테스트
const testGetRuns = async () => {
  try {
    runsResult.value = { status: 'loading...' }
    const response = await api.getTrainingRuns()
    runsResult.value = response
    ElMessage.success('조회 성공!')
  } catch (error) {
    runsResult.value = { error: error.message, details: error.response?.data }
    ElMessage.error('조회 실패: ' + error.message)
  }
}

// Health Check 테스트
const testHealthAPI = async () => {
  try {
    healthResult.value = { status: 'loading...' }
    const response = await fetch(`${backendUrl}/api/health`)
    const data = await response.json()
    healthResult.value = { status: response.status, data }
    ElMessage.success('Health Check 성공!')
  } catch (error) {
    healthResult.value = { error: error.message }
    ElMessage.error('Health Check 실패: ' + error.message)
  }
}
</script>

<style scoped>
.api-tester {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.swagger-container {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.result-box {
  margin-top: 15px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.result-box pre {
  margin: 0;
  font-size: 12px;
  color: #303133;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

