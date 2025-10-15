<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text" data-aos="fade-up">
          <h1 class="hero-title">
            SK Planet <span class="highlight">AIOps</span>
          </h1>
          <p class="hero-subtitle">
            SK AX가 제공하는 AI 기반 광고 최적화 플랫폼으로<br />
            사용자 행동을 분석하여 전략 인사이트를 실시간 제공합니다
          </p>
          <div class="company-badge">
            <span class="badge-text">서비스 제공</span>
            <span class="badge-company">SK AX</span>
          </div>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="startDemo">
              <el-icon><VideoPlay /></el-icon>
              데모 시작하기
            </el-button>
            <el-button size="large" plain @click="scrollToContact">
              문의하기
            </el-button>
          </div>
        </div>
        <div class="hero-visual" data-aos="fade-left" data-aos-delay="200">
          <div class="floating-card card-1">
            <el-icon><TrendCharts /></el-icon>
            <span>87.5% 정확도</span>
          </div>
          <div class="floating-card card-2">
            <el-icon><Timer /></el-icon>
            <span>&lt; 100ms 응답속도</span>
          </div>
          <div class="floating-card card-3">
            <el-icon><Checked /></el-icon>
            <span>99.9% 가용성</span>
          </div>
        </div>
      </div>
      <div class="scroll-indicator" @click="scrollToFeatures">
        <el-icon><ArrowDown /></el-icon>
      </div>
    </section>

    <!-- Client Intro Section - SK Planet -->
    <section class="client-intro-section">
      <div class="container">
        <div class="client-banner" data-aos="fade-up">
          <div class="client-badge">SERVICE FOR</div>
          <div class="client-logo">
            <h1>SK Planet</h1>
            <p class="client-tagline">AIOps</p>
          </div>
          <div class="client-description">
            <p>
              <strong>SK Planet의 광고 사이트</strong>에서 발생하는 사용자 행동 데이터를 AI가 실시간으로 분석하여<br />
              CTR(클릭률) 예측 모델을 통해 마케팅 전략 인사이트를 제공합니다.
            </p>
            <p class="highlight-text">
              SK AX가 제공하는 AI 기반 플랫폼으로<br />
              <span class="gradient-text">데이터 기반 마케팅 전략과 실행 가능한 액션 플랜</span>을 실현합니다.
            </p>
          </div>
          <div class="client-services">
            <div class="service-badge">OK캐쉬백</div>
            <div class="service-badge">Syrup</div>
            <div class="service-badge">오!락</div>
            <div class="service-badge">마케팅 솔루션</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Navigation - HS Ad Style -->
    <section class="interactive-section">
      <div class="container">
        <div class="interactive-content" data-aos="zoom-in">
          <h2 class="interactive-title">
            <span class="greeting-text">만나서 반갑습니다!</span><br />
            무엇을 도와드릴까요?
          </h2>
          
          <div class="selection-area">
            <div class="selection-row">
              <span class="selection-label">나는</span>
              <el-select
                v-model="selectedRole"
                placeholder="선택하세요"
                size="large"
                class="role-select"
                @change="handleRoleChange"
              >
                <el-option label="고객사 담당자" value="client" />
                <el-option label="SI 업체 담당자" value="si" />
                <el-option label="마케팅 매니저" value="marketing" />
                <el-option label="데이터 분석가" value="analyst" />
                <el-option label="경영진" value="executive" />
                <el-option label="방문객" value="visitor" />
              </el-select>
              <span class="selection-label">이며,</span>
            </div>
            
            <div class="selection-row">
              <el-select
                v-model="selectedTopic"
                placeholder="관심 주제를 선택하세요"
                size="large"
                class="topic-select"
                @change="handleTopicChange"
              >
                <el-option label="서비스 소개" value="service" />
                <el-option label="AI 분석 기능" value="ai-features" />
                <el-option label="실시간 모니터링" value="monitoring" />
                <el-option label="보고서 샘플" value="reports" />
                <el-option label="도입 사례" value="cases" />
                <el-option label="가격 정책" value="pricing" />
                <el-option label="문의하기" value="contact" />
              </el-select>
              <span class="selection-label">에 대한 내용이 궁금해요.</span>
            </div>
          </div>

          <el-button
            type="primary"
            size="large"
            class="go-button"
            :disabled="!selectedRole || !selectedTopic"
            @click="navigateToContent"
          >
            알아보기
            <el-icon><ArrowRight /></el-icon>
          </el-button>

          <div v-if="recommendedPath" class="recommendation">
            <el-icon><InfoFilled /></el-icon>
            {{ recommendedPath }}
          </div>
        </div>
      </div>
    </section>

    <!-- Company Overview - SK AX -->
    <section class="company-section">
      <div class="container">
        <div class="company-content" data-aos="fade-up">
          <div class="company-logo">
            <h1>SK AX</h1>
          </div>
          <div class="company-description">
            <h3>AI와 데이터로 비즈니스를 혁신합니다</h3>
            <p>
              SK AX는 SK그룹의 AI/DX 전문 계열사로, 기업의 디지털 전환과 AI 적용을 선도하고 있습니다.
              최첨단 AI 기술과 빅데이터 분석 역량을 바탕으로 고객의 비즈니스 성과를 극대화하는 
              맞춤형 솔루션을 제공합니다.
            </p>
            <div class="company-stats">
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">AI 프로젝트</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">200+</div>
                <div class="stat-label">고객사</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">98%</div>
                <div class="stat-label">고객 만족도</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Overview -->
    <section class="service-section" id="features">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">CTR AIOps 서비스</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          AI 기반 자동화로 마케팅 의사결정을 더 빠르고 정확하게
        </p>
        <div class="service-grid">
          <div class="service-card" data-aos="fade-up" data-aos-delay="200">
            <div class="service-icon">
              <el-icon :size="40" color="#3498db"><DataAnalysis /></el-icon>
            </div>
            <h3>AI 자동 분석</h3>
            <p>딥러닝 모델이 수만 건의 데이터를 분석하여 숨겨진 패턴을 발견합니다</p>
          </div>
          <div class="service-card" data-aos="fade-up" data-aos-delay="300">
            <div class="service-icon">
              <el-icon :size="40" color="#67c23a"><Document /></el-icon>
            </div>
            <h3>통계적 근거</h3>
            <p>p-value, 신뢰구간 등 통계적 검증을 통해 신뢰할 수 있는 인사이트 제공</p>
          </div>
          <div class="service-card" data-aos="fade-up" data-aos-delay="400">
            <div class="service-icon">
              <el-icon :size="40" color="#e6a23c"><Monitor /></el-icon>
            </div>
            <h3>실시간 모니터링</h3>
            <p>모델 성능을 실시간으로 추적하고 이상 징후를 즉시 알림</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">주요 기능</h2>
        
        <!-- Feature 1: 고객사 대시보드 -->
        <div class="feature-row">
          <div class="feature-content" data-aos="fade-right">
            <span class="feature-tag">고객사 대시보드</span>
            <h3>SK Planet을 위한<br/>맞춤형 대시보드</h3>
            <ul class="feature-list">
              <li><el-icon><Check /></el-icon> 비즈니스 중심 인사이트 & ROI 분석</li>
              <li><el-icon><Check /></el-icon> 마케팅 전략 추천 & 액션 플랜</li>
              <li><el-icon><Check /></el-icon> 실시간 성과 모니터링</li>
            </ul>
          </div>
          <div class="feature-visual" data-aos="fade-left">
            <div class="dashboard-preview">
              <div class="preview-tab active">고객사 대시보드</div>
              <div class="preview-content">
                <div class="preview-metric">
                  <span>CTR 향상</span>
                  <strong>25%</strong>
                </div>
                <div class="preview-metric">
                  <span>ROI 증대</span>
                  <strong>1.5배</strong>
                </div>
                <div class="preview-metric">
                  <span>추가 수익</span>
                  <strong>1.25억원</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 2: AI 보고서 -->
        <div class="feature-row reverse">
          <div class="feature-content" data-aos="fade-left">
            <span class="feature-tag">AI 보고서</span>
            <h3>생성형 AI 기반<br/>마케팅 전략 보고서</h3>
            <ul class="feature-list">
              <li><el-icon><Check /></el-icon> 자연어로 작성된 실행 가능한 인사이트</li>
              <li><el-icon><Check /></el-icon> 피처 중요도 분석 & 통계적 근거 제시</li>
              <li><el-icon><Check /></el-icon> ROI 시뮬레이션 & 최적 전략 추천</li>
            </ul>
          </div>
          <div class="feature-visual" data-aos="fade-right">
            <div class="report-preview">
              <div class="report-header">
                <el-icon><Document /></el-icon>
                <span>AI 생성 보고서</span>
              </div>
              <div class="report-content">
                <div class="insight-item">
                  💡 "20-30대 여성 고객의 클릭률이 오후 8-10시에 가장 높습니다"
                </div>
                <div class="insight-item">
                  📊 "모바일 광고 위치 상단이 CTR 23% 증가 효과"
                </div>
                <div class="insight-item">
                  🎯 "추천: 타겟 세그먼트별 차별화된 광고 소재 활용"
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 3: 실시간 알림 -->
        <div class="feature-row">
          <div class="feature-content" data-aos="fade-right">
            <span class="feature-tag">성능 알림</span>
            <h3>실시간 성능 모니터링<br/>& 자동 알림 시스템</h3>
            <ul class="feature-list">
              <li><el-icon><Check /></el-icon> Accuracy < 0.7 시 자동 경고</li>
              <li><el-icon><Check /></el-icon> WebSocket 기반 실시간 푸시</li>
              <li><el-icon><Check /></el-icon> 성능 저하 원인 자동 분석 & 재학습 제안</li>
            </ul>
          </div>
          <div class="feature-visual" data-aos="fade-left">
            <div class="alert-preview">
              <el-alert
                title="성능 경고"
                type="warning"
                description="모델 정확도가 0.68로 하락했습니다. 재학습을 권장합니다."
                show-icon
                :closable="false"
              />
              <el-alert
                title="학습 완료"
                type="success"
                description="새로운 모델 학습이 완료되었습니다. Accuracy: 0.875"
                show-icon
                :closable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Performance Metrics -->
    <section class="metrics-section" id="metrics">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">성능 지표</h2>
        <div class="metrics-grid">
          <div class="metric-card" data-aos="flip-up" data-aos-delay="200">
            <div class="metric-value">87.5%</div>
            <div class="metric-label">평균 정확도</div>
          </div>
          <div class="metric-card" data-aos="flip-up" data-aos-delay="300">
            <div class="metric-value">&lt; 100ms</div>
            <div class="metric-label">추론 속도</div>
          </div>
          <div class="metric-card" data-aos="flip-up" data-aos-delay="400">
            <div class="metric-value">99.9%</div>
            <div class="metric-label">가용성</div>
          </div>
          <div class="metric-card" data-aos="flip-up" data-aos-delay="500">
            <div class="metric-value">+25%</div>
            <div class="metric-label">ROI 증대</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="contact">
      <div class="container">
        <div class="cta-content" data-aos="zoom-in">
          <h2>지금 바로 시작하세요</h2>
          <p>데이터 기반 마케팅 의사결정의 새로운 기준</p>
          <div class="cta-actions">
            <el-button type="primary" size="large" @click="startDemo">
              무료 데모 신청
            </el-button>
            <el-button size="large" plain @click="contactUs">
              문의하기
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>SK AX</h3>
            <p class="company-slogan">AI eXcellence, Accelerate Your Future</p>
            <p>
              SK그룹의 AI/DX 전문 계열사<br />
              혁신적인 AI 솔루션으로 비즈니스를 혁신합니다
            </p>
          </div>
          <div class="footer-section">
            <h4>서비스</h4>
            <ul>
              <li><a href="#features">CTR AIOps</a></li>
              <li><a href="#">AI 컨설팅</a></li>
              <li><a href="#">MLOps 솔루션</a></li>
              <li><a href="#">데이터 분석</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>회사</h4>
            <ul>
              <li><a href="#">회사 소개</a></li>
              <li><a href="#">사업 영역</a></li>
              <li><a href="#">채용</a></li>
              <li><a href="#">파트너십</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>문의</h4>
            <p>Email: contact@sk-ax.com</p>
            <p>Tel: 02-6400-0000</p>
            <p>서울특별시 중구 을지로 SK서린빌딩</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 SK AX. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AOS from 'aos'
