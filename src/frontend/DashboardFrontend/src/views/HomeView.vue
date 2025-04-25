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
          <h3 class="subsection-title">Sales Quotation Map</h3>
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
            title="Sales Distribution by Category" 
            type="pie" 
            color="#00f2fe"
            :expanded="expandedCard === 1"
            @toggleFullscreen="toggleCardExpansion(1)"
          />
          <Card 
            title="Monthly Sales History" 
            type="histogram" 
            color="#00b09b"
            :expanded="expandedCard === 2"
            @toggleFullscreen="toggleCardExpansion(2)"
          />
          <Card 
            title="Sales Plan Achievement" 
            type="radar" 
            color="#fc466b"
            :expanded="expandedCard === 3"
            @toggleFullscreen="toggleCardExpansion(3)"
          />
          <Card 
            title="Growth Trend Analysis" 
            type="line" 
            color="#ffd166"
            :expanded="expandedCard === 4"
            @toggleFullscreen="toggleCardExpansion(4)"
          />
          <Card 
            title="YoY Category Comparison" 
            type="bar" 
            color="#ef476f"
            :expanded="expandedCard === 5"
            @toggleFullscreen="toggleCardExpansion(5)"
          />
          <Card 
            title="Target vs Actual Sales" 
            type="area" 
            color="#06d6a0"
            :expanded="expandedCard === 6"
            @toggleFullscreen="toggleCardExpansion(6)"
          />
        </template>
        
        <template v-else>
          <!-- Product specific dashboard -->
          <Card 
            title="Monthly Sales History" 
            type="histogram" 
            color="#00b09b"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 1"
            @toggleFullscreen="toggleCardExpansion(1)"
          />
          <Card 
            title="Quarterly Sales Distribution" 
            type="radar" 
            color="#fc466b"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 2"
            @toggleFullscreen="toggleCardExpansion(2)"
          />
          <Card 
            title="Target Achievement" 
            type="pie" 
            color="#00f2fe"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 3"
            @toggleFullscreen="toggleCardExpansion(3)"
          />
          <Card 
            title="Customer Segments" 
            type="line" 
            color="#ffd166"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 4"
            @toggleFullscreen="toggleCardExpansion(4)"
          />
          <Card 
            title="Regional Distribution" 
            type="bar" 
            color="#ef476f"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 5"
            @toggleFullscreen="toggleCardExpansion(5)"
          />
          <Card 
            title="Growth Trend" 
            type="area" 
            color="#06d6a0"
            :isProductView="true"
            :productId="selectedProduct.id"
            :productName="selectedProduct.name"
            :expanded="expandedCard === 6"
            @toggleFullscreen="toggleCardExpansion(6)"
          />
        </template>
      </div>
    </div>
    
    <!-- Filter popup component -->
    <FilterPopup ref="filterPopupRef" />
  </main>
  
  <!-- Keep Footer component -->
  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import Card from '../components/Card.vue';
import QuotationMap from '../components/QuotationMap.vue';
import FilterPopup from '../components/FilterPopup.vue';
import NotificationWindow from '../components/NotificationWindow.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

// Props
const props = defineProps({
  isProductView: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['return-to-general', 'product-selected']);

// State
const expandedCard = ref(null);
const quotationKey = ref(0);
const quotationMapRef = ref(null);
const filterPopupRef = ref(null);
const notificationsRef = ref(null);
const updateInterval = ref(null);
const selectedProduct = ref({
  id: null,
  name: '',
  category: '',
  sku: ''
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

// Event handlers
const returnToGeneral = () => {
  emit('return-to-general');
};

const toggleCardExpansion = (cardId) => {
  expandedCard.value = expandedCard.value === cardId ? null : cardId;
};

const handleProductSelected = (product) => {
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
const getRandomUpdateMessage = () => {
  // Get random index
  const index = Math.floor(Math.random() * updateEvents.length);
  return updateEvents[index];
};

// Event listeners for data updates
onMounted(() => {
  // Listen for data-updated events from various components
  window.addEventListener('data-updated', refreshData);
  
  // Listen for filter updates
  window.addEventListener('filters-updated', handleFiltersUpdated);
  
  // Start sending periodic updates for notifications
  startPeriodicUpdates();
});

onUnmounted(() => {
  window.removeEventListener('data-updated', refreshData);
  window.removeEventListener('filters-updated', handleFiltersUpdated);
  
  // Clear update interval when component unmounts
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
  }
});

// Start sending periodic updates for notifications
const startPeriodicUpdates = () => {
  // Generate an initial update
  generateUpdate();
  
  // Set interval for periodic updates (every 2 minutes)
  updateInterval.value = setInterval(() => {
    generateUpdate();
  }, 120000); // 2 minutes
};

// Generate an update and notify components
const generateUpdate = () => {
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
const refreshData = async () => {
  // Increment key to force re-render of QuotationMap
  quotationKey.value++;
  
  // If you have refs to other components that need refreshing
  await nextTick();
};

// Handle filter updates
const handleFiltersUpdated = (event) => {
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
  margin-bottom: 2.5rem;
  width: 100%;
  display: block;
}

.analytics-section {
  margin-bottom: 2rem;
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
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 1.5rem;
}

/* Define styles for product-specific grid layout */
.dashboard-grid.product-grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(300px, auto);
}

/* Ensure dashboard content fills available space */
.dashboard-content {
  padding: 32px;
  max-width: 1440px;
  margin: 0 auto;
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
</style>