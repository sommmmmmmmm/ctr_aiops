<template>
  <div class="si-dashboard">
    <!-- 헤더 통계 카드 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon accuracy">
              <el-icon :size="28"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ currentMetrics.accuracy }}%</div>
              <div class="stat-label">Accuracy</div>
              <div class="stat-change" :class="getChangeClass(accuracyChange)">
                {{ accuracyChange > 0 ? '+' : '' }}{{ accuracyChange }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon precision">
              <el-icon :size="28"><DataAnalysis /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ currentMetrics.precision.toFixed(3) }}</div>
              <div class="stat-label">Precision</div>
              <div class="stat-detail">F1: {{ currentMetrics.f1Score.toFixed(3) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon latency">
              <el-icon :size="28"><Timer /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ currentMetrics.responseTime }}ms</div>
              <div class="stat-label">응답 시간</div>
              <div class="stat-detail">Avg: {{ avgResponseTime }}ms</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon health">
              <el-icon :size="28"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ systemHealth.status }}</div>
              <div class="stat-label">시스템 상태</div>
              <div class="stat-detail">가동시간: {{ uptime }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 성능 그래프 및 시스템 헬스 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>실시간 성능 모니터링</span>
              <el-radio-group v-model="performanceChartType" size="small">
                <el-radio-button label="accuracy">Accuracy</el-radio-button>
                <el-radio-button label="loss">Loss</el-radio-button>
                <el-radio-button label="f1">F1</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <PerformanceChart
            v-if="performanceData"
            :data="performanceData"
            :type="performanceChartType"
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>시스템 헬스</span>
          </template>
          <div class="health-monitors">
            <div class="health-item">
              <div class="health-label">
                <el-icon><Cpu /></el-icon>
                <span>CPU 사용률</span>
              </div>
              <el-progress
                :percentage="systemHealth.cpuUsage"
                :status="getProgressStatus(systemHealth.cpuUsage)"
              />
            </div>
            <div class="health-item">
              <div class="health-label">
                <el-icon><Memo /></el-icon>
                <span>메모리 사용률</span>
              </div>
              <el-progress
                :percentage="systemHealth.memoryUsage"
                :status="getProgressStatus(systemHealth.memoryUsage)"
              />
            </div>
            <div class="health-item">
              <div class="health-label">
                <el-icon><Connection /></el-icon>
                <span>API 응답률</span>
              </div>
              <el-progress
                :percentage="systemHealth.apiSuccessRate"
                :status="systemHealth.apiSuccessRate > 95 ? 'success' : 'warning'"
              />
            </div>
            <div class="health-item">
              <div class="health-label">
                <el-icon><Warning /></el-icon>
                <span>에러율</span>
              </div>
              <el-progress
                :percentage="systemHealth.errorRate"
                :status="systemHealth.errorRate < 5 ? 'success' : 'exception'"
                :color="customColors"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 기술 지표 및 로그 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>모델 학습 지표</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Run ID">
              <el-tag size="small">{{ latestRun.runId }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="학습 시간">
              {{ latestRun.trainingTime }}분
            </el-descriptions-item>
            <el-descriptions-item label="Epoch">
              {{ latestRun.epochs }}
            </el-descriptions-item>
            <el-descriptions-item label="Batch Size">
              {{ latestRun.batchSize }}
            </el-descriptions-item>
            <el-descriptions-item label="Learning Rate">
              {{ latestRun.learningRate }}
            </el-descriptions-item>
            <el-descriptions-item label="Optimizer">
              {{ latestRun.optimizer }}
            </el-descriptions-item>
            <el-descriptions-item label="최종 Loss">
              {{ latestRun.finalLoss.toFixed(4) }}
            </el-descriptions-item>
            <el-descriptions-item label="최고 Accuracy">
              {{ latestRun.bestAccuracy }}%
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>최근 에러 로그</span>
              <el-button size="small" @click="refreshLogs">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="error-logs">
            <div
              v-for="(log, index) in errorLogs"
              :key="index"
              class="log-item"
              :class="`log-${log.level}`"
            >
              <div class="log-header">
                <el-tag :type="getLogType(log.level)" size="small">{{ log.level }}</el-tag>
                <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              </div>
              <div class="log-message">{{ log.message }}</div>
              <div v-if="log.stack" class="log-stack">
                <el-collapse>
                  <el-collapse-item title="Stack Trace" name="1">
                    <pre>{{ log.stack }}</pre>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <el-empty v-if="errorLogs.length === 0" description="에러 없음" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 성능 병목 구간 분석 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>성능 병목 구간 분석</span>
          </template>
          <el-table :data="bottleneckAnalysis" style="width: 100%">
            <el-table-column prop="component" label="컴포넌트" width="200" />
            <el-table-column prop="avgTime" label="평균 처리 시간" width="150">
              <template #default="scope">
                {{ scope.row.avgTime }}ms
              </template>
            </el-table-column>
            <el-table-column prop="maxTime" label="최대 처리 시간" width="150">
              <template #default="scope">
                {{ scope.row.maxTime }}ms
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="전체 대비 비율" width="150">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.percentage"
                  :color="customColors"
                  :show-text="false"
                />
                {{ scope.row.percentage }}%
              </template>
            </el-table-column>
            <el-table-column prop="status" label="상태" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'normal' ? 'success' : 'warning'">
                  {{ scope.row.status === 'normal' ? '정상' : '주의' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="recommendation" label="최적화 제안" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/modules/notification'
import { useWebSocket } from '@/composables/useWebSocket'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import {
  TrendCharts,
  DataAnalysis,
  Timer,
  CircleCheck,
  Cpu,
  Memo,
  Connection,
  Warning,
  Refresh
} from '@element-plus/icons-vue'

const router = useRouter()
const notificationStore = useNotificationStore()

// State
const performanceChartType = ref('accuracy')
const currentMetrics = ref({
  accuracy: 87.5,
  precision: 0.851,
  recall: 0.843,
  f1Score: 0.847,
  responseTime: 85
})

const accuracyChange = ref(2.3)
const avgResponseTime = ref(92)
const uptime = ref('15d 7h 23m')

const systemHealth = ref({
  status: '정상',
  cpuUsage: 45,
  memoryUsage: 62,
  apiSuccessRate: 99.2,
  errorRate: 0.8
})

const performanceData = ref({
  epochs: Array.from({ length: 10 }, (_, i) => `Epoch ${i + 1}`),
  accuracy: [0.72, 0.78, 0.81, 0.84, 0.86, 0.87, 0.875, 0.878, 0.88, 0.875],
  valAccuracy: [0.70, 0.76, 0.79, 0.82, 0.84, 0.85, 0.852, 0.855, 0.857, 0.853],
  loss: [0.58, 0.45, 0.38, 0.32, 0.28, 0.25, 0.23, 0.22, 0.21, 0.22],
  valLoss: [0.62, 0.48, 0.41, 0.35, 0.31, 0.28, 0.26, 0.25, 0.24, 0.25],
  f1Score: [0.70, 0.75, 0.78, 0.81, 0.83, 0.84, 0.847, 0.850, 0.852, 0.847],
  valF1Score: [0.68, 0.73, 0.76, 0.79, 0.81, 0.82, 0.825, 0.828, 0.830, 0.825]
})

const latestRun = ref({
  runId: 'run-abc12345',
  trainingTime: 23.5,
  epochs: 10,
  batchSize: 4096,
  learningRate: 0.001,
  optimizer: 'Adam',
  finalLoss: 0.2156,
  bestAccuracy: 88.0
})

const errorLogs = ref([
  {
    level: 'warning',
    message: 'Model inference latency increased to 150ms',
    timestamp: new Date(Date.now() - 300000),
    stack: null
  },
  {
    level: 'error',
    message: 'Failed to connect to database: Connection timeout',
    timestamp: new Date(Date.now() - 600000),
    stack: 'Error: Connection timeout\n  at Database.connect (db.js:45)\n  at async main (index.js:12)'
  }
])

const bottleneckAnalysis = ref([
  {
    component: 'Data Preprocessing',
    avgTime: 12,
    maxTime: 18,
    percentage: 15,
    status: 'normal',
    recommendation: '최적화 불필요'
  },
  {
    component: 'Feature Extraction',
    avgTime: 8,
    maxTime: 12,
    percentage: 10,
    status: 'normal',
    recommendation: '최적화 불필요'
  },
  {
    component: 'Model Inference',
    avgTime: 45,
    maxTime: 85,
    percentage: 55,
    status: 'attention',
    recommendation: 'Batch 처리 또는 모델 경량화 검토'
  },
  {
    component: 'Post-processing',
    avgTime: 10,
    maxTime: 15,
    percentage: 12,
    status: 'normal',
    recommendation: '최적화 불필요'
  },
  {
    component: 'Response Generation',
    avgTime: 7,
    maxTime: 10,
    percentage: 8,
    status: 'normal',
    recommendation: '최적화 불필요'
  }
])

const customColors = [
  { color: '#67c23a', percentage: 30 },
  { color: '#e6a23c', percentage: 70 },
  { color: '#f56c6c', percentage: 100 }
]

// WebSocket 연결
const { isConnected } = useWebSocket('/ws/performance', {
  onMessage: (data) => {
    if (data.type === 'metrics_update') {
      currentMetrics.value = { ...currentMetrics.value, ...data.metrics }
      
      // 성능 경고 체크
      if (data.metrics.accuracy < 0.7) {
        notificationStore.addPerformanceAlert(data.metrics)
      }
    } else if (data.type === 'system_health') {
      systemHealth.value = { ...systemHealth.value, ...data.health }
    } else if (data.type === 'error_log') {
      errorLogs.value.unshift(data.log)
      if (errorLogs.value.length > 10) {
        errorLogs.value.pop()
      }
    }
  }
})

// Computed
const getChangeClass = (value) => {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

const getProgressStatus = (value) => {
  if (value < 70) return 'success'
  if (value < 85) return 'warning'
  return 'exception'
}

const getLogType = (level) => {
  const types = {
    error: 'danger',
    warning: 'warning',
    info: 'info'
  }
  return types[level] || 'info'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ko-KR')
}

// Methods
const refreshLogs = () => {
  // API 호출로 로그 새로고침
  console.log('Refreshing logs...')
}

onMounted(() => {
  console.log('SI Dashboard mounted')
})
</script>

<style scoped>
.si-dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon.precision {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-icon.latency {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-icon.health {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.stat-change {
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.stat-detail {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.health-monitors {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.health-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.health-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.error-logs {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border-left: 4px solid;
}

.log-item.log-error {
  background: #fef0f0;
  border-color: #f56c6c;
}

.log-item.log-warning {
  background: #fdf6ec;
  border-color: #e6a23c;
}

.log-item.log-info {
  background: #f4f4f5;
  border-color: #909399;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.log-time {
  font-size: 12px;
  color: #909399;
}

.log-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.log-stack {
  margin-top: 8px;
}

.log-stack pre {
  font-size: 11px;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>

