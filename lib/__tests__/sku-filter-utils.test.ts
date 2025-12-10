import { describe, it, expect } from 'vitest';
import {
  validateFilters,
  buildStockStatusFilter,
  buildSkuFilters,
  calculatePagination,
  filtersToQueryString,
  queryStringToFilters,
  type SkuFilters,
  type StockStatus,
} from '../sku-filter-utils';

describe('sku-filter-utils', () => {
  describe('validateFilters', () => {
    it('should validate and sanitize search text', () => {
      const input = { search: '  VLASYX  ' };
      const result = validateFilters(input);
      expect(result.search).toBe('VLASYX');
    });

    it('should filter valid shades (1-10)', () => {
      const input = { shades: ['1', '5', '11', '0', 'invalid'] };
      const result = validateFilters(input);
      expect(result.shades).toEqual(['1', '5']);
    });

    it('should filter valid lengths (40, 50, 60, 70)', () => {
      const input = { lengths: ['40', '60', '80', '35'] };
      const result = validateFilters(input);
      expect(result.lengths).toEqual([40, 60]);
    });

    it('should validate stock status', () => {
      const valid = validateFilters({ stockStatus: 'IN_STOCK' });
      expect(valid.stockStatus).toBe('IN_STOCK');

      const invalid = validateFilters({ stockStatus: 'INVALID' });
      expect(invalid.stockStatus).toBeUndefined();
    });

    it('should validate sale modes', () => {
      const input = { saleModes: ['PIECE_BY_WEIGHT', 'INVALID', 'BULK_G'] };
      const result = validateFilters(input);
      expect(result.saleModes).toEqual(['PIECE_BY_WEIGHT', 'BULK_G']);
    });

    it('should validate categories', () => {
      const input = { categories: ['STANDARD', 'INVALID', 'LUXE'] };
      const result = validateFilters(input);
      expect(result.categories).toEqual(['STANDARD', 'LUXE']);
    });

    it('should handle pagination with defaults', () => {
      const result = validateFilters({ page: '0', limit: '999' });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(25);
    });

    it('should accept valid pagination values', () => {
      const result = validateFilters({ page: '3', limit: '50' });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(50);
    });

    it('should handle empty/null/undefined inputs', () => {
      const result = validateFilters({});
      expect(result).toEqual({});
    });

    it('should convert single values to arrays', () => {
      const result = validateFilters({
        shades: '5',
        lengths: '60',
        saleModes: 'PIECE_BY_WEIGHT',
        categories: 'LUXE'
      });
      expect(result.shades).toEqual(['5']);
      expect(result.lengths).toEqual([60]);
      expect(result.saleModes).toEqual(['PIECE_BY_WEIGHT']);
      expect(result.categories).toEqual(['LUXE']);
    });
  });

  describe('buildStockStatusFilter', () => {
    it('should build IN_STOCK filter correctly', () => {
      const filter = buildStockStatusFilter('IN_STOCK');
      expect(filter).toEqual({
        AND: [
          { inStock: true },
          {
            OR: [
              { weightTotalG: { gt: 0 } },
              { availableGrams: { gt: 0 } },
            ],
          },
        ],
      });
    });

    it('should build SOLD_OUT filter correctly', () => {
      const filter = buildStockStatusFilter('SOLD_OUT');
      expect(filter).toEqual({
        OR: [
          { soldOut: true },
          { inStock: false },
        ],
      });
    });

    it('should build LOW_STOCK filter correctly', () => {
      const filter = buildStockStatusFilter('LOW_STOCK');
      expect(filter).toEqual({
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
      });
    });

    it('should return empty filter for ALL', () => {
      const filter = buildStockStatusFilter('ALL');
      expect(filter).toEqual({});
    });
  });

  describe('buildSkuFilters', () => {
    it('should build search filter (case-insensitive)', () => {
      const filters: SkuFilters = { search: 'VLASYX' };
      const result = buildSkuFilters(filters);
      expect(result).toEqual({
        AND: [
          {
            OR: [
              { sku: { contains: 'VLASYX', mode: 'insensitive' } },
              { name: { contains: 'VLASYX', mode: 'insensitive' } },
            ],
          },
        ],
      });
    });

    it('should build shade filter', () => {
      const filters: SkuFilters = { shades: ['4', '5'] };
      const result = buildSkuFilters(filters);
      expect(result).toEqual({
        AND: [{ shade: { in: ['4', '5'] } }],
      });
    });

    it('should build length filter', () => {
      const filters: SkuFilters = { lengths: [60, 70] };
      const result = buildSkuFilters(filters);
      expect(result).toEqual({
        AND: [{ lengthCm: { in: [60, 70] } }],
      });
    });

    it('should build combined filters', () => {
      const filters: SkuFilters = {
        search: 'VLASYX',
        shades: ['4'],
        lengths: [60],
        stockStatus: 'IN_STOCK',
        saleModes: ['PIECE_BY_WEIGHT'],
        categories: ['PLATINUM_EDITION'],
      };
      const result = buildSkuFilters(filters);
      expect(result.AND).toHaveLength(6);
    });

    it('should return empty object when no filters', () => {
      const result = buildSkuFilters({});
      expect(result).toEqual({});
    });

    it('should skip ALL stock status', () => {
      const filters: SkuFilters = { stockStatus: 'ALL' };
      const result = buildSkuFilters(filters);
      expect(result).toEqual({});
    });

    it('should ignore empty arrays', () => {
      const filters: SkuFilters = {
        shades: [],
        lengths: [],
        saleModes: [],
        categories: [],
      };
      const result = buildSkuFilters(filters);
      expect(result).toEqual({});
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly', () => {
      const result = calculatePagination(2, 25, 100);
      expect(result).toEqual({
        page: 2,
        limit: 25,
        total: 100,
        totalPages: 4,
      });
    });

    it('should handle partial last page', () => {
      const result = calculatePagination(3, 25, 70);
      expect(result).toEqual({
        page: 3,
        limit: 25,
        total: 70,
        totalPages: 3,
      });
    });

    it('should default to page 1', () => {
      const result = calculatePagination(0, 25, 100);
      expect(result.page).toBe(1);
    });

    it('should handle zero total', () => {
      const result = calculatePagination(1, 25, 0);
      expect(result).toEqual({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 1,
      });
    });
  });

  describe('filtersToQueryString', () => {
    it('should convert filters to query string', () => {
      const filters: SkuFilters = {
        search: 'test',
        shades: ['1', '2'],
        lengths: [60, 70],
        stockStatus: 'IN_STOCK',
        saleModes: ['PIECE_BY_WEIGHT'],
        categories: ['LUXE'],
        page: 2,
        limit: 50,
      };
      const result = filtersToQueryString(filters);
      expect(result).toContain('search=test');
      expect(result).toContain('shades=1%2C2');
      expect(result).toContain('lengths=60%2C70');
      expect(result).toContain('stockStatus=IN_STOCK');
      expect(result).toContain('saleModes=PIECE_BY_WEIGHT');
      expect(result).toContain('categories=LUXE');
      expect(result).toContain('page=2');
      expect(result).toContain('limit=50');
    });

    it('should skip undefined and ALL stock status', () => {
      const filters: SkuFilters = {
        search: undefined,
        stockStatus: 'ALL',
      };
      const result = filtersToQueryString(filters);
      expect(result).toBe('');
    });

    it('should skip empty arrays', () => {
      const filters: SkuFilters = {
        shades: [],
        lengths: [],
      };
      const result = filtersToQueryString(filters);
      expect(result).toBe('');
    });
  });

  describe('queryStringToFilters', () => {
    it('should parse query string to filters', () => {
      const params = new URLSearchParams(
        'search=test&shades=1,2&lengths=60,70&stockStatus=IN_STOCK&saleModes=PIECE_BY_WEIGHT&categories=LUXE&page=2&limit=50'
      );
      const result = queryStringToFilters(params);
      expect(result.search).toBe('test');
      expect(result.shades).toEqual(['1', '2']);
      expect(result.lengths).toEqual([60, 70]);
      expect(result.stockStatus).toBe('IN_STOCK');
      expect(result.saleModes).toEqual(['PIECE_BY_WEIGHT']);
      expect(result.categories).toEqual(['LUXE']);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should handle empty query string', () => {
      const params = new URLSearchParams('');
      const result = queryStringToFilters(params);
      expect(result).toEqual({});
    });

    it('should validate parsed values', () => {
      const params = new URLSearchParams(
        'shades=1,11,invalid&lengths=60,999&stockStatus=INVALID&page=abc&limit=999'
      );
      const result = queryStringToFilters(params);
      expect(result.shades).toEqual(['1']); // 11 and invalid filtered out
      expect(result.lengths).toEqual([60]); // 999 filtered out
      expect(result.stockStatus).toBeUndefined(); // INVALID filtered out
      expect(result.page).toBeUndefined(); // abc becomes NaN, filtered out
      expect(result.limit).toBe(25); // 999 not allowed, defaults to 25
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed inputs gracefully', () => {
      const result = validateFilters({
        search: null,
        shades: 'not-an-array',
        lengths: undefined,
        stockStatus: 123,
        page: 'abc',
        limit: -5,
      });
      // When string is passed for array field, it gets wrapped in array and filtered
      expect(result.shades).toEqual([]); // 'not-an-array' filtered out as invalid shade
      expect(result.page).toBe(1);
      expect(result.limit).toBe(25);
    });

    it('should handle special characters in search', () => {
      const filters: SkuFilters = { search: 'test@#$%' };
      const result = buildSkuFilters(filters);
      expect(result.AND?.[0]).toHaveProperty('OR');
    });

    it('should handle round-trip conversion', () => {
      const original: SkuFilters = {
        search: 'VLASYX',
        shades: ['4'],
        lengths: [60],
        stockStatus: 'IN_STOCK',
        page: 2,
        limit: 50,
      };
      const queryString = filtersToQueryString(original);
      const params = new URLSearchParams(queryString);
      const parsed = queryStringToFilters(params);
      expect(parsed).toEqual(original);
    });
  });
});
