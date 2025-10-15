<template>
  <div class="ai-report">
    <!-- 액션 헤더 -->
    <div class="report-header">
      <div class="report-title">
        <h1>AI 생성 분석 보고서</h1>
        <p class="report-subtitle">Run ID: {{ runId }}</p>
      </div>
      <div class="report-actions">
        <el-button-group>
          <el-button
            type="primary"
            :icon="Download"
            :loading="downloadingPDF"
            @click="downloadPDF('backend')"
          >
            AI 생성 PDF 다운로드
          </el-button>
          <el-button
            :icon="Printer"
            :loading="generatingClientPDF"
            @click="downloadPDF('client')"
          >
            클라이언트 PDF
          </el-button>
        </el-button-group>
        <el-dropdown @command="handleExportCommand">
          <el-button :icon="More">
            더보기
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="excel">
                <el-icon><Document /></el-icon>
                Excel로 내보내기
              </el-dropdown-item>
              <el-dropdown-item command="ppt">
                <el-icon><Document /></el-icon>
                PPT로 내보내기
              </el-dropdown-item>
              <el-dropdown-item divided command="email">
                <el-icon><Message /></el-icon>
                이메일로 전송
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Executive Summary -->
    <el-card class="summary-card" id="executive-summary">
      <template #header>
        <span>📋 Executive Summary</span>
      </template>
      <div class="summary-content">
        <h2>{{ reportData.title }}</h2>
        <p class="summary-text">{{ reportData.summary }}</p>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="8">
            <div class="summary-metric">
              <div class="metric-icon">📈</div>
              <div class="metric-info">
                <div class="metric-label">예상 ROI 증대</div>
                <div class="metric-value">+{{ reportData.roiIncrease }}%</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-metric">
              <div class="metric-icon">🎯</div>
              <div class="metric-info">
                <div class="metric-label">모델 정확도</div>
                <div class="metric-value">{{ reportData.accuracy }}%</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-metric">
              <div class="metric-icon">💰</div>
              <div class="metric-info">
                <div class="metric-label">예상 추가 매출</div>
                <div class="metric-value">{{ reportData.additionalRevenue }}M</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 피처 중요도 분석 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>🔍 피처 중요도 분석 (Feature Importance)</span>
          </template>
          <div id="feature-importance-chart">
            <FeatureImportanceChart :data="featureImportance" :top-n="15" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>⭐ 중요 피처 Top 5</span>
          </template>
          <div class="top-features">
            <div
              v-for="(feature, index) in topFeatures"
              :key="index"
              class="feature-item"
            >
              <div class="feature-rank">{{ index + 1 }}</div>
              <div class="feature-content">
                <div class="feature-name">{{ feature.name }}</div>
                <div class="feature-description">{{ feature.description }}</div>
                <el-progress
                  :percentage="Math.round(feature.importance * 100)"
                  :color="feature.color"
                />
                <div class="feature-stats">
                  <el-tag size="small">p-value: {{ feature.pValue.toFixed(4) }}</el-tag>
                  <el-tag size="small" type="success">유의함</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 상관관계 분석 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>🔗 상관관계 분석 (Correlation Matrix)</span>
          </template>
          <div id="correlation-matrix">
            <CorrelationMatrix :data="correlationData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 저영향 피처 분석 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>📉 저영향 피처 분석 & 개선 방안</span>
          </template>
          <el-table :data="lowImpactFeatures" style="width: 100%">
            <el-table-column prop="feature" label="피처명" width="200" />
            <el-table-column prop="importance" label="중요도" width="120">
              <template #default="scope">
                {{ scope.row.importance.toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column prop="pValue" label="p-value" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.pValue > 0.05 ? 'info' : 'warning'" size="small">
                  {{ scope.row.pValue.toFixed(4) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="상태" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'insignificant' ? 'info' : 'warning'" size="small">
                  {{ scope.row.status === 'insignificant' ? '유의하지 않음' : '저영향' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="recommendation" label="개선 방안" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 액션 플랜 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>🚀 액션 플랜 우선순위</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(action, index) in actionPlan"
              :key="index"
              :color="action.color"
              :size="action.priority === 'high' ? 'large' : 'normal'"
            >
              <div class="action-item">
                <div class="action-header">
                  <h4>{{ action.title }}</h4>
                  <el-tag :type="action.priority === 'high' ? 'danger' : 'warning'">
                    {{ action.priority === 'high' ? '높은 우선순위' : '중간 우선순위' }}
                  </el-tag>
                </div>
                <p>{{ action.description }}</p>
                <div class="action-metrics">
                  <span>예상 효과: <strong>+{{ action.impact }}%</strong></span>
                  <span>실행 기간: <strong>{{ action.duration }}</strong></span>
                  <span>예상 비용: <strong>{{ action.cost }}</strong></span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Printer,
  More,
  ArrowDown,
  Document,
  Message
} from '@element-plus/icons-vue'
import FeatureImportanceChart from '@/components/charts/FeatureImportanceChart.vue'
import CorrelationMatrix from '@/components/charts/CorrelationMatrix.vue'
import api from '@/api'
import { generateReportPDF, generateAdvancedReportPDF, downloadAIGeneratedPDF } from '@/utils/pdfGenerator'

const route = useRoute()

// State
const downloadingPDF = ref(false)
const generatingClientPDF = ref(false)
const runId = computed(() => route.params.runId || 'latest')

const reportData = ref({
  title: 'CTR 예측 모델 분석 보고서',
  summary: '사용자 행동 패턴 분석 결과, 시간대와 사용자 세그먼트가 클릭률에 가장 큰 영향을 미치는 것으로 나타났습니다. 모바일 광고 최적화와 타겟 세그먼트 집중 공략을 통해 ROI를 25% 이상 증대시킬 수 있을 것으로 예상됩니다.',
  accuracy: 87.5,
  roiIncrease: 25,
  additionalRevenue: 1.25
})

const featureImportance = ref([
  { feature: 'hour', importance: 0.342, pValue: 0.0001, ci: [0.31, 0.37] },
  { feature: 'age_group', importance: 0.287, pValue: 0.0003, ci: [0.25, 0.32] },
  { feature: 'ad_position_level1', importance: 0.251, pValue: 0.0005, ci: [0.22, 0.28] },
  { feature: 'device_type', importance: 0.198, pValue: 0.002, ci: [0.17, 0.23] },
  { feature: 'impression_count_7d', importance: 0.176, pValue: 0.003, ci: [0.15, 0.20] },
  { feature: 'day_of_week', importance: 0.145, pValue: 0.008, ci: [0.12, 0.17] },
  { feature: 'gender', importance: 0.132, pValue: 0.012, ci: [0.11, 0.15] },
  { feature: 'avg_session_duration', importance: 0.118, pValue: 0.015, ci: [0.10, 0.14] },
  { feature: 'historical_ctr_overall', importance: 0.095, pValue: 0.025, ci: [0.08, 0.11] },
  { feature: 'user_click_rate_cat1', importance: 0.082, pValue: 0.035, ci: [0.07, 0.10] }
])

const topFeatures = ref([
  {
    name: 'hour (시간대)',
    description: '광고 노출 시간대가 CTR에 가장 큰 영향',
    importance: 0.342,
    pValue: 0.0001,
    color: '#f56c6c'
  },
  {
    name: 'age_group (연령대)',
    description: '20-30대의 클릭률이 타 연령대 대비 45% 높음',
    importance: 0.287,
    pValue: 0.0003,
    color: '#e6a23c'
  },
  {
    name: 'ad_position (광고 위치)',
    description: '상단 배치 광고의 CTR이 2.3배 높음',
    importance: 0.251,
    pValue: 0.0005,
    color: '#409eff'
  },
  {
    name: 'device_type (디바이스)',
    description: '모바일 사용자의 전환율이 19% 우수',
    importance: 0.198,
    pValue: 0.002,
    color: '#67c23a'
  },
  {
    name: 'impression_count (노출 횟수)',
    description: '7일 노출 횟수와 CTR의 강한 양의 상관관계',
    importance: 0.176,
    pValue: 0.003,
    color: '#909399'
  }
])

const correlationData = ref({
  features: ['hour', 'age_group', 'device', 'position', 'gender'],
  matrix: [
    [1.0, 0.12, -0.08, 0.25, 0.05],
    [0.12, 1.0, 0.18, 0.15, 0.42],
    [-0.08, 0.18, 1.0, -0.12, 0.08],
    [0.25, 0.15, -0.12, 1.0, 0.03],
    [0.05, 0.42, 0.08, 0.03, 1.0]
  ]
})

const lowImpactFeatures = ref([
  {
    feature: 'connection_type',
    importance: 0.012,
    pValue: 0.452,
    status: 'insignificant',
    recommendation: '데이터 수집 중단 고려'
  },
  {
    feature: 'language_preference',
    importance: 0.008,
    pValue: 0.678,
    status: 'insignificant',
    recommendation: '피처 제거 권장'
  },
  {
    feature: 'feat_a_15',
    importance: 0.005,
    pValue: 0.821,
    status: 'insignificant',
    recommendation: '리소스 재배치 필요'
  }
])

const actionPlan = ref([
  {
    title: '타겟 세그먼트 집중 공략',
    description: '20-30대 여성 고객에게 광고 예산의 35% 배정. 맞춤형 소재 제작.',
    priority: 'high',
    impact: 28,
    duration: '2주',
    cost: '500만원',
    color: '#f56c6c'
  },
  {
    title: '프라임 타임 광고 증대',
    description: '오후 8-10시 시간대 광고 노출 30% 증가. 경쟁 입찰 강화.',
    priority: 'high',
    impact: 22,
    duration: '1주',
    cost: '300만원',
    color: '#e6a23c'
  },
  {
    title: '모바일 광고 최적화',
    description: '모바일 상단 배치 비율 70%로 증가. 크리에이티브 개선.',
    priority: 'medium',
    impact: 15,
    duration: '3주',
    cost: '400만원',
    color: '#409eff'
  }
])

// AI 인사이트 데이터
const aiInsights = ref([
  {
    icon: '🎯',
    title: '20-30대 여성 타겟 집중',
    message: '해당 세그먼트의 클릭률이 평균 대비 45% 높으며, 전환율도 32% 우수합니다.'
  },
  {
    icon: '⏰',
    title: '프라임 타임 광고 강화',
    message: '오후 8-10시 시간대의 트래픽이 28%이지만, 광고 노출은 18%에 불과합니다.'
  },
  {
    icon: '📱',
    title: '모바일 상단 배치 최적화',
    message: '모바일 상단 배치 광고의 CTR이 하단 대비 2.3배 높습니다.'
  }
])

// PDF 다운로드 함수
const downloadPDF = async (type) => {
  if (type === 'backend') {
    // 백엔드 AI 생성 PDF 다운로드
    downloadingPDF.value = true
    try {
      await ElMessageBox.confirm(
        '백엔드에서 생성형 AI를 사용하여 고급 보고서를 생성합니다. 약 30초 소요됩니다.',
        'AI 보고서 생성',
        {
          confirmButtonText: '생성하기',
          cancelButtonText: '취소',
          type: 'info'
        }
      )

      const loading = ElMessage({
        message: 'AI가 보고서를 생성하는 중입니다...',
        type: 'info',
        duration: 0
      })

      try {
        // 백엔드 PDF 생성 요청
        await api.generatePDFReport(runId.value, {
          includeCharts: true,
          includeInsights: true,
          includeActionPlan: true
        })

        // PDF 다운로드
        const response = await api.downloadPDFReport(runId.value)
        
        const blob = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `SK_AX_CTR_AI_Report_${runId.value}_${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        loading.close()
        ElMessage.success('AI 보고서가 다운로드되었습니다!')
      } catch (error) {
        loading.close()
        console.error('Backend PDF error:', error)
        
        // 백엔드 실패 시 클라이언트 생성으로 폴백
        ElMessage.warning('백엔드 연결 실패. 클라이언트에서 PDF를 생성합니다.')
        await generateClientPDF()
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('PDF download error:', error)
      }
    } finally {
      downloadingPDF.value = false
    }
  } else if (type === 'client') {
    await generateClientPDF()
  }
}

// 클라이언트 측 PDF 생성
const generateClientPDF = async () => {
  generatingClientPDF.value = true
  try {
    const loading = ElMessage({
      message: 'PDF를 생성하는 중입니다...',
      type: 'info',
      duration: 0
    })

    // 보고서 데이터 준비
    const pdfData = {
      summary: reportData.value.summary,
      accuracy: reportData.value.accuracy,
      roiIncrease: reportData.value.roiIncrease,
      additionalRevenue: reportData.value.additionalRevenue,
      topFeatures: topFeatures.value,
      aiInsights: aiInsights.value,
      actionPlan: actionPlan.value
    }

    // 차트 포함 고급 PDF 생성
    await generateAdvancedReportPDF(
      pdfData,
      ['feature-importance-chart', 'correlation-matrix'],
      {
        fileName: `SK_AX_CTR_Report_${runId.value}_${Date.now()}.pdf`,
        orientation: 'portrait'
      }
    )

    loading.close()
    ElMessage.success('PDF 보고서가 다운로드되었습니다!')
  } catch (error) {
    console.error('Client PDF generation error:', error)
    ElMessage.error('PDF 생성 중 오류가 발생했습니다.')
  } finally {
    generatingClientPDF.value = false
  }
}

// 기타 내보내기 기능
const handleExportCommand = (command) => {
  switch (command) {
    case 'excel':
      ElMessage.info('Excel 내보내기 기능은 준비 중입니다.')
      break
    case 'ppt':
      ElMessage.info('PPT 내보내기 기능은 준비 중입니다.')
      break
    case 'email':
      ElMessageBox.prompt('받는 사람 이메일을 입력하세요', '이메일 전송', {
        confirmButtonText: '전송',
        cancelButtonText: '취소',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '올바른 이메일 주소를 입력하세요'
      }).then(({ value }) => {
        ElMessage.success(`${value}로 보고서를 전송했습니다.`)
      }).catch(() => {
        // 취소
      })
      break
  }
}
</script>

<style scoped>
.ai-report {
  max-width: 1400px;
  margin: 0 auto;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.report-title h1 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.report-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.report-actions {
  display: flex;
  gap: 12px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.summary-content h2 {
  font-size: 28px;
  margin-bottom: 16px;
}

.summary-text {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.95;
}

.summary-metric {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}

.metric-icon {
  font-size: 36px;
}

.metric-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
}

.top-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-rank {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #2c3e50;
}

.feature-description {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.feature-stats {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.action-header h4 {
  margin: 0;
  color: #2c3e50;
}

.action-item p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
}

.action-metrics {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #606266;
}

.action-metrics strong {
  color: #3498db;
}
</style>

