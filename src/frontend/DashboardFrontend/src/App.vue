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

interface Card {
  id: number
  title: string
  type: string
  color: string
  expanded: boolean
  order?: number
}

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

const cards = ref<Card[]>([
  { id: 1, title: 'Revenue Analysis', type: 'histogram', color: '#4CAF50', expanded: false },
  { id: 2, title: 'Market Distribution', type: 'pie', color: '#2196F3', expanded: false },
  { id: 3, title: 'Performance Trends', type: 'line', color: '#9C27B0', expanded: false },
  { id: 4, title: 'Sales Comparison', type: 'bar', color: '#FF9800', expanded: false },
  { id: 5, title: 'Growth Analysis', type: 'area', color: '#E91E63', expanded: false },
  { id: 6, title: 'Regional Stats', type: 'radar', color: '#00BCD4', expanded: false }
])

const draggedCard = ref<Card | null>(null)
const draggedIndex = ref<number | null>(null)
const hoveredCardId = ref<number | null>(null)

const toggleExpand = (cardId: number): void => {
  const card = cards.value.find(c => c.id === cardId)
  if (card) {
    // Collapse all other cards first
    cards.value.forEach(c => {
      if (c.id !== cardId) c.expanded = false
    })
    // Toggle the clicked card
    card.expanded = !card.expanded
  }
}

const handleMouseEnter = (cardId: number): void => {
  hoveredCardId.value = cardId
}

const handleMouseLeave = () => {
  hoveredCardId.value = null
}

const handleDragStart = (card: Card, index: number, event: DragEvent): void => {
  if (!event.dataTransfer) return
  draggedCard.value = card
  draggedIndex.value = index
  event.target.classList.add('dragging')
}

const handleDragEnd = (event: DragEvent): void => {
  event.target.classList.remove('dragging')
  draggedCard.value = null
  draggedIndex.value = null
}

const handleDragEnter = (event: DragEvent): void => {
  event.preventDefault()
  event.target.closest('.card-container')?.classList.add('drag-over')
}

const handleDragLeave = (event: DragEvent): void => {
  event.preventDefault()
  event.target.closest('.card-container')?.classList.remove('drag-over')
}

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault()
}

const handleDrop = (targetIndex: number, event: DragEvent): void => {
  event.preventDefault()
  const container = event.target.closest('.card-container')
  if (container) {
    container.classList.remove('drag-over')
  }

  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return

  // Swap cards
  const temp = cards.value[targetIndex]
  cards.value[targetIndex] = cards.value[draggedIndex.value]
  cards.value[draggedIndex.value] = temp

  draggedCard.value = null
  draggedIndex.value = null
}
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
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="card-container"
          :class="{
            'is-dragging': draggedCard === card,
            'is-expanded': card.expanded,
            'is-collapsed': cards.some(c => c.expanded) && !card.expanded
          }"
          draggable="true"
          @dragstart="(e) => handleDragStart(card, index, e)"
          @dragend="handleDragEnd"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="(e) => handleDrop(index, e)"
          @mouseenter="() => handleMouseEnter(card.id)"
          @mouseleave="handleMouseLeave"
        >
          <Card
            :title="card.title"
            :type="card.type"
            :color="card.color"
            class="draggable-card"
            @toggleFullscreen="toggleExpand(card.id)"
          />
        </div>
      </div>
    </main>

    <ReportPopup />
    <FilterPopup />
    <Footer />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark), var(--background-light));
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  margin: 0;
  grid-template-columns: 1fr 1fr;
  padding: 0;
  position: relative;
  overflow-x: hidden;
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
  z-index: 100;
}

/* Main content area */
main {
  padding: 24px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-x: hidden;
}

.static-cards {
  display: grid;
  grid-template-columns: 75% 23%;
  gap: 2%;
  height: 500px;
  margin-bottom: 32px;
}

.quotation-map {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 16px;
  height: 100%;
  padding: 24px;
}

.notification-window {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 24px;
}

.dynamic-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.card-container {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  will-change: transform, opacity;
}

.card-container.is-expanded {
  transform: scale(1.1);
  z-index: 10;
}

.card-container.is-collapsed {
  transform: scale(0.9);
  opacity: 0.7;
}

.card-container.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
  z-index: 20;
}

.draggable-card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 16px;
  height: 400px;
  cursor: move;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 24px;
  position: relative;
  overflow: hidden;
  user-select: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.is-expanded .draggable-card {
  box-shadow: 0 12px 32px rgba(0, 242, 254, 0.3);
}

.is-collapsed .draggable-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  filter: brightness(0.95);
}

/* Footer */
:deep(footer) {
  height: 40px;
  background: var(--card-background);
  border-top: var(--card-border);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 24px;
  margin-top: auto;
}

@media (max-width: 1440px) {
  .dynamic-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .draggable-card {
    height: 350px;
  }
}

@media (max-width: 1024px) {
  main {
    padding: 16px 24px 48px;
  }

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
