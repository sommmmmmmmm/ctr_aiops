"""
AI Report Service - 생성형 AI 보고서 생성
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

class AIReportService:
    def __init__(self, openai_api_key: str = None):
        self.openai_api_key = openai_api_key
        self.use_openai = bool(openai_api_key)
        
        # Mock AI responses for development
        self.mock_responses = {
            "summary": """
            SK Planet의 광고 사이트 사용자 행동 분석 결과, CTR 예측 모델이 87.5%의 높은 정확도를 달성했습니다. 
            주요 인사이트로는 시간대별 클릭 패턴, 사용자 연령대별 선호도, 광고 위치 효과 등이 발견되었습니다.
            이를 바탕으로 마케팅 전략 최적화를 통해 25%의 CTR 향상과 1.5배의 ROI 증대가 기대됩니다.
            """,
            "insights": [
                {
                    "title": "시간대별 클릭 패턴 분석",
                    "description": "오후 2-4시와 저녁 8-10시에 클릭률이 가장 높게 나타났습니다. 이는 사용자의 활동 패턴과 일치합니다.",
                    "impact": "high",
                    "recommendation": "타겟 시간대에 광고 집중 배치 권장"
                },
                {
                    "title": "연령대별 광고 선호도",
                    "description": "20-30대는 모바일 광고에, 40-50대는 데스크톱 광고에 더 높은 반응을 보였습니다.",
                    "impact": "high",
                    "recommendation": "연령대별 맞춤형 광고 전략 수립"
                },
                {
                    "title": "광고 위치별 효과성",
                    "description": "상단 배너와 사이드바 광고가 가장 효과적이며, 하단 광고는 상대적으로 낮은 성과를 보였습니다.",
                    "impact": "medium",
                    "recommendation": "효과적인 위치에 광고 비중 증가"
                },
                {
                    "title": "사용자 행동 시퀀스 패턴",
                    "description": "검색 → 상품 확인 → 장바구니 → 구매 순서의 전형적인 패턴이 확인되었습니다.",
                    "impact": "high",
                    "recommendation": "각 단계별 맞춤형 리타겟팅 전략"
                }
            ],
            "action_plan": [
                {
                    "priority": "high",
                    "action": "시간대 최적화",
                    "description": "오후 2-4시, 저녁 8-10시에 광고 집중 배치",
                    "expected_impact": "CTR 15% 향상",
                    "timeline": "즉시 적용 가능"
                },
                {
                    "priority": "high",
                    "action": "연령대별 맞춤 광고",
                    "description": "20-30대는 모바일 최적화, 40-50대는 데스크톱 중심 광고",
                    "expected_impact": "타겟 정확도 20% 향상",
                    "timeline": "2주 내 구현"
                },
                {
                    "priority": "medium",
                    "action": "광고 위치 재배치",
                    "description": "상단 배너와 사이드바 광고 비중 증가",
                    "expected_impact": "전체 CTR 8% 향상",
                    "timeline": "1주 내 적용"
                },
                {
                    "priority": "medium",
                    "action": "리타겟팅 캠페인 강화",
                    "description": "사용자 행동 단계별 맞춤형 광고 제공",
                    "expected_impact": "전환율 12% 향상",
                    "timeline": "3주 내 구현"
                }
            ]
        }
    
    async def generate_report(self, run_id: str, training_results: Dict[str, Any], 
                            feature_importance: list = None) -> Dict[str, Any]:
        """Generate AI-powered report"""
        try:
            if self.use_openai and self.openai_api_key:
                report = await self._generate_with_openai(run_id, training_results, feature_importance)
            else:
                report = await self._generate_mock_report(run_id, training_results, feature_importance)
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating report: {str(e)}")
            return await self._generate_mock_report(run_id, training_results, feature_importance)
    
    async def _generate_with_openai(self, run_id: str, training_results: Dict[str, Any], 
                                  feature_importance: list = None) -> Dict[str, Any]:
        """Generate report using OpenAI API"""
        try:
            import openai
            
            # Set API key
            openai.api_key = self.openai_api_key
            
            # Prepare context
            context = self._prepare_context(training_results, feature_importance)
            
            # Generate executive summary
            summary_prompt = f"""
            SK Planet의 광고 사이트 사용자 행동 분석 결과를 바탕으로 마케팅 인사이트 보고서의 Executive Summary를 작성해주세요.
            
            분석 결과:
            - 모델 정확도: {training_results.get('metrics', {}).get('final_val_accuracy', 0):.1%}
            - 주요 피처: {', '.join([f['feature'] for f in feature_importance[:5]]) if feature_importance else 'N/A'}
            
            다음 내용을 포함해주세요:
            1. 전체적인 성과 요약
            2. 주요 발견사항
            3. 기대 효과
            4. 핵심 권장사항
            
            전문적이면서도 이해하기 쉬운 톤으로 작성해주세요.
            """
            
            summary_response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": summary_prompt}],
                max_tokens=500
            )
            
            summary = summary_response.choices[0].message.content.strip()
            
            # Generate insights
            insights_prompt = f"""
            다음 분석 결과를 바탕으로 마케팅 인사이트 4개를 생성해주세요:
            
            {context}
            
            각 인사이트는 다음 형식으로 작성해주세요:
            - title: 인사이트 제목
            - description: 상세 설명
            - impact: high/medium/low
            - recommendation: 구체적인 권장사항
            
            JSON 배열 형태로 응답해주세요.
            """
            
            insights_response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": insights_prompt}],
                max_tokens=800
            )
            
            insights_text = insights_response.choices[0].message.content.strip()
            insights = json.loads(insights_text)
            
            # Generate action plan
            action_prompt = f"""
            위 인사이트를 바탕으로 실행 가능한 액션 플랜 4개를 생성해주세요:
            
            각 액션 플랜은 다음 형식으로 작성해주세요:
            - priority: high/medium/low
            - action: 액션 제목
            - description: 구체적인 실행 방법
            - expected_impact: 기대 효과
            - timeline: 실행 일정
            
            JSON 배열 형태로 응답해주세요.
            """
            
            action_response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": action_prompt}],
                max_tokens=600
            )
            
            action_text = action_response.choices[0].message.content.strip()
            action_plan = json.loads(action_text)
            
            return {
                "summary": summary,
                "insights": insights,
                "action_plan": action_plan,
                "generated_at": datetime.now().isoformat(),
                "model_used": "gpt-4"
            }
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return await self._generate_mock_report(run_id, training_results, feature_importance)
    
    async def _generate_mock_report(self, run_id: str, training_results: Dict[str, Any], 
                                  feature_importance: list = None) -> Dict[str, Any]:
        """Generate mock report for development"""
        # Customize mock responses based on actual results
        accuracy = training_results.get('metrics', {}).get('final_val_accuracy', 0.875)
        
        # Adjust summary based on accuracy
        if accuracy > 0.9:
            performance_text = "매우 높은 정확도(90% 이상)"
            impact_text = "30%의 CTR 향상과 2배의 ROI 증대"
        elif accuracy > 0.85:
            performance_text = "높은 정확도(85% 이상)"
            impact_text = "25%의 CTR 향상과 1.5배의 ROI 증대"
        else:
            performance_text = "양호한 정확도"
            impact_text = "15%의 CTR 향상과 1.2배의 ROI 증대"
        
        summary = f"""
        SK Planet의 광고 사이트 사용자 행동 분석 결과, CTR 예측 모델이 {performance_text}를 달성했습니다.
        주요 인사이트로는 시간대별 클릭 패턴, 사용자 연령대별 선호도, 광고 위치 효과 등이 발견되었습니다.
        이를 바탕으로 마케팅 전략 최적화를 통해 {impact_text}가 기대됩니다.
        """
        
        return {
            "summary": summary.strip(),
            "insights": self.mock_responses["insights"],
            "action_plan": self.mock_responses["action_plan"],
            "generated_at": datetime.now().isoformat(),
            "model_used": "mock-ai"
        }
    
    def _prepare_context(self, training_results: Dict[str, Any], feature_importance: list = None) -> str:
        """Prepare context for AI generation"""
        context_parts = []
        
        # Model performance
        metrics = training_results.get('metrics', {})
        context_parts.append(f"모델 성능:")
        context_parts.append(f"- 정확도: {metrics.get('final_val_accuracy', 0):.1%}")
        context_parts.append(f"- 최고 검증 정확도: {metrics.get('best_val_accuracy', 0):.1%}")
        
        # Feature importance
        if feature_importance:
            context_parts.append(f"\n주요 피처 중요도:")
            for i, feature in enumerate(feature_importance[:10], 1):
                context_parts.append(f"{i}. {feature['feature']}: {feature['importance']:.3f}")
        
        # Training configuration
        config = training_results.get('config', {})
        context_parts.append(f"\n학습 설정:")
        context_parts.append(f"- 에포크: {config.get('epochs', 10)}")
        context_parts.append(f"- 배치 크기: {config.get('batch_size', 1024)}")
        context_parts.append(f"- 학습률: {config.get('learning_rate', 0.001)}")
        
        return "\n".join(context_parts)
    
    def get_report_summary(self, report: Dict[str, Any]) -> Dict[str, Any]:
        """Get summary statistics for report"""
        return {
            "accuracy": 87.5,  # Mock value, should be from actual results
            "roiIncrease": 25,
            "additionalRevenue": 1.25,
            "insights_count": len(report.get("insights", [])),
            "actions_count": len(report.get("action_plan", [])),
            "generated_at": report.get("generated_at"),
            "model_used": report.get("model_used", "unknown")
        }
