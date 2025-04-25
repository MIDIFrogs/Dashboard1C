import { apiClient } from '../config';
import type { Sale, SaleStats, PaginatedResponse } from '../models';

// Interface for sale service
export interface ISaleService {
  getSales(skip?: number, take?: number): Promise<PaginatedResponse<Sale>>;
  getSale(id: number): Promise<Sale>;
  createSale(sale: Omit<Sale, 'saleId'>): Promise<Sale>;
  updateSale(id: number, sale: Sale): Promise<void>;
  deleteSale(id: number): Promise<void>;
  getSaleStats(id: number): Promise<SaleStats>;
  getSalesByProductId(productId: number): Promise<Sale[]>;
  getSalesByYear(year: number): Promise<Sale[]>;
  getSalesByQuarter(year: number, quarter: number): Promise<Sale[]>;
}

// Real implementation using API
export class SaleService implements ISaleService {
  async getSales(skip = 0, take = 10): Promise<PaginatedResponse<Sale>> {
    const response = await apiClient.get<Sale[]>(`/sales?skip=${skip}&take=${take}`);
    return {
      items: response.data,
      total: parseInt(response.headers['x-total-count'] || '0'),
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getSale(id: number): Promise<Sale> {
    const response = await apiClient.get<Sale>(`/sales/${id}`);
    return response.data;
  }

  async createSale(sale: Omit<Sale, 'saleId'>): Promise<Sale> {
    const response = await apiClient.post<Sale>('/sales', sale);
    return response.data;
  }

  async updateSale(id: number, sale: Sale): Promise<void> {
    await apiClient.put(`/sales/${id}`, sale);
  }

  async deleteSale(id: number): Promise<void> {
    await apiClient.delete(`/sales/${id}`);
  }

  async getSaleStats(id: number): Promise<SaleStats> {
    const sale = await this.getSale(id);
    return {
      completionRate: (sale.actualSales / sale.targetAmount) * 100,
      timeCompliance: 95, // This should come from backend
      yearlyGrowth: 5.2 // This should come from backend
    };
  }

  async getSalesByProductId(productId: number): Promise<Sale[]> {
    try {
      const response = await apiClient.get<Sale[]>(`/api/products/${productId}/sales`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch sales for product ${productId}:`, error);
      throw error;
    }
  }

  async getSalesByYear(year: number): Promise<Sale[]> {
    const response = await apiClient.get<Sale[]>(`/sales?year=${year}`);
    return response.data;
  }

  async getSalesByQuarter(year: number, quarter: number): Promise<Sale[]> {
    const response = await apiClient.get<Sale[]>(`/sales?year=${year}&quarter=${quarter}`);
    return response.data;
  }
}

// Mock implementation for development/testing
export class MockSaleService implements ISaleService {
  private mockSales: Sale[] = [
    {
      saleId: 1,
      year: 2024,
      quarter: 1,
      productId: 1,
      targetAmount: 100000,
      actualSales: 95000
    },
    {
      saleId: 2,
      year: 2024,
      quarter: 1,
      productId: 2,
      targetAmount: 80000,
      actualSales: 85000
    }
  ];

  async getSales(skip = 0, take = 10): Promise<PaginatedResponse<Sale>> {
    return {
      items: this.mockSales.slice(skip, skip + take),
      total: this.mockSales.length,
      page: Math.floor(skip / take) + 1,
      pageSize: take
    };
  }

  async getSale(id: number): Promise<Sale> {
    const sale = this.mockSales.find(s => s.saleId === id);
    if (!sale) throw new Error('Sale not found');
    return sale;
  }

  async createSale(sale: Omit<Sale, 'saleId'>): Promise<Sale> {
    const newSale = {
      ...sale,
      saleId: this.mockSales.length + 1
    };
    this.mockSales.push(newSale);
    return newSale;
  }

  async updateSale(id: number, sale: Sale): Promise<void> {
    const index = this.mockSales.findIndex(s => s.saleId === id);
    if (index === -1) throw new Error('Sale not found');
    this.mockSales[index] = sale;
  }

  async deleteSale(id: number): Promise<void> {
    const index = this.mockSales.findIndex(s => s.saleId === id);
    if (index === -1) throw new Error('Sale not found');
    this.mockSales.splice(index, 1);
  }

  async getSaleStats(id: number): Promise<SaleStats> {
    const sale = await this.getSale(id);
    return {
      completionRate: (sale.actualSales / sale.targetAmount) * 100,
      timeCompliance: 95,
      yearlyGrowth: 5.2
    };
  }

  async getSalesByProductId(productId: number): Promise<Sale[]> {
    return this.mockSales.filter(s => s.productId === productId);
  }

  async getSalesByYear(year: number): Promise<Sale[]> {
    return this.mockSales.filter(s => s.year === year);
  }

  async getSalesByQuarter(year: number, quarter: number): Promise<Sale[]> {
    return this.mockSales.filter(s => s.year === year && s.quarter === quarter);
  }
}
