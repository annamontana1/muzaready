import { Prisma } from '@prisma/client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type StockStatus = 'ALL' | 'IN_STOCK' | 'SOLD_OUT' | 'LOW_STOCK';
export type SaleMode = 'PIECE_BY_WEIGHT' | 'BULK_G';
export type CustomerCategory = 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION';

export interface SkuFilters {
  search?: string;
  shades?: string[];
  lengths?: number[];
  stockStatus?: StockStatus;
  saleModes?: SaleMode[];
  categories?: CustomerCategory[];
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates and sanitizes filter inputs
 */
export function validateFilters(input: any): SkuFilters {
  const filters: SkuFilters = {};

  // Search (text)
  if (input.search && typeof input.search === 'string') {
    filters.search = input.search.trim();
  }

  // Shades (array of strings: "1", "2", ... "10")
  if (input.shades) {
    const shadesArray = Array.isArray(input.shades) ? input.shades : [input.shades];
    filters.shades = shadesArray.filter((s: any) => {
      const num = parseInt(s, 10);
      return num >= 1 && num <= 10;
    });
  }

  // Lengths (array of numbers: 40, 50, 60, 70)
  if (input.lengths) {
    const lengthsArray = Array.isArray(input.lengths) ? input.lengths : [input.lengths];
    filters.lengths = lengthsArray
      .map((l: any) => parseInt(l, 10))
      .filter((l: any) => [40, 50, 60, 70].includes(l));
  }

  // Stock Status (radio: ALL, IN_STOCK, SOLD_OUT, LOW_STOCK)
  if (input.stockStatus && typeof input.stockStatus === 'string') {
    const validStatuses: StockStatus[] = ['ALL', 'IN_STOCK', 'SOLD_OUT', 'LOW_STOCK'];
    if (validStatuses.includes(input.stockStatus as StockStatus)) {
      filters.stockStatus = input.stockStatus as StockStatus;
    }
  }

  // Sale Modes (checkboxes: PIECE_BY_WEIGHT, BULK_G)
  if (input.saleModes) {
    const modesArray = Array.isArray(input.saleModes) ? input.saleModes : [input.saleModes];
    filters.saleModes = modesArray.filter((m: any) => ['PIECE_BY_WEIGHT', 'BULK_G'].includes(m));
  }

  // Categories (checkboxes: STANDARD, LUXE, PLATINUM_EDITION)
  if (input.categories) {
    const categoriesArray = Array.isArray(input.categories) ? input.categories : [input.categories];
    filters.categories = categoriesArray.filter((c: any) =>
      ['STANDARD', 'LUXE', 'PLATINUM_EDITION'].includes(c)
    );
  }

  // Pagination
  if (input.page) {
    const page = parseInt(input.page, 10);
    filters.page = page > 0 ? page : 1;
  }

  if (input.limit) {
    const limit = parseInt(input.limit, 10);
    filters.limit = [25, 50, 100].includes(limit) ? limit : 25;
  }

  return filters;
}

// ============================================================================
// STOCK STATUS FILTER BUILDER
// ============================================================================

/**
 * Builds Prisma WHERE clause for stock status filtering
 *
 * Stock Status Logic:
 * - IN_STOCK: inStock=true AND (weightTotalG>0 OR availableGrams>0)
 * - SOLD_OUT: soldOut=true OR inStock=false
 * - LOW_STOCK: (weightTotalG<100 OR availableGrams<100) AND inStock=true
 * - ALL: no filter
 */
export function buildStockStatusFilter(status: StockStatus): Prisma.SkuWhereInput {
  switch (status) {
    case 'IN_STOCK':
      return {
        AND: [
          { inStock: true },
          {
            OR: [
              { weightTotalG: { gt: 0 } },
              { availableGrams: { gt: 0 } },
            ],
          },
        ],
      };

    case 'SOLD_OUT':
      return {
        OR: [
          { soldOut: true },
          { inStock: false },
        ],
      };

    case 'LOW_STOCK':
      return {
        AND: [
          { inStock: true },
          {
            OR: [
              {
                AND: [
                  { weightTotalG: { not: null } },
                  { weightTotalG: { lt: 100 } },
                ]
              },
              {
                AND: [
                  { availableGrams: { not: null } },
                  { availableGrams: { lt: 100 } },
                ]
              },
            ],
          },
        ],
      };

    case 'ALL':
    default:
      return {};
  }
}

// ============================================================================
// MAIN FILTER BUILDER
// ============================================================================

/**
 * Builds complete Prisma WHERE clause from all filters
 */
export function buildSkuFilters(filters: SkuFilters): Prisma.SkuWhereInput {
  const where: Prisma.SkuWhereInput = { AND: [] };
  const andConditions = where.AND as Prisma.SkuWhereInput[];

  // 1. Search filter (SKU code or name)
  if (filters.search) {
    andConditions.push({
      OR: [
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
      ],
    });
  }

  // 2. Shade filter (multi-select: 1-10)
  if (filters.shades && filters.shades.length > 0) {
    andConditions.push({
      shade: { in: filters.shades },
    });
  }

  // 3. Length filter (checkboxes: 40, 50, 60, 70)
  if (filters.lengths && filters.lengths.length > 0) {
    andConditions.push({
      lengthCm: { in: filters.lengths },
    });
  }

  // 4. Stock Status filter
  if (filters.stockStatus && filters.stockStatus !== 'ALL') {
    andConditions.push(buildStockStatusFilter(filters.stockStatus));
  }

  // 5. Sale Mode filter
  if (filters.saleModes && filters.saleModes.length > 0) {
    andConditions.push({
      saleMode: { in: filters.saleModes },
    });
  }

  // 6. Category filter
  if (filters.categories && filters.categories.length > 0) {
    andConditions.push({
      customerCategory: { in: filters.categories },
    });
  }

  // Return empty object if no filters, otherwise return the AND clause
  return andConditions.length > 0 ? where : {};
}

// ============================================================================
// PAGINATION HELPER
// ============================================================================

/**
 * Calculates pagination metadata
 */
export function calculatePagination(
  page: number = 1,
  limit: number = 25,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Math.max(1, page),
    limit,
    total,
    totalPages: Math.max(1, totalPages),
  };
}

