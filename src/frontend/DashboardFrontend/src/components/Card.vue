<template>
  <div 
    class="card" 
    :class="{ 'is-expanded': expanded, 'dark': isDark, 'is-dragging': isDragging }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="card-controls">
        <button class="control-btn" @click="toggleExpand" :title="expanded ? 'Collapse' : 'Expand'">
          <span class="icon">{{ expanded ? '⤧' : '⤢' }}</span>
        </button>
      </div>
    </div>
    <div class="card-content" :class="{ 'is-loading': isLoading }">
      <div class="chart-loader" v-if="isLoading">
        <div class="spinner"></div>
        <span>Loading data...</span>
      </div>
      <component 
        v-else
        :is="chartComponent"
        ref="chartRef"
      />
    </div>
    <div class="neon-border"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import MetricsCard from './charts/MetricsCard.vue';
import CategorySalesChart from './charts/CategorySalesChart.vue';
import QuarterlySalesChart from './charts/QuarterlySalesChart.vue';
import PlanAchievementChart from './charts/PlanAchievementChart.vue';
import RegionalSalesHeatmap from './charts/RegionalSalesHeatmap.vue';
import TargetVsActualChart from './charts/TargetVsActualChart.vue';
import YearOverYearChart from './charts/YearOverYearChart.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => [
      'metrics',
      'category-sales',
      'quarterly-sales',
      'plan-achievement',
      'regional-sales',
      'target-vs-actual',
      'year-over-year'
    ].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    required: true
  },
  isDark: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggleExpand', 'reorder']);

const isLoading = ref(true);
const isDragging = ref(false);
const chartRef = ref(null);

const chartComponent = computed(() => {
  switch (props.type) {
    case 'metrics':
      return MetricsCard;
    case 'category-sales':
      return CategorySalesChart;
    case 'quarterly-sales':
      return QuarterlySalesChart;
    case 'plan-achievement':
      return PlanAchievementChart;
    case 'regional-sales':
      return RegionalSalesHeatmap;
    case 'target-vs-actual':
      return TargetVsActualChart;
    case 'year-over-year':
      return YearOverYearChart;
    default:
      return null;
  }
});

const toggleExpand = () => {
  emit('toggleExpand', props.index);
};

// Drag and drop functionality
const handleDragStart = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  if (e.dataTransfer && target) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', props.index.toString());
    isDragging.value = true;
    requestAnimationFrame(() => {
      target.style.opacity = '0.4';
    });
  }
};

const handleDragEnd = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  if (target) {
    isDragging.value = false;
    target.style.opacity = '';
  }
};

const handleDragEnter = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  if (target) {
    target.classList.add('drag-over');
  }
};

const handleDragLeave = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  if (target) {
    target.classList.remove('drag-over');
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if (target) {
    target.classList.remove('drag-over');
  }
  const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1');
  if (fromIndex >= 0 && fromIndex !== props.index) {
    emit('reorder', { fromIndex, toIndex: props.index });
  }
};

onMounted(() => {
  // Simulate loading time for better UX
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
:root {
  /* Light theme variables */
  --card-bg: white;
  --card-border: 1px solid #eee;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --text-primary: #2c3e50;
  --text-secondary: #666;
  --border-color: #eee;
  --hover-color: #2c3e50;
  --spinner-bg: #f3f3f3;
  --spinner-color: #3498db;
  --loader-bg: rgba(255, 255, 255, 0.9);
  --neon-color: #00f2fe;
  --neon-shadow: rgba(0, 242, 254, 0.5);
}

.card.dark {
  /* Dark theme variables */
  --card-bg: #1a1a1a;
  --card-border: 1px solid #333;
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  --text-primary: #e0e0e0;
  --text-secondary: #999;
  --border-color: #333;
  --hover-color: #fff;
  --spinner-bg: #333;
  --spinner-color: #3498db;
  --loader-bg: rgba(26, 26, 26, 0.9);
  --neon-color: #00f2fe;
  --neon-shadow: rgba(0, 242, 254, 0.5);
}

.card {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  border: var(--card-border);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: grab;
  margin: 1rem;
  overflow: hidden;
  position: relative;
  transform-origin: center;
  will-change: transform, box-shadow;
}

.card:hover:not(.is-expanded) {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.card.is-dragging {
  cursor: grabbing;
  opacity: 0.4;
  transform: scale(1.02);
}

.card.drag-over {
  border: 2px dashed var(--neon-color);
}

.card.is-expanded {
  position: fixed;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  margin: 0;
  transform: none;
  cursor: default;
}

.card.is-expanded::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--neon-color);
  border-radius: 10px;
  animation: neonGlow 1.5s ease-in-out infinite alternate;
  pointer-events: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg);
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.card-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.control-btn:hover {
  color: var(--hover-color);
  transform: scale(1.1);
}

.card-content {
  position: relative;
  height: 400px;
  transition: height 0.3s ease;
  background: var(--card-bg);
}

.card.is-expanded .card-content {
  height: calc(100% - 60px);
}

.chart-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--loader-bg);
  color: var(--text-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--spinner-bg);
  border-top: 3px solid var(--spinner-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes neonGlow {
  from {
    box-shadow: 0 0 10px var(--neon-shadow),
                0 0 20px var(--neon-shadow),
                0 0 30px var(--neon-shadow);
  }
  to {
    box-shadow: 0 0 20px var(--neon-shadow),
                0 0 30px var(--neon-shadow),
                0 0 40px var(--neon-shadow);
  }
}

/* Dark theme specific styles */
.card.dark.is-expanded::after {
  opacity: 0.8;
}

.card.dark .drag-over {
  background: rgba(0, 242, 254, 0.1);
}
</style> 