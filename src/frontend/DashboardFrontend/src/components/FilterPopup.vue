<template>
  <Teleport to="body">
    <transition name="fade">
      <div class="filter-popup" v-if="isVisible" @click.self="closePopup">
        <div class="filter-content">
          <div class="filter-header">
            <h2>Data Filters</h2>
            <button class="close-btn" @click="closePopup">×</button>
          </div>
          
          <div class="filter-body">
            <div v-if="isLoading" class="loading">
              <div class="spinner"></div>
              <p>Loading filter options...</p>
            </div>
            
            <div v-else class="filter-sections">
              <!-- Categories Filter -->
              <div class="filter-section">
                <h3>
                  <div class="section-header" @click="toggleSection('categories')">
                    <span class="section-title">Categories</span>
                    <span class="toggle-icon">{{ expandedSections.categories ? '▼' : '►' }}</span>
                  </div>
                </h3>
                <div v-if="expandedSections.categories" class="filter-options">
                  <div class="filter-actions">
                    <button class="select-all" @click="selectAllCategories(true)">Select All</button>
                    <button class="select-none" @click="selectAllCategories(false)">Deselect All</button>
                  </div>
                  <div class="checkbox-list">
                    <div v-for="category in filterOptions.categories" :key="category.id" class="checkbox-item">
                      <label>
                        <input 
                          type="checkbox" 
                          :value="category.id" 
                          v-model="selectedFilters.categoryIds"
                        >
                        {{ category.name }} 
                        <span class="item-count">({{ category.count || 0 }})</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Products Filter -->
              <div class="filter-section">
                <h3>
                  <div class="section-header" @click="toggleSection('products')">
                    <span class="section-title">Products</span>
                    <span class="toggle-icon">{{ expandedSections.products ? '▼' : '►' }}</span>
                  </div>
                </h3>
                <div v-if="expandedSections.products" class="filter-options">
                  <div class="filter-actions">
                    <button class="select-all" @click="selectAllProducts(true)">Select All</button>
                    <button class="select-none" @click="selectAllProducts(false)">Deselect All</button>
                  </div>
                  <div class="search-box">
                    <input 
                      type="text" 
                      v-model="productSearchQuery" 
                      placeholder="Search products..." 
                      @input="filterProducts"
                    >
                  </div>
                  <div class="checkbox-list scrollable">
                    <div v-for="product in filteredProducts" :key="product.id" class="checkbox-item">
                      <label>
                        <input 
                          type="checkbox" 
                          :value="product.id" 
                          v-model="selectedFilters.productIds"
                        >
                        {{ product.name }}
                      </label>
                    </div>
                    <div v-if="filteredProducts.length === 0" class="no-results">
                      No products match your search
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Regions Filter -->
              <div class="filter-section">
                <h3>
                  <div class="section-header" @click="toggleSection('regions')">
                    <span class="section-title">Regions</span>
                    <span class="toggle-icon">{{ expandedSections.regions ? '▼' : '►' }}</span>
                  </div>
                </h3>
                <div v-if="expandedSections.regions" class="filter-options">
                  <div class="filter-actions">
                    <button class="select-all" @click="selectAllRegions(true)">Select All</button>
                    <button class="select-none" @click="selectAllRegions(false)">Deselect All</button>
                  </div>
                  <div class="checkbox-list">
                    <div v-for="region in filterOptions.regions" :key="region.id" class="checkbox-item">
                      <label>
                        <input 
                          type="checkbox" 
                          :value="region.id" 
                          v-model="selectedFilters.regionIds"
                        >
                        {{ region.name }}
                        <span class="item-count">({{ region.count || 0 }})</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Completion Status Filter -->
              <div class="filter-section">
                <h3>
                  <div class="section-header" @click="toggleSection('completion')">
                    <span class="section-title">Completion Status</span>
                    <span class="toggle-icon">{{ expandedSections.completion ? '▼' : '►' }}</span>
                  </div>
                </h3>
                <div v-if="expandedSections.completion" class="filter-options">
                  <div class="radio-list">
                    <div class="radio-item">
                      <label>
                        <input 
                          type="radio" 
                          value="all" 
                          v-model="selectedFilters.completionStatus"
                        >
                        All
                      </label>
                    </div>
                    <div class="radio-item">
                      <label>
                        <input 
                          type="radio" 
                          value="completed" 
                          v-model="selectedFilters.completionStatus"
                        >
                        Plan Completed (≥ 100%)
                      </label>
                    </div>
                    <div class="radio-item">
                      <label>
                        <input 
                          type="radio" 
                          value="incompleted" 
                          v-model="selectedFilters.completionStatus"
                        >
                        Plan Incomplete (< 100%)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="filter-footer">
            <div class="active-filters" v-if="hasActiveFilters">
              <span class="filter-count">{{ activeFilterCount }} active filters</span>
              <button class="reset-filters" @click="resetFilters">Clear All</button>
            </div>
            <div class="filter-actions">
              <button class="cancel-btn" @click="closePopup">Cancel</button>
              <button class="apply-btn" @click="applyFilters" :disabled="isApplying">
                {{ isApplying ? 'Applying...' : 'Apply Filters' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue';
import { filterService } from '@/api/services/filterService';

// State
const isVisible = ref(false);
const isLoading = ref(false);
const isApplying = ref(false);
const productSearchQuery = ref('');

// Filter options from API
const filterOptions = reactive({
  categories: [],
  products: [],
  regions: []
});

// Selected filter values
const selectedFilters = reactive({
  categoryIds: [],
  productIds: [],
  regionIds: [],
  completionStatus: 'all'
});

// UI state - which sections are expanded
const expandedSections = reactive({
  categories: true,
  products: false,
  regions: false,
  completion: false
});

// Cached products for search functionality
const allProducts = ref([]);

// Computed properties
const filteredProducts = computed(() => {
  if (!productSearchQuery.value) {
    return allProducts.value;
  }
  
  const query = productSearchQuery.value.toLowerCase();
  return allProducts.value.filter(product => 
    product.name.toLowerCase().includes(query)
  );
});

const hasActiveFilters = computed(() => {
  return selectedFilters.categoryIds.length > 0 ||
         selectedFilters.productIds.length > 0 ||
         selectedFilters.regionIds.length > 0 ||
         selectedFilters.completionStatus !== 'all';
});

const activeFilterCount = computed(() => {
  let count = 0;
  count += selectedFilters.categoryIds.length;
  count += selectedFilters.productIds.length;
  count += selectedFilters.regionIds.length;
  if (selectedFilters.completionStatus !== 'all') count += 1;
  return count;
});

// Methods
const loadFilterOptions = async () => {
  isLoading.value = true;
  try {
    const options = await filterService.getFilterOptions();
    filterOptions.categories = options.categories || [];
    filterOptions.products = options.products || [];
    filterOptions.regions = options.regions || [];
    
    // Cache products for search
    allProducts.value = [...filterOptions.products];
    
    // Initialize selected filters with all options
    selectedFilters.categoryIds = filterOptions.categories.map(c => c.id);
    selectedFilters.productIds = filterOptions.products.map(p => p.id);
    selectedFilters.regionIds = filterOptions.regions.map(r => r.id);
  } catch (error) {
    console.error('Failed to load filter options:', error);
    // Use sample data if API fails
    initSampleData();
  } finally {
    isLoading.value = false;
  }
};

const initSampleData = () => {
  // Sample categories
  filterOptions.categories = [
    { id: 1, name: 'Technology', count: 8 },
    { id: 2, name: 'Finance', count: 5 },
    { id: 3, name: 'Healthcare', count: 7 },
    { id: 4, name: 'Retail', count: 6 },
    { id: 5, name: 'Manufacturing', count: 4 }
  ];
  
  // Sample products
  filterOptions.products = [
    { id: 1, name: 'Product A', categoryId: 1 },
    { id: 2, name: 'Product B', categoryId: 1 },
    { id: 3, name: 'Product C', categoryId: 2 },
    { id: 4, name: 'Product D', categoryId: 3 },
    { id: 5, name: 'Product E', categoryId: 4 },
    { id: 6, name: 'Product F', categoryId: 5 },
    { id: 7, name: 'Product G', categoryId: 1 },
    { id: 8, name: 'Product H', categoryId: 2 },
    { id: 9, name: 'Product I', categoryId: 3 },
    { id: 10, name: 'Product J', categoryId: 4 }
  ];
  
  // Sample regions
  filterOptions.regions = [
    { id: 1, name: 'North America', count: 12 },
    { id: 2, name: 'Europe', count: 10 },
    { id: 3, name: 'Asia', count: 8 },
    { id: 4, name: 'Africa', count: 5 },
    { id: 5, name: 'South America', count: 7 }
  ];
  
  // Cache products for search
  allProducts.value = [...filterOptions.products];
  
  // Initialize selected filters with all options
  selectedFilters.categoryIds = filterOptions.categories.map(c => c.id);
  selectedFilters.productIds = filterOptions.products.map(p => p.id);
  selectedFilters.regionIds = filterOptions.regions.map(r => r.id);
};

const toggleSection = (section) => {
  expandedSections[section] = !expandedSections[section];
};

const selectAllCategories = (select) => {
  selectedFilters.categoryIds = select ? filterOptions.categories.map(c => c.id) : [];
};

const selectAllProducts = (select) => {
  selectedFilters.productIds = select ? allProducts.value.map(p => p.id) : [];
};

const selectAllRegions = (select) => {
  selectedFilters.regionIds = select ? filterOptions.regions.map(r => r.id) : [];
};

const filterProducts = () => {
  // This function doesn't need a body as we're using a computed property
};

const resetFilters = () => {
  selectAllCategories(true);
  selectAllProducts(true);
  selectAllRegions(true);
  selectedFilters.completionStatus = 'all';
};

const applyFilters = async () => {
  isApplying.value = true;
  try {
    // Call API to apply filters
    await filterService.applyFilters('dashboard', {
      categoryIds: selectedFilters.categoryIds,
      productIds: selectedFilters.productIds,
      regionIds: selectedFilters.regionIds,
      completionStatus: selectedFilters.completionStatus
    });
    
    // Emit an event to notify components to refresh data
    window.dispatchEvent(new CustomEvent('filters-updated', {
      detail: {
        ...selectedFilters
      }
    }));
    
    closePopup();
  } catch (error) {
    console.error('Failed to apply filters:', error);
    alert('Failed to apply filters. Please try again.');
  } finally {
    isApplying.value = false;
  }
};

const showPopup = () => {
  isVisible.value = true;
};

const closePopup = () => {
  isVisible.value = false;
};

// Watch for categories filter changes to filter products by category
watch(
  () => selectedFilters.categoryIds,
  (newCategoryIds) => {
    // If we have categories selected, only show products from those categories
    if (newCategoryIds.length > 0 && newCategoryIds.length < filterOptions.categories.length) {
      // Make sure we handle products that might not have categoryId correctly
      allProducts.value = filterOptions.products.filter(product => 
        product.categoryId && newCategoryIds.includes(product.categoryId)
      );
    } else {
      // Otherwise, show all products
      allProducts.value = [...filterOptions.products];
    }
  }
);

// Load data when component is mounted
onMounted(() => {
  loadFilterOptions();
  
  // Listen for global open filter popup event
  window.addEventListener('open-filter-popup', showPopup);
});

// Clean up event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('open-filter-popup', showPopup);
});

