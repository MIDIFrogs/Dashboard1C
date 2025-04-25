<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="card-controls">
        <button class="control-btn" @click="toggleFullscreen">
          <span class="icon">⤢</span>
        </button>
      </div>
    </div>
    <div class="diagram" :class="type">
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
      default: 'histogram'
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chart = null

    const createChart = () => {
      if (!chartCanvas.value) return

      const ctx = chartCanvas.value.getContext('2d')
      const data = generateDummyData(props.type)

      chart = new Chart(ctx, data)
    }

    const generateDummyData = (type) => {
      switch (type) {
        case 'histogram':
          return {
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Revenue',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(0, 242, 254, 0.5)',
                borderColor: 'rgba(0, 242, 254, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        case 'windrose':
          return {
            type: 'radar',
            data: {
              labels: ['Sales', 'Marketing', 'Development', 'Support', 'HR', 'Legal'],
              datasets: [{
                label: 'Performance',
                data: [85, 65, 75, 80, 60, 70],
                backgroundColor: 'rgba(123, 66, 246, 0.5)',
                borderColor: 'rgba(123, 66, 246, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
        case 'heatmap':
          return {
            type: 'scatter',
            data: {
              datasets: [{
                label: 'Performance',
                data: Array.from({ length: 20 }, () => ({
                  x: Math.random() * 100,
                  y: Math.random() * 100
                })),
                backgroundColor: 'rgba(0, 255, 157, 0.5)'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          }
      }
    }

    const toggleFullscreen = () => {
      const card = chartCanvas.value.closest('.card')
      card.classList.toggle('fullscreen')
    }

    onMounted(() => {
      createChart()
    })

    watch(() => props.type, () => {
      if (chart) {
        chart.destroy()
      }
      createChart()
    })

    return {
      chartCanvas,
      toggleFullscreen
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  --glass-effect: backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.2rem;
}

.card-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  width: 30px;
  height: 30px;
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
}

.diagram {
  height: 250px;
  position: relative;
}

.fullscreen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
  z-index: 1000;
}

.fullscreen .diagram {
  height: calc(90vh - 100px);
}
</style> 