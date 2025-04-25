<template>
  <div class="chart-container">
    <h3>Plan Achievement by Category</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { statisticsService } from '@/services/StatisticsService';
import { getServiceFactory } from '@/api/services';
import { Chart } from 'chart.js/auto';
import type { ChartData, ChartOptions } from 'chart.js';

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chart = ref<Chart | null>(null);
const services = getServiceFactory(true);

const loadData = async () => {
  try {
    const categories = await services.categoryService.getCategories(0, 50);
    const labels: string[] = [];
    const completionRates: number[] = [];

    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        labels.push(category.name);
        completionRates.push(stats.avgCompletion);
      }
    }

    const data: ChartData = {
      labels: labels,
      datasets: [{
        label: 'Plan Achievement',
        data: completionRates,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        fill: true
      }]
    };

    const options: ChartOptions = {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => value + '%'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return context.label + ': ' + context.raw.toFixed(1) + '%';
            }
          }
        }
      }
    };

    if (chartCanvas.value) {
      if (chart.value) {
        chart.value.destroy();
      }
      chart.value = new Chart(chartCanvas.value, {
        type: 'radar',
        data: data,
        options: options
      });
    }
  } catch (error) {
    console.error('Error loading plan achievement data:', error);
  }
};

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 400px;
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}
</style> 