<template>
  <div class="quotation-map">
    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.sector"
        class="category-card"
      >
        <div 
          class="category-header"
          @click="selectCategory(category.sector)"
        >
          <h3>{{ category.sector }}</h3>
          <div class="category-stats">
            <div class="stat-item">
              <span class="stat-label">Products:</span>
              <span class="stat-value">{{ category.products.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Score:</span>
              <span class="stat-value">${{ category.totalScore.toLocaleString() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg Completion:</span>
              <span class="stat-value">{{ category.avgCompletion.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <transition
          name="expand"
          @enter="startTransition"
          @after-enter="endTransition"
          @before-leave="startTransition"
          @after-leave="endTransition"
        >
          <div class="products-grid" v-if="expandedCategory === category.sector">
            <div 
              v-for="product in category.products" 
              :key="product.id"
              class="product-card"
              :class="{ 
                'status-danger': product.planCompletion < 90 || product.timeCompliance < 90,
                'status-success': product.planCompletion >= 90 && product.timeCompliance >= 90,
                'is-expanded': expandedProduct === product.id
              }"
              @click.stop="toggleProduct(product.id)"
            >
              <div class="product-header">
                <h4>{{ product.name }}</h4>
                <span class="expand-indicator">{{ expandedProduct === product.id ? '−' : '+' }}</span>
              </div>
              
              <div class="product-stats" :class="{ 'expanded': expandedProduct === product.id }">
                <div class="basic-stats">
                  <div class="stat-row">
                    <span class="stat-label">Sales:</span>
                    <span class="stat-value">${{ product.sales.toLocaleString() }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Plan:</span>
                    <span class="stat-value">{{ product.planCompletion }}%</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Time:</span>
                    <span class="stat-value">{{ product.timeCompliance }}%</span>
                  </div>
                </div>

                <transition name="fade">
                  <div v-if="expandedProduct === product.id" class="detailed-stats">
                    <div class="stat-row">
                      <span class="stat-label">Monthly Growth:</span>
                      <span class="stat-value">{{ product.monthlyGrowth }}%</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Market Share:</span>
                      <span class="stat-value">{{ product.marketShare }}%</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Customer Rating:</span>
                      <span class="stat-value">{{ product.rating }}/5</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Units Sold:</span>
                      <span class="stat-value">{{ product.unitsSold.toLocaleString() }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Revenue Q1:</span>
                      <span class="stat-value">${{ product.quarterlyRevenue.q1.toLocaleString() }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Revenue Q2:</span>
                      <span class="stat-value">${{ product.quarterlyRevenue.q2.toLocaleString() }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Extended sample data with more categories and detailed product information
const sampleProducts = {
  'Technology': [
    { 
      id: 1, 
      name: 'Smart Hub Pro',
      sales: 150000,
      planCompletion: 95,
      timeCompliance: 92,
      monthlyGrowth: 4.5,
      marketShare: 15.3,
      rating: 4.2,
      unitsSold: 12500,
      quarterlyRevenue: { q1: 68000, q2: 82000 }
    },
    { 
      id: 2,
      name: 'AI Assistant',
      sales: 80000,
      planCompletion: 85,
      timeCompliance: 88,
      monthlyGrowth: 3.2,
      marketShare: 8.7,
      rating: 3.9,
      unitsSold: 8900,
      quarterlyRevenue: { q1: 35000, q2: 45000 }
    },
    { 
      id: 3,
      name: 'Security Suite',
      sales: 120000,
      planCompletion: 92,
      timeCompliance: 95,
      monthlyGrowth: 5.1,
      marketShare: 12.4,
      rating: 4.5,
      unitsSold: 15600,
      quarterlyRevenue: { q1: 55000, q2: 65000 }
    }
  ],
  'Finance': [
    { 
      id: 4,
      name: 'Trading Platform',
      sales: 200000,
      planCompletion: 98,
      timeCompliance: 95,
      monthlyGrowth: 6.2,
      marketShare: 18.5,
      rating: 4.7,
      unitsSold: 5800,
      quarterlyRevenue: { q1: 95000, q2: 105000 }
    },
    { 
      id: 5,
      name: 'Payment Gateway',
      sales: 120000,
      planCompletion: 92,
      timeCompliance: 94,
      monthlyGrowth: 4.8,
      marketShare: 14.2,
      rating: 4.4,
      unitsSold: 9200,
      quarterlyRevenue: { q1: 58000, q2: 62000 }
    }
  ],
  'Healthcare': [
    { 
      id: 6,
      name: 'Patient Monitor',
      sales: 180000,
      planCompletion: 96,
      timeCompliance: 97,
      monthlyGrowth: 5.5,
      marketShare: 22.1,
      rating: 4.8,
      unitsSold: 3200,
      quarterlyRevenue: { q1: 85000, q2: 95000 }
    },
    { 
      id: 7,
      name: 'Medical Records',
      sales: 90000,
      planCompletion: 88,
      timeCompliance: 86,
      monthlyGrowth: 3.8,
      marketShare: 9.5,
      rating: 3.7,
      unitsSold: 4500,
      quarterlyRevenue: { q1: 42000, q2: 48000 }
    }
  ],
  'Manufacturing': [
    { 
      id: 8,
      name: 'Assembly Line',
      sales: 250000,
      planCompletion: 94,
      timeCompliance: 91,
      monthlyGrowth: 4.2,
      marketShare: 25.8,
      rating: 4.3,
      unitsSold: 180,
      quarterlyRevenue: { q1: 120000, q2: 130000 }
    },
    { 
      id: 9,
      name: 'Quality Control',
      sales: 140000,
      planCompletion: 91,
      timeCompliance: 93,
      monthlyGrowth: 3.9,
      marketShare: 16.4,
      rating: 4.1,
      unitsSold: 850,
      quarterlyRevenue: { q1: 65000, q2: 75000 }
    }
  ],
  'Energy': [
    { 
      id: 10,
      name: 'Solar Solutions',
      sales: 300000,
      planCompletion: 97,
      timeCompliance: 96,
      monthlyGrowth: 7.2,
      marketShare: 28.5,
      rating: 4.6,
      unitsSold: 2200,
      quarterlyRevenue: { q1: 140000, q2: 160000 }
    },
    { 
      id: 11,
      name: 'Smart Grid',
      sales: 220000,
      planCompletion: 93,
      timeCompliance: 92,
      monthlyGrowth: 5.8,
      marketShare: 19.7,
      rating: 4.4,
      unitsSold: 1800,
      quarterlyRevenue: { q1: 105000, q2: 115000 }
    }
  ]
}

const expandedCategory = ref<string | null>(null)
const expandedProduct = ref<number | null>(null)
const isTransitioning = ref(false)

const categories = computed(() => {
  return Object.entries(sampleProducts).map(([sector, products]) => ({
    sector,
    products,
    totalScore: products.reduce((sum, p) => sum + p.sales, 0),
    avgCompletion: products.reduce((sum, p) => sum + p.planCompletion, 0) / products.length
  }))
})

const selectCategory = (sector: string): void => {
  if (isTransitioning.value) return
  expandedCategory.value = expandedCategory.value === sector ? null : sector
  expandedProduct.value = null
}

const toggleProduct = (productId: number): void => {
  expandedProduct.value = expandedProduct.value === productId ? null : productId
}

const startTransition = (el: Element): void => {
  if (!(el instanceof HTMLElement)) return
  isTransitioning.value = true
}

const endTransition = (el: Element): void => {
  if (!(el instanceof HTMLElement)) return
  isTransitioning.value = false
}
</script>

<style scoped>
.quotation-map {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.category-card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.category-card:hover {
  box-shadow: 0 8px 24px rgba(0, 242, 254, 0.2);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Changed from flex-start for better alignment */
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  user-select: none;
  height: 100%; /* Take full height of card */
}

.category-header:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.category-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  flex: 1;
}

.category-stats {
  display: flex;
  gap: 16px;
  align-items: center; /* Changed from flex-end */
  justify-content: flex-end;
  flex-wrap: nowrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px; /* Prevent stats from wrapping too early */
}

.products-grid {
  background: var(--card-background);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  grid-column: 1 / -1;
  width: 100%;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: scaleY(1);
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.15);
}

.product-card.is-expanded {
  grid-column: span 2;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.expand-indicator {
  font-size: 1.2rem;
  color: var(--text-secondary);
  font-weight: bold;
}

.product-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-stats.expanded {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
}

.basic-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detailed-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.status-danger {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-success {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

@media (max-width: 768px) {
  .product-card.is-expanded {
    grid-column: span 1;
  }

  .product-stats.expanded {
    grid-template-columns: 1fr;
  }

  .detailed-stats {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 8px;
    margin-top: 8px;
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 