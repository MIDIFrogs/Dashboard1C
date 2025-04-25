<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Card from './components/Card.vue'
import QuotationMap from './components/QuotationMap.vue'
import NotificationWindow from './components/NotificationWindow.vue'
import ReportPopup from './components/ReportPopup.vue'
import FilterPopup from './components/FilterPopup.vue'
import '@/assets/styles/theme.css'

const companies = ref([
  { id: 1, name: 'TechCorp', sector: 'Technology', performance: 2.5 },
  { id: 2, name: 'InnovateX', sector: 'Innovation', performance: -1.2 },
  { id: 3, name: 'GlobalTrade', sector: 'Trading', performance: 3.7 },
  { id: 4, name: 'EcoSolutions', sector: 'Environmental', performance: 1.8 },
  { id: 5, name: 'FinanceHub', sector: 'Finance', performance: 2.1 },
  { id: 6, name: 'HealthTech', sector: 'Healthcare', performance: 4.2 },
  { id: 7, name: 'SmartEnergy', sector: 'Energy', performance: -0.8 },
  { id: 8, name: 'DataDrive', sector: 'Data Analytics', performance: 3.1 },
  { id: 9, name: 'BuildCorp', sector: 'Construction', performance: 1.5 },
  { id: 10, name: 'AgroTech', sector: 'Agriculture', performance: 2.7 }
])

const cards = ref([
  { id: 1, title: 'Revenue Analysis', type: 'histogram', color: '#4CAF50' },
  { id: 2, title: 'Market Distribution', type: 'pie', color: '#2196F3' },
  { id: 3, title: 'Performance Trends', type: 'line', color: '#9C27B0' },
  { id: 4, title: 'Sales Comparison', type: 'bar', color: '#FF9800' },
  { id: 5, title: 'Growth Analysis', type: 'area', color: '#E91E63' },
  { id: 6, title: 'Regional Stats', type: 'radar', color: '#00BCD4' }
])
</script>

<template>
  <div class="app-container">
    <Header />

    <main>
      <div class="static-cards">
        <QuotationMap class="quotation-map" :companies="companies" />
        <NotificationWindow class="notification-window" />
      </div>
      <div class="dynamic-cards">
        <Card 
          v-for="card in cards" 
          :key="card.id"
          :title="card.title"
          :type="card.type"
          :color="card.color"
          class="draggable-card"
        />
      </div>
    </main>

    <ReportPopup />
    <FilterPopup />
    <Footer />
  </div>
</template>

<style scoped>
:root {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark), var(--background-light));
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

/* Header - fixed at top */
:deep(header) {
  height: 50px;
  background: var(--card-background);
  border-bottom: var(--card-border);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Main content area */
main {
  margin-top: 50px; /* Space for header */
  padding: 16px;
  min-height: calc(100vh - 50px); /* Minimum height to push footer down */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.static-cards {
  display: grid;
  grid-template-columns: 65% 33%;
  gap: 2%;
  height: 450px;
  min-height: 450px;
  width: 100%;
}

.quotation-map {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  height: 100%;
  width: 100%;
  padding: 20px;
}

.notification-window {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
}

.dynamic-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  padding: 4px;
}

.draggable-card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  height: 400px;
  cursor: move;
  transition: all 0.3s ease;
  min-height: 300px;
  min-width: 350px;
  padding: 20px;
  position: relative;
}

.draggable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 32px rgba(0, 242, 254, 0.15);
}

/* Footer */
:deep(footer) {
  height: 50px;
  background: var(--card-background);
  border-top: var(--card-border);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 0 24px;
  width: 100%;
}

@media (max-width: 1600px) {
  .dynamic-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .static-cards {
    grid-template-columns: 1fr;
    gap: 24px;
    height: auto;
  }

  .quotation-map,
  .notification-window {
    height: 400px;
  }

  .dynamic-cards {
    grid-template-columns: 1fr;
  }
}
</style>