import 'aos/dist/aos.css'
import {
  VideoPlay,
  ArrowDown,
  ArrowRight,
  InfoFilled,
  DataAnalysis,
  Document,
  Monitor,
  Check,
  TrendCharts,
  Timer,
  Checked
} from '@element-plus/icons-vue'

const router = useRouter()

// Interactive Section State
const selectedRole = ref('')
const selectedTopic = ref('')
const recommendedPath = ref('')

// 애니메이션 초기화
onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  })
})

// 스크롤 함수
const scrollToFeatures = () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
}

const scrollToContact = () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
}

// Interactive Section 함수
const handleRoleChange = (role) => {
  updateRecommendation()
}

const handleTopicChange = (topic) => {
  updateRecommendation()
}

const updateRecommendation = () => {
  if (selectedRole.value && selectedTopic.value) {
    const roleMap = {
      client: '고객사 담당자',
      si: 'SI 업체 담당자',
      marketing: '마케팅 매니저',
      analyst: '데이터 분석가',
      executive: '경영진',
      visitor: '방문객'
    }
    
    const topicMap = {
      service: '서비스 소개 페이지',
      'ai-features': 'AI 분석 기능 상세',
      monitoring: '실시간 모니터링 대시보드',
      reports: '보고서 샘플 보기',
      cases: '도입 사례 소개',
      pricing: '가격 정책 안내',
      contact: '문의하기'
    }
    
    recommendedPath.value = `${roleMap[selectedRole.value]}님을 위한 "${topicMap[selectedTopic.value]}"로 안내합니다.`
  }
}

