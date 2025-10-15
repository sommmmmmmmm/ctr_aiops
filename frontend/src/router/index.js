import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import SIDashboard from '../views/SIDashboard.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import DataUpload from '../views/DataUpload.vue'
import TrainingMonitor from '../views/TrainingMonitor.vue'
import AIReport from '../views/AIReport.vue'
import APITester from '../views/APITester.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    meta: { title: '홈', layout: 'landing' }
  },
  {
    path: '/dashboard/si',
    name: 'SIDashboard',
    component: SIDashboard,
    meta: { title: 'SI 대시보드', role: 'si' }
  },
  {
    path: '/dashboard/client',
    name: 'ClientDashboard',
    component: ClientDashboard,
    meta: { title: '고객사 대시보드', role: 'client' }
  },
  {
    path: '/upload',
    name: 'DataUpload',
    component: DataUpload,
    meta: { title: '데이터 업로드' }
  },
  {
    path: '/training/:runId?',
    name: 'TrainingMonitor',
    component: TrainingMonitor,
    meta: { title: '학습 모니터링' }
  },
  {
    path: '/report/:runId',
    name: 'AIReport',
    component: AIReport,
    meta: { title: 'AI 생성 보고서' }
  },
  {
    path: '/api-tester',
    name: 'APITester',
    component: APITester,
    meta: { title: 'API 테스터' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 페이지 타이틀 설정
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SK AX AIOps` || 'SK AX AIOps'
  next()
})

export default router

