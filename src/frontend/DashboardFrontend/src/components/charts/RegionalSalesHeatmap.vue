<template>
  <div class="chart-container">
    <h3>Sales by Region</h3>
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
    const regionSales = new Map<string, number>();

    // Collect sales data by region
    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        for (const product of stats.products) {
          const currentSales = regionSales.get(product.region) || 0;
          regionSales.set(product.region, currentSales + product.totalSales);
        }
      }
    }

    // Convert to arrays for Chart.js
    const regions = Array.from(regionSales.keys());
    const salesValues = Array.from(regionSales.values());

    // Find min and max for color scaling
    const maxSale = Math.max(...salesValues);
    const minSale = Math.min(...salesValues);

    const data: ChartData = {
      labels: regions,
      datasets: [{
        label: 'Sales',
        data: salesValues,
        backgroundColor: (context: any) => {
          const value = context.raw;
          const alpha = (value - minSale) / (maxSale - minSale);
          return `rgba(54, 162, 235, ${alpha})`;
        }
      }]
    };

    const options: ChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return new Intl.NumberFormat('en-US', {
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
          display: false
        }
      }
    };

    if (chartCanvas.value) {
      if (chart.value) {
        chart.value.destroy();
      }
      chart.value = new Chart(chartCanvas.value, {
        type: 'bar',
        data: data,
        options: options
      });
    }
  } catch (error) {
    console.error('Error loading regional sales data:', error);
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