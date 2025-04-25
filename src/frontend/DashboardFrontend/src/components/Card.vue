<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="card-controls">
        <button class="control-btn" @click="$emit('toggleFullscreen')">
          <span class="icon">⤢</span>
        </button>
      </div>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'bar'
    },
    color: {
      type: String,
      default: '#00f2fe'
    }
  },
  emits: ['toggleFullscreen'],
  setup(props) {
    const chartCanvas = ref(null)
    let chart = null

    const createChart = () => {
      if (!chartCanvas.value) return

      const ctx = chartCanvas.value.getContext('2d')
      const data = generateChartData(props.type, props.color)

      if (chart) {
        chart.destroy()
      }

      chart = new Chart(ctx, data)
    }

    const generateChartData = (type, color) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const randomData = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))

      switch (type) {
        case 'bar':
          return {
            type: 'bar',
            data: {
              labels: months,
              datasets: [{
                label: 'Revenue',
                data: randomData(),
                backgroundColor: `${color}40`,
                borderColor: color,
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                },
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                }
              }
            }
          }
        case 'line':
          return {
            type: 'line',
            data: {
              labels: months,
              datasets: [{
                label: 'Trends',
                data: randomData(),
                borderColor: color,
                tension: 0.4,
                fill: true,
                backgroundColor: `${color}20`
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                },
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                }
              }
            }
          }
        case 'pie':
          return {
            type: 'pie',
            data: {
              labels: ['Product A', 'Product B', 'Product C', 'Product D'],
              datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                  color,
                  `${color}80`,
                  `${color}60`,
                  `${color}40`
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: '#fff'
                  }
                }
              }
            }
          }
        case 'radar':
          return {
            type: 'radar',
            data: {
              labels: ['Sales', 'Marketing', 'Development', 'Customer Support', 'HR', 'Legal'],
              datasets: [{
                label: 'Current',
                data: randomData().slice(0, 6),
                backgroundColor: `${color}40`,
                borderColor: color,
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                r: {
                  angleLines: {
                    color: '#ffffff20'
                  },
                  grid: {
                    color: '#ffffff20'
                  },
                  pointLabels: {
                    color: '#fff'
                  }
                }
              }
            }
          }
        case 'area':
          return {
            type: 'line',
            data: {
              labels: months,
              datasets: [{
                label: 'Growth',
                data: randomData(),
                borderColor: color,
                backgroundColor: `${color}40`,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#fff'
                  }
                }
              },
              scales: {
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                },
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: '#ffffff20' }
                }
              }
            }
          }
      }
    }

    onMounted(() => {
      createChart()
    })

    watch(() => [props.type, props.color], () => {
      createChart()
    })

    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 500;
}

.card-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: var(--primary-color);
  color: var(--background-dark);
  transform: scale(1.1);
}

.chart-container {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.fullscreen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
  z-index: 1000;
  background: var(--background-dark);
}

.fullscreen .chart-container {
  height: calc(90vh - 80px);
}
</style> 