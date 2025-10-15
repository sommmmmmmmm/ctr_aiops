"""
PDF Service - AI 보고서 PDF 생성
"""

import os
import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import A4, letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import logging

logger = logging.getLogger(__name__)

class PDFService:
    def __init__(self, output_dir: str = "pdf_reports"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    def generate_report_pdf(self, run_id: str, report_data: Dict[str, Any], 
                          feature_importance: list = None) -> str:
        """Generate comprehensive AI report PDF"""
        try:
            # Create PDF file
            filename = f"SK_Planet_AIOps_Report_{run_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Title'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.HexColor('#2563eb')
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading1'],
                fontSize=16,
                spaceAfter=12,
                textColor=colors.HexColor('#7c3aed')
            )
            
            # Build PDF content
            story = []
            
            # Title
            story.append(Paragraph("SK Planet AIOps - 마케팅 인사이트 보고서", title_style))
            story.append(Spacer(1, 20))
            
            # Executive Summary
            story.append(Paragraph("Executive Summary", heading_style))
            story.append(Paragraph(report_data.get("summary", "No summary available"), styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Key Metrics
            story.append(Paragraph("핵심 성과 지표", heading_style))
            metrics_data = [
                ['지표', '값', '단위'],
                ['모델 정확도', f"{report_data.get('accuracy', 0):.1f}", '%'],
                ['CTR 향상 예상', f"{report_data.get('roiIncrease', 0):.1f}", '%'],
                ['추가 수익 예상', f"{report_data.get('additionalRevenue', 0):.2f}", '억원']
            ]
            
            metrics_table = Table(metrics_data)
            metrics_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(metrics_table)
            story.append(Spacer(1, 20))
            
            # AI Insights
            insights = report_data.get("insights", [])
            if insights:
                story.append(Paragraph("AI 인사이트", heading_style))
                for i, insight in enumerate(insights[:4], 1):  # Top 4 insights
                    story.append(Paragraph(f"{i}. {insight.get('title', 'No title')}", styles['Heading2']))
                    story.append(Paragraph(insight.get('description', 'No description'), styles['Normal']))
                    story.append(Paragraph(f"권장사항: {insight.get('recommendation', 'No recommendation')}", styles['Normal']))
                    story.append(Spacer(1, 10))
                story.append(Spacer(1, 20))
            
            # Action Plan
            action_plan = report_data.get("action_plan", [])
            if action_plan:
                story.append(Paragraph("실행 계획", heading_style))
                for i, action in enumerate(action_plan[:4], 1):  # Top 4 actions
                    story.append(Paragraph(f"{i}. {action.get('action', 'No action')}", styles['Heading2']))
                    story.append(Paragraph(action.get('description', 'No description'), styles['Normal']))
                    story.append(Paragraph(f"기대 효과: {action.get('expected_impact', 'No impact')}", styles['Normal']))
                    story.append(Paragraph(f"일정: {action.get('timeline', 'No timeline')}", styles['Normal']))
                    story.append(Spacer(1, 10))
                story.append(Spacer(1, 20))
            
            # Feature Importance
            if feature_importance:
                story.append(PageBreak())
                story.append(Paragraph("피처 중요도 분석", heading_style))
                
                # Top 10 features
                top_features = feature_importance[:10]
                feature_data = [['순위', '피처명', '중요도', '설명']]
                
                for i, feature in enumerate(top_features, 1):
                    feature_data.append([
                        str(i),
                        feature.get('feature', 'Unknown'),
                        f"{feature.get('importance', 0):.3f}",
                        feature.get('description', 'No description')
                    ])
                
                feature_table = Table(feature_data)
                feature_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7c3aed')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(feature_table)
                story.append(Spacer(1, 20))
            
            # Footer
            story.append(Paragraph("---", styles['Normal']))
            story.append(Paragraph(f"보고서 생성일: {datetime.now().strftime('%Y년 %m월 %d일')}", styles['Normal']))
            story.append(Paragraph("SK AX - SK Planet AIOps", styles['Normal']))
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"PDF report generated: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"PDF generation error: {str(e)}")
            raise Exception(f"PDF generation failed: {str(e)}")
    
    def get_pdf_file(self, filepath: str) -> bytes:
        """Get PDF file as bytes"""
        try:
            with open(filepath, 'rb') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading PDF file: {str(e)}")
            raise Exception(f"Failed to read PDF file: {str(e)}")
    
    def cleanup_old_pdfs(self, max_age_hours: int = 24):
        """Clean up old PDF files"""
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for filename in os.listdir(self.output_dir):
                if filename.endswith('.pdf'):
                    filepath = os.path.join(self.output_dir, filename)
                    file_age = current_time - os.path.getctime(filepath)
                    
                    if file_age > max_age_seconds:
                        os.remove(filepath)
                        logger.info(f"Cleaned up old PDF: {filename}")
                        
        except Exception as e:
            logger.error(f"PDF cleanup error: {str(e)}")
