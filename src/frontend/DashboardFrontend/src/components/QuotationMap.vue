<template>
  <div class="quotation-map">
    <div class="quotation-map-title">
      <h3>Sales Quotation Map</h3>
    </div>
    <div v-if="isLoading" class="loading-state">
      Loading categories...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else class="categories-grid">
      <div
        v-for="category in categoryStats"
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
                'status-danger': getProductStatus(product) === 'danger',
                'status-success': getProductStatus(product) === 'success',
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
                    <span class="stat-value">${{ getTotalSales(product).toLocaleString() }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Plan:</span>
                    <span class="stat-value">{{ getCompletionRate(product).toFixed(1) }}%</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Time:</span>
                    <span class="stat-value">{{ getTimeCompliance(product).toFixed(1) }}%</span>
                  </div>
                </div>

                <transition name="fade">
                  <div v-if="expandedProduct === product.id" class="detailed-stats">
                    <div class="stat-row">
                      <span class="stat-label">Monthly Growth:</span>
                      <span class="stat-value">{{ getMonthlyGrowth(product).toFixed(1) }}%</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Market Share:</span>
                      <span class="stat-value">{{ getMarketShare(product).toFixed(1) }}%</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Customer Rating:</span>
                      <span class="stat-value">{{ getRating(product).toFixed(1) }}/5</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Units Sold:</span>
                      <span class="stat-value">{{ getUnitsSold(product).toLocaleString() }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Revenue Q1:</span>
                      <span class="stat-value">${{ getQuarterlyRevenue(product, 1).toLocaleString() }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="stat-label">Revenue Q2:</span>
                      <span class="stat-value">${{ getQuarterlyRevenue(product, 2).toLocaleString() }}</span>
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
import { ref, computed, onMounted } from 'vue';
import { getServiceFactory } from '@/api/services';
import type { Category, ProductGroup, Sale } from '@/api/models';
import type { AppliedFilters } from '@/api/types/filters';

// Initialize services
const services = getServiceFactory(import.meta.env.DEV);
const { categoryService, productService, saleService } = services;

// State management
const categories = ref<Category[]>([]);
const expandedCategory = ref<string | null>(null);
const expandedProduct = ref<number | null>(null);
const isTransitioning = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);
const activeFilters = ref<AppliedFilters>({
  categoryIds: [],
  productIds: []
});

// Load initial data
onMounted(async () => {
  await loadCategories();
});

// Method to load categories with optional filters
const loadCategories = async (filters?: AppliedFilters) => {
  isLoading.value = true;
  error.value = null;

  try {
    let response;

    if (filters && (filters.categoryIds.length || filters.productIds.length || filters.regionIds?.length)) {
      // Apply filters when loading categories
      activeFilters.value = { ...filters };
      response = await categoryService.getCategoriesFiltered(filters);
    } else {
      // Load all categories if no filters
      response = await categoryService.getCategories(0, 50); // Get up to 50 categories
    }

    categories.value = response.items;
    isLoading.value = false;
  } catch (e) {
    error.value = 'Failed to load categories';
    isLoading.value = false;
    console.error('Error loading categories:', e);
  }
};

// Method to apply filters (called from parent component)
const applyFilters = async (filters: AppliedFilters) => {
  console.log('Applying filters to QuotationMap:', filters);
  await loadCategories(filters);

  // Reset expanded states when filters change
  expandedCategory.value = null;
  expandedProduct.value = null;
};

// Expose the applyFilters method
defineExpose({ applyFilters });

// Computed properties for statistics
const categoryStats = computed(() => {
  return categories.value.map(category => ({
    sector: category.name,
    products: category.products,
    totalScore: category.products.reduce((sum, product) =>
      sum + product.sales.reduce((salesSum, sale) => salesSum + sale.actualSales, 0), 0),
    avgCompletion: calculateAvgCompletion(category.products)
  }));
});

// Helper function to calculate average completion
function calculateAvgCompletion(products: ProductGroup[]): number {
  const completionRates = products.flatMap(product =>
    product.sales.map(sale => (sale.actualSales / sale.targetAmount) * 100)
  );

  if (completionRates.length === 0) return 0;
  return completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
}

// Event handlers
const selectCategory = async (sector: string) => {
  if (isTransitioning.value) return;

  try {
    if (expandedCategory.value === sector) {
      expandedCategory.value = null;
    } else {
      expandedCategory.value = sector;
      // Load detailed product data if not already loaded
      const category = categories.value.find(c => c.name === sector);
      if (category && (!category.products || category.products.length === 0)) {
        const products = await productService.getProductsByCategoryId(category.id);
        // Load sales data for each product
        for (const product of products) {
          product.sales = await saleService.getSalesByProductId(product.id);
        }
        // Update the category's products
        category.products = products;
      }
    }
    expandedProduct.value = null;
  } catch (e) {
    error.value = 'Failed to load category details';
    console.error('Error loading category details:', e);
  }
};

const toggleProduct = async (productId: number) => {
  try {
    if (expandedProduct.value === productId) {
      expandedProduct.value = null;
    } else {
      expandedProduct.value = productId;
      // Load detailed product stats if needed
      const stats = await productService.getProductStats(productId);
      // You can use the stats to show additional information in the UI
      console.log('Product stats:', stats);
    }
  } catch (e) {
    error.value = 'Failed to load product details';
    console.error('Error loading product details:', e);
  }
};

const startTransition = (el: Element): void => {
  if (!(el instanceof HTMLElement)) return;
  isTransitioning.value = true;
};

const endTransition = (el: Element): void => {
  if (!(el instanceof HTMLElement)) return;
  isTransitioning.value = false;
};
</script>

<style scoped>
.quotation-map {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quotation-map-title {
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.quotation-map-title h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 500;
}

.categories-grid {
  overflow-y: auto;
  padding: 0.5rem;
  flex: 1;
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

/* Add new styles for loading and error states */
.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.error-state {
  color: #f44336;
}
</style>

<script lang="ts">
// Helper functions for product statistics
function getProductStatus(product: ProductGroup): 'danger' | 'success' | null {
  const completionRate = getCompletionRate(product);
  const timeCompliance = getTimeCompliance(product);
  if (completionRate < 90 || timeCompliance < 90) return 'danger';
  if (completionRate >= 90 && timeCompliance >= 90) return 'success';
  return null;
}

function getTotalSales(product: ProductGroup): number {
  return product.sales.reduce((sum, sale) => sum + sale.actualSales, 0);
}

function getCompletionRate(product: ProductGroup): number {
  const totalActual = product.sales.reduce((sum, sale) => sum + sale.actualSales, 0);
  const totalTarget = product.sales.reduce((sum, sale) => sum + sale.targetAmount, 0);
  return totalTarget ? (totalActual / totalTarget) * 100 : 0;
}

function getTimeCompliance(product: ProductGroup): number {
  // This should be calculated based on actual delivery dates vs planned dates
  // For now, return a mock value
  return 95;
}

function getMonthlyGrowth(product: ProductGroup): number {
  const currentYear = new Date().getFullYear();
  const currentYearSales = product.sales.filter(s => s.year === currentYear);
  const lastYearSales = product.sales.filter(s => s.year === currentYear - 1);

  const currentTotal = currentYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);
  const lastTotal = lastYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);

  return lastTotal ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;
}

function getMarketShare(product: ProductGroup): number {
  // This should come from backend
  return 15.3;
}

function getRating(product: ProductGroup): number {
  // This should come from backend
  return 4.2;
}

function getUnitsSold(product: ProductGroup): number {
  return product.sales.reduce((sum, sale) => sum + sale.actualSales, 0);
}

function getQuarterlyRevenue(product: ProductGroup, quarter: number): number {
  const currentYear = new Date().getFullYear();
  const quarterSales = product.sales.filter(s => s.year === currentYear && s.quarter === quarter);
  return quarterSales.reduce((sum, sale) => sum + sale.actualSales, 0);
}
</script>
