import { API_BASE_URL, apiClient } from '../config';
import type {
  FilterCategory,
  FilterProduct,
  FilterRegion,
  DateRange,
  FilterOptions,
  NormalizedFilters,
  AppliedFilters
} from '../types/filters';
import { FilterServiceError } from '../types/filters';

/**
 * Service for handling filter-related operations
 */
export const filterService = {
  /**
   * Fetches all available filter options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await apiClient.get('/filters/options');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Fall back to mock in development environment
      if (import.meta.env.DEV) {
        return this.getMockFilterOptions();
      }
      throw new FilterServiceError('Failed to fetch filter options');
    }
  },

  /**
   * Fetches available categories for filtering
   */
  async getCategories(): Promise<FilterCategory[]> {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter categories:', error);
      if (import.meta.env.DEV) {
        return this.getMockFilterOptions().categories;
      }
      throw new FilterServiceError('Failed to fetch categories');
    }
  },

  /**
   * Fetches available products for filtering
   */
  async getProducts(): Promise<FilterProduct[]> {
    try {
      const response = await apiClient.get('/filters/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter products:', error);
      if (import.meta.env.DEV) {
        return this.getMockFilterOptions().products;
      }
      throw new FilterServiceError('Failed to fetch products');
    }
  },

  /**
   * Fetches available regions for filtering
   */
  async getRegions(): Promise<FilterRegion[]> {
    try {
      const response = await apiClient.get('/filters/regions');
      return response.data;
    } catch (error) {
      console.error('Error fetching filter regions:', error);
      if (import.meta.env.DEV) {
        return this.getMockFilterOptions().regions;
      }
      throw new FilterServiceError('Failed to fetch regions');
    }
  },

  /**
   * Fetches available completion statuses for filtering
   */
  async getCompletionStatuses(): Promise<string[]> {
    try {
      const response = await apiClient.get('/filters/completion-statuses');
      return response.data;
    } catch (error) {
      console.error('Error fetching completion statuses:', error);
      if (import.meta.env.DEV) {
        return this.getMockFilterOptions().completionStatuses;
      }
      throw new FilterServiceError('Failed to fetch completion statuses');
    }
  },

  /**
   * Normalizes the applied filters into a consistent format
   */
  normalizeFilters(filters: AppliedFilters): NormalizedFilters {
    // Convert string regions to numbers if needed
    const regionIds = filters.regionIds ||
      (filters.regions?.map(region =>
        typeof region === 'string' ? parseInt(region, 10) : region
      ) || []);

    // Ensure all regionIds are valid numbers
    const validRegionIds = regionIds.filter(id => !isNaN(Number(id)));

    return {
      categoryIds: filters.categoryIds || [],
      productIds: filters.productIds || [],
      regionIds: validRegionIds,
      completionStatus: filters.completionStatus ||
        (filters.completionStatuses?.[0] || 'all'),
      dateRange: filters.dateRange ? {
        start: new Date(filters.dateRange.start),
        end: new Date(filters.dateRange.end)
      } : undefined
    };
  },

  /**
   * Applies filters and fetches filtered data
   */
  async applyFilters<T>(endpoint: string, filters: AppliedFilters): Promise<T> {
    if (!endpoint) {
      throw new FilterServiceError('Endpoint is required');
    }

    try {
      const normalizedFilters = this.normalizeFilters(filters);
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const response = await apiClient.post(`/${cleanEndpoint}/filter`, normalizedFilters);
      return response.data;
    } catch (error) {
      console.error(`Error applying filters to ${endpoint}:`, error);
      throw new FilterServiceError(`Failed to apply filters`, endpoint);
    }
  },

  /**
   * Provides mock filter options for development
   */
  getMockFilterOptions(): FilterOptions {
    return {
      categories: [
        { id: 1, name: 'Beverages', slug: 'beverages', count: 3 },
        { id: 2, name: 'Electronics', slug: 'electronics', count: 2 },
        { id: 3, name: 'Clothing', slug: 'clothing', count: 2 },
        { id: 4, name: 'Food', slug: 'food', count: 2 }
      ],
      products: [
        { id: 1, name: 'Coffee', categoryId: 1 },
        { id: 2, name: 'Tea', categoryId: 1 },
        { id: 3, name: 'Soda', categoryId: 1 },
        { id: 4, name: 'Smartphones', categoryId: 2 },
        { id: 5, name: 'Laptops', categoryId: 2 },
        { id: 6, name: 'T-shirts', categoryId: 3 },
        { id: 7, name: 'Jeans', categoryId: 3 },
        { id: 8, name: 'Bread', categoryId: 4 },
        { id: 9, name: 'Cheese', categoryId: 4 }
      ],
      regions: [
        { id: 1, name: 'North America', count: 12 },
        { id: 2, name: 'Europe', count: 10 },
        { id: 3, name: 'Asia', count: 8 },
        { id: 4, name: 'Africa', count: 5 },
        { id: 5, name: 'South America', count: 7 }
      ],
      completionStatuses: [
        'Completed', 'In Progress', 'Not Started', 'Cancelled'
      ]
    };
  }
};
