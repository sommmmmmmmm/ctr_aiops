<template>
  <div v-if="isLandingPage">
    <!-- 랜딩 페이지는 레이아웃 없이 -->
    <router-view />
  </div>
  <el-container v-else class="app-container">
    <!-- 사이드바 -->
    <el-aside width="240px" class="sidebar">
        <div class="logo" @click="goToLanding">
          <h2>SK AX</h2>
          <p class="logo-subtitle">AIOps</p>
        </div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        router
        @select="handleSelect"
      >
        <el-menu-item index="/dashboard/si">
          <el-icon><Setting /></el-icon>
          <span>SI 대시보드</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/client">
          <el-icon><User /></el-icon>
          <span>고객사 대시보드</span>
        </el-menu-item>
        <el-menu-item index="/upload">
          <el-icon><Upload /></el-icon>
          <span>데이터 업로드</span>
        </el-menu-item>
        <el-menu-item index="/training">
          <el-icon><Monitor /></el-icon>
          <span>학습 모니터링</span>
        </el-menu-item>
        <el-menu-item index="/report/latest">
          <el-icon><Document /></el-icon>
          <span>AI 보고서</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 메인 컨텐츠 -->
    <el-container>
      <!-- 헤더 -->
      <el-header class="header">
        <div class="header-content">
          <h3>{{ currentPageTitle }}</h3>
          <div class="header-actions">
            <el-badge :value="12" class="notification-badge">
              <el-icon :size="20"><Bell /></el-icon>
            </el-badge>
            <el-dropdown>
              <el-avatar class="user-avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>프로필</el-dropdown-item>
                  <el-dropdown-item>설정</el-dropdown-item>
                  <el-dropdown-item divided>로그아웃</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <!-- 본문 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <!-- 푸터 -->
      <el-footer class="footer">
        <span>© 2025 CTR AIOps. All Rights Reserved.</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataBoard,
  Upload,
  Monitor,
  Document,
  User,
  Setting,
  Bell
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const isLandingPage = computed(() => route.meta.layout === 'landing')
const activeIndex = computed(() => route.path)

const currentPageTitle = computed(() => {
  return route.meta.title || '대시보드'
})

const handleSelect = (index) => {
  console.log('Selected:', index)
}

const goToLanding = () => {
  router.push('/')
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  background-color: var(--bg-secondary);
}

.sidebar {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-right: 2px solid var(--primary);
  box-shadow: 2px 0 8px rgba(37, 99, 235, 0.1);
}

.logo {
  padding: 24px 20px;
  text-align: center;
  border-bottom: 2px solid var(--primary);
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0;
  font-size: 12px;
  font-weight: normal;
}

.el-menu-vertical {
  border-right: none;
  background-color: #2c3e50;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #ecf0f1 !important;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #34495e !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #3498db !important;
  color: white !important;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  cursor: pointer;
}

.user-avatar {
  cursor: pointer;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

.footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

/* 페이지 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* 전역 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100vh;
}
</style>

