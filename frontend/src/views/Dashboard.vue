<template>
  <div class="dashboard">
    <!-- 통계 카드 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #409eff20">
              <el-icon :size="32" color="#409eff"><DataAnalysis /></el-icon>
            </div>
            <div class="stat-text">
              <div class="stat-value">{{ totalRuns }}</div>
              <div class="stat-label">총 학습 횟수</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #67c23a20">
              <el-icon :size="32" color="#67c23a"><Checked /></el-icon>
            </div>
            <div class="stat-text">
              <div class="stat-value">{{ completedRuns }}</div>
              <div class="stat-label">완료된 학습</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f56c6c20">
              <el-icon :size="32" color="#f56c6c"><TrendCharts /></el-icon>
            </div>
            <div class="stat-text">
              <div class="stat-value">{{ bestAccuracy }}%</div>
              <div class="stat-label">최고 정확도</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #e6a23c20">
              <el-icon :size="32" color="#e6a23c"><Files /></el-icon>
            </div>
            <div class="stat-text">
              <div class="stat-value">{{ datasetCount }}</div>
              <div class="stat-label">업로드된 데이터셋</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 최근 학습 기록 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>최근 학습 기록</span>
              <el-button type="primary" size="small" @click="goToTraining">
                새 학습 시작
              </el-button>
            </div>
          </template>
          <el-table :data="recentRuns" style="width: 100%" v-loading="loading">
            <el-table-column prop="run_id" label="Run ID" width="120">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.run_id.slice(0, 8) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="생성 시간" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="상태" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="accuracy" label="정확도" width="100">
              <template #default="scope">
                {{ scope.row.accuracy ? scope.row.accuracy.toFixed(2) + '%' : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="액션" width="200">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  :icon="View"
                  @click="viewReport(scope.row.run_id, 'client')"
                >
                  고객사 보고서
                </el-button>
                <el-button
                  size="small"
                  :icon="View"
                  @click="viewReport(scope.row.run_id, 'si')"
                >
                  SI사 보고서
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 최근 활동 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>최근 활동</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  DataAnalysis,
  Checked,
  TrendCharts,
  Files,
  View
} from '@element-plus/icons-vue'
import api from '@/api'

const router = useRouter()

// 통계 데이터
const totalRuns = ref(0)
const completedRuns = ref(0)
const bestAccuracy = ref(0)
const datasetCount = ref(0)

// 최근 학습 기록
const recentRuns = ref([])
const loading = ref(false)

// 최근 활동
const activities = ref([
  { timestamp: '2025-10-15 14:30', content: '새로운 데이터셋 업로드 완료' },
  { timestamp: '2025-10-15 13:45', content: '모델 학습 완료 (Run ID: abc12345)' },
  { timestamp: '2025-10-15 11:20', content: '고객사 보고서 생성' },
  { timestamp: '2025-10-14 16:00', content: '시스템 점검 완료' }
])

// 데이터 로드
const loadDashboardData = async () => {
  loading.value = true
  try {
    const runs = await api.getAllRuns()
    recentRuns.value = runs.slice(0, 5) // 최근 5개
    totalRuns.value = runs.length
    completedRuns.value = runs.filter(r => r.status === 'completed').length
    bestAccuracy.value = Math.max(...runs.map(r => r.accuracy || 0))
    datasetCount.value = new Set(runs.map(r => r.file_id)).size
  } catch (error) {
    ElMessage.error('데이터를 불러오는데 실패했습니다.')
    // Mock 데이터로 폴백
    recentRuns.value = mockRuns()
    totalRuns.value = 15
    completedRuns.value = 12
    bestAccuracy.value = 87.5
    datasetCount.value = 8
  } finally {
    loading.value = false
  }
}

// Mock 데이터
const mockRuns = () => [
  { run_id: 'abc12345678', created_at: new Date(), status: 'completed', accuracy: 87.5 },
  { run_id: 'def98765432', created_at: new Date(Date.now() - 86400000), status: 'completed', accuracy: 85.2 },
  { run_id: 'ghi55544332', created_at: new Date(Date.now() - 172800000), status: 'training', accuracy: null },
  { run_id: 'jkl11122233', created_at: new Date(Date.now() - 259200000), status: 'failed', accuracy: null },
  { run_id: 'mno99988877', created_at: new Date(Date.now() - 345600000), status: 'completed', accuracy: 83.8 }
]

// 헬퍼 함수
const formatDate = (date) => {
  return new Date(date).toLocaleString('ko-KR')
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    training: 'warning',
    failed: 'danger',
    pending: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    completed: '완료',
    training: '학습 중',
    failed: '실패',
    pending: '대기 중'
  }
  return texts[status] || status
}

const goToTraining = () => {
  router.push('/upload')
}

const viewReport = (runId, type) => {
  router.push(`/report/${type}/${runId}`)
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-text {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
</style>

