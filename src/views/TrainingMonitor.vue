<template>
  <div class="training-monitor">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <div>
                <span>🔄 실시간 학습 모니터링</span>
                <el-tag :type="statusType" style="margin-left: 12px">
                  {{ statusText }}
                </el-tag>
              </div>
              <div class="connection-status">
                <el-icon :class="{ connected: isConnected }">
                  <CircleCheck v-if="isConnected" />
                  <CircleClose v-else />
                </el-icon>
                <span>{{ isConnected ? '연결됨' : '연결 끊김' }}</span>
              </div>
            </div>
          </template>

          <!-- 진행 상황 -->
          <div class="progress-section">
            <div class="progress-info">
              <span>Epoch {{ currentEpoch }} / {{ totalEpochs }}</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <el-progress
              :percentage="progressPercentage"
              :status="progressStatus"
              :stroke-width="20"
            />
          </div>

          <!-- 실시간 메트릭 -->
          <el-row :gutter="20" style="margin-top: 30px">
            <el-col :span="6">
              <div class="metric-box">
                <div class="metric-label">Train Loss</div>
                <div class="metric-value">{{ currentMetrics.trainLoss.toFixed(4) }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="metric-box">
                <div class="metric-label">Val Loss</div>
                <div class="metric-value">{{ currentMetrics.valLoss.toFixed(4) }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="metric-box">
                <div class="metric-label">Train Accuracy</div>
                <div class="metric-value">{{ (currentMetrics.trainAccuracy * 100).toFixed(2) }}%</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="metric-box">
                <div class="metric-label">Val Accuracy</div>
                <div class="metric-value">{{ (currentMetrics.valAccuracy * 100).toFixed(2) }}%</div>
              </div>
            </el-col>
          </el-row>

          <!-- 차트 영역 -->
          <el-row :gutter="20" style="margin-top: 30px">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>Loss 추이</span>
                </template>
                <PerformanceChart
                  :data="trainingHistory"
                  type="loss"
                  height="300"
                />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>Accuracy 추이</span>
                </template>
                <PerformanceChart
                  :data="trainingHistory"
                  type="accuracy"
                  height="300"
                />
              </el-card>
            </el-col>
          </el-row>

          <!-- 로그 영역 -->
          <el-card style="margin-top: 30px">
            <template #header>
              <span>학습 로그</span>
            </template>
            <div class="log-container">
              <div
                v-for="(log, index) in trainingLogs"
                :key="index"
                class="log-item"
              >
                <span class="log-time">{{ log.timestamp }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </el-card>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebSocket } from '@/composables/useWebSocket'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'

const route = useRoute()
const router = useRouter()
const runId = ref(route.params.runId || 'demo-run')

// 상태 관리
const status = ref('pending') // pending, training, completed, failed
const currentEpoch = ref(0)
const totalEpochs = ref(10)
const currentMetrics = ref({
  trainLoss: 0,
  valLoss: 0,
  trainAccuracy: 0,
  valAccuracy: 0
})

const trainingHistory = ref({
  epochs: [],
  accuracy: [],
  valAccuracy: [],
  loss: [],
  valLoss: []
})

const trainingLogs = ref([])

// WebSocket 연결 (Mock 모드)
const { isConnected } = useWebSocket(`/ws/training/${runId.value}`, {
  onMessage: (data) => {
    if (data.type === 'epoch_update') {
      currentEpoch.value = data.epoch
      currentMetrics.value = data.metrics
      
      // 히스토리 업데이트
      trainingHistory.value.epochs.push(`Epoch ${data.epoch}`)
      trainingHistory.value.accuracy.push(data.metrics.trainAccuracy)
      trainingHistory.value.valAccuracy.push(data.metrics.valAccuracy)
      trainingHistory.value.loss.push(data.metrics.trainLoss)
      trainingHistory.value.valLoss.push(data.metrics.valLoss)
      
      addLog(`Epoch ${data.epoch}/${totalEpochs.value} - Loss: ${data.metrics.trainLoss.toFixed(4)}, Acc: ${(data.metrics.trainAccuracy * 100).toFixed(2)}%`)
    } else if (data.type === 'training_complete') {
      status.value = 'completed'
      addLog('학습이 완료되었습니다!')
      
      // 완료 후 결과 페이지로 이동
      setTimeout(() => {
        router.push('/dashboard/si')
      }, 2000)
    } else if (data.type === 'log') {
      addLog(data.message)
    }
  },
  onError: () => {
    // WebSocket 실패 시 Mock 모드로 전환
    console.log('WebSocket 실패, Mock 모드로 전환')
    startMockTraining()
  }
})

// Computed
const progressPercentage = computed(() => {
  return Math.round((currentEpoch.value / totalEpochs.value) * 100)
})

const statusType = computed(() => {
  const types = {
    pending: 'info',
    training: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return types[status.value]
})

const statusText = computed(() => {
  const texts = {
    pending: '대기 중',
    training: '학습 중',
    completed: '완료',
    failed: '실패'
  }
  return texts[status.value]
})

const progressStatus = computed(() => {
  if (status.value === 'completed') return 'success'
  if (status.value === 'failed') return 'exception'
  return undefined
})

// Methods
const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  trainingLogs.value.push({ timestamp, message })
  
  // 최대 100개 로그만 유지
  if (trainingLogs.value.length > 100) {
    trainingLogs.value.shift()
  }
}

// Mock 데이터 시뮬레이션 (백엔드 미연결 시)
const startMockTraining = () => {
  let epoch = 0
  const interval = setInterval(() => {
    if (epoch >= totalEpochs.value) {
      clearInterval(interval)
      status.value = 'completed'
      addLog('학습이 완료되었습니다!')
      
      // 완료 후 결과 페이지로 이동
      setTimeout(() => {
        router.push('/dashboard/si')
      }, 2000)
      return
    }
    
    epoch++
    currentEpoch.value = epoch
    
    currentMetrics.value = {
      trainLoss: 0.5 - (epoch * 0.03) + Math.random() * 0.05,
      valLoss: 0.52 - (epoch * 0.028) + Math.random() * 0.05,
      trainAccuracy: 0.7 + (epoch * 0.018) + Math.random() * 0.01,
      valAccuracy: 0.68 + (epoch * 0.017) + Math.random() * 0.01
    }
    
    trainingHistory.value.epochs.push(`Epoch ${epoch}`)
    trainingHistory.value.accuracy.push(currentMetrics.value.trainAccuracy)
    trainingHistory.value.valAccuracy.push(currentMetrics.value.valAccuracy)
    trainingHistory.value.loss.push(currentMetrics.value.trainLoss)
    trainingHistory.value.valLoss.push(currentMetrics.value.valLoss)
    
    addLog(`Epoch ${epoch}/${totalEpochs.value} - Loss: ${currentMetrics.value.trainLoss.toFixed(4)}, Acc: ${(currentMetrics.value.trainAccuracy * 100).toFixed(2)}%`)
  }, 2000)
}

onMounted(() => {
  status.value = 'training'
  addLog('학습을 시작합니다...')
  
  // WebSocket이 연결되지 않으면 Mock 시뮬레이션
  setTimeout(() => {
    if (!isConnected.value) {
      addLog('실시간 연결 실패. 시뮬레이션 모드로 전환합니다.')
      startMockTraining()
    }
  }, 2000)
})
</script>

<style scoped>
.training-monitor {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.connection-status .el-icon {
  font-size: 16px;
  color: #f56c6c;
}

.connection-status .el-icon.connected {
  color: #67c23a;
}

.progress-section {
  margin: 20px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.metric-box {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.metric-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #495057;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #6c757d;
  min-width: 80px;
}

.log-message {
  color: #495057;
  flex: 1;
}
</style>