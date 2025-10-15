# ⚡ 3분 만에 배포하기

## 🚀 최소 단계로 배포하기

### 1. Vercel CLI 설치 및 로그인

```bash
npm install -g vercel
vercel login
```

### 2. 프로젝트 배포

```bash
cd /Users/jangsomin/workspace/ctr_aiops

# 한 줄로 배포
vercel --prod
```

### 3. 완료! 🎉

배포된 URL을 확인하고 브라우저에서 접속하세요.

---

## 📌 Backend가 필요한 경우

### Render 1-Click 배포

1. https://render.com 가입
2. **New Web Service**
3. GitHub 저장소 연결
4. 다음 입력:
   ```
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **Create**

### Backend URL을 Vercel에 연결

Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Redeploy!

---

## 🎯 그게 전부입니다!

더 자세한 내용은:
- `VERCEL_DEPLOYMENT_CHECKLIST.md` - 체크리스트
- `DEPLOYMENT_GUIDE.md` - 완전 가이드

