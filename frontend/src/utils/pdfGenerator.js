import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * AI 보고서를 PDF로 생성
 */
export async function generateReportPDF(reportData, options = {}) {
  const {
    fileName = 'CTR_AI_Report.pdf',
    includeCharts = true,
    includeLogo = true
  } = options

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPos = margin

  // 한글 폰트 설정 (기본 폰트로 대체)
  pdf.setFont('helvetica')

  // 헤더 - SK AX 로고 및 타이틀
  if (includeLogo) {
    pdf.setFontSize(24)
    pdf.setTextColor(102, 126, 234)
    pdf.text('SK AX', margin, yPos)
    
    pdf.setFontSize(10)
    pdf.setTextColor(120, 120, 120)
    pdf.text('AI eXcellence, Accelerate Your Future', margin, yPos + 7)
    
    yPos += 20
  }

  // 제목
  pdf.setFontSize(20)
  pdf.setTextColor(44, 62, 80)
  pdf.text('CTR Prediction AI Analysis Report', margin, yPos)
  yPos += 10

  // 날짜
  pdf.setFontSize(10)
  pdf.setTextColor(150, 150, 150)
  pdf.text(`Generated: ${new Date().toLocaleString('ko-KR')}`, margin, yPos)
  yPos += 15

  // 구분선
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Executive Summary
  pdf.setFontSize(16)
  pdf.setTextColor(52, 152, 219)
  pdf.text('Executive Summary', margin, yPos)
  yPos += 8

  pdf.setFontSize(11)
  pdf.setTextColor(60, 60, 60)
  const summaryLines = pdf.splitTextToSize(reportData.summary || 'No summary available', contentWidth)
  pdf.text(summaryLines, margin, yPos)
  yPos += summaryLines.length * 6 + 10

  // 핵심 지표
  pdf.setFillColor(248, 249, 250)
  pdf.rect(margin, yPos, contentWidth, 30, 'F')
  
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text('Model Accuracy', margin + 10, yPos + 10)
  pdf.text('ROI Increase', margin + 70, yPos + 10)
  pdf.text('Additional Revenue', margin + 130, yPos + 10)
  
  pdf.setFontSize(14)
  pdf.setTextColor(52, 152, 219)
  pdf.text(`${reportData.accuracy}%`, margin + 10, yPos + 20)
  pdf.text(`+${reportData.roiIncrease}%`, margin + 70, yPos + 20)
  pdf.text(`${reportData.additionalRevenue}M KRW`, margin + 130, yPos + 20)
  
  yPos += 40

  // 새 페이지 확인
  if (yPos > pageHeight - 40) {
    pdf.addPage()
    yPos = margin
  }

  // 중요 피처 Top 5
  pdf.setFontSize(16)
  pdf.setTextColor(52, 152, 219)
  pdf.text('Top 5 Important Features', margin, yPos)
  yPos += 10

  reportData.topFeatures?.forEach((feature, index) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage()
      yPos = margin
    }

    pdf.setFontSize(12)
    pdf.setTextColor(44, 62, 80)
    pdf.text(`${index + 1}. ${feature.name}`, margin + 5, yPos)
    yPos += 6

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    const descLines = pdf.splitTextToSize(feature.description, contentWidth - 10)
    pdf.text(descLines, margin + 10, yPos)
    yPos += descLines.length * 5

    pdf.setTextColor(103, 194, 58)
    pdf.text(`Importance: ${(feature.importance * 100).toFixed(1)}% | p-value: ${feature.pValue.toFixed(4)}`, margin + 10, yPos)
    yPos += 8
  })

  yPos += 5

  // 새 페이지
  if (yPos > pageHeight - 40) {
    pdf.addPage()
    yPos = margin
  }

  // AI 인사이트
  pdf.setFontSize(16)
  pdf.setTextColor(52, 152, 219)
  pdf.text('AI-Generated Insights', margin, yPos)
  yPos += 10

  reportData.aiInsights?.forEach((insight, index) => {
    if (yPos > pageHeight - 50) {
      pdf.addPage()
      yPos = margin
    }

    pdf.setFontSize(12)
    pdf.setTextColor(44, 62, 80)
    pdf.text(`${insight.icon} ${insight.title}`, margin, yPos)
    yPos += 7

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    const messageLines = pdf.splitTextToSize(insight.message, contentWidth - 5)
    pdf.text(messageLines, margin + 5, yPos)
    yPos += messageLines.length * 5 + 8
  })

  // 새 페이지
  if (yPos > pageHeight - 40) {
    pdf.addPage()
    yPos = margin
  }

  // 액션 플랜
  pdf.setFontSize(16)
  pdf.setTextColor(52, 152, 219)
  pdf.text('Action Plan & Recommendations', margin, yPos)
  yPos += 10

  reportData.actionPlan?.forEach((action, index) => {
    if (yPos > pageHeight - 50) {
      pdf.addPage()
      yPos = margin
    }

    // 우선순위 배지
    const priorityColor = action.priority === 'high' ? [245, 108, 108] : [230, 162, 60]
    pdf.setFillColor(...priorityColor)
    pdf.roundedRect(margin, yPos - 4, 20, 6, 2, 2, 'F')
    pdf.setFontSize(8)
    pdf.setTextColor(255, 255, 255)
    pdf.text(action.priority === 'high' ? 'HIGH' : 'MED', margin + 2, yPos)

    pdf.setFontSize(12)
    pdf.setTextColor(44, 62, 80)
    pdf.text(action.title, margin + 25, yPos)
    yPos += 7

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    const actionLines = pdf.splitTextToSize(action.description, contentWidth - 5)
    pdf.text(actionLines, margin + 5, yPos)
    yPos += actionLines.length * 5

    pdf.setTextColor(103, 194, 58)
    pdf.text(`Impact: +${action.impact}% | Duration: ${action.duration} | Cost: ${action.cost}`, margin + 5, yPos)
    yPos += 10
  })

  // 푸터
  const totalPages = pdf.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(9)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `© 2025 SK AX. All Rights Reserved. | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // PDF 저장
  pdf.save(fileName)
  
  return pdf
}

/**
 * HTML 요소를 캡처하여 PDF에 추가
 */
export async function captureElementToPDF(elementId, pdf, xPos, yPos, width) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn(`Element #${elementId} not found`)
    return yPos
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true
    })
    
    const imgData = canvas.toDataURL('image/png')
    const imgHeight = (canvas.height * width) / canvas.width
    
    pdf.addImage(imgData, 'PNG', xPos, yPos, width, imgHeight)
    
    return yPos + imgHeight + 10
  } catch (error) {
    console.error('Failed to capture element:', error)
    return yPos
  }
}

