import { getServiceFactory } from '@/api/services';
import type { Category, ProductGroup, Sale, ProductStats } from '@/api/types';

export interface CategoryStatistics {
  sector: string;
  totalProducts: number;
  totalScore: number;
  avgCompletion: number;
  products: ProductStatistics[];
}

export interface ProductStatistics {
  id: number;
  name: string;
  totalSales: number;
  completionRate: number;
  timeCompliance: number;
  monthlyGrowth: number;
  marketShare: number;
  customerRating: number;
  unitsSold: number;
  quarterlyRevenue: Record<number, number>;
  status: 'danger' | 'success' | null;
}

class StatisticsService {
  private categoryCache: Map<string, CategoryStatistics> = new Map();
  private productCache: Map<number, ProductStatistics> = new Map();
  private productDetailsCache: Map<number, ProductStats> = new Map();
  private loadingCategories: Set<string> = new Set();
  private loadingProducts: Set<number> = new Set();
  private services = getServiceFactory(false);

  // Cache expiration time (30 minutes)
  private CACHE_EXPIRATION = 30 * 60 * 1000;
  private lastCacheCleanup = Date.now();

  constructor() {
    // Periodically clean up expired cache entries
    setInterval(() => this.cleanupCache(), this.CACHE_EXPIRATION);
  }

  private cleanupCache(): void {
    const now = Date.now();
    if (now - this.lastCacheCleanup < this.CACHE_EXPIRATION) return;

    this.categoryCache.clear();
    this.productCache.clear();
    this.productDetailsCache.clear();
    this.lastCacheCleanup = now;
  }

  async getCategoryStatistics(sector: string): Promise<CategoryStatistics | null> {
    // Check cache first
    if (this.categoryCache.has(sector)) {
      return this.categoryCache.get(sector)!;
    }

    // Prevent duplicate loading
    if (this.loadingCategories.has(sector)) {
      return new Promise((resolve) => {
        const checkCache = () => {
          if (this.categoryCache.has(sector)) {
            resolve(this.categoryCache.get(sector)!);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        setTimeout(checkCache, 100);
      });
    }

    this.loadingCategories.add(sector);

    try {
      const categories = await this.services.categoryService.getCategories(0, 50);
      const category = categories.items.find(c => c.name === sector);
      
      if (!category) {
        return null;
      }

      const products = await this.services.productService.getProductsByCategoryId(category.id);
      
      // Load sales data for all products in parallel
      const salesPromises = products.map(async product => {
        const sales = await this.services.saleService.getSalesByProductId(product.id);
        product.sales = sales;
        return this.calculateProductStatistics(product);
      });

      const productStats = await Promise.all(salesPromises);

      const categoryStats: CategoryStatistics = {
        sector: category.name,
        totalProducts: products.length,
        totalScore: this.calculateTotalScore(productStats),
        avgCompletion: this.calculateAvgCompletion(productStats),
        products: productStats
      };

      this.categoryCache.set(sector, categoryStats);
      return categoryStats;

    } catch (error) {
      console.error('Error loading category statistics:', error);
      throw error;
    } finally {
      this.loadingCategories.delete(sector);
    }
  }

  async getProductStatistics(productId: number): Promise<ProductStatistics | null> {
    // Check cache first
    if (this.productCache.has(productId)) {
      return this.productCache.get(productId)!;
    }

    // Prevent duplicate loading
    if (this.loadingProducts.has(productId)) {
      return new Promise((resolve) => {
        const checkCache = () => {
          if (this.productCache.has(productId)) {
            resolve(this.productCache.get(productId)!);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        setTimeout(checkCache, 100);
      });
    }

    this.loadingProducts.add(productId);

    try {
      const [product, sales, details] = await Promise.all([
        this.services.productService.getProduct(productId),
        this.services.saleService.getSalesByProductId(productId),
        this.services.productService.getProductStats(productId)
      ]);

      product.sales = sales;
      const stats = this.calculateProductStatistics(product, details);
      
      this.productCache.set(productId, stats);
      this.productDetailsCache.set(productId, details);
      
      return stats;

    } catch (error) {
      console.error('Error loading product statistics:', error);
      throw error;
    } finally {
      this.loadingProducts.delete(productId);
    }
  }

  private calculateProductStatistics(product: ProductGroup, details?: ProductStats): ProductStatistics {
    const currentYear = new Date().getFullYear();
    const sales = product.sales || [];
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.actualSales, 0);
    const totalTarget = sales.reduce((sum, sale) => sum + sale.targetAmount, 0);
    const completionRate = totalTarget ? (totalSales / totalTarget) * 100 : 0;
    
    // Calculate quarterly revenue
    const quarterlyRevenue: Record<number, number> = {};
    for (let quarter = 1; quarter <= 4; quarter++) {
      const quarterSales = sales.filter(s => s.year === currentYear && s.quarter === quarter);
      quarterlyRevenue[quarter] = quarterSales.reduce((sum, sale) => sum + sale.actualSales, 0);
    }

    // Calculate monthly growth
    const currentYearSales = sales.filter(s => s.year === currentYear);
    const lastYearSales = sales.filter(s => s.year === currentYear - 1);
    const currentTotal = currentYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);
    const lastTotal = lastYearSales.reduce((sum, sale) => sum + sale.actualSales, 0);
    const monthlyGrowth = lastTotal ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    const stats: ProductStatistics = {
      id: product.id,
      name: product.name,
      totalSales,
      completionRate,
      timeCompliance: 95, // This should come from backend
      monthlyGrowth,
      marketShare: details?.marketShare || 15.3,
      customerRating: details?.rating || 4.2,
      unitsSold: totalSales,
      quarterlyRevenue,
      status: this.calculateProductStatus(completionRate)
    };

    return stats;
  }

  private calculateProductStatus(completionRate: number): 'danger' | 'success' | null {
    if (completionRate < 90) return 'danger';
    if (completionRate >= 90) return 'success';
    return null;
  }

  private calculateTotalScore(products: ProductStatistics[]): number {
    return products.reduce((sum, product) => sum + product.totalSales, 0);
  }

  private calculateAvgCompletion(products: ProductStatistics[]): number {
    if (products.length === 0) return 0;
    const total = products.reduce((sum, product) => sum + product.completionRate, 0);
    return total / products.length;
  }
}

// Export a singleton instance
export const statisticsService = new StatisticsService(); 