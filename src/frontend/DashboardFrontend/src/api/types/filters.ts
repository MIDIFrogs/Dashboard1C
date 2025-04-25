
export interface FilterCategory {
  id: number;
  name: string;
  slug?: string;
  count?: number;
}

export interface FilterProduct {
  id: number;
  name: string;
  categoryId: number;
}

export interface FilterRegion {
  id: number;
  name: string;
  count?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface FilterOptions {
  categories: FilterCategory[];
  products: FilterProduct[];
  regions: FilterRegion[];
  completionStatuses: string[];
}

export interface NormalizedFilters {
  categoryIds: number[];
  productIds: number[];
  regionIds: number[];
  completionStatus: string;
  dateRange?: DateRange;
}


export interface AppliedFilters {
  categoryIds: number[];
  productIds: number[];
  regionIds?: number[];
  regions?: string[] | number[];
  completionStatus?: string;
  completionStatuses?: string[];
  dateRange?: DateRange;
}

export class FilterServiceError extends Error {
  constructor(message: string, public readonly endpoint?: string) {
    super(message);
    this.name = 'FilterServiceError';
  }
} 