// ============================================================================
// URL QUERY BUILDER
// ============================================================================

/**
 * Converts filter object to URL query string
 */
export function filtersToQueryString(filters: SkuFilters): string {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.shades?.length) params.set('shades', filters.shades.join(','));
  if (filters.lengths?.length) params.set('lengths', filters.lengths.join(','));
  if (filters.stockStatus && filters.stockStatus !== 'ALL') params.set('stockStatus', filters.stockStatus);
  if (filters.saleModes?.length) params.set('saleModes', filters.saleModes.join(','));
  if (filters.categories?.length) params.set('categories', filters.categories.join(','));
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());

  return params.toString();
}

/**
 * Parses URL search params into filter object
 */
export function queryStringToFilters(searchParams: URLSearchParams): SkuFilters {
  const filters: SkuFilters = {};

  const search = searchParams.get('search');
  if (search) filters.search = search;

  const shades = searchParams.get('shades');
  if (shades) filters.shades = shades.split(',');

  const lengths = searchParams.get('lengths');
  if (lengths) filters.lengths = lengths.split(',').map((l) => parseInt(l, 10));

  const stockStatus = searchParams.get('stockStatus');
  if (stockStatus) filters.stockStatus = stockStatus as StockStatus;

  const saleModes = searchParams.get('saleModes');
  if (saleModes) filters.saleModes = saleModes.split(',') as SaleMode[];

  const categories = searchParams.get('categories');
  if (categories) filters.categories = categories.split(',') as CustomerCategory[];

  const page = searchParams.get('page');
  if (page) filters.page = parseInt(page, 10);

  const limit = searchParams.get('limit');
  if (limit) filters.limit = parseInt(limit, 10);

  return validateFilters(filters);
}