const navigateToContent = () => {
  const navigationMap = {
    service: '#features',
    'ai-features': '#features',
    monitoring: '/dashboard/si',
    reports: '/dashboard/client',
    tech: '#tech',
    cases: '#metrics',
    pricing: '#contact',
    contact: '#contact'
  }
  
  const target = navigationMap[selectedTopic.value]
  
  if (target.startsWith('#')) {
    const element = document.querySelector(target)
    element?.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push(target)
  }
}

// 액션 함수
const startDemo = () => {
  router.push('/upload')
}

const contactUs = () => {
  scrollToContact()
}
</script>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg-secondary);
}

/* Hero Section - 모던한 그라디언트 */
.hero-section {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 56px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-title .highlight {
  color: #fbbf24;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.9;
}

.company-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  width: fit-content;
}

.badge-text {
  font-size: 14px;
  opacity: 0.8;
}

.badge-company {
  font-size: 18px;
  font-weight: bold;
  color: #ffd700;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: white;
  color: #333;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  animation: float 3s ease-in-out infinite;
}

.floating-card.card-1 {
  top: 50px;
  left: 0;
}

.floating-card.card-2 {
  top: 180px;
  right: 50px;
  animation-delay: 1s;
}

.floating-card.card-3 {
  bottom: 80px;
  left: 100px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

/* Sections */
section {
  padding: 100px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Client Intro Section - SK Planet */
.client-intro-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 100px 20px;
}

.client-banner {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.client-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 24px;
}

.client-logo h1 {
  font-size: 64px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.client-tagline {
  font-size: 18px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 32px;
}

.client-description {
  margin: 32px 0;
}

.client-description p {
  font-size: 18px;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 16px;
}

.client-description strong {
  color: #667eea;
  font-weight: 600;
}

.highlight-text {
  font-size: 20px;
  font-weight: 500;
  margin-top: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: bold;
}

.client-services {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.service-badge {
  padding: 12px 24px;
  background: white;
  border-radius: 24px;
  font-weight: 600;
  color: #2c3e50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.service-badge:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Interactive Section - HS Ad Style */
.interactive-section {
  background: white;
  padding: 100px 20px;
}

.interactive-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.interactive-title {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 48px;
  line-height: 1.5;
}

.greeting-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.selection-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.selection-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.selection-label {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 500;
}

.role-select,
.topic-select {
  min-width: 200px;
}

:deep(.role-select .el-input__wrapper),
:deep(.topic-select .el-input__wrapper) {
  border-radius: 24px;
  border: 2px solid #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transition: all 0.3s;
}

:deep(.role-select .el-input__wrapper:hover),
:deep(.topic-select .el-input__wrapper:hover) {
  border-color: #764ba2;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.go-button {
  min-width: 200px;
  height: 50px;
  font-size: 18px;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.go-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.recommendation {
  margin-top: 24px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-radius: 12px;
  color: #667eea;
  font-size: 16px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Company Section */
.company-section {
  background: white;
  padding: 80px 20px;
}

.company-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 60px;
  align-items: center;
}

.company-logo h1 {
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-description h3 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 16px;
}

.company-description p {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 24px;
}

.company-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.section-title {
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #2c3e50;
}

.section-subtitle {
  font-size: 18px;
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 60px;
}

/* Service Section */
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.service-card {
  text-align: center;
  padding: 40px 30px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-card h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.service-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* Features Section */
.features-section {
  background: #f8f9fa;
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  margin-bottom: 100px;
}

.feature-row.reverse {
  direction: rtl;
}

.feature-row.reverse > * {
  direction: ltr;
}

.feature-tag {
  display: inline-block;
  padding: 6px 16px;
  background: #3498db20;
  color: #3498db;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.feature-content h3 {
  font-size: 36px;
  line-height: 1.3;
  margin-bottom: 24px;
  color: #2c3e50;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #555;
  margin-bottom: 16px;
}

.feature-visual {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}


/* Metrics Section */
.metrics-section {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  color: white;
}

.metrics-section .section-title {
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.metric-card {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.metric-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 16px;
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  background: #2c3e50;
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 42px;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Footer */
.footer {
  background: #34495e;
  color: #ecf0f1;
  padding: 60px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  font-size: 24px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-section h4 {
  margin-bottom: 16px;
  font-size: 16px;
}

.company-slogan {
  font-size: 13px;
  font-style: italic;
  color: #95a5a6;
  margin-bottom: 12px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #3498db;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #7f8c8d;
  color: #95a5a6;
}

/* 반응형 */
@media (max-width: 1024px) {
  .hero-content,
  .feature-row,
  .metrics-grid,
  .company-content {
    grid-template-columns: 1fr;
  }
  
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .selection-row {
    flex-direction: column;
  }
  
  .client-logo h1 {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .service-grid,
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .company-logo h1 {
    font-size: 48px;
  }
  
  .company-stats {
    gap: 20px;
  }
  
  .client-logo h1 {
    font-size: 40px;
  }
  
  .interactive-title {
    font-size: 28px;
  }
  
  .selection-label {
    font-size: 16px;
  }
  
  .gradient-text {
    font-size: 18px;
  }
}
</style>

