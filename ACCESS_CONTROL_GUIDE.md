# 🔒 접근 제어 가이드

## 기본 동작: 전 세계 공개 🌍

Vercel로 배포하면 **기본적으로 누구나 접속 가능**합니다!
- URL만 알면 전 세계 어디서든 접속 가능
- 검색 엔진에도 노출 가능
- 완전 무료

---

## 옵션 1: 완전 공개 (현재 설정) ✅

### 장점
- 👥 누구나 접속 가능
- 🚀 빠른 공유 (URL만 전송)
- 📱 포트폴리오/데모 용도로 최적
- 💰 완전 무료

### 사용 예시
```bash
# 배포
vercel --prod

# URL 공유
"우리 프로젝트: https://ctr-aiops.vercel.app"
```

---

## 옵션 2: 비밀번호 보호 (간단) 🔐

Preview 배포만 비밀번호로 보호 (Vercel Pro 필요)

### Vercel Dashboard 설정
1. Project → Settings → Password Protection
2. 비밀번호 설정
3. Preview 배포에만 적용

### 무료 대안: Frontend에 간단한 로그인 추가

`frontend/src/views/LandingPage.vue`에 간단한 비밀번호 체크 추가:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const isAuthenticated = ref(false)
const password = ref('')

onMounted(() => {
  const auth = sessionStorage.getItem('auth')
  if (auth === 'authenticated') {
    isAuthenticated.value = true
  }
})

const checkPassword = () => {
  // 간단한 비밀번호 (실제 운영에서는 백엔드 인증 필요)
  if (password.value === 'skplanet2024') {
    sessionStorage.setItem('auth', 'authenticated')
    isAuthenticated.value = true
  } else {
    alert('비밀번호가 틀렸습니다')
  }
}
</script>

<template>
  <div v-if="!isAuthenticated" class="password-screen">
    <h2>접근 인증 필요</h2>
    <input v-model="password" type="password" placeholder="비밀번호">
    <button @click="checkPassword">확인</button>
  </div>
  <div v-else>
    <!-- 실제 콘텐츠 -->
  </div>
</template>
```

---

## 옵션 3: IP 화이트리스트 (고급) 🏢

특정 IP만 접속 허용

### Vercel Enterprise 필요
- 회사 IP만 허용
- VPN 사용자만 허용

### 무료 대안: Cloudflare 사용
1. Cloudflare 계정 생성 (무료)
2. 도메인 연결
3. Firewall Rules 설정
4. IP 화이트리스트 추가

---

## 옵션 4: 인증 시스템 (전문적) 🔐

### JWT 기반 로그인
- 회원가입/로그인 기능
- 이메일 인증
- 역할 기반 접근 제어 (RBAC)

### 구현 예시
```javascript
// Frontend: 로그인 체크
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

// Backend: JWT 검증
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials = Depends(security)):
    token = credentials.credentials
    # JWT 토큰 검증 로직
    if not valid_token(token):
        raise HTTPException(status_code=401)
```

---

## 옵션 5: 검색 엔진 노출 방지 🕵️

### robots.txt 추가

`frontend/public/robots.txt`:
```
User-agent: *
Disallow: /
```

### meta 태그 추가
```html
<meta name="robots" content="noindex, nofollow">
```

---

## 🎯 추천 시나리오

### 포트폴리오/데모 → 완전 공개 ✅
- 현재 설정 그대로
- URL만 공유하면 OK
- 가장 간단하고 효과적

### 내부 테스트 → 간단한 비밀번호
- Frontend에 비밀번호 체크 추가
- 팀원에게만 비밀번호 공유

### 기업 운영 → JWT 인증
- 본격적인 로그인 시스템
- 역할별 권한 관리
- Backend 인증 필수

---

## 📊 비교표

| 방법 | 보안 수준 | 구현 난이도 | 비용 | 추천도 |
|------|-----------|-------------|------|--------|
| 완전 공개 | ⭐ | ⭐ | 무료 | ⭐⭐⭐⭐⭐ (데모) |
| 비밀번호 보호 | ⭐⭐ | ⭐⭐ | 무료 | ⭐⭐⭐⭐ (내부) |
| IP 화이트리스트 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 유료 | ⭐⭐⭐ (기업) |
| JWT 인증 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 무료 | ⭐⭐⭐⭐⭐ (운영) |

---

## 🚀 현재 설정으로 바로 배포

**지금 바로 배포해도 괜찮습니다!**

```bash
# 공개 배포
vercel --prod

# URL 공유
"데모 사이트: https://ctr-aiops.vercel.app"
```

### 나중에 변경 가능
- 언제든지 인증 시스템 추가 가능
- 배포 후에도 설정 변경 가능
- 일단 공개로 시작하고 필요시 제한 추가

---

## 💡 실전 팁

### URL 공유 시
```
✅ 좋은 예:
"SK Planet AIOps 데모입니다: https://ctr-aiops.vercel.app
AI 기반 CTR 예측 시스템을 확인해보세요!"

❌ 나쁜 예:
"여기 들어가봐: https://ctr-aiops-abc123xyz.vercel.app"
```

### Preview vs Production
- **Preview**: 테스트용, 매번 새 URL
- **Production**: 운영용, 고정 URL (공유용으로 최적)

---

## 🎉 결론

**지금 배포하면 → 전 세계 누구나 접속 가능!**

이게 바로 Vercel의 강력한 기능입니다:
- ✅ 즉시 공유 가능
- ✅ 포트폴리오로 활용
- ✅ 고객 데모
- ✅ 팀 협업

필요하면 나중에 인증 추가하면 됩니다! 🚀

