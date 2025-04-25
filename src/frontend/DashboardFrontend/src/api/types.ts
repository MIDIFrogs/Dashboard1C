// Base interfaces for data models
export interface Category {
  id: number;
  name: string;
  products: ProductGroup[];
}

export interface ProductGroup {
  id: number;
  name: string;
  categoryId: number;
  sales: Sale[];
}

export interface Sale {
  id: number;
  productId: number;
  year: number;
  quarter: number;
  actualSales: number;
  targetAmount: number;
}

export interface ProductStats {
  id: number;
  marketShare: number;
  rating: number;
}

// Pagination interface
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Service interfaces
export interface ICategoryService {
  getCategories(page: number, pageSize: number): Promise<PaginatedResponse<Category>>;
  getCategory(id: number): Promise<Category>;
}

export interface IProductService {
  getProduct(id: number): Promise<ProductGroup>;
  getProductsByCategoryId(categoryId: number): Promise<ProductGroup[]>;
  getProductStats(productId: number): Promise<ProductStats>;
}

export interface ISaleService {
  getSalesByProductId(productId: number): Promise<Sale[]>;
}

// Service factory interface
export interface IServiceFactory {
  categoryService: ICategoryService;
  productService: IProductService;
  saleService: ISaleService;
}

// API Response types
export interface CategoryStats {
  totalSales: number;
  averageCompletion: number;
  productCount: number;
}

export interface SaleStats {
  completionRate: number;
  timeCompliance: number;
  yearlyGrowth: number;
} 