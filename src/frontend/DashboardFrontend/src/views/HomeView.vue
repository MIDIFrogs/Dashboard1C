<template>
  <!-- Keep only one Header component -->
  <Header />
  
  <main class="dashboard-content">
    <div v-if="isProductView" class="product-view-header">
      <h1>{{ selectedProduct.name }} Dashboard</h1>
      <p class="product-info">{{ selectedProduct.category }} · SKU: {{ selectedProduct.sku }}</p>
    </div>
    
    <!-- Top section with Quotation Map and Live Updates side by side -->
    <div class="top-section">
      <div class="section-header">
        <h2 class="section-title">Sales Performance Dashboard</h2>
      </div>
      
      <div class="top-section-content">
        <div class="quotation-section">
          <div class="quotation-container">
            <QuotationMap 
              @product-selected="handleProductSelected" 
              :key="quotationKey"
              ref="quotationMapRef"
            />
          </div>
        </div>
        
        <div class="updates-section">
          <NotificationWindow ref="notificationsRef" :refreshInterval="8000" />
        </div>
      </div>
    </div>
    
    <!-- Dashboard analytics cards -->
    <div class="analytics-section">
      <div class="section-header">
        <h2 class="section-title">Dashboard Analytics</h2>
      </div>
      
      <div class="dashboard-grid" :class="{ 'product-grid': isProductView }">
        <!-- Grid layout will be different based on if we're in product view or general view -->
        <template v-if="!isProductView">
          <!-- General dashboard view -->
          <Card
            v-for="(card, index) in cards"
            :key="index"
            :title="card.title"
            :type="card.type"
            :color="card.color"
            :expanded="expandedCard === index + 1"
            :isDragging="draggedCard === index"
            :isDragOver="hoveredCardId === index"
            @toggleFullscreen="toggleCardExpansion(index + 1)"
            @dragStart="(e) => handleDragStart(index, e)"
            @dragEnd="handleDragEnd"
            @dragEnter="handleDragEnter"
            @dragLeave="handleDragLeave"
            @dragOver="handleDragOver"
            @drop="(e) => handleDrop(index, e)"
          />
        </template>
        
        <template v-else>
          <!-- Product specific dashboard -->
          <Card
            v-for="(card, index) in cards"
            :key="index"
            :title="card.title"
            :type="card.type"
            :color="card.color"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === index + 1"
            :isDragging="draggedCard === index"
            :isDragOver="hoveredCardId === index"
            @toggleFullscreen="toggleCardExpansion(index + 1)"
            @dragStart="(e) => handleDragStart(index, e)"
            @dragEnd="handleDragEnd"
            @dragEnter="handleDragEnter"
            @dragLeave="handleDragLeave"
            @dragOver="handleDragOver"
            @drop="(e) => handleDrop(index, e)"
          />
        </template>
      </div>
    </div>
    
    <!-- Sales Heatmap Section -->
    <div class="heatmap-section">
      <div class="section-header">
        <h2 class="section-title">Regional Sales Intensity</h2>
      </div>
      <div class="heatmap-container">
        <SalesHeatmap :filters="currentFilters" />
      </div>
    </div>
    
    <!-- Filter popup component -->
    <FilterPopup ref="filterPopupRef" />
  </main>
  
  <!-- Keep Footer component -->
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import Card from '../components/Card.vue';
import QuotationMap from '../components/QuotationMap.vue';
import FilterPopup from '../components/FilterPopup.vue';
import NotificationWindow from '../components/NotificationWindow.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SalesHeatmap from '../components/SalesHeatmap.vue';
import type { AppliedFilters } from '../api/types';

// Props
interface Props {
  isProductView?: boolean;
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: 'return-to-general'): void;
  (e: 'product-selected', product: any): void;
}

const emit = defineEmits<Emits>();

// State
const expandedCard = ref<number | null>(null);
const quotationKey = ref<number>(0);
const quotationMapRef = ref<any>(null);
const filterPopupRef = ref<any>(null);
const notificationsRef = ref<any>(null);
const updateInterval = ref<number | null>(null);
const selectedProduct = ref<{
  id: number | undefined;
  name: string;
  category: string;
  sku: string;
}>({
  id: undefined,
  name: '',
  category: '',
  sku: ''
});

// Track current filters for components
const currentFilters = ref<AppliedFilters>({
  categoryIds: [],
  productIds: []
});

// Update events to track
const updateEvents = [
  'Sales data updated',
  'Market analytics refreshed',
  'Performance metrics calculated',
  'Product comparison refreshed',
  'Regional sales updated',
  'Category analysis completed',
  'Target achievement metrics updated'
];

// Add these refs after other refs in the script setup section
const draggedCard = ref<number | null>(null);
const draggedIndex = ref<number | null>(null);
const hoveredCardId = ref<number | null>(null);

// Add cards state
const cards = ref(!props.isProductView ? [
  { title: "Sales Distribution by Category", type: "pie", color: "#00f2fe" },
  { title: "Monthly Sales History", type: "histogram", color: "#00b09b" },
  { title: "Sales Plan Achievement", type: "radar", color: "#fc466b" },
  { title: "YoY Category Comparison", type: "bar", color: "#ef476f" },
  { title: "Target vs Actual Sales", type: "area", color: "#06d6a0" }
] : [
  { title: "Monthly Sales History", type: "histogram", color: "#00b09b" },
  { title: "Quarterly Sales Distribution", type: "radar", color: "#fc466b" },
  { title: "Target Achievement", type: "pie", color: "#00f2fe" },
  { title: "Category Distribution", type: "categoryDistribution", color: "#ffd166" },
  { title: "Regional Distribution", type: "bar", color: "#ef476f" },
  { title: "Target vs Actual Sales", type: "area", color: "#06d6a0" }
]);