// Expose methods to be used by parent component
defineExpose({
  showPopup,
  closePopup
});
</script>

<style scoped>
.filter-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.filter-content {
  background: var(--background-dark);
  border: var(--card-border);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: var(--card-border);
  background: rgba(0, 0, 0, 0.2);
}

.filter-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.filter-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 242, 254, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.filter-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-title {
  font-weight: 500;
  color: var(--text-primary);
}

.toggle-icon {
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.filter-options {
  padding: 16px;
  background: rgba(0, 0, 0, 0.1);
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.select-all, .select-none {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all:hover, .select-none:hover {
  background: rgba(255, 255, 255, 0.2);
}

.checkbox-list, .radio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scrollable {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.checkbox-item, .radio-item {
  display: flex;
  align-items: center;
}

.checkbox-item label, .radio-item label {
  display: flex;
  align-items: center;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.checkbox-item input, .radio-item input {
  margin-right: 8px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.item-count {
  margin-left: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.search-box {
  margin-bottom: 12px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.no-results {
  padding: 16px 0;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

.filter-footer {
  padding: 16px 24px;
  border-top: var(--card-border);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.active-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-count {
  color: var(--text-secondary);
  font-size: 14px;
}

.reset-filters {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.reset-filters:hover {
  text-decoration: underline;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn, .apply-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.apply-btn {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: var(--text-primary);
  border: none;
}

.apply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
}

.apply-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 