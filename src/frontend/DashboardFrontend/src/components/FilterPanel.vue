<!-- Filter panel component that provides UI for selecting and applying filters -->
<template>
  <div class="filter-panel" :class="{ 'is-expanded': isExpanded }">
    <div class="filter-panel-header" @click="togglePanel">
      <h3>Filters</h3>
      <div class="filter-badges" v-if="hasActiveFilters">
        <span class="filter-badge">{{ activeFilterCount }}</span>
      </div>
      <div class="expand-icon" :class="{ 'is-expanded': isExpanded }">
        <i class="fas fa-angle-down"></i>
      </div>
    </div>

    <div class="filter-panel-content" v-show="isExpanded">
      <div v-if="isLoading" class="filter-loading">
        <div class="spinner"></div>
        <span>Loading filters...</span>
      </div>
      
      <div v-else-if="error" class="filter-error">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ error }}</span>
        <button @click="loadFilterOptions" class="retry-button">Retry</button>
      </div>
      
      <div v-else class="filter-sections">
        <!-- Categories filter -->
        <div class="filter-section">
          <h4>Categories</h4>
          <div class="filter-items">
            <div v-for="category in filterOptions.categories" :key="category.id" class="filter-item">
              <input 
                type="checkbox" 
                :id="`category-${category.id}`" 
                :value="category.id" 
                v-model="selectedFilters.categoryIds"
              >
              <label :for="`category-${category.id}`">{{ category.name }}</label>
            </div>
          </div>
        </div>

        <!-- Products filter -->
        <div class="filter-section">
          <h4>Products</h4>
          <div class="filter-items">
            <div v-for="(product, index) in filterOptions.products" :key="index" class="filter-item">
              <input 
                type="checkbox" 
                :id="`product-${index}`" 
                :value="product" 
                v-model="selectedFilters.productIds"
              >
              <label :for="`product-${index}`">{{ product }}</label>
            </div>
          </div>
        </div>

        <!-- Regions filter -->
        <div class="filter-section">
          <h4>Regions</h4>
          <div class="filter-items">
            <div v-for="(region, index) in filterOptions.regions" :key="index" class="filter-item">
              <input 
                type="checkbox" 
                :id="`region-${index}`" 
                :value="region" 
                v-model="selectedFilters.regions"
              >
              <label :for="`region-${index}`">{{ region }}</label>
            </div>
          </div>
        </div>

        <!-- Status filter -->
        <div class="filter-section">
          <h4>Status</h4>
          <div class="filter-items">
            <div v-for="(status, index) in filterOptions.completionStatuses" :key="index" class="filter-item">
              <input 
                type="checkbox" 
                :id="`status-${index}`" 
                :value="status" 
                v-model="selectedFilters.completionStatuses"
              >
              <label :for="`status-${index}`">{{ status }}</label>
            </div>
          </div>
        </div>

        <!-- Date range filter -->
        <div class="filter-section">
          <h4>Date Range</h4>
          <div class="date-range-inputs">
            <div class="date-input">
              <label for="start-date">From</label>
              <input 
                type="date" 
                id="start-date" 
                v-model="dateRange.start" 
                :max="dateRange.end"
              >
            </div>
            <div class="date-input">
              <label for="end-date">To</label>
              <input 
                type="date" 
                id="end-date" 
                v-model="dateRange.end" 
                :min="dateRange.start"
              >
            </div>
          </div>
        </div>

        <!-- Filter actions -->
        <div class="filter-actions">
          <button 
            class="apply-filters-btn" 
            @click="applyFilters" 
            :disabled="isApplying"
          >
            <span v-if="isApplying">Applying...</span>
            <span v-else>Apply Filters</span>
          </button>
          <button class="reset-filters-btn" @click="resetFilters" :disabled="isApplying">
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import { getServiceFactory } from '../api/services';

