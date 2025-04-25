import { apiClient } from './apiClient';
import type { ProductGroup, ProductStats, PaginatedResponse, IProductService } from '../models';

// Interface for product service
export interface IProductService {
  getProducts(skip?: number, take?: number): Promise<PaginatedResponse<ProductGroup>>;
  getProduct(id: number): Promise<ProductGroup>;
  createProduct(product: Omit<ProductGroup, 'id' | 'sales'>): Promise<ProductGroup>;
  updateProduct(id: number, product: Omit<ProductGroup, 'sales'>): Promise<void>;
  deleteProduct(id: number): Promise<void>;
  getProductStats(id: number): Promise<ProductStats>;
  getProductsByCategoryId(categoryId: number): Promise<ProductGroup[]>;
}

// Real implementation using API
export class ProductService implements IProductService {
  async getProducts(skip = 0, take = 10): Promise<PaginatedResponse<ProductGroup>> {
    const response = await apiClient.get<ProductGroup[]>(`/products?skip=${skip}&take=${take}`);
    return {
      items: response.data,
      total: parseInt(response.headers['x-total-count'] || '0'),
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getProduct(id: number): Promise<ProductGroup> {
    try {
      const response = await apiClient.get<ProductGroup>(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(product: Omit<ProductGroup, 'id' | 'sales'>): Promise<ProductGroup> {
    const response = await apiClient.post<ProductGroup>('/products', product);
    return response.data;
  }

  async updateProduct(id: number, product: Omit<ProductGroup, 'sales'>): Promise<void> {
    await apiClient.put(`/products/${id}`, product);
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  async getProductStats(id: number): Promise<ProductStats> {
    try {
      const response = await apiClient.get<ProductStats>(`/api/products/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch stats for product ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategoryId(categoryId: number): Promise<ProductGroup[]> {
    try {
      const response = await apiClient.get<ProductGroup[]>(`/api/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch products for category ${categoryId}:`, error);
      throw error;
    }
  }
}

// Mock implementation for development/testing
export class MockProductService implements IProductService {
  private mockProducts: ProductGroup[] = [
    {
      id: 1,
      name: 'Smart Hub Pro',
      categoryId: 1,
      sales: []
    },
    {
      id: 2,
      name: 'AI Assistant',
      categoryId: 1,
      sales: []
    }
  ];

  async getProducts(skip = 0, take = 10): Promise<PaginatedResponse<ProductGroup>> {
    return {
      items: this.mockProducts.slice(skip, skip + take),
      total: this.mockProducts.length,
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getProduct(id: number): Promise<ProductGroup> {
    const product = this.mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async createProduct(product: Omit<ProductGroup, 'id' | 'sales'>): Promise<ProductGroup> {
    const newProduct = {
      ...product,
      id: this.mockProducts.length + 1,
      sales: []
    };
    this.mockProducts.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Omit<ProductGroup, 'sales'>): Promise<void> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.mockProducts[index] = { ...this.mockProducts[index], ...product };
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.mockProducts.splice(index, 1);
  }

  async getProductStats(id: number): Promise<ProductStats> {
    return {
      monthlyGrowth: 4.5,
      marketShare: 15.3,
      rating: 4.2,
      unitsSold: 12500,
      quarterlyRevenue: {
        q1: 68000,
        q2: 82000,
        q3: 75000,
        q4: 90000
      }
    };
  }

  async getProductsByCategoryId(categoryId: number): Promise<ProductGroup[]> {
    return this.mockProducts.filter(p => p.categoryId === categoryId);
  }
}

// Helper function to calculate growth rate
function calculateGrowthRate(lastYearSales: any[], currentYearSales: any[]): number {
  const lastYearTotal = lastYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);
  const currentYearTotal = currentYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);

  if (lastYearTotal === 0) return 0;
  return ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100;
}
