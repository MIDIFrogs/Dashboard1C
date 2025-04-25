import { CategoryService, MockCategoryService, ICategoryService } from './categoryService';
import { ProductService, MockProductService, IProductService } from './productService';
import { SaleService, MockSaleService, ISaleService } from './saleService';
import { filterService } from './filterService';
import { 
  FilterOptions, 
  AppliedFilters, 
  FilterCategory,
  FilterProduct,
  FilterRegion,
  DateRange,
  NormalizedFilters,
  FilterServiceError
} from '../types/filters';

// Service factory interface
export interface IServiceFactory {
  categoryService: ICategoryService;
  productService: IProductService;
  saleService: ISaleService;
  filterService: typeof filterService;
}

// Real API service factory
export class ServiceFactory implements IServiceFactory {
  private static instance: ServiceFactory;
  private _categoryService: ICategoryService;
  private _productService: IProductService;
  private _saleService: ISaleService;
  private _filterService: typeof filterService;

  private constructor() {
    this._categoryService = new CategoryService();
    this._productService = new ProductService();
    this._saleService = new SaleService();
    this._filterService = filterService;
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  get categoryService(): ICategoryService {
    return this._categoryService;
  }

  get productService(): IProductService {
    return this._productService;
  }

  get saleService(): ISaleService {
    return this._saleService;
  }

  get filterService(): typeof filterService {
    return this._filterService;
  }
}

// Mock service factory for development/testing
export class MockServiceFactory implements IServiceFactory {
  private static instance: MockServiceFactory;
  private _categoryService: ICategoryService;
  private _productService: IProductService;
  private _saleService: ISaleService;
  private _filterService: typeof filterService;

  private constructor() {
    this._categoryService = new MockCategoryService();
    this._productService = new MockProductService();
    this._saleService = new MockSaleService();
    this._filterService = filterService;
  }

  public static getInstance(): MockServiceFactory {
    if (!MockServiceFactory.instance) {
      MockServiceFactory.instance = new MockServiceFactory();
    }
    return MockServiceFactory.instance;
  }

  get categoryService(): ICategoryService {
    return this._categoryService;
  }

  get productService(): IProductService {
    return this._productService;
  }

  get saleService(): ISaleService {
    return this._saleService;
  }

  get filterService(): typeof filterService {
    return this._filterService;
  }
}

// Export a function to get the appropriate service factory
export function getServiceFactory(useMock = false): IServiceFactory {
  return useMock ? MockServiceFactory.getInstance() : ServiceFactory.getInstance();
}

// Export interfaces
export type { ICategoryService, IProductService, ISaleService };
export type { FilterOptions, AppliedFilters, FilterCategory, FilterProduct, FilterRegion, DateRange, NormalizedFilters, FilterServiceError }; 