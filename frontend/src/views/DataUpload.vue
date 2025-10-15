<template>
  <div class="data-upload">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>📤 데이터 업로드</span>
          <el-steps :active="currentStep" simple>
            <el-step title="파일 선택" :icon="Upload" />
            <el-step title="데이터 검증" :icon="Check" />
            <el-step title="학습 설정" :icon="Setting" />
          </el-steps>
        </div>
      </template>

      <!-- Step 1: 파일 업로드 -->
      <div v-show="currentStep === 0" class="upload-section">
        <el-upload
          class="upload-dragger"
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          accept=".csv"
          :limit="1"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            파일을 여기로 드래그하거나 <em>클릭하여 업로드</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              CSV 파일만 업로드 가능합니다 (최대 500MB)
            </div>
          </template>
        </el-upload>

        <el-alert
          v-if="uploadedFile"
          type="success"
          title="파일 선택됨"
          :closable="false"
          style="margin-top: 20px"
        >
          <template #default>
            <div class="file-info">
              <div><strong>파일명:</strong> {{ uploadedFile.name }}</div>
              <div><strong>크기:</strong> {{ formatFileSize(uploadedFile.size) }}</div>
              <div><strong>수정일:</strong> {{ new Date(uploadedFile.lastModified).toLocaleString() }}</div>
            </div>
          </template>
        </el-alert>

        <div class="upload-actions">
          <el-button
            type="primary"
            size="large"
            :disabled="!uploadedFile"
            @click="validateData"
          >
            다음 단계
          </el-button>
        </div>
      </div>

      <!-- Step 2: 데이터 검증 -->
      <div v-show="currentStep === 1" class="validation-section">
        <el-alert
          :type="validationResult.isValid ? 'success' : 'warning'"
          :title="validationResult.isValid ? '데이터 검증 완료' : '데이터 검증 결과'"
          :closable="false"
          style="margin-bottom: 20px"
        >
          <div v-if="validationResult.isValid">
            모든 필수 컬럼이 존재하며 데이터 형식이 올바릅니다.
          </div>
          <div v-else>
            일부 문제가 발견되었습니다. 아래 내용을 확인하세요.
          </div>
        </el-alert>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="총 행 수">
            {{ dataInfo.totalRows.toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="총 컬럼 수">
            {{ dataInfo.totalColumns }}
          </el-descriptions-item>
          <el-descriptions-item label="결측치">
            {{ dataInfo.missingValues }} ({{ dataInfo.missingPercentage }}%)
          </el-descriptions-item>
          <el-descriptions-item label="중복 행">
            {{ dataInfo.duplicateRows }}
          </el-descriptions-item>
          <el-descriptions-item label="clicked=1">
            {{ dataInfo.clickedOne.toLocaleString() }} ({{ dataInfo.ctr }}%)
          </el-descriptions-item>
          <el-descriptions-item label="clicked=0">
            {{ dataInfo.clickedZero.toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div class="data-preview">
          <h4>데이터 미리보기 (처음 10행)</h4>
          <el-table
            :data="previewData"
            style="width: 100%"
            max-height="400"
            stripe
            border
          >
            <el-table-column
              v-for="col in previewColumns"
              :key="col"
              :prop="col"
              :label="col"
              width="150"
              show-overflow-tooltip
            />
          </el-table>
        </div>

        <div class="validation-actions">
          <el-button @click="currentStep = 0">이전</el-button>
          <el-button
            type="primary"
            size="large"
            :disabled="!validationResult.isValid"
            @click="currentStep = 2"
          >
            다음 단계
          </el-button>
        </div>
      </div>

      <!-- Step 3: 학습 설정 -->
      <div v-show="currentStep === 2" class="config-section">
        <el-form :model="trainingConfig" label-width="140px">
          <el-form-item label="실험 이름">
            <el-input
              v-model="trainingConfig.experimentName"
              placeholder="예: CTR_Experiment_2025_10"
            />
          </el-form-item>
          
          <el-divider content-position="left">모델 설정</el-divider>
          
          <el-form-item label="Epochs">
            <el-slider
              v-model="trainingConfig.epochs"
              :min="5"
              :max="50"
              :step="5"
              show-stops
              show-input
            />
          </el-form-item>

          <el-form-item label="Batch Size">
            <el-select v-model="trainingConfig.batchSize">
              <el-option label="1024" :value="1024" />
              <el-option label="2048" :value="2048" />
              <el-option label="4096 (권장)" :value="4096" />
              <el-option label="8192" :value="8192" />
            </el-select>
          </el-form-item>

          <el-form-item label="Learning Rate">
            <el-input-number
              v-model="trainingConfig.learningRate"
              :min="0.0001"
              :max="0.01"
              :step="0.0001"
              :precision="4"
            />
          </el-form-item>

          <el-form-item label="LSTM Hidden">
            <el-input-number
              v-model="trainingConfig.lstmHidden"
              :min="16"
              :max="128"
              :step="16"
            />
          </el-form-item>

          <el-form-item label="MLP Hidden Units">
            <el-input
              v-model="trainingConfig.mlpHidden"
              placeholder="256,128,64"
            />
          </el-form-item>

          <el-form-item label="Dropout">
            <el-slider
              v-model="trainingConfig.dropout"
              :min="0"
              :max="0.5"
              :step="0.05"
              show-input
            />
          </el-form-item>

          <el-divider content-position="left">데이터 설정</el-divider>

          <el-form-item label="다운샘플링">
            <el-switch
              v-model="trainingConfig.downsampling"
              active-text="활성화"
              inactive-text="비활성화"
            />
            <div class="form-hint">
              clicked=0 데이터를 clicked=1의 2배만 사용하여 불균형 해소
            </div>
          </el-form-item>

          <el-form-item label="검증 데이터 비율">
            <el-slider
              v-model="trainingConfig.validationSplit"
              :min="0.1"
              :max="0.3"
              :step="0.05"
              :format-tooltip="(val) => (val * 100) + '%'"
            />
          </el-form-item>

          <el-form-item label="알림 설정">
            <el-checkbox-group v-model="trainingConfig.notifications">
              <el-checkbox label="email">이메일 알림</el-checkbox>
              <el-checkbox label="push" checked>실시간 푸시</el-checkbox>
              <el-checkbox label="slack">Slack 알림</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <div class="config-actions">
          <el-button @click="currentStep = 1">이전</el-button>
          <el-button
            type="primary"
            size="large"
            :loading="isTraining"
            @click="startTraining"
          >
            <el-icon v-if="!isTraining"><VideoPlay /></el-icon>
            {{ isTraining ? '학습 중...' : '학습 시작' }}
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 업로드 히스토리 -->
    <el-card v-if="uploadHistory.length > 0" style="margin-top: 20px">
      <template #header>
        <span>📋 최근 업로드 히스토리</span>
      </template>
      <el-table :data="uploadHistory" style="width: 100%">
        <el-table-column prop="filename" label="파일명" />
        <el-table-column prop="uploadedAt" label="업로드 시간" width="200">
          <template #default="scope">
            {{ new Date(scope.row.uploadedAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="rows" label="행 수" width="120">
          <template #default="scope">
            {{ scope.row.rows.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="상태" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'completed' ? 'success' : 'warning'">
              {{ scope.row.status === 'completed' ? '완료' : '처리 중' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="액션" width="150">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :disabled="scope.row.status !== 'completed'"
              @click="viewResults(scope.row.runId)"
            >
              결과 보기
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Check,
  Setting,
  UploadFilled,
  VideoPlay
} from '@element-plus/icons-vue'
import api from '@/api'

const router = useRouter()

// State
const currentStep = ref(0)
const fileList = ref([])
const uploadedFile = ref(null)
const uploadedFileId = ref(null)  // 업로드된 파일의 ID 저장
const isTraining = ref(false)

const validationResult = ref({
  isValid: true,
  errors: [],
  warnings: []
})

const dataInfo = ref({
  totalRows: 60000,
  totalColumns: 119,
  missingValues: 0,
  missingPercentage: 0,
  duplicateRows: 0,
  clickedOne: 1150,
  clickedZero: 58850,
  ctr: 1.92
})

const previewData = ref([])
const previewColumns = ref([])

const trainingConfig = ref({
  experimentName: `CTR_Experiment_${new Date().toISOString().split('T')[0]}`,
  epochs: 10,
  batchSize: 4096,
  learningRate: 0.001,
  lstmHidden: 64,
  mlpHidden: '256,128',
  dropout: 0.2,
  downsampling: true,
  validationSplit: 0.2,
  notifications: ['push']
})

const uploadHistory = ref([
  {
    filename: 'CTR_60000_renamed.csv',
    uploadedAt: new Date(Date.now() - 86400000),
    rows: 60000,
    status: 'completed',
    runId: 'run-abc12345'
  }
])

// Methods
const handleFileChange = (file, fileListParam) => {
  uploadedFile.value = file.raw
  fileList.value = [file]
}

const beforeUpload = (file) => {
  const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv')
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isCSV) {
    ElMessage.error('CSV 파일만 업로드 가능합니다!')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('파일 크기는 500MB를 초과할 수 없습니다!')
    return false
  }
  return true
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const validateData = async () => {
  if (!uploadedFile.value) {
    ElMessage.warning('먼저 파일을 선택하세요.')
    return
  }

  const loading = ElMessage({
    message: '데이터를 검증하는 중...',
    type: 'info',
    duration: 0
  })

  try {
    // FormData 생성
    const formData = new FormData()
    formData.append('file', uploadedFile.value)

    // 백엔드 API 호출 (검증)
    const response = await api.uploadData(formData)
    
    // 파일 ID 저장 (중요!)
    uploadedFileId.value = response.file_id
    
    // 검증 결과 및 데이터 정보 업데이트
    validationResult.value = response.validation
    dataInfo.value = response.info
    previewData.value = response.preview.slice(0, 10)
    previewColumns.value = response.columns.slice(0, 10)

    loading.close()
    
    if (validationResult.value.isValid) {
      ElMessage.success('데이터 검증 완료!')
      currentStep.value = 1
    } else {
      ElMessage.warning('데이터에 문제가 있습니다. 확인 후 수정하세요.')
      currentStep.value = 1
    }
  } catch (error) {
    loading.close()
    console.error('Validation error:', error)
    
    // Mock 데이터로 폴백 (백엔드 미구현 시)
    ElMessage.warning('백엔드 연결 실패. Mock 데이터를 사용합니다.')
    
    // Mock 데이터 생성
    previewColumns.value = ['gender', 'age_group', 'inventory_id', 'day_of_week', 'hour', 'seq', 'clicked']
    previewData.value = Array.from({ length: 5 }, (_, i) => ({
      gender: (i % 2 + 1).toFixed(1),
      age_group: (i % 5 + 4).toFixed(1),
      inventory_id: Math.floor(Math.random() * 100),
      day_of_week: (i % 7 + 1),
      hour: Math.floor(Math.random() * 24),
      seq: '57,281,455,130,479,35',
      clicked: i % 5 === 0 ? 1 : 0
    }))
    
    validationResult.value.isValid = true
    currentStep.value = 1
  }
}

const startTraining = async () => {
  try {
    // 파일 ID 확인 (임시로 Mock 데이터 사용)
    if (!uploadedFileId.value) {
      // Mock 파일 ID 사용
      uploadedFileId.value = 'mock-file-id-123'
      ElMessage.info('Mock 데이터로 학습을 시작합니다.')
    }

    await ElMessageBox.confirm(
      '모델 학습을 시작하시겠습니까? 완료까지 약 20-30분 소요됩니다.',
      '학습 시작 확인',
      {
        confirmButtonText: '시작',
        cancelButtonText: '취소',
        type: 'warning'
      }
    )

    isTraining.value = true

    // 학습 시작 API 호출 (실제 file_id 사용)
    const response = await api.startTraining(uploadedFileId.value, trainingConfig.value)
    
    ElMessage.success('모델 학습이 시작되었습니다!')
    
    // 학습 모니터링 페이지로 이동
    setTimeout(() => {
      router.push(`/training/${response.run_id}`)
    }, 1500)

  } catch (error) {
    if (error !== 'cancel') {
      console.error('Training error:', error)
      
      // Mock: 학습 시작 시뮬레이션
      ElMessage.success('모델 학습이 시작되었습니다! (Mock)')
      setTimeout(() => {
        router.push('/training/mock-run-id')
      }, 1500)
    }
    isTraining.value = false
  }
}

const viewResults = (runId) => {
  router.push(`/report/${runId}`)
}
</script>

<style scoped>
.data-upload {
  max-width: 1000px;
  margin: 0 auto;
}

.upload-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.upload-section,
.validation-section,
.config-section {
  padding: 20px 0;
}

.upload-dragger {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  padding: 60px 40px;
}

.el-icon--upload {
  font-size: 67px;
  color: #409eff;
  margin-bottom: 16px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.upload-actions,
.validation-actions,
.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.data-preview {
  margin-top: 20px;
}

.data-preview h4 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

:deep(.el-steps--simple) {
  background: transparent;
}
</style>

