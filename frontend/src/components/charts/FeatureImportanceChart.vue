<template>
  <div class="feature-importance-chart">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // [{feature: 'gender', importance: 0.35, pValue: 0.001}, ...]
  },
  topN: {
    type: Number,
    default: 15
  },
  showPValue: {
    type: Boolean,
    default: true
  }
})

const chartData = computed(() => {
  // 중요도 순으로 정렬하고 상위 N개 선택
  const sortedData = [...props.data]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, props.topN)

  // p-value에 따른 색상 결정
  const getColor = (pValue) => {
    if (!pValue) return 'rgba(52, 152, 219, 0.8)'
    if (pValue < 0.001) return 'rgba(39, 174, 96, 0.8)' // 매우 유의
    if (pValue < 0.01) return 'rgba(52, 152, 219, 0.8)' // 유의
    if (pValue < 0.05) return 'rgba(241, 196, 15, 0.8)' // 약간 유의
    return 'rgba(189, 195, 199, 0.8)' // 유의하지 않음
  }

  return {
    labels: sortedData.map(d => d.feature || d.name),
    datasets: [{
      label: 'Feature Importance',
      data: sortedData.map(d => d.importance),
      backgroundColor: props.showPValue
        ? sortedData.map(d => getColor(d.pValue))
        : 'rgba(52, 152, 219, 0.8)',
      borderColor: props.showPValue
        ? sortedData.map(d => getColor(d.pValue).replace('0.8', '1'))
        : 'rgba(52, 152, 219, 1)',
      borderWidth: 2
    }]
  }
})

const chartOptions = computed(() => ({
  indexAxis: 'y', // 가로 막대 그래프
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: '피처 중요도 분석 (Feature Importance)',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      callbacks: {
        afterLabel: function(context) {
          const dataIndex = context.dataIndex
          const item = [...props.data]
            .sort((a, b) => b.importance - a.importance)[dataIndex]
          
          let extra = []
          if (item.pValue !== undefined) {
            extra.push(`p-value: ${item.pValue.toFixed(4)}`)
            extra.push(`통계적 유의성: ${item.pValue < 0.05 ? '✓ 유의함' : '✗ 유의하지 않음'}`)
          }
          if (item.ci) {
            extra.push(`95% CI: [${item.ci[0].toFixed(3)}, ${item.ci[1].toFixed(3)}]`)
          }
          return extra
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Importance Score'
      }
    },
    y: {
      ticks: {
        autoSkip: false,
        font: {
          size: 11
        }
      }
    }
  }
}))
</script>

<style scoped>
.feature-importance-chart {
  width: 100%;
  height: 600px;
}
</style>

