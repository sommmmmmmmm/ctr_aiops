<template>
  <div class="performance-chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'accuracy' // 'accuracy', 'loss', 'f1', 'all'
  }
})

const chartData = computed(() => {
  const { epochs, accuracy, loss, f1Score, valAccuracy, valLoss, valF1Score } = props.data

  const datasets = []

  if (props.type === 'accuracy' || props.type === 'all') {
    datasets.push({
      label: 'Train Accuracy',
      data: accuracy,
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      fill: true,
      tension: 0.4
    })
    if (valAccuracy) {
      datasets.push({
        label: 'Val Accuracy',
        data: valAccuracy,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        fill: true,
        tension: 0.4
      })
    }
  }

  if (props.type === 'loss' || props.type === 'all') {
    datasets.push({
      label: 'Train Loss',
      data: loss,
      borderColor: '#e74c3c',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      fill: true,
      tension: 0.4
    })
    if (valLoss) {
      datasets.push({
        label: 'Val Loss',
        data: valLoss,
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        fill: true,
        tension: 0.4
      })
    }
  }

  if (props.type === 'f1') {
    datasets.push({
      label: 'F1 Score',
      data: f1Score,
      borderColor: '#9b59b6',
      backgroundColor: 'rgba(155, 89, 182, 0.1)',
      fill: true,
      tension: 0.4
    })
    if (valF1Score) {
      datasets.push({
        label: 'Val F1 Score',
        data: valF1Score,
        borderColor: '#1abc9c',
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
        fill: true,
        tension: 0.4
      })
    }
  }

  return {
    labels: epochs || Array.from({ length: accuracy?.length || 0 }, (_, i) => `Epoch ${i + 1}`),
    datasets
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15
      }
    },
    title: {
      display: true,
      text: getChartTitle(),
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(4)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Epoch'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: props.type === 'loss' ? 'Loss' : 'Score'
      },
      beginAtZero: props.type === 'loss',
      max: props.type !== 'loss' ? 1 : undefined
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

const getChartTitle = () => {
  const titles = {
    accuracy: '모델 정확도 (Accuracy)',
    loss: '학습 손실 (Loss)',
    f1: 'F1 Score',
    all: '전체 성능 지표'
  }
  return titles[props.type] || '성능 지표'
}
</script>

<style scoped>
.performance-chart {
  width: 100%;
  height: 400px;
}
</style>

