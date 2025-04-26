<template>
  <div 
    class="card" 
    :class="{ 
      'is-expanded': expanded,
      'is-dragging': isDragging,
      'drag-over': isDragOver
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="card-controls">
        <button class="control-btn" @click="toggleExpand" :title="expanded ? 'Collapse' : 'Expand'">
          <span class="icon" :class="{ 'is-expanded': expanded }">⤢</span>
        </button>
      </div>
    </div>
    <div class="chart-container" ref="chartContainer">
      <canvas ref="chartCanvas"></canvas>
      <div class="chart-loader" v-if="isLoading">
        <div class="spinner"></div>
        <span>Loading data...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { chartDataService } from '../api/chartDataService'

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
    },
    expanded: {
      type: Boolean,
      default: false
    },
    isProductView: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default: null
    },
    productName: {
      type: String,
      default: ''
    },
    interactive: {
      type: Boolean,
      default: true
    },
    isDragging: {
      type: Boolean,
      default: false
    },
    isDragOver: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'toggleFullscreen',
    'dragStart',
    'dragEnd',
    'dragEnter',
    'dragLeave',
    'dragOver',
    'drop'
  ],
  setup(props, { emit }) {
    const chartCanvas = ref(null)
    const chartContainer = ref(null)
    const isLoading = ref(true)
    let chart = null

    const createChart = async () => {
      if (!chartCanvas.value) return

      isLoading.value = true;
      
      // Simulate some loading time for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const ctx = chartCanvas.value.getContext('2d')
      const chartData = getChartData(props.type, props.color)

      if (chart) {
        chart.destroy()
      }

      // Set aspect ratio and responsive options
      const chartOptions = {
        ...chartData.options,
        responsive: true,
        maintainAspectRatio: false,
        onResize: (chart, size) => {
          // Ensure chart sizes properly on resize
          chart.resize();
        }
      };

      chart = new Chart(ctx, {
        ...chartData,
        options: chartOptions
      });
      
      // Add click handlers for interactive charts if needed
      if (props.interactive) {
        setupChartInteractions(chart);
      }
      
      isLoading.value = false;
    }
    
    const setupChartInteractions = (chartInstance) => {
      chartCanvas.value.onclick = (evt) => {
        const points = chartInstance.getElementsAtEventForMode(
          evt, 
          'nearest', 
          { intersect: true }, 
          false
        );
        
        if (points.length) {
          const firstPoint = points[0];
          const label = chartInstance.data.labels[firstPoint.index];
          const value = chartInstance.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
          
          console.log('Clicked:', label, value);
          // Here you could trigger detailed views or drilldowns
        }
      };
    }

    const toggleExpand = () => {
      emit('toggleFullscreen');
      
      // Ensure chart resizes correctly after transitioning
      nextTick(() => {
        if (chart) {
          setTimeout(() => {
            chart.resize();
          }, 300); // Match transition duration
        }
      });
    }

    const getChartData = (type, color) => {
      // If we're in product view, we show product-specific charts
      if (props.isProductView) {
        return getProductChartData(type, color, props.productId, props.productName)
      }
      
      // Otherwise we show general dashboard charts
      return getGeneralChartData(type, color)
    }

    const getGeneralChartData = (type, color) => {
      switch (type) {
        case 'histogram':
          // Historical sales histogram (requirement 2)
          return {
            type: 'bar',
            data: chartDataService.getHistoricalSalesData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Monthly Sales (2023)',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Sales Amount ($1000)',
                    color: '#fff'
                  },
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
          // Category sales percentage pie chart (requirement 1)
          return {
            type: 'pie',
            data: chartDataService.getCategorySalesPercentage(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Sales Distribution by Category',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  position: 'right',
                  labels: { color: '#fff' }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}%`
                  }
                }
              }
            }
          }
        case 'radar':
          // Wind rose - category plan achievement (requirement 3)
          return {
            type: 'radar',
            data: chartDataService.getCategoryPlanAchievement(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  angleLines: { color: '#ffffff20' },
                  grid: { color: '#ffffff20' },
                  pointLabels: { color: '#fff' },
                  ticks: { 
                    color: '#fff',
                    backdropColor: 'transparent',
                    callback: (value) => `${value}%`
                  },
                  suggestedMin: 50,
                  suggestedMax: 120
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Sales Plan Achievement by Category',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw}% of plan`
                  }
                }
              }
            }
          }
        case 'performance':
          // Product performance analytics chart
          return chartDataService.getProductPerformanceAnalytics();
        case 'line':
          // Growth trends line chart (custom chart 4)
          return {
            type: 'line',
            data: chartDataService.getProductGrowthTrend(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Growth Trends',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Growth Rate (%)',
                    color: '#fff'
                  },
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
        case 'bar':
          // Year-over-year comparison (custom chart 5)
          return {
            type: 'bar',
            data: chartDataService.getYearlyComparisonData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Year-over-Year Category Growth',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
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
        case 'area':
          // Sales vs target (custom chart 6)
          return {
            type: 'line',
            data: chartDataService.getSalesVsTargetsData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Sales vs Target',
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
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
        default:
          // Default chart
          return {
            type: 'bar',
            data: {
              labels: ['Default Data'],
              datasets: [{
                label: 'Default',
                data: [50],
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
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: { ticks: { color: '#fff' }, grid: { color: '#ffffff20' } },
                x: { ticks: { color: '#fff' }, grid: { color: '#ffffff20' } }
              }
            }
          }
      }
    }

    const getProductChartData = (type, color, productId, productName) => {
      switch (type) {
        case 'histogram':
          // Product historical sales histogram (product requirement 1)
          const historicalData = chartDataService.getProductHistoricalSales(productId)
          return {
            type: 'bar',
            data: historicalData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Monthly Sales (2023)`,
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Sales Amount ($1000)',
                    color: '#fff'
                  },
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
        case 'radar':
          // Quarterly sales wind rose (product requirement 2)
          return {
            type: 'radar',
            data: chartDataService.getProductQuarterlySales(productId),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  angleLines: { color: '#ffffff20' },
                  grid: { color: '#ffffff20' },
                  pointLabels: { color: '#fff', font: { size: 14 } },
                  ticks: { color: '#fff', backdropColor: 'transparent' },
                  suggestedMin: 0
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Quarterly Sales Distribution`,
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: $${context.raw}k`
                  }
                }
              }
            }
          }
        case 'pie':
          // Target achievement gauge (product custom chart 3)
          return {
            type: 'doughnut',
            data: chartDataService.getProductTargetAchievement(productId),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Target Achievement`,
                  color: '#fff',
                  font: { size: 16 }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw}% of target`
                  }
                }
              }
            }
          }
        case 'categoryDistribution':
          // Category distribution chart
          const distributionData = chartDataService.getProductCategoryDistribution(productId);
          if (!distributionData) return getGeneralChartData(type, color);
          return {
            ...distributionData,
            options: {
              ...distributionData.options,
              plugins: {
                ...distributionData.options.plugins,
                title: {
                  display: true,
                  text: `${productName} Category Performance`,
                  color: '#fff',
                  font: { size: 16 }
                }
              }
            }
          };
        case 'line':
          // Customer demographics (product custom chart 4)
          return {
            type: 'doughnut',
            data: chartDataService.getProductCustomerSegments(productId),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '60%',
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Customer Segments`,
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  position: 'right',
                  labels: { color: '#fff' }
                }
              }
            }
          }
        case 'bar':
          // Regional distribution (product custom chart 5)
          return {
            type: 'polarArea',
            data: chartDataService.getProductRegionalDistribution(productId),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Regional Distribution`,
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  position: 'right',
                  labels: { color: '#fff' }
                }
              }
            }
          }
        case 'area':
          // Growth trend (product custom chart 6)
          return {
            type: 'line',
            data: chartDataService.getProductGrowthTrend(productId),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${productName} Growth Trend`,
                  color: '#fff',
                  font: { size: 16 }
                },
                legend: {
                  labels: { color: '#fff' }
                }
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Growth Rate (%)',
                    color: '#fff'
                  },
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
        default:
          // Default chart
          return getGeneralChartData(type, color)
      }
    }

    // Added function to handle window resize
    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
    };
    
    onMounted(() => {
      createChart();
      
      // Add event listener for data updates
      window.addEventListener('data-updated', refreshChart);
      // Add resize event listener
      window.addEventListener('resize', handleResize);
    })
    
    // Clean up
    onUnmounted(() => {
      if (chart) {
        chart.destroy();
      }
      window.removeEventListener('data-updated', refreshChart);
      window.removeEventListener('resize', handleResize);
    });
    
    // Refresh chart data
    const refreshChart = () => {
      createChart();
    };

    // Watch for changes that would affect the chart
    watch(() => [props.type, props.color, props.isProductView, props.productId, props.productName], () => {
      createChart()
    })

    const handleDragStart = (event) => {
      emit('dragStart', event);
    };

    const handleDragEnd = (event) => {
      emit('dragEnd', event);
    };

    const handleDragEnter = (event) => {
      event.preventDefault();
      emit('dragEnter', event);
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      emit('dragLeave', event);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      emit('dragOver', event);
    };

    const handleDrop = (event) => {
      event.preventDefault();
      emit('drop', event);
    };

    return {
      chartCanvas,
      chartContainer,
      isLoading,
      toggleExpand,
      handleDragStart,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1;
  transform-origin: center;
  will-change: transform, box-shadow, z-index;
  position: relative;
  margin-bottom: 1px;
  cursor: move;
}

.card.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
  z-index: 20;
}

.card.drag-over {
  border: 2px dashed var(--primary-color);
  transform: scale(1.02);
}

.card.is-expanded {
  z-index: 10;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transform: scale(1.05);
  filter: brightness(1.05);
  cursor: default;
}

.card:not(.is-expanded):not(.is-dragging):hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-bottom-color 0.3s ease;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.1);
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

.icon {
  display: inline-block;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform-origin: center;
}

.icon.is-expanded {
  transform: rotate(180deg);
}

.control-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.control-btn:active {
  transform: translateY(0);
}

.is-expanded .control-btn {
  color: var(--primary-color);
  background: rgba(0, 242, 254, 0.1);
}

.chart-container {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 250px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  box-sizing: border-box;
}

canvas {
  max-width: 100% !important;
  height: 100% !important;
}

.chart-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.is-expanded .card-header {
  border-bottom-color: var(--primary-color);
  background: rgba(0, 242, 254, 0.05);
}

.is-expanded .card-header h3 {
  font-weight: 600;
  color: white;
}

.is-expanded::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  pointer-events: none;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
  animation: pulseBorder 2s infinite;
}

@keyframes pulseBorder {
  0% {
    box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.5);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
  }
}
</style> 