<template>
  <div class="chart-container">
    <h3>Sales Distribution by Category</h3>
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
    const values: number[] = [];

    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        labels.push(category.name);
        values.push(stats.totalScore);
      }
    }

    const data: ChartData = {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        hoverOffset: 4
      }]
    };

    const options: ChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(1);
              return context.label + ': ' + percentage + '%';
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
        type: 'pie',
        data: data,
        options: options
      });
    }
  } catch (error) {
    console.error('Error loading category sales data:', error);
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