/**
 * 고급 PDF 보고서 생성 (차트 포함)
 */
export async function generateAdvancedReportPDF(reportData, chartIds = [], options = {}) {
  const {
    fileName = 'CTR_AI_Report_Advanced.pdf',
    orientation = 'portrait'
  } = options

  const pdf = new jsPDF(orientation, 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPos = margin

  // 커버 페이지
  pdf.setFillColor(102, 126, 234)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')
  
  pdf.setFontSize(32)
  pdf.setTextColor(255, 255, 255)
  pdf.text('CTR Prediction', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' })
  
  pdf.setFontSize(40)
  pdf.text('AI Analysis Report', pageWidth / 2, pageHeight / 2, { align: 'center' })
  
  pdf.setFontSize(14)
  pdf.setTextColor(255, 255, 255, 0.8)
  pdf.text('Powered by SK AX', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' })
  
  pdf.setFontSize(12)
  pdf.text(new Date().toLocaleDateString('ko-KR'), pageWidth / 2, pageHeight - 30, { align: 'center' })

  // 새 페이지 - 내용
  pdf.addPage()
  yPos = margin

  // 나머지 내용은 기본 PDF 생성 함수 사용
  const basicPdf = await generateReportPDF(reportData, { ...options, fileName: null })
  
  // 차트 캡처 및 추가
  if (chartIds.length > 0) {
    pdf.addPage()
    yPos = margin
    
    pdf.setFontSize(16)
    pdf.setTextColor(52, 152, 219)
    pdf.text('Performance Charts', margin, yPos)
    yPos += 10

    for (const chartId of chartIds) {
      yPos = await captureElementToPDF(chartId, pdf, margin, yPos, contentWidth)
      
      if (yPos > pageHeight - 100) {
        pdf.addPage()
        yPos = margin
      }
    }
  }

  // 푸터 추가
  const totalPages = pdf.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(9)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `© 2025 SK AX. Confidential | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  pdf.save(fileName)
  return pdf
}

/**
 * 백엔드 AI 생성 PDF 다운로드
 */
export async function downloadAIGeneratedPDF(runId, apiClient) {
  try {
    const response = await apiClient.get(`/api/report/pdf/${runId}`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CTR_AI_Report_${runId}_${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Failed to download PDF:', error)
    throw error
  }
}

export default {
  generateReportPDF,
  generateAdvancedReportPDF,
  captureElementToPDF,
  downloadAIGeneratedPDF
}

