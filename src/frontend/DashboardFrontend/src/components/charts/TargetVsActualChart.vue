<template>
  <div class="chart-container">
    <h3>Target vs Actual Sales</h3>
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
    const currentYear = new Date().getFullYear();
    const quarterlyActual = [0, 0, 0, 0];
    const quarterlyTarget = [0, 0, 0, 0];

    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        for (const product of stats.products) {
          for (const sale of product.sales) {
            if (sale.year === currentYear) {
              quarterlyActual[sale.quarter - 1] += sale.actualSales;
              quarterlyTarget[sale.quarter - 1] += sale.targetAmount;
            }
          }
        }
      }
    }

    const data: ChartData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Actual Sales',
          data: quarterlyActual,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Target Sales',
          data: quarterlyTarget,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    const options: ChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return context.dataset.label + ': ' + 
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(context.raw);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value as number);
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
        type: 'line',
        data: data,
        options: options
      });
    }
  } catch (error) {
    console.error('Error loading target vs actual sales data:', error);
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