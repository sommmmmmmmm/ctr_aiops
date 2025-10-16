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

          <!-- 학습 그래프 -->
          <div style="margin-top: 30px">
            <PerformanceChart
              v-if="trainingHistory.accuracy.length > 0"
              :data="trainingHistory"
              type="accuracy"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 학습 로그 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>📝 학습 로그</span>
          </template>
          <div class="log-console">
            <div
              v-for="(log, index) in trainingLogs"
              :key="index"
              class="log-line"
            >
              <span class="log-timestamp">{{ log.timestamp }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWebSocket } from '@/composables/useWebSocket'
import { useNotificationStore } from '@/stores/modules/notification'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'

const route = useRoute()
const notificationStore = useNotificationStore()

const runId = computed(() => route.params.runId || 'mock-run-id')

// State
const currentEpoch = ref(0)
const totalEpochs = ref(10)
const status = ref('training') // 'pending', 'training', 'completed', 'failed'

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
      
      // 로그 추가
      addLog(`Epoch ${data.epoch}/${totalEpochs.value} - Loss: ${data.metrics.trainLoss.toFixed(4)}, Acc: ${(data.metrics.trainAccuracy * 100).toFixed(2)}%`)
    } else if (data.type === 'training_complete') {
      status.value = 'completed'
      notificationStore.addTrainingCompleteNotification(runId.value, data.metrics)
      addLog('학습 완료!')
    } else if (data.type === 'training_failed') {
      status.value = 'failed'
      notificationStore.addTrainingFailedNotification(runId.value, data.error)
      addLog(`학습 실패: ${data.error}`)
    } else if (data.type === 'log') {
      addLog(data.message)
    }
  },
  onError: () => {
    // WebSocket 실패 시 Mock 모드로 전환
    console.log('WebSocket 실패, Mock 모드로 전환')
    simulateTraining()
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
const simulateTraining = () => {
  let epoch = 0
  const interval = setInterval(() => {
    if (epoch >= totalEpochs.value) {
      clearInterval(interval)
      status.value = 'completed'
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
      simulateTraining()
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
  color: #909399;
}

.connection-status .connected {
  color: #67c23a;
}

.progress-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.metric-box {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.metric-label {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
}

.log-console {
  max-height: 400px;
  overflow-y: auto;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.log-line {
  padding: 4px 0;
  display: flex;
  gap: 12px;
}

.log-timestamp {
  color: #858585;
  min-width: 80px;
}

.log-message {
  color: #d4d4d4;
}
</style>

