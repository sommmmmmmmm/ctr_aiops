#!/bin/bash

# CTR AIOps Vercel 배포 스크립트
# Usage: ./deploy.sh [production|preview]

echo "🚀 CTR AIOps 배포 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 배포 타입 (기본값: preview)
DEPLOY_TYPE=${1:-preview}

# 1. 의존성 체크
echo -e "${BLUE}📦 의존성 확인 중...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI가 설치되어 있지 않습니다.${NC}"
    echo -e "${YELLOW}다음 명령어로 설치하세요: npm install -g vercel${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Vercel CLI 설치 확인${NC}"
echo ""

# 2. Frontend 빌드 테스트
echo -e "${BLUE}🔨 Frontend 빌드 테스트 중...${NC}"
cd frontend
npm install
if ! npm run build; then
    echo -e "${RED}❌ Frontend 빌드 실패${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend 빌드 성공${NC}"
cd ..
echo ""

# 3. Vercel 배포
echo -e "${BLUE}☁️  Vercel에 배포 중...${NC}"
if [ "$DEPLOY_TYPE" == "production" ]; then
    echo -e "${YELLOW}🚀 Production 배포${NC}"
    vercel --prod
else
    echo -e "${YELLOW}🔍 Preview 배포${NC}"
    vercel
fi

echo ""
echo -e "${GREEN}✅ 배포 완료!${NC}"
echo ""
echo -e "${BLUE}📝 다음 단계:${NC}"
echo "1. Vercel Dashboard에서 환경변수 설정"
echo "   - VITE_API_BASE_URL: 백엔드 API URL"
echo "   - VITE_WS_URL: 백엔드 WebSocket URL"
echo "2. 백엔드 배포 (Render/Railway 추천)"
echo "3. Frontend 재배포 (환경변수 적용)"
echo ""
echo -e "${YELLOW}📖 자세한 가이드: DEPLOYMENT_GUIDE.md 참조${NC}"

