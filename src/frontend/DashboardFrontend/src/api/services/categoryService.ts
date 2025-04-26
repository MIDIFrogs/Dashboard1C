import { apiClient } from '../config';
import type { Category, CategoryStats, PaginatedResponse } from '../models';
import type { AppliedFilters } from '../types/filters';
import { mockCategories } from '../mockData';

// Interface for category service
export interface ICategoryService {
  getCategories(skip?: number, take?: number): Promise<PaginatedResponse<Category>>;
  getCategory(id: number): Promise<Category>;
  createCategory(category: Omit<Category, 'id' | 'products'>): Promise<Category>;
  updateCategory(id: number, category: Omit<Category, 'products'>): Promise<void>;
  deleteCategory(id: number): Promise<void>;
  getCategoryStats(id: number): Promise<CategoryStats>;
  getCategoriesFiltered(filters: AppliedFilters): Promise<PaginatedResponse<Category>>;
}

// Real implementation using API
export class CategoryService implements ICategoryService {
  async getCategories(skip: number = 0, take: number = 10): Promise<PaginatedResponse<Category>> {
    // Return paginated mock categories
    const start = skip;
    const end = Math.min(skip + take, mockCategories.length);
    return {
      items: mockCategories.slice(start, end),
      total: mockCategories.length,
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getCategoriesFiltered(filters: AppliedFilters): Promise<PaginatedResponse<Category>> {
    let filteredCategories = [...mockCategories];

    if (filters.categoryIds?.length) {
      filteredCategories = filteredCategories.filter(cat => 
        filters.categoryIds.includes(cat.id)
      );
    }

    if (filters.productIds?.length) {
      filteredCategories = filteredCategories.map(cat => ({
        ...cat,
        products: cat.products.filter(prod => 
          filters.productIds.includes(prod.id)
        )
      })).filter(cat => cat.products.length > 0);
    }

    return {
      items: filteredCategories,
      total: filteredCategories.length,
      page: 1,
      pageSize: filteredCategories.length
    };
  }

  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/api/categories/${id}`);
    return response.data;
  }

  async createCategory(category: Omit<Category, 'id' | 'products'>): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', category);
    return response.data;
  }

  async updateCategory(id: number, category: Omit<Category, 'products'>): Promise<void> {
    await apiClient.put(`/categories/${id}`, category);
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }

  async getCategoryStats(id: number): Promise<CategoryStats> {
    const category = await this.getCategory(id);
    return {
      totalSales: category.products.reduce((sum, product) =>
        sum + product.sales.reduce((salesSum, sale) => salesSum + sale.actualSales, 0), 0),
      averageCompletion: category.products.reduce((sum, product) =>
        sum + product.sales.reduce((completionSum, sale) =>
          completionSum + (sale.actualSales / sale.targetAmount * 100), 0), 0) /
        category.products.reduce((count, product) => count + product.sales.length, 0),
      productCount: category.products.length
    };
  }
}

// Mock implementation for development/testing
export class MockCategoryService implements ICategoryService {

  async getCategories(skip = 0, take = 10): Promise<PaginatedResponse<Category>> {
    return {
      items: mockCategories.slice(skip, skip + take),
      total: mockCategories.length,
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getCategoriesFiltered(filters: AppliedFilters): Promise<PaginatedResponse<Category>> {
    console.log('Applying filters to categories:', filters);

    // Filter the mock categories based on the provided filters
    let filteredCategories = [...mockCategories];

    // Filter by category IDs if provided
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filteredCategories = filteredCategories.filter(category =>
        filters.categoryIds.includes(category.id)
      );
    }

    // For a more complex implementation, we would also filter the products
    // within each category based on productIds in the filters

    return {
      items: filteredCategories,
      total: filteredCategories.length,
      page: 1,
      pageSize: filteredCategories.length
    };
  }

  async getCategory(id: number): Promise<Category> {
    const category = mockCategories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async createCategory(category: Omit<Category, 'id' | 'products'>): Promise<Category> {
    const newCategory = {
      ...category,
      id: mockCategories.length + 1,
      products: []
    };
    mockCategories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Omit<Category, 'products'>): Promise<void> {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    mockCategories[index] = { ...mockCategories[index], ...category };
  }

  async deleteCategory(id: number): Promise<void> {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    mockCategories.splice(index, 1);
  }

  async getCategoryStats(id: number): Promise<CategoryStats> {
    return {
      totalSales: 1500000,
      averageCompletion: 92.5,
      productCount: 5
    };
  }
}
