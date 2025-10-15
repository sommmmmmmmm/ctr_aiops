import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const alertHistory = ref([])

  // 알림 추가
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    notifications.value.unshift(newNotification)
    unreadCount.value++
    
    // 히스토리에도 저장
    alertHistory.value.unshift(newNotification)
    
    // Element Plus Notification 표시
    showElementNotification(newNotification)
    
    return newNotification
  }

  // Element Plus Notification 표시
  const showElementNotification = (notification) => {
    const typeMap = {
      error: 'error',
      warning: 'warning',
      success: 'success',
      info: 'info'
    }

    ElNotification({
      title: notification.title,
      message: notification.message,
      type: typeMap[notification.type] || 'info',
      duration: notification.persistent ? 0 : 4500,
      showClose: true,
      onClick: () => {
        notification.onClick?.()
      }
    })
  }

  // 성능 경고 알림
  const addPerformanceAlert = (metrics) => {
    const { accuracy, f1Score, responseTime } = metrics
    
    // Accuracy < 0.7 경고
    if (accuracy < 0.7) {
      addNotification({
        title: '⚠️ 성능 경고',
        message: `모델 정확도가 ${(accuracy * 100).toFixed(1)}%로 하락했습니다. 재학습을 권장합니다.`,
        type: 'warning',
        persistent: true,
        severity: 'high',
        category: 'performance',
        action: {
          label: '재학습 시작',
          callback: () => console.log('Trigger retraining')
        }
      })
    }

    // F1 Score 급락 경고
    if (f1Score && f1Score < 0.6) {
      addNotification({
        title: '⚠️ F1 Score 급락',
        message: `F1 Score가 ${f1Score.toFixed(2)}로 급락했습니다.`,
        type: 'warning',
        persistent: true,
        severity: 'high',
        category: 'performance'
      })
    }

    // 추론 지연 경고
    if (responseTime > 500) {
      addNotification({
        title: '⏱️ 응답 지연',
        message: `추론 시간이 ${responseTime}ms로 증가했습니다. 성능 최적화가 필요합니다.`,
        type: 'warning',
        severity: 'medium',
        category: 'latency'
      })
    }
  }

  // 학습 완료 알림
  const addTrainingCompleteNotification = (runId, metrics) => {
    addNotification({
      title: '✅ 학습 완료',
      message: `새로운 모델 학습이 완료되었습니다. Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`,
      type: 'success',
      category: 'training',
      runId
    })
  }

  // 학습 실패 알림
  const addTrainingFailedNotification = (runId, error) => {
    addNotification({
      title: '❌ 학습 실패',
      message: `모델 학습 중 오류가 발생했습니다: ${error}`,
      type: 'error',
      persistent: true,
      category: 'training',
      runId
    })
  }

  // 데이터 drift 감지 알림
  const addDataDriftAlert = (driftMetrics) => {
    addNotification({
      title: '🔄 데이터 Drift 감지',
      message: `입력 데이터 분포에 변화가 감지되었습니다. 모델 재학습을 고려하세요.`,
      type: 'warning',
      severity: 'medium',
      category: 'data_drift',
      details: driftMetrics
    })
  }

  // 알림 읽음 처리
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value--
    }
  }

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  }

  // 알림 삭제
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value--
      }
      notifications.value.splice(index, 1)
    }
  }

  // 모든 알림 삭제
  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  // 카테고리별 필터링
  const getNotificationsByCategory = (category) => {
    return notifications.value.filter(n => n.category === category)
  }

  // 심각도별 필터링
  const getNotificationsBySeverity = (severity) => {
    return notifications.value.filter(n => n.severity === severity)
  }

  // 최근 알림 가져오기
  const getRecentNotifications = (limit = 10) => {
    return notifications.value.slice(0, limit)
  }

  return {
    // State
    notifications,
    unreadCount,
    alertHistory,
    
    // Actions
    addNotification,
    addPerformanceAlert,
    addTrainingCompleteNotification,
    addTrainingFailedNotification,
    addDataDriftAlert,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    
    // Getters
    getNotificationsByCategory,
    getNotificationsBySeverity,
    getRecentNotifications
  }
})

