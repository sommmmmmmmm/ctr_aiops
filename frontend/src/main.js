import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import './style.css'

// 모던한 색상 체계를 전역 CSS 변수로 설정
const style = document.createElement('style')
style.textContent = `
:root {
  /* Primary Colors - 딥 블루 계열 */
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  
  /* Secondary Colors - 퍼플 계열 */
  --secondary: #7c3aed;
  --secondary-dark: #6d28d9;
  --secondary-light: #8b5cf6;
  
  /* Accent Colors - 그린 계열 */
  --accent: #059669;
  --accent-dark: #047857;
  --accent-light: #10b981;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Background & Text */
  --bg-primary: #ffffff;
  --bg-secondary: var(--gray-50);
  --bg-tertiary: var(--gray-100);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-muted: var(--gray-500);
}

body {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Element Plus 테마 커스터마이징 */
.el-button--primary {
  background-color: var(--primary);
  border-color: var(--primary);
}

.el-button--primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.el-menu-item.is-active {
  color: var(--primary);
  background-color: rgba(37, 99, 235, 0.1);
}

/* Gradient Utilities */
.gradient-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
}

.gradient-accent {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
}

.gradient-mixed {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}
`
document.head.appendChild(style)

const app = createApp(App)
const pinia = createPinia()

// Element Plus Icons 등록
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