// Event handlers
const returnToGeneral = (): void => {
  emit('return-to-general');
};

const toggleCardExpansion = (cardId: number): void => {
  expandedCard.value = expandedCard.value === cardId ? null : cardId;
};

const handleProductSelected = (product: any): void => {
  selectedProduct.value = product;
  emit('product-selected', product);
  
  // Show notification when product is selected
  if (notificationsRef.value && product.name) {
    notificationsRef.value.addNotification(
      `${product.name} dashboard is now active`,
      'info'
    );
  }
};

// Generates a random update notification
const getRandomUpdateMessage = (): string => {
  // Get random index
  const index = Math.floor(Math.random() * updateEvents.length);
  return updateEvents[index];
};

// Create a type-safe event handler
const filtersUpdatedHandler = ((event: Event) => {
  if (event instanceof CustomEvent) {
    handleFiltersUpdated(event);
  }
}) as EventListener;

// Update event listeners
onMounted(() => {
  window.addEventListener('data-updated', refreshData);
  window.addEventListener('filters-updated', filtersUpdatedHandler);
  startPeriodicUpdates();
});

onUnmounted(() => {
  window.removeEventListener('data-updated', refreshData);
  window.removeEventListener('filters-updated', filtersUpdatedHandler);
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
  }
});

// Start sending periodic updates for notifications
const startPeriodicUpdates = (): void => {
  // Generate an initial update
  generateUpdate();
  
  // Set interval for periodic updates (every 2 minutes)
  updateInterval.value = setInterval(() => {
    generateUpdate();
  }, 120000); // 2 minutes
};

// Generate an update and notify components
const generateUpdate = (): void => {
  // Create update message
  const updateMessage = getRandomUpdateMessage();
  
  // Notify other components by emitting a custom event
  window.dispatchEvent(new CustomEvent('data-updated', {
    detail: {
      timestamp: new Date().toISOString(),
      message: updateMessage
    }
  }));
};

// Refresh dashboard data
const refreshData = async (): Promise<void> => {
  // Increment key to force re-render of QuotationMap
  quotationKey.value++;
  
  // If you have refs to other components that need refreshing
  await nextTick();
};

// Handle filter updates
const handleFiltersUpdated = (event: CustomEvent): void => {
  // Store the current filters
  currentFilters.value = event.detail;
  
  if (quotationMapRef.value) {
    // Apply filters to quotation map
    quotationMapRef.value.applyFilters(event.detail);
  }
  
  // Show notification about applied filters
  if (notificationsRef.value) {
    notificationsRef.value.addNotification(
      'Filters applied to dashboard',
      'info'
    );
  }
  
  // Refresh the chart data
  refreshData();
};

// Add these methods after other methods in the script setup section
const handleDragStart = (index: number, event: DragEvent) => {
  draggedCard.value = index;
  draggedIndex.value = index;
};

const handleDragEnd = () => {
  draggedCard.value = null;
  draggedIndex.value = null;
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = (targetIndex: number, event: Event) => {
  event.preventDefault();
  
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return;

  // Swap cards in the reactive array
  const temp = cards.value[targetIndex];
  cards.value[targetIndex] = cards.value[draggedIndex.value];
  cards.value[draggedIndex.value] = temp;

  draggedCard.value = null;
  draggedIndex.value = null;
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.top-section {
  margin-bottom: 1rem;
  width: 100%;
  display: block;
}

.analytics-section {
  margin-bottom: 1rem;
  width: 100%;
  display: block;
}

.top-section-content {
  display: flex;
  gap: 1rem;
  height: 500px;
  max-height: 40vh;
  width: 100%;
}

.quotation-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.updates-section {
  width: 300px;
  min-width: 250px;
  flex-shrink: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(300px, auto);
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 1rem;
  position: relative;
}

/* Define styles for product-specific grid layout */
.dashboard-grid.product-grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(300px, auto);
}

/* Ensure dashboard content fills available space */
.dashboard-content {
  padding: 16px;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Simplified card layout - no need for individual card spans now */
.revenue-chart-card,
.product-performance-card,
.sales-breakdown-card,
.regional-performance-card,
.customer-satisfaction-card,
.sales-growth-card,
.sales-prediction-card {
  width: 100%;
}

@media (max-width: 1400px) {
  .top-section-content {
    height: 450px;
    max-height: 35vh;
  }
}

@media (max-width: 1200px) {
  .top-section-content {
    flex-direction: column;
    height: auto;
    max-height: none;
  }

  .updates-section {
    width: 100%;
    height: 300px;
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .dashboard-content {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    grid-auto-rows: minmax(250px, auto);
  }
  
  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .dashboard-content {
    padding: 16px;
  }
}

.product-view-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.product-view-header h1 {
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--text-primary);
}

.product-info {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.section-title {
  font-size: 1.5rem;
  margin: 30px 0 20px;
  color: var(--text-primary);
  position: relative;
  padding-left: 15px;
}

.section-header .section-title {
  margin: 0;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: var(--primary-color);
  border-radius: 2px;
}

.subsection-title {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-weight: 500;
}

.quotation-container {
  flex: 1;
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.heatmap-container {
  height: 400px;
  width: 100%;
  background-color: #1a2233; /* Dark background to make the map visible */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.heatmap-section {
  margin-top: 2rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  border: var(--card-border);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  min-height: 450px; /* Ensure there's enough space */
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .heatmap-container {
    height: 300px;
  }
}

.dashboard-grid .card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dashboard-grid .card.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
  z-index: 20;
}

.dashboard-grid .card.drag-over {
  transform: scale(1.02);
}
</style>