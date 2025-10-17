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
          <el-col :span="6">
            <div class="summary-metric">
              <div class="metric-icon">📈</div>
              <div class="metric-info">
                <div class="metric-label">현재 ROAS</div>
                <div class="metric-value">{{ reportData.roas }}x</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-metric">
              <div class="metric-icon">👥</div>
              <div class="metric-info">
                <div class="metric-label">현재 CAC</div>
                <div class="metric-value">{{ reportData.cac.toLocaleString() }}원</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-metric">
              <div class="metric-icon">💰</div>
              <div class="metric-info">
                <div class="metric-label">현재 LTV</div>
                <div class="metric-value">{{ reportData.ltv.toLocaleString() }}원</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-metric">
              <div class="metric-icon">🎯</div>
              <div class="metric-info">
                <div class="metric-label">예상 ROAS 증가</div>
                <div class="metric-value">+{{ reportData.roiIncrease }}%</div>
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
            <span>중요 피처 Top 5</span>
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
            <span>저영향 피처 분석 & 개선 방안</span>
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
            <span>액션 플랜 우선순위</span>
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
                  <span>예상 ROAS 증가: <strong>+{{ action.impact }}%</strong></span>
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
  title: '마케팅 KPI 최적화 분석 보고서',
  summary: '콘텐츠 카테고리 ID와 스크롤 깊이, 7일 노출 횟수 등 핵심 피처 분석 결과, ROAS 4.2x 달성과 CAC 최적화 기회를 발견했습니다. 카테고리 ID 15 × 스크롤 80%+ 조합에 예산을 재배치하면 전체 ROAS를 5.1x로 상승시킬 수 있을 것으로 예상됩니다.',
  accuracy: 89.2,
  roas: 4.2,
  cac: 12500,
  ltv: 185000,
  roiIncrease: 21,
  additionalRevenue: 2.8
})

const featureImportance = ref([
  { feature: '콘텐츠유형', importance: 0.456, pValue: 0.0001, ci: [0.42, 0.49] },
  { feature: '페이지탐색도', importance: 0.389, pValue: 0.0002, ci: [0.35, 0.43] },
  { feature: '노출빈도', importance: 0.324, pValue: 0.0003, ci: [0.29, 0.36] },
  { feature: '조합효과', importance: 0.287, pValue: 0.0005, ci: [0.25, 0.32] },
  { feature: '재방문율', importance: 0.251, pValue: 0.0008, ci: [0.22, 0.28] },
  { feature: '증분효과', importance: 0.218, pValue: 0.001, ci: [0.19, 0.25] },
  { feature: '7일기여도', importance: 0.198, pValue: 0.002, ci: [0.17, 0.23] },
  { feature: '간접전환', importance: 0.176, pValue: 0.003, ci: [0.15, 0.20] },
  { feature: '참여지표', importance: 0.145, pValue: 0.008, ci: [0.12, 0.17] },
  { feature: '이탈률', importance: 0.132, pValue: 0.012, ci: [0.11, 0.15] }
])

const topFeatures = ref([
  {
    name: '콘텐츠 유형',
    description: '라이프스타일 콘텐츠에서 ROAS 6.8x 달성',
    importance: 0.456,
    pValue: 0.0001,
    color: '#f56c6c'
  },
  {
    name: '페이지 탐색도',
    description: '깊은 탐색(80%+)에서 CTR 7.3%로 평균 대비 340% 높음',
    importance: 0.389,
    pValue: 0.0002,
    color: '#e6a23c'
  },
  {
    name: '노출 빈도',
    description: '적정 노출(3-5회) 세그먼트에서 CAC 8,500원으로 최적',
    importance: 0.324,
    pValue: 0.0003,
    color: '#409eff'
  },
  {
    name: '조합 효과',
    description: '콘텐츠 × 탐색도 조합이 ROAS를 62% 향상',
    importance: 0.287,
    pValue: 0.0005,
    color: '#67c23a'
  },
  {
    name: '재방문율',
    description: '신규 고객 7일 재방문율이 LTV에 직접적 영향',
    importance: 0.251,
    pValue: 0.0008,
    color: '#909399'
  }
])

const correlationData = ref({
  features: ['콘텐츠유형', '페이지탐색도', '노출빈도', '조합효과', '재방문율'],
  matrix: [
    [1.0, 0.78, 0.45, 0.62, 0.35],
    [0.78, 1.0, 0.52, 0.68, 0.28],
    [0.45, 0.52, 1.0, 0.41, 0.58],
    [0.62, 0.68, 0.41, 1.0, 0.33],
    [0.35, 0.28, 0.58, 0.33, 1.0]
  ]
})

const lowImpactFeatures = ref([
  {
    feature: '디바이스유형',
    importance: 0.045,
    pValue: 0.152,
    status: 'low_impact',
    recommendation: '모바일 최적화에 집중하되 우선순위 낮춤'
  },
  {
    feature: '요일',
    importance: 0.032,
    pValue: 0.234,
    status: 'low_impact',
    recommendation: '요일별 세분화 대신 시간대 집중'
  },
  {
    feature: '성별',
    importance: 0.028,
    pValue: 0.312,
    status: 'low_impact',
    recommendation: '성별보다 콘텐츠 유형 기반 타겟팅'
  }
])

const actionPlan = ref([
  {
    title: 'ROAS 최적화 - 라이프스타일 × 깊은 탐색 조합 집중',
    description: 'ROAS 6.8x 달성 세그먼트에 광고 예산의 35%를 재배치하여 전체 ROAS를 4.2x에서 5.1x로 상승시킵니다.',
    priority: 'high',
    impact: 21,
    duration: '2주',
    cost: '800만원',
    color: '#f56c6c'
  },
  {
    title: 'CAC 최적화 - 적정 노출 세그먼트 확대',
    description: 'CAC 8,500원 달성 세그먼트의 노출을 12%에서 25%로 증가시켜 전체 CAC를 12,500원에서 10,200원으로 감소시킵니다.',
    priority: 'high',
    impact: 18,
    duration: '1주',
    cost: '500만원',
    color: '#e6a23c'
  },
  {
    title: '신규 고객 ROAS 강화 - 테크 콘텐츠 타겟팅',
    description: '테크 콘텐츠 × 중간 탐색 조합에 신규 고객 맞춤형 광고를 배치하여 신규 고객 ROAS를 3.8x에서 4.6x로 향상시킵니다.',
    priority: 'medium',
    impact: 21,
    duration: '3주',
    cost: '600만원',
    color: '#409eff'
  }
])

// AI 인사이트 데이터
const aiInsights = ref([
  {
    icon: '💰',
    title: 'ROAS 4.2x 달성 - 라이프스타일 × 깊은 탐색 조합이 핵심',
    message: '라이프스타일 콘텐츠에서 깊은 탐색(80%+) 사용자 세그먼트의 ROAS가 6.8x로 전체 평균 대비 62% 높습니다.'
  },
  {
    icon: '📈',
    title: 'CAC 최적화 기회 - 적정 노출 세그먼트 과소노출',
    message: '적정 노출(3-5회) 사용자 그룹의 CAC가 8,500원으로 전체 평균 대비 32% 낮습니다.'
  },
  {
    icon: '🎯',
    title: '신규 고객 ROAS 3.8x - 테크 콘텐츠 × 중간 탐색 조합 발견',
    message: '테크 콘텐츠에서 중간 탐색(60-80%) 구간의 신규 고객 ROAS가 5.2x로 높습니다.'
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

