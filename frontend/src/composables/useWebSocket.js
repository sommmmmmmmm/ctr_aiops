import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket(url, options = {}) {
  const ws = ref(null)
  const isConnected = ref(false)
  const messageQueue = ref([])
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = options.maxReconnectAttempts || 5
  const reconnectInterval = options.reconnectInterval || 3000

  // 연결
  const connect = () => {
    try {
      const wsUrl = url.startsWith('ws') ? url : `ws://localhost:8000${url}`
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('WebSocket Connected:', url)
        isConnected.value = true
        reconnectAttempts.value = 0
        
        // 큐에 쌓인 메시지 전송
        while (messageQueue.value.length > 0) {
          const message = messageQueue.value.shift()
          send(message)
        }
        
        options.onOpen?.()
      }

      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          options.onMessage?.(data)
        } catch (error) {
          console.error('Failed to parse message:', error)
          options.onMessage?.(event.data)
        }
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket Error:', error)
        options.onError?.(error)
      }

      ws.value.onclose = () => {
        console.log('WebSocket Disconnected')
        isConnected.value = false
        options.onClose?.()
        
        // 자동 재연결
        if (reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++
          console.log(`Reconnecting... (${reconnectAttempts.value}/${maxReconnectAttempts})`)
          setTimeout(connect, reconnectInterval)
        } else {
          console.error('Max reconnect attempts reached')
        }
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      options.onError?.(error)
    }
  }

  // 메시지 전송
  const send = (data) => {
    if (isConnected.value && ws.value?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      ws.value.send(message)
    } else {
      // 연결되지 않았으면 큐에 저장
      messageQueue.value.push(data)
    }
  }

  // 연결 종료
  const close = () => {
    reconnectAttempts.value = maxReconnectAttempts // 재연결 방지
    ws.value?.close()
  }

  // 수동 재연결
  const reconnect = () => {
    close()
    reconnectAttempts.value = 0
    setTimeout(connect, 1000)
  }

  onMounted(() => {
    if (options.autoConnect !== false) {
      connect()
    }
  })

  onUnmounted(() => {
    close()
  })

  return {
    ws,
    isConnected,
    connect,
    send,
    close,
    reconnect
  }
}

