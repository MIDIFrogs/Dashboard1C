import { apiClient } from '../config';
import type { Category, CategoryStats, PaginatedResponse } from '../models';
import type { AppliedFilters } from '../types/filters';

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
  async getCategories(page: number, pageSize: number): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<PaginatedResponse<Category>>('/api/categories', {
      params: { page, pageSize }
    });
    return response.data;
  }

  async getCategoriesFiltered(filters: AppliedFilters): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.post<PaginatedResponse<Category>>('/api/categories/filter', filters);
    return response.data;
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
  private mockCategories: Category[] = [
    {
      id: 1,
      name: 'Technology',
      products: []
    },
    {
      id: 2,
      name: 'Finance',
      products: []
    }
  ];

  async getCategories(skip = 0, take = 10): Promise<PaginatedResponse<Category>> {
    return {
      items: this.mockCategories.slice(skip, skip + take),
      total: this.mockCategories.length,
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getCategoriesFiltered(filters: AppliedFilters): Promise<PaginatedResponse<Category>> {
    console.log('Applying filters to categories:', filters);

    // Filter the mock categories based on the provided filters
    let filteredCategories = [...this.mockCategories];

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
    const category = this.mockCategories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async createCategory(category: Omit<Category, 'id' | 'products'>): Promise<Category> {
    const newCategory = {
      ...category,
      id: this.mockCategories.length + 1,
      products: []
    };
    this.mockCategories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Omit<Category, 'products'>): Promise<void> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    this.mockCategories[index] = { ...this.mockCategories[index], ...category };
  }

  async deleteCategory(id: number): Promise<void> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    this.mockCategories.splice(index, 1);
  }

  async getCategoryStats(id: number): Promise<CategoryStats> {
    return {
      totalSales: 1500000,
      averageCompletion: 92.5,
      productCount: 5
    };
  }
}