export default defineComponent({
  name: 'FilterPanel',
  
  emits: ['filters-applied'],
  
  setup(props, { emit }) {
    const serviceFactory = getServiceFactory();
    const filterService = serviceFactory.filterService;
    
    // State
    const isExpanded = ref(false);
    const isLoading = ref(true);
    const isApplying = ref(false);
    const error = ref(null);
    
    // Filter options and selections
    const filterOptions = reactive({
      categories: [],
      products: [],
      regions: [],
      completionStatuses: []
    });
    
    const selectedFilters = reactive({
      categoryIds: [],
      productIds: [],
      regions: [],
      completionStatuses: []
    });
    
    const dateRange = reactive({
      start: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      end: formatDate(new Date())
    });
    
    // Computed properties
    const hasActiveFilters = computed(() => {
      return selectedFilters.categoryIds.length > 0 || 
             selectedFilters.productIds.length > 0 || 
             selectedFilters.regions.length > 0 || 
             selectedFilters.completionStatuses.length > 0;
    });
    
    const activeFilterCount = computed(() => {
      return selectedFilters.categoryIds.length + 
             selectedFilters.productIds.length + 
             selectedFilters.regions.length + 
             selectedFilters.completionStatuses.length;
    });
    
    // Methods
    function togglePanel() {
      isExpanded.value = !isExpanded.value;
    }
    
    async function loadFilterOptions() {
      isLoading.value = true;
      error.value = null;
      
      try {
        const options = await filterService.getFilterOptions();
        filterOptions.categories = options.categories;
        filterOptions.products = options.products;
        filterOptions.regions = options.regions;
        filterOptions.completionStatuses = options.completionStatuses;
      } catch (err) {
        console.error('Failed to load filter options:', err);
        error.value = 'Failed to load filter options. Please try again.';
      } finally {
        isLoading.value = false;
      }
    }
    
    async function applyFilters() {
      isApplying.value = true;
      
      try {
        // Construct the filters object to send
        const filtersToApply = {
          categoryIds: selectedFilters.categoryIds,
          productIds: selectedFilters.productIds,
          regions: selectedFilters.regions,
          completionStatuses: selectedFilters.completionStatuses
        };
        
        // Add date range if both dates are set
        if (dateRange.start && dateRange.end) {
          filtersToApply.dateRange = {
            start: new Date(dateRange.start),
            end: new Date(dateRange.end)
          };
        }
        
        // Emit the event with the filters
        emit('filters-applied', filtersToApply);
        
        // Optionally close the panel after applying
        // isExpanded.value = false;
      } catch (err) {
        console.error('Error applying filters:', err);
      } finally {
        isApplying.value = false;
      }
    }
    
    function resetFilters() {
      selectedFilters.categoryIds = [];
      selectedFilters.productIds = [];
      selectedFilters.regions = [];
      selectedFilters.completionStatuses = [];
      
      // Reset date range to last 30 days
      dateRange.start = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      dateRange.end = formatDate(new Date());
      
      // Immediately apply reset filters
      applyFilters();
    }
    
    // Helper function to format date for input[type=date]
    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }
    
    // Load filter options on component mount
    onMounted(() => {
      loadFilterOptions();
    });
    
    return {
      isExpanded,
      isLoading,
      isApplying,
      error,
      filterOptions,
      selectedFilters,
      dateRange,
      hasActiveFilters,
      activeFilterCount,
      togglePanel,
      loadFilterOptions,
      applyFilters,
      resetFilters
    };
  }
});
</script>

<style scoped>
.filter-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.filter-panel-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.2s ease;
}

.filter-panel-header:hover {
  background-color: #f0f2f5;
}

.filter-panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.filter-badges {
  display: flex;
  gap: 8px;
}

.filter-badge {
  background-color: #4a8af4;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
}

.filter-panel-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.filter-panel.is-expanded .filter-panel-content {
  padding: 20px;
  max-height: 800px; /* Adjust based on expected content height */
  overflow: auto;
}

.filter-loading,
.filter-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;
  color: #666;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a8af4;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.filter-error {
  color: #d93025;
}

.retry-button {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #f1f3f4;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #e8eaed;
}

.filter-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.filter-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item input[type="checkbox"] {
  margin: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.filter-item label {
  font-size: 14px;
  color: #444;
  cursor: pointer;
}

.date-range-inputs {
  display: flex;
  gap: 10px;
}

.date-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-input label {
  font-size: 12px;
  color: #666;
}

.date-input input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.apply-filters-btn,
.reset-filters-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.apply-filters-btn {
  background-color: #4a8af4;
  color: white;
  flex: 2;
}

.apply-filters-btn:hover:not(:disabled) {
  background-color: #3a7ae3;
}

.reset-filters-btn {
  background-color: #f1f3f4;
  color: #444;
  flex: 1;
}

.reset-filters-btn:hover:not(:disabled) {
  background-color: #e8eaed;
}

.apply-filters-btn:disabled,
.reset-filters-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 