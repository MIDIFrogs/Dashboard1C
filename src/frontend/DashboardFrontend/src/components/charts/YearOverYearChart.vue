<template>
  <div class="chart-container">
    <h3>Year-over-Year Category Growth</h3>
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
    const categoryGrowth: { category: string; q1: number; q2: number; q3: number; q4: number }[] = [];

    for (const category of categories.items) {
      const stats = await statisticsService.getCategoryStatistics(category.name);
      if (stats) {
        const quarterlyGrowth = {
          category: category.name,
          q1: 0,
          q2: 0,
          q3: 0,
          q4: 0
        };

        // Calculate quarterly growth rates
        for (const product of stats.products) {
          const currentYearSales = product.sales.filter(s => s.year === currentYear);
          const lastYearSales = product.sales.filter(s => s.year === currentYear - 1);

          for (let quarter = 1; quarter <= 4; quarter++) {
            const currentQuarterSales = currentYearSales.find(s => s.quarter === quarter)?.actualSales || 0;
            const lastQuarterSales = lastYearSales.find(s => s.quarter === quarter)?.actualSales || 0;

            if (lastQuarterSales > 0) {
              const growth = ((currentQuarterSales - lastQuarterSales) / lastQuarterSales) * 100;
              quarterlyGrowth['q' + quarter] += growth;
            }
          }
        }

        // Average the growth rates by number of products
        const productCount = stats.products.length;
        quarterlyGrowth.q1 /= productCount;
        quarterlyGrowth.q2 /= productCount;
        quarterlyGrowth.q3 /= productCount;
        quarterlyGrowth.q4 /= productCount;

        categoryGrowth.push(quarterlyGrowth);
      }
    }

    const data: ChartData = {
      labels: categoryGrowth.map(c => c.category),
      datasets: [
        {
          label: 'Q1 Growth',
          data: categoryGrowth.map(c => c.q1),
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Q2 Growth',
          data: categoryGrowth.map(c => c.q2),
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        },
        {
          label: 'Q3 Growth',
          data: categoryGrowth.map(c => c.q3),
          backgroundColor: 'rgba(255, 206, 86, 0.7)'
        },
        {
          label: 'Q4 Growth',
          data: categoryGrowth.map(c => c.q4),
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        }
      ]
    };

    const options: ChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value) => value + '%'
          }
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
    console.error('Error loading year-over-year comparison data:', error);
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