<template>
  <div class="metrics-card">
    <div class="metric">
      <h3>Total Points</h3>
      <div class="value">{{ formatNumber(totalPoints) }}</div>
    </div>
    <div class="metric">
      <h3>Cross-Rebate (2% cap)</h3>
      <div class="value">{{ formatPercentage(crossRebate) }}%</div>
    </div>
    <div class="period">
      {{ currentYear }} Q{{ currentQuarter }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statisticsService } from '@/services/StatisticsService';
import type { CategoryStatistics } from '@/services/StatisticsService';
import { getServiceFactory } from '@/api/services';

const totalPoints = ref(0);
const crossRebate = ref(0);
const currentYear = new Date().getFullYear();
const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
const services = getServiceFactory(true);

const calculateMetrics = async () => {
  try {
    // Get all categories
    const categories = await services.categoryService.getCategories(0, 50);
    let totalPointsSum = 0;

    // Calculate points for each category
    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        // Calculate points based on sales volume and category weight
        const categoryPoints = stats.totalScore * category.weight;
        totalPointsSum += categoryPoints;
      }
    }

    totalPoints.value = totalPointsSum;
    // Calculate cross-rebate (capped at 2%)
    crossRebate.value = Math.min(totalPointsSum / 50, 2); // Assuming 1 point = 0.02% rebate
  } catch (error) {
    console.error('Error calculating metrics:', error);
  }
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(Math.round(value));
};

const formatPercentage = (value: number): string => {
  return value.toFixed(2);
};

onMounted(() => {
  calculateMetrics();
});
</script>

<style scoped>
.metrics-card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric {
  margin-bottom: 1rem;
}

.metric h3 {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.period {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}
</style> 