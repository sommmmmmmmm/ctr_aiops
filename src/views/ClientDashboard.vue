<template>
  <div class="client-dashboard">
    <!-- 핵심 비즈니스 지표 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="8">
        <el-card class="kpi-card gradient-blue">
          <div class="kpi-content">
            <div class="kpi-icon">
              <el-icon :size="40"><TrendCharts /></el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-label">예측 클릭률 (CTR)</div>
              <div class="kpi-value">{{ businessMetrics.predictedCTR }}%</div>
              <div class="kpi-change positive">
                <el-icon><CaretTop /></el-icon>
                전월 대비 +{{ businessMetrics.ctrChange }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="kpi-card gradient-green">
          <div class="kpi-content">
            <div class="kpi-icon">
              <el-icon :size="40"><Money /></el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-label">예상 ROI 증대</div>
              <div class="kpi-value">+{{ businessMetrics.roiIncrease }}%</div>
              <div class="kpi-subtext">
                월 예상 추가 매출: {{ businessMetrics.additionalRevenue }}만원
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="kpi-card gradient-purple">
          <div class="kpi-content">
            <div class="kpi-icon">
              <el-icon :size="40"><User /></el-icon>
            </div>
            <div class="kpi-info">
              <div class="kpi-label">타겟 전환율</div>
              <div class="kpi-value">{{ businessMetrics.conversionRate }}%</div>
              <div class="kpi-change positive">
                <el-icon><CaretTop /></el-icon>
                전월 대비 +{{ businessMetrics.conversionChange }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI 생성 인사이트 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="insights-card">
          <template #header>
            <div class="card-header">
              <span>AI 핵심 인사이트</span>
              <el-tag type="success">실시간 분석</el-tag>
            </div>
          </template>
          <div class="insights-list">
            <div
              v-for="(insight, index) in aiInsights"
              :key="index"
              class="insight-item"
              :class="`insight-${insight.type}`"
            >
              <div class="insight-header">
                <div class="insight-icon">{{ insight.icon }}</div>
                <div class="insight-content">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.message }}</p>
                </div>
              </div>
              <div v-if="insight.details" class="insight-details">
                <el-tag
                  v-for="(detail, idx) in insight.details"
                  :key="idx"
                  size="small"
                  class="detail-tag"
                >
                  {{ detail }}
                </el-tag>
              </div>
              <div v-if="insight.action" class="insight-action">
                <el-button type="primary" size="small" @click="applyRecommendation(insight)">
                  {{ insight.action }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>퀵 액션</span>
          </template>
          <div class="quick-actions">
            <el-button
              type="primary"
              :icon="Upload"
              size="large"
              class="action-btn"
              @click="goToUpload"
            >
              새 데이터 업로드
            </el-button>
            <el-button
              type="success"
              :icon="Document"
              size="large"
              class="action-btn"
              @click="viewFullReport"
            >
              전체 보고서 보기
            </el-button>
            <el-button
              type="success"
              :icon="Download"
              size="large"
              class="action-btn"
              :loading="downloadingPDF"
              @click="downloadReport"
            >
              PDF 보고서 다운로드
            </el-button>
          </div>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <span>성과 요약</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in performanceSummary"
              :key="index"
              :timestamp="item.date"
              :color="item.color"
            >
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 사용자 행동 패턴 분석 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>👥 타겟 고객 세그먼트 분석</span>
          </template>
          <div class="segment-analysis">
            <div
              v-for="segment in customerSegments"
              :key="segment.name"
              class="segment-item"
            >
              <div class="segment-header">
                <span class="segment-name">{{ segment.name }}</span>
                <el-tag :type="segment.performance">{{ segment.label }}</el-tag>
              </div>
              <div class="segment-metrics">
                <div class="metric">
                  <span class="metric-label">클릭률</span>
                  <span class="metric-value">{{ segment.ctr }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">전환율</span>
                  <span class="metric-value">{{ segment.conversion }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">평균 구매액</span>
                  <span class="metric-value">{{ segment.avgPurchase }}원</span>
                </div>
                <div class="metric">
                  <span class="metric-label">상관계수</span>
                  <span class="metric-value">{{ segment.correlation }}</span>
                </div>
              </div>
              <el-progress
                :percentage="segment.potential"
                :color="customColors"
                :stroke-width="8"
              >
                <span class="progress-text">성장 잠재력: {{ segment.potential }}%</span>
              </el-progress>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>⏰ 최적 광고 시간대</span>
          </template>
          <div class="time-analysis">
            <div
              v-for="timeSlot in optimalTimeSlots"
              :key="timeSlot.period"
              class="time-slot"
              :class="{ 'best-time': timeSlot.isBest }"
            >
              <div class="time-period">
                <el-icon :size="20"><Clock /></el-icon>
                <span>{{ timeSlot.period }}</span>
              </div>
              <div class="time-metrics">
                <div class="time-ctr">
                  <span class="label">CTR</span>
                  <el-progress
                    :percentage="timeSlot.ctr"
                    :color="timeSlot.color"
                    :stroke-width="12"
                  />
                </div>
                <div class="time-traffic">
                  <span class="traffic-value">{{ timeSlot.traffic }}</span>
                  <span class="traffic-label">예상 트래픽</span>
                </div>
                <div class="time-scroll">
                  <span class="scroll-value">{{ timeSlot.scrollDepth }}</span>
                  <span class="scroll-label">스크롤 깊이</span>
                </div>
                <div class="time-exposure">
                  <span class="exposure-value">{{ timeSlot.exposureCount }}</span>
                  <span class="exposure-label">7일 노출</span>
                </div>
              </div>
              <div v-if="timeSlot.isBest" class="best-badge">
                <el-icon><Star /></el-icon>
                추천 시간대
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 마케팅 전략 추천 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>AI 추천 마케팅 전략</span>
              <el-button type="text" @click="refreshRecommendations">
                <el-icon><Refresh /></el-icon>
                새로고침
              </el-button>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col
              v-for="strategy in marketingStrategies"
              :key="strategy.id"
              :span="8"
            >
              <div class="strategy-card" :class="`priority-${strategy.priority}`">
                <div class="strategy-header">
                  <el-tag :type="getPriorityType(strategy.priority)" size="large">
                    {{ strategy.priorityLabel }}
                  </el-tag>
                  <span class="strategy-impact">예상 효과: +{{ strategy.impact }}%</span>
                </div>
                <h3>{{ strategy.title }}</h3>
                <p>{{ strategy.description }}</p>
                <div class="strategy-details">
                  <div class="detail-item">
                    <el-icon><Calendar /></el-icon>
                    <span>실행 기간: {{ strategy.duration }}</span>
                  </div>
                  <div class="detail-item">
                    <el-icon><Money /></el-icon>
                    <span>예상 비용: {{ strategy.budget }}</span>
                  </div>
                  <div class="detail-item">
                    <el-icon><TrendCharts /></el-icon>
                    <span>ROI: {{ strategy.roi }}%</span>
                  </div>
                  <div class="detail-item">
                    <el-icon><DataAnalysis /></el-icon>
                    <span>상관계수: {{ strategy.correlation }}</span>
                  </div>
                </div>
                <el-button
                  type="primary"
                  class="strategy-action"
                  @click="viewStrategyDetails(strategy)"
                >
                  상세 보기
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  TrendCharts,
  Money,
  User,
  CaretTop,
  Upload,
  Document,
  Download,
  Clock,
  Star,
  Refresh,
  Calendar,
  DataAnalysis
} from '@element-plus/icons-vue'
import api from '@/api'

const router = useRouter()

// State
const downloadingPDF = ref(false)

// 비즈니스 지표
const businessMetrics = ref({
  predictedCTR: 3.8,
  ctrChange: 12.5,
  roiIncrease: 25,
  additionalRevenue: 1250,
  conversionRate: 4.2,
  conversionChange: 8.3
})

// AI 인사이트 - 피처 상관관계 기반 깊은 분석
const aiInsights = ref([
  {
    icon: '🎯',
    type: 'success',
    title: '콘텐츠 카테고리 ID 15 + 스크롤 깊이 80% 이상 조합 최적화',
    message: '콘텐츠 카테고리 ID 15(라이프스타일)에서 스크롤 깊이 80% 이상 사용자의 CTR이 7.3%로 평균 대비 340% 높습니다. 이 조합에 광고 예산의 40%를 집중하면 ROI가 45% 증가할 것으로 예상됩니다.',
    details: ['카테고리 ID 15 CTR: 7.3%', '스크롤 깊이 상관계수: 0.78', '예상 ROI 증가: +45%'],
    action: '콘텐츠-스크롤 최적화'
  },
  {
    icon: '📊',
    type: 'warning',
    title: '7일 노출 횟수 3-5회 세그먼트 과소노출 문제',
    message: '7일 노출 횟수 3-5회 사용자 그룹의 전환율이 8.2%로 최고 수준이지만, 현재 광고 노출은 전체의 12%에 불과합니다. 이 세그먼트의 노출을 25%로 증가시키면 즉각적인 성과 개선이 가능합니다.',
    details: ['3-5회 노출 전환율: 8.2%', '현재 노출 비율: 12%', '예상 개선: +28%'],
    action: '노출 빈도 최적화'
  },
  {
    icon: '🔍',
    type: 'info',
    title: '스크롤 깊이 60-80% + 카테고리 ID 8 조합 발견',
    message: '스크롤 깊이 60-80% 구간에서 카테고리 ID 8(테크) 콘텐츠의 CTR이 5.8%로 높은 상관관계를 보입니다. 이 조합에 맞춤형 광고를 배치하면 전환율이 35% 향상될 것으로 예상됩니다.',
    details: ['조합 CTR: 5.8%', '상관계수: 0.65', '예상 전환율 증가: +35%'],
    action: '맞춤형 광고 배치'
  }
])

// 고객 세그먼트 - 피처 기반 세분화 분석
const customerSegments = ref([
  {
    name: '카테고리 ID 15 + 스크롤 80%+',
    performance: 'success',
    label: '최우수',
    ctr: 7.3,
    conversion: 9.1,
    avgPurchase: 125000,
    potential: 92,
    correlation: 0.78
  },
  {
    name: '7일 노출 3-5회 그룹',
    performance: 'success',
    label: '우수',
    ctr: 6.2,
    conversion: 8.2,
    avgPurchase: 98000,
    potential: 88,
    correlation: 0.72
  },
  {
    name: '카테고리 ID 8 + 스크롤 60-80%',
    performance: 'warning',
    label: '보통',
    ctr: 5.8,
    conversion: 6.5,
    avgPurchase: 87000,
    potential: 75,
    correlation: 0.65
  },
  {
    name: '카테고리 ID 3 + 스크롤 40-60%',
    performance: 'info',
    label: '개선 필요',
    ctr: 3.1,
    conversion: 4.2,
    avgPurchase: 65000,
    potential: 52,
    correlation: 0.41
  }
])

// 최적 시간대 - 스크롤 깊이와 노출 횟수 기반 분석
const optimalTimeSlots = ref([
  {
    period: '06:00 - 10:00',
    ctr: 65,
    traffic: '중',
    color: '#67c23a',
    isBest: false,
    scrollDepth: '평균 45%',
    exposureCount: '2.3회'
  },
  {
    period: '10:00 - 14:00',
    ctr: 72,
    traffic: '높음',
    color: '#409eff',
    isBest: false,
    scrollDepth: '평균 52%',
    exposureCount: '3.1회'
  },
  {
    period: '14:00 - 18:00',
    ctr: 68,
    traffic: '중',
    color: '#67c23a',
    isBest: false,
    scrollDepth: '평균 48%',
    exposureCount: '2.8회'
  },
  {
    period: '18:00 - 22:00',
    ctr: 88,
    traffic: '매우 높음',
    color: '#f56c6c',
    isBest: true,
    scrollDepth: '평균 78%',
    exposureCount: '4.2회'
  },
  {
    period: '22:00 - 02:00',
    ctr: 55,
    traffic: '낮음',
    color: '#e6a23c',
    isBest: false,
    scrollDepth: '평균 35%',
    exposureCount: '1.9회'
  }
])

// 마케팅 전략 - 피처 상관관계 기반 전략
const marketingStrategies = ref([
  {
    id: 1,
    priority: 'high',
    priorityLabel: '높은 우선순위',
    title: '콘텐츠-스크롤 조합 최적화',
    description: '카테고리 ID 15 + 스크롤 깊이 80% 이상 조합에 맞춤형 광고를 제작하고, 광고 예산의 40%를 배정합니다.',
    impact: 45,
    duration: '2주',
    budget: '600만원',
    roi: 320,
    correlation: 0.78
  },
  {
    id: 2,
    priority: 'high',
    priorityLabel: '높은 우선순위',
    title: '7일 노출 빈도 최적화',
    description: '7일 노출 횟수 3-5회 세그먼트의 광고 노출을 25%로 증가시키고, 맞춤형 리타겟팅을 강화합니다.',
    impact: 28,
    duration: '1주',
    budget: '400만원',
    roi: 220,
    correlation: 0.72
  },
  {
    id: 3,
    priority: 'medium',
    priorityLabel: '중간 우선순위',
    title: '테크 카테고리 스크롤 최적화',
    description: '카테고리 ID 8 + 스크롤 깊이 60-80% 조합에 맞춤형 광고 소재를 개발하고 배치를 최적화합니다.',
    impact: 35,
    duration: '3주',
    budget: '500만원',
    roi: 180,
    correlation: 0.65
  }
])

// 성과 요약
const performanceSummary = ref([
  {
    date: '2025-10-15',
    color: '#67c23a',
    title: 'CTR 3.8% 달성',
    description: '전월 대비 12.5% 상승'
  },
  {
    date: '2025-10-10',
    color: '#409eff',
    title: '새로운 모델 배포',
    description: '예측 정확도 87.5%로 향상'
  },
  {
    date: '2025-10-05',
    color: '#e6a23c',
    title: '마케팅 전략 업데이트',
    description: 'AI 추천 전략 3개 적용'
  }
])

const customColors = [
  { color: '#f56c6c', percentage: 30 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#67c23a', percentage: 100 }
]

// Methods
const applyRecommendation = (insight) => {
  ElMessage.success(`"${insight.title}" 전략을 적용합니다.`)
}

const goToUpload = () => {
  router.push('/upload')
}

const viewFullReport = () => {
  router.push('/report/latest')
}

const downloadReport = async () => {
  downloadingPDF.value = true
  try {
    const loading = ElMessage({
      message: 'AI가 맞춤형 보고서를 생성하는 중입니다...',
      type: 'info',
      duration: 0
    })

    try {
      // 백엔드 AI 생성 PDF 다운로드 시도
      const response = await api.downloadPDFReport('latest')
      
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `SK_AX_고객사_보고서_${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      loading.close()
      ElMessage.success('보고서가 다운로드되었습니다!')
    } catch (error) {
      loading.close()
      console.error('PDF download error:', error)
      ElMessage.warning('백엔드 미연결 상태입니다. AI 보고서 페이지에서 다운로드하세요.')
      setTimeout(() => {
        router.push('/report/latest')
      }, 1500)
    }
  } finally {
    downloadingPDF.value = false
  }
}

const refreshRecommendations = () => {
  ElMessage.success('최신 추천 전략을 불러왔습니다.')
}

const viewStrategyDetails = (strategy) => {
  ElMessage.info(`"${strategy.title}" 상세 정보를 확인합니다.`)
}

const getPriorityType = (priority) => {
  const types = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[priority] || 'info'
}
</script>

<style scoped>
.client-dashboard {
  padding: 0;
}

.kpi-row {
  margin-bottom: 20px;
}

.kpi-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
}

.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.gradient-green {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
}

.gradient-purple {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.kpi-icon {
  opacity: 0.9;
}

.kpi-info {
  flex: 1;
}

.kpi-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 36px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 8px;
}

.kpi-change {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-subtext {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.insights-card {
  height: 100%;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insight-item {
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid;
  background: #f8f9fa;
}

.insight-item.insight-success {
  border-color: #67c23a;
  background: #f0f9ff;
}

.insight-item.insight-warning {
  border-color: #e6a23c;
  background: #fffbf0;
}

.insight-item.insight-info {
  border-color: #409eff;
  background: #f4f7fc;
}

.insight-header {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.insight-icon {
  font-size: 32px;
  line-height: 1;
}

.insight-content h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #2c3e50;
}

.insight-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

.insight-details {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.detail-tag {
  background: white;
}

.insight-action {
  margin-top: 12px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
}

.segment-analysis {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.segment-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.segment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.segment-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.segment-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 12px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: #909399;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.progress-text {
  font-size: 12px;
}

.time-analysis {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-slot {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.time-slot.best-time {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border: 2px solid #f56c6c;
}

.time-period {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.time-metrics {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.time-ctr {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-traffic,
.time-scroll,
.time-exposure {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.traffic-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.traffic-label,
.scroll-label,
.exposure-label {
  font-size: 12px;
  color: #909399;
}

.scroll-value,
.exposure-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.best-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #f56c6c;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.strategy-card {
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e4e7ed;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.strategy-card.priority-high {
  border-color: #f56c6c;
  background: linear-gradient(to bottom, #fff5f5 0%, white 100%);
}

.strategy-card.priority-medium {
  border-color: #e6a23c;
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.strategy-impact {
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
}

.strategy-card h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.strategy-card p {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 16px;
  flex: 1;
}

.strategy-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.strategy-action {
  width: 100%;
}
</style>

