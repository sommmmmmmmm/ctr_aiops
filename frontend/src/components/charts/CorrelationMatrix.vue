<template>
  <div class="correlation-matrix">
    <div class="matrix-container">
      <div class="matrix-header">
        <h3>상관관계 매트릭스 (Correlation Matrix)</h3>
        <div class="legend">
          <div class="legend-item">
            <div class="color-box" style="background: #d73027"></div>
            <span>강한 음의 상관</span>
          </div>
          <div class="legend-item">
            <div class="color-box" style="background: #f7f7f7"></div>
            <span>무상관</span>
          </div>
          <div class="legend-item">
            <div class="color-box" style="background: #1a9850"></div>
            <span>강한 양의 상관</span>
          </div>
        </div>
      </div>
      <div class="matrix-grid" ref="matrixRef">
        <div class="matrix-row header-row">
          <div class="matrix-cell header-cell corner"></div>
          <div
            v-for="feature in features"
            :key="`header-${feature}`"
            class="matrix-cell header-cell"
          >
            <span class="feature-label">{{ feature }}</span>
          </div>
        </div>
        <div
          v-for="(row, rowIndex) in correlationMatrix"
          :key="`row-${rowIndex}`"
          class="matrix-row"
        >
          <div class="matrix-cell header-cell">
            <span class="feature-label">{{ features[rowIndex] }}</span>
          </div>
          <div
            v-for="(value, colIndex) in row"
            :key="`cell-${rowIndex}-${colIndex}`"
            class="matrix-cell data-cell"
            :style="getCellStyle(value)"
            @mouseenter="showTooltip(rowIndex, colIndex, value, $event)"
            @mouseleave="hideTooltip"
          >
            <span class="cell-value">{{ value.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div v-if="tooltip.show" class="tooltip" :style="tooltipStyle">
        <div><strong>{{ tooltip.feature1 }}</strong> ↔ <strong>{{ tooltip.feature2 }}</strong></div>
        <div>상관계수: <strong>{{ tooltip.value }}</strong></div>
        <div>{{ tooltip.interpretation }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    // { features: ['feat1', 'feat2', ...], matrix: [[1, 0.5, ...], ...] }
  }
})

const matrixRef = ref(null)
const tooltip = ref({
  show: false,
  feature1: '',
  feature2: '',
  value: 0,
  interpretation: '',
  x: 0,
  y: 0
})

const features = computed(() => props.data.features || [])
const correlationMatrix = computed(() => props.data.matrix || [])

// 상관계수에 따른 색상 결정 (RdYlGn 컬러맵)
const getCellStyle = (value) => {
  const absValue = Math.abs(value)
  let color

  if (value > 0.7) {
    color = '#1a9850'
  } else if (value > 0.5) {
    color = '#66bd63'
  } else if (value > 0.3) {
    color = '#a6d96a'
  } else if (value > 0) {
    color = '#d9ef8b'
  } else if (value > -0.3) {
    color = '#fee08b'
  } else if (value > -0.5) {
    color = '#fdae61'
  } else if (value > -0.7) {
    color = '#f46d43'
  } else {
    color = '#d73027'
  }

  // 대각선은 회색으로
  if (absValue === 1) {
    color = '#999'
  }

  return {
    backgroundColor: color,
    color: absValue > 0.5 || absValue === 1 ? '#fff' : '#333'
  }
}

// 상관계수 해석
const getInterpretation = (value) => {
  const absValue = Math.abs(value)
  const sign = value >= 0 ? '양의' : '음의'

  if (absValue === 1) return '완전 상관'
  if (absValue > 0.7) return `강한 ${sign} 상관`
  if (absValue > 0.5) return `중간 ${sign} 상관`
  if (absValue > 0.3) return `약한 ${sign} 상관`
  return '거의 무상관'
}

// 툴팁 표시
const showTooltip = (rowIndex, colIndex, value, event) => {
  tooltip.value = {
    show: true,
    feature1: features.value[rowIndex],
    feature2: features.value[colIndex],
    value: value.toFixed(3),
    interpretation: getInterpretation(value),
    x: event.clientX + 10,
    y: event.clientY + 10
  }
}

// 툴팁 숨김
const hideTooltip = () => {
  tooltip.value.show = false
}

const tooltipStyle = computed(() => ({
  left: `${tooltip.value.x}px`,
  top: `${tooltip.value.y}px`
}))
</script>

<style scoped>
.correlation-matrix {
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.matrix-container {
  position: relative;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.matrix-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.legend {
  display: flex;
  gap: 20px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.matrix-grid {
  display: inline-block;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: auto;
  max-width: 100%;
  max-height: 600px;
}

.matrix-row {
  display: flex;
}

.matrix-cell {
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;
  font-size: 12px;
  transition: all 0.2s;
}

.header-cell {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.corner {
  background: #fff;
}

.feature-label {
  writing-mode: horizontal-tb;
  text-align: center;
  font-size: 11px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-row .feature-label {
  transform: rotate(-45deg);
  transform-origin: center;
}

.data-cell {
  cursor: pointer;
  font-weight: 600;
}

.data-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.cell-value {
  font-size: 13px;
  font-weight: 600;
}

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 250px;
}

.tooltip div {
  margin: 4px 0;
}

.tooltip strong {
  color: #ffd700;
}
</style>

