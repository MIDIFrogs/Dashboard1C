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

const cards = ref([
  { id: 1, title: 'Revenue Analysis', type: 'histogram' },
  { id: 2, title: 'Market Distribution', type: 'windrose' },
  { id: 3, title: 'Performance Heatmap', type: 'heatmap' }
])
</script>

<template>
  <div class="app-container">
    <Header />

    <main>
      <div class="static-cards">
        <QuotationMap class="quotation-map" />
        <NotificationWindow class="notification-window" />
      </div>
      <div class="dynamic-cards">
        <Card 
          v-for="card in cards" 
          :key="card.id"
          :title="card.title"
          :type="card.type"
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
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark), var(--background-light));
  color: var(--text-primary);
}

main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 60px; /* Space for footer */
}

.static-cards {
  display: grid;
  grid-template-columns: 60% 38%;
  gap: 2%;
  margin-bottom: 20px;
}

.quotation-map {
  animation: fadeIn 0.5s ease-out;
}

.notification-window {
  animation: slideIn 0.5s ease-out;
}

.dynamic-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.draggable-card {
  cursor: move;
  transition: transform 0.2s, box-shadow 0.2s;
}

.draggable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 242, 254, 0.2);
}

@media (max-width: 768px) {
  .static-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
