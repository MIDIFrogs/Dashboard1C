<template>
  <div class="dashboard">
    <div class="controls">
      <button @click="updateData">Update Data</button>
      <button @click="generateReport">Generate Report</button>
    </div>
    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :margin="[10, 10]"
    >
      <grid-item
        v-for="chart in charts"
        :key="chart.id"
        :x="chart.x"
        :y="chart.y"
        :w="chart.w"
        :h="chart.h"
      >
        <chart-component :data="chart.data" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import ChartComponent from './ChartComponent.vue'

export default {
  components: {
    GridLayout,
    GridItem,
    ChartComponent,
  },
  data() {
    return {
      layout: [],
      charts: [
        {
          id: 1,
          x: 0,
          y: 0,
          w: 4,
          h: 4,
          data: {
            labels: ['Postgres Pro', 'Kaspersky', 'P7', 'Astra', 'ASCON', 'AI Content'],
            datasets: [
              {
                label: 'Sales Plan',
                data: [100000, 1200000, 500000, 1000000, 700000, 300000],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Actual Sales',
                data: [80000, 800000, 467000, 765000, 300000, 191919],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ],
          },
        },
        // Add more chart objects as needed
      ],
    }
  },
  methods: {
    updateData() {
      // Simulate data update
      console.log('Data updated')
    },
    generateReport() {
      // Simulate report generation
      console.log('Report generated')
    },
  },
}
</script>

<style>
.dashboard {
  padding: 20px;
}
.controls {
  margin-bottom: 20px;
}
</style>
