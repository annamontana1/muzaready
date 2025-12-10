# Warehouse Inventory Filtering System - Design Specification

**Version:** 1.0
**Date:** 2025-12-10
**Status:** Design Phase
**Author:** Design Agent

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Proposed Filtering Logic](#2-proposed-filtering-logic)
3. [Technical Specifications](#3-technical-specifications)
4. [API Contract](#4-api-contract)
5. [UI/UX Requirements](#5-uiux-requirements)
6. [Edge Cases & Error Handling](#6-edge-cases--error-handling)
7. [Test Scenarios](#7-test-scenarios)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Current State Analysis

### 1.1 Database Schema

**SKU Model** (`prisma/schema.prisma:160-198`):
```prisma
model Sku {
  id               String            @id @default(cuid())
  sku              String            @unique
  name             String?
  shade            String?
  shadeName        String?
  lengthCm         Int?
  structure        String?
  ending           String?
  saleMode         SaleMode          // PIECE_BY_WEIGHT | BULK_G
  pricePerGramCzk  Float?
  weightTotalG     Int?
  availableGrams   Int?
  minOrderG        Int?
  stepG            Int?
  inStock          Boolean           @default(false)
  soldOut          Boolean           @default(false)
  customerCategory CustomerCategory? // STANDARD | LUXE | PLATINUM_EDITION
  isListed         Boolean           @default(false)
  listingPriority  Int?
  reservedUntil    DateTime?
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}
```

**StockMovement Model** (`prisma/schema.prisma:200-211`):
```prisma
model StockMovement {
  id         String   @id @default(cuid())
  skuId      String
  type       MoveType // IN | OUT | ADJUST
  grams      Int
  note       String?
  refOrderId String?
  createdAt  DateTime @default(now())
  sku        Sku      @relation(fields: [skuId], references: [id])
}
```

### 1.2 Current Implementation

**Existing Pages:**
- `/app/admin/sklad/page.tsx` - Basic SKU list page with create form
- No filtering capabilities
- Simple table view with all SKUs

**Current API Endpoints:**
- `GET /api/admin/skus` - Fetches all SKUs (no filtering)
- `POST /api/admin/skus` - Creates new SKU
- `POST /api/admin/stock` - Records stock movements

**Current Features:**
- Display all SKUs in a table
- Create new SKU with form
- View basic SKU information
- No search functionality
- No filtering options
- No sorting capabilities

### 1.3 Limitations

1. **No Search**: Cannot search by SKU code, name, or attributes
2. **No Filters**: Cannot filter by category, stock status, or supplier
3. **No Sorting**: Fixed sort order (createdAt desc)
4. **No Pagination**: All SKUs loaded at once (performance issue at scale)
5. **No Stock Status Views**: Cannot quickly see low stock or out of stock items
6. **No Date Filtering**: Cannot filter by creation date or stock movement dates
7. **No Export**: Cannot export filtered results

---

## 2. Proposed Filtering Logic

### 2.1 Filter Categories

#### A. Product Attributes
- **Customer Category**: STANDARD, LUXE, PLATINUM_EDITION
- **Sale Mode**: PIECE_BY_WEIGHT (Culík), BULK_G (Sypané)
- **Structure**: rovné, mírně vlnité, vlnité, kudrnaté
- **Shade/Color**: Filter by shade number or color family
- **Length**: Range filter (e.g., 40-60 cm)

#### B. Stock Status
- **In Stock**: `inStock = true`
- **Low Stock**:
  - For BULK_G: `availableGrams > 0 AND availableGrams < minOrderG * 2`
  - For PIECE_BY_WEIGHT: `inStock = true AND NOT soldOut`
- **Out of Stock**: `inStock = false` OR `soldOut = true`
- **Reserved**: `reservedUntil > NOW()`

#### C. Inventory Levels
- **Available Grams**: Range filter (e.g., 100-500g)
- **Zero Stock**: `availableGrams = 0` OR `soldOut = true`
- **High Stock**: `availableGrams >= 1000` (for BULK_G)

#### D. Listing Status
- **Listed**: `isListed = true`
- **Unlisted**: `isListed = false`
- **Priority**: Filter by listingPriority range

#### E. Date Ranges
- **Created Date**: Range filter (from/to)
- **Last Updated**: Range filter (from/to)
- **In Stock Since**: Range filter

#### F. Search
- **SKU Code**: Full-text search on `sku` field
- **Product Name**: Full-text search on `name` field
- **Shade Name**: Full-text search on `shadeName` field
- **Combined Search**: Search across SKU, name, and shadeName

### 2.2 Sorting Options

```typescript
type SortField =
  | 'sku'
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'pricePerGramCzk'
  | 'availableGrams'
  | 'lengthCm'
  | 'listingPriority';

type SortDirection = 'asc' | 'desc';
```

**Default Sort**: `listingPriority DESC, createdAt DESC`

### 2.3 Pagination

- **Page Size Options**: 10, 25, 50, 100
- **Default Page Size**: 25
- **Pagination Type**: Cursor-based (for performance) or offset-based (simpler)

---

## 3. Technical Specifications

### 3.1 Data Structures

#### Filter State Interface

```typescript
interface WarehouseFilters {
  // Search
  search?: string; // Searches across SKU, name, shadeName

  // Product Attributes
  customerCategory?: CustomerCategory[]; // STANDARD, LUXE, PLATINUM_EDITION
  saleMode?: SaleMode[]; // PIECE_BY_WEIGHT, BULK_G
  structure?: string[]; // rovné, mírně vlnité, vlnité, kudrnaté
  shade?: string[]; // Shade codes
  lengthRange?: {
    min?: number;
    max?: number;
  };

  // Stock Status
  stockStatus?: StockStatus[]; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK, RESERVED

  // Inventory Levels
  availableGramsRange?: {
    min?: number;
    max?: number;
  };

  // Listing Status
  isListed?: boolean | null; // null = all, true = listed, false = unlisted
  listingPriorityRange?: {
    min?: number;
    max?: number;
  };

  // Date Ranges
  createdDateRange?: {
    from?: Date;
    to?: Date;
  };
  updatedDateRange?: {
    from?: Date;
    to?: Date;
  };
  inStockSinceRange?: {
    from?: Date;
    to?: Date;
  };

  // Sorting
  sortBy?: SortField;
  sortDirection?: SortDirection;

  // Pagination
  page?: number;
  pageSize?: number;
}

type StockStatus =
  | 'IN_STOCK'      // inStock = true AND (soldOut = false OR saleMode = BULK_G with availableGrams > 0)
  | 'LOW_STOCK'     // For BULK_G: 0 < availableGrams < minOrderG * 2
  | 'OUT_OF_STOCK'  // inStock = false OR soldOut = true OR availableGrams = 0
  | 'RESERVED';     // reservedUntil > NOW()
```

#### API Response Interface

```typescript
interface WarehouseListResponse {
  items: SkuWithComputedFields[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: WarehouseFilters; // Echo back applied filters
  aggregations?: {
    totalInStock: number;
    totalLowStock: number;
    totalOutOfStock: number;
    totalReserved: number;
    totalAvailableGrams: number;
    totalValue: number; // Sum of (availableGrams * pricePerGramCzk)
  };
}

interface SkuWithComputedFields extends Sku {
  computedStockStatus: StockStatus;
  stockMovementCount?: number;
  lastMovement?: StockMovement;
  totalStockIn?: number;
  totalStockOut?: number;
}
```

### 3.2 Database Query Strategy

#### Query Builder Logic

```typescript
// Pseudo-code for building Prisma where clause
function buildWhereClause(filters: WarehouseFilters) {
  const where: Prisma.SkuWhereInput = {};

  // Search (full-text)
  if (filters.search) {
    where.OR = [
      { sku: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
      { shadeName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Customer Category
  if (filters.customerCategory?.length) {
    where.customerCategory = { in: filters.customerCategory };
  }

  // Sale Mode
  if (filters.saleMode?.length) {
    where.saleMode = { in: filters.saleMode };
  }

  // Structure
  if (filters.structure?.length) {
    where.structure = { in: filters.structure };
  }

  // Shade
  if (filters.shade?.length) {
    where.shade = { in: filters.shade };
  }

  // Length Range
  if (filters.lengthRange) {
    if (filters.lengthRange.min) {
      where.lengthCm = { ...where.lengthCm, gte: filters.lengthRange.min };
    }
    if (filters.lengthRange.max) {
      where.lengthCm = { ...where.lengthCm, lte: filters.lengthRange.max };
    }
  }

  // Stock Status
  if (filters.stockStatus?.length) {
    const stockConditions: Prisma.SkuWhereInput[] = [];

    if (filters.stockStatus.includes('IN_STOCK')) {
      stockConditions.push({
        inStock: true,
        OR: [
          { saleMode: 'PIECE_BY_WEIGHT', soldOut: false },
          { saleMode: 'BULK_G', availableGrams: { gt: 0 } },
        ],
      });
    }

    if (filters.stockStatus.includes('OUT_OF_STOCK')) {
      stockConditions.push({
        OR: [
          { inStock: false },
          { soldOut: true },
          { saleMode: 'BULK_G', availableGrams: { lte: 0 } },
        ],
      });
    }

    if (filters.stockStatus.includes('RESERVED')) {
      stockConditions.push({
        reservedUntil: { gt: new Date() },
      });
    }

    // LOW_STOCK requires aggregation - handle separately

    if (stockConditions.length) {
      where.OR = [...(where.OR || []), ...stockConditions];
    }
  }

  // Available Grams Range
  if (filters.availableGramsRange) {
    if (filters.availableGramsRange.min !== undefined) {
      where.availableGrams = { ...where.availableGrams, gte: filters.availableGramsRange.min };
    }
    if (filters.availableGramsRange.max !== undefined) {
      where.availableGrams = { ...where.availableGrams, lte: filters.availableGramsRange.max };
    }
  }

  // Listing Status
  if (filters.isListed !== undefined && filters.isListed !== null) {
    where.isListed = filters.isListed;
  }

  // Listing Priority Range
  if (filters.listingPriorityRange) {
    if (filters.listingPriorityRange.min !== undefined) {
      where.listingPriority = { ...where.listingPriority, gte: filters.listingPriorityRange.min };
    }
    if (filters.listingPriorityRange.max !== undefined) {
      where.listingPriority = { ...where.listingPriority, lte: filters.listingPriorityRange.max };
    }
  }

  // Date Ranges
  if (filters.createdDateRange?.from) {
    where.createdAt = { ...where.createdAt, gte: filters.createdDateRange.from };
  }
  if (filters.createdDateRange?.to) {
    where.createdAt = { ...where.createdAt, lte: filters.createdDateRange.to };
  }

  if (filters.updatedDateRange?.from) {
    where.updatedAt = { ...where.updatedAt, gte: filters.updatedDateRange.from };
  }
  if (filters.updatedDateRange?.to) {
    where.updatedAt = { ...where.updatedAt, lte: filters.updatedDateRange.to };
  }

  if (filters.inStockSinceRange?.from) {
    where.inStockSince = { ...where.inStockSince, gte: filters.inStockSinceRange.from };
  }
  if (filters.inStockSinceRange?.to) {
    where.inStockSince = { ...where.inStockSince, lte: filters.inStockSinceRange.to };
  }

  return where;
}
```

#### Low Stock Detection

```typescript
// Post-processing for LOW_STOCK detection
function computeStockStatus(sku: Sku): StockStatus {
  // Reserved
  if (sku.reservedUntil && sku.reservedUntil > new Date()) {
    return 'RESERVED';
  }

  // Out of Stock
  if (!sku.inStock || sku.soldOut) {
    return 'OUT_OF_STOCK';
  }

  if (sku.saleMode === 'BULK_G') {
    if (!sku.availableGrams || sku.availableGrams <= 0) {
      return 'OUT_OF_STOCK';
    }

    // Low Stock: less than 2x minimum order
    const threshold = (sku.minOrderG || 100) * 2;
    if (sku.availableGrams < threshold) {
      return 'LOW_STOCK';
    }
  }

  // In Stock
  return 'IN_STOCK';
}
```

### 3.3 Performance Considerations

#### Database Indexes

```prisma
// Add these indexes to prisma/schema.prisma
model Sku {
  // ... existing fields ...

  @@index([customerCategory])
  @@index([saleMode])
  @@index([structure])
  @@index([shade])
  @@index([lengthCm])
  @@index([inStock])
  @@index([isListed])
  @@index([listingPriority])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([inStockSince])
  @@index([availableGrams])

  // Composite indexes for common queries
  @@index([inStock, isListed])
  @@index([customerCategory, inStock])
  @@index([saleMode, availableGrams])
}
```

#### Caching Strategy

- Cache aggregation results for 5 minutes
- Cache filter options (unique values) for 10 minutes
- Use Redis or in-memory cache for frequently accessed data

---

## 4. API Contract

### 4.1 GET /api/admin/warehouse/skus

**Description**: Fetch filtered and paginated SKU list

**Authentication**: Required (Admin only)

**Query Parameters**:

```typescript
interface QueryParams {
  // Search
  search?: string;

  // Filters (comma-separated for arrays)
  customerCategory?: string; // e.g., "STANDARD,LUXE"
  saleMode?: string; // e.g., "BULK_G"
  structure?: string; // e.g., "rovné,vlnité"
  shade?: string; // e.g., "1,2,3"
  lengthMin?: number;
  lengthMax?: number;

  stockStatus?: string; // e.g., "IN_STOCK,LOW_STOCK"

  availableGramsMin?: number;
  availableGramsMax?: number;

  isListed?: boolean;
  listingPriorityMin?: number;
  listingPriorityMax?: number;

  createdFrom?: string; // ISO date
  createdTo?: string; // ISO date
  updatedFrom?: string; // ISO date
  updatedTo?: string; // ISO date

  // Sorting
  sortBy?: string; // e.g., "createdAt"
  sortDirection?: 'asc' | 'desc';

  // Pagination
  page?: number; // Default: 1
  pageSize?: number; // Default: 25

  // Options
  includeMovements?: boolean; // Include stock movements
  includeAggregations?: boolean; // Include aggregations
}
```

**Request Example**:

```bash
GET /api/admin/warehouse/skus?search=VLASYX&stockStatus=IN_STOCK,LOW_STOCK&customerCategory=LUXE&sortBy=availableGrams&sortDirection=asc&page=1&pageSize=25&includeAggregations=true
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clc123abc",
        "sku": "VLASYX-BULK-001",
        "name": "VlasyX LUXE - Černá",
        "customerCategory": "LUXE",
        "shade": "1",
        "shadeName": "Černá",
        "lengthCm": 45,
        "structure": "rovné",
        "saleMode": "BULK_G",
        "pricePerGramCzk": 18.5,
        "availableGrams": 150,
        "minOrderG": 100,
        "stepG": 10,
        "inStock": true,
        "soldOut": false,
        "isListed": true,
        "listingPriority": 10,
        "createdAt": "2025-12-01T10:00:00Z",
        "updatedAt": "2025-12-10T15:30:00Z",
        "computedStockStatus": "LOW_STOCK",
        "stockMovementCount": 5,
        "lastMovement": {
          "id": "clm456def",
          "type": "OUT",
          "grams": 50,
          "createdAt": "2025-12-10T15:30:00Z"
        }
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pageSize": 25,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "search": "VLASYX",
      "stockStatus": ["IN_STOCK", "LOW_STOCK"],
      "customerCategory": ["LUXE"],
      "sortBy": "availableGrams",
      "sortDirection": "asc",
      "page": 1,
      "pageSize": 25
    },
    "aggregations": {
      "totalInStock": 30,
      "totalLowStock": 15,
      "totalOutOfStock": 0,
      "totalReserved": 0,
      "totalAvailableGrams": 5430,
      "totalValue": 100455
    }
  }
}
```

**Error Responses**:

```json
// 401 Unauthorized
{
  "success": false,
  "error": "Authentication required"
}

// 400 Bad Request
{
  "success": false,
  "error": "Invalid filter parameters",
  "details": {
    "pageSize": "Must be between 1 and 100"
  }
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Failed to fetch SKUs",
  "message": "Database connection error"
}
```

### 4.2 GET /api/admin/warehouse/filter-options

**Description**: Get available filter options (for dropdown population)

**Authentication**: Required (Admin only)

**Response Example**:

```json
{
  "success": true,
  "data": {
    "customerCategories": ["STANDARD", "LUXE", "PLATINUM_EDITION"],
    "saleModes": ["PIECE_BY_WEIGHT", "BULK_G"],
    "structures": ["rovné", "mírně vlnité", "vlnité", "kudrnaté"],
    "shades": [
      { "code": "1", "name": "Černá" },
      { "code": "2", "name": "Velmi tmavá hnědá" },
      { "code": "3", "name": "Tmavá hnědá" }
    ],
    "lengthRange": {
      "min": 35,
      "max": 90
    },
    "availableGramsRange": {
      "min": 0,
      "max": 5000
    },
    "listingPriorityRange": {
      "min": 1,
      "max": 10
    }
  }
}
```

### 4.3 POST /api/admin/warehouse/skus/bulk-update

**Description**: Bulk update SKU fields (e.g., mark multiple as listed/unlisted)

**Authentication**: Required (Admin only)

**Request Body**:

```json
{
  "skuIds": ["clc123abc", "clc456def", "clc789ghi"],
  "updates": {
    "isListed": true,
    "listingPriority": 5
  }
}
```

**Response Example**:

```json
{
  "success": true,
  "data": {
    "updated": 3,
    "skuIds": ["clc123abc", "clc456def", "clc789ghi"]
  }
}
```

---

## 5. UI/UX Requirements

### 5.1 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Warehouse Inventory                         [+ New SKU]     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Search: [_______________] [🔍]                         │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Filters: ▼                                             │   │
│ │                                                         │   │
│ │ Category:  [All ▼] [Standard] [LUXE] [Platinum]       │   │
│ │ Sale Mode: [All ▼] [Culík] [Sypané]                   │   │
│ │ Stock:     [All ▼] [In Stock] [Low] [Out of Stock]    │   │
│ │ Structure: [All ▼] [rovné] [vlnité] [kudrnaté]        │   │
│ │ Length:    [Min: __] - [Max: __] cm                   │   │
│ │ Listed:    [All ▼] [Listed] [Unlisted]                │   │
│ │                                                         │   │
│ │ [Apply Filters] [Reset] [Save View]                   │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 📊 Summary:                                            │   │
│ │ Total: 45 | In Stock: 30 | Low: 15 | Out: 0 | $10k   │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ Sort by: [Created Date ▼] [↓]    [25 per page ▼]           │
│                                                               │
│ [✓] Select All | Bulk Actions: [Mark Listed ▼] [Apply]     │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SKU              Name         Category  Stock   Grams   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑ VLASYX-001   VlasyX Black  LUXE      🟡 Low   150g   │ │
│ │ ☐ PLAT-002     Platinum 45cm PLATINUM  🟢 In    1pc    │ │
│ │ ☐ VLASYX-003   VlasyX Brown  STANDARD  🔴 Out   0g     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ ← Previous | Page 1 of 2 | Next →                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Breakdown

#### A. Search Bar Component

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch: () => void;
}
```

**Features**:
- Debounced input (300ms delay)
- Clear button when text entered
- Search icon button
- Enter key triggers search

#### B. Filter Panel Component

```typescript
interface FilterPanelProps {
  filters: WarehouseFilters;
  filterOptions: FilterOptions;
  onChange: (filters: WarehouseFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onSaveView: () => void;
}
```

**Features**:
- Collapsible sections
- Multi-select dropdowns
- Range inputs with validation
- Active filter count badge
- "Apply" and "Reset" buttons
- "Save View" for named filter presets

#### C. Summary Cards Component

```typescript
interface SummaryCardsProps {
  aggregations: Aggregations;
  loading?: boolean;
}
```

**Features**:
- Display total SKUs, stock counts, total value
- Color-coded badges (green/yellow/red)
- Clickable cards to filter by status
- Loading skeleton states

#### D. Bulk Actions Toolbar

```typescript
interface BulkActionsProps {
  selectedSkuIds: string[];
  onBulkUpdate: (updates: Partial<Sku>) => Promise<void>;
  onClearSelection: () => void;
}
```

**Features**:
- Select all checkbox
- Dropdown for bulk actions
- Apply button
- Clear selection button
- Disabled when no items selected

#### E. SKU Table Component

```typescript
interface SkuTableProps {
  skus: SkuWithComputedFields[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSort: (field: SortField, direction: SortDirection) => void;
  sortBy: SortField;
  sortDirection: SortDirection;
  loading?: boolean;
}
```

**Features**:
- Selectable rows (checkboxes)
- Sortable columns (click header)
- Expandable rows for details
- Color-coded stock status badges
- Quick actions (Edit, Delete, View Movements)
- Loading skeleton for rows

#### F. Pagination Component

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

**Features**:
- Previous/Next buttons
- Page number display
- Page size selector
- Jump to page input
- Total items count

### 5.3 Mobile Responsiveness

**Breakpoints**:
- Desktop: >= 1024px (full layout)
- Tablet: 768px - 1023px (compact filters)
- Mobile: < 768px (stacked layout, drawer filters)

**Mobile Adaptations**:
- Filters in a slide-out drawer
- Cards instead of table
- Bottom sheet for bulk actions
- Simplified summary bar

### 5.4 Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader announcements for filter changes
- High contrast mode support

---

## 6. Edge Cases & Error Handling

### 6.1 Edge Cases

#### A. Empty Results

**Scenario**: Filters applied but no SKUs match

**Handling**:
- Display empty state illustration
- Show message: "No SKUs found matching your filters"
- Suggest actions: "Try adjusting your filters or create a new SKU"
- Show "Reset Filters" button

#### B. Low Stock Calculation Edge Cases

**Scenario 1**: BULK_G SKU with `minOrderG = null`

**Handling**: Use default threshold of 100g for low stock calculation

**Scenario 2**: PIECE_BY_WEIGHT SKU

**Handling**: Low stock doesn't apply; only IN_STOCK or OUT_OF_STOCK

#### C. Concurrent Updates

**Scenario**: Multiple admins updating same SKU simultaneously

**Handling**:
- Use optimistic locking (check `updatedAt` before update)
- Show warning if SKU was modified since last fetch
- Prompt user to refresh and retry

#### D. Large Datasets

**Scenario**: Warehouse has 10,000+ SKUs

**Handling**:
- Enforce maximum page size of 100
- Add search debouncing to reduce queries
- Show loading indicators
- Implement cursor-based pagination for better performance

#### E. Invalid Date Ranges

**Scenario**: User enters "from" date after "to" date

**Handling**:
- Validate on client side
- Show inline error message
- Swap dates automatically with confirmation

#### F. Reserved SKUs

**Scenario**: SKU has `reservedUntil` in the past

**Handling**:
- Don't show as RESERVED status
- Background job to clear expired reservations

### 6.2 Error Handling

#### Client-Side Errors

```typescript
// Network errors
if (error.message.includes('network')) {
  toast.error('Network error. Please check your connection.');
  return;
}

// Timeout errors
if (error.message.includes('timeout')) {
  toast.error('Request timed out. Please try again.');
  return;
}

// Validation errors
if (error.response?.status === 400) {
  toast.error(error.response.data.error);
  return;
}

// Generic error fallback
toast.error('Something went wrong. Please try again.');
```

#### Server-Side Errors

```typescript
// Database connection errors
catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error occurred' },
      { status: 500 }
    );
  }

  // Generic errors
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

### 6.3 Data Validation

#### Query Parameter Validation

```typescript
// Validate page number
if (page < 1) {
  return NextResponse.json(
    { success: false, error: 'Page must be >= 1' },
    { status: 400 }
  );
}

// Validate page size
if (pageSize < 1 || pageSize > 100) {
  return NextResponse.json(
    { success: false, error: 'Page size must be between 1 and 100' },
    { status: 400 }
  );
}

// Validate date formats
if (createdFrom && isNaN(Date.parse(createdFrom))) {
  return NextResponse.json(
    { success: false, error: 'Invalid date format for createdFrom' },
    { status: 400 }
  );
}

// Validate enum values
if (sortBy && !['sku', 'name', 'createdAt', ...].includes(sortBy)) {
  return NextResponse.json(
    { success: false, error: 'Invalid sortBy value' },
    { status: 400 }
  );
}
```

---

## 7. Test Scenarios

### 7.1 Functional Tests

#### Test Suite 1: Search Functionality

```typescript
describe('Warehouse Search', () => {
  it('should find SKUs by exact SKU code', async () => {
    // Arrange: Create SKU with code "VLASYX-001"
    // Act: Search for "VLASYX-001"
    // Assert: SKU is found
  });

  it('should find SKUs by partial name match', async () => {
    // Arrange: Create SKU with name "VlasyX Black"
    // Act: Search for "Black"
    // Assert: SKU is found
  });

  it('should be case-insensitive', async () => {
    // Arrange: Create SKU with name "VlasyX Black"
    // Act: Search for "vlasyx black"
    // Assert: SKU is found
  });

  it('should search across SKU, name, and shadeName', async () => {
    // Arrange: Create SKU with shadeName "Černá"
    // Act: Search for "Černá"
    // Assert: SKU is found
  });

  it('should return empty results for non-matching search', async () => {
    // Arrange: Create SKUs
    // Act: Search for "NONEXISTENT"
    // Assert: Empty array returned
  });
});
```

#### Test Suite 2: Filtering Logic

```typescript
describe('Warehouse Filters', () => {
  it('should filter by single customer category', async () => {
    // Arrange: Create STANDARD, LUXE, PLATINUM SKUs
    // Act: Filter by customerCategory = [LUXE]
    // Assert: Only LUXE SKUs returned
  });

  it('should filter by multiple customer categories', async () => {
    // Arrange: Create STANDARD, LUXE, PLATINUM SKUs
    // Act: Filter by customerCategory = [LUXE, PLATINUM_EDITION]
    // Assert: LUXE and PLATINUM SKUs returned
  });

  it('should filter by sale mode', async () => {
    // Arrange: Create PIECE_BY_WEIGHT and BULK_G SKUs
    // Act: Filter by saleMode = [BULK_G]
    // Assert: Only BULK_G SKUs returned
  });

  it('should filter by stock status IN_STOCK', async () => {
    // Arrange: Create in-stock and out-of-stock SKUs
    // Act: Filter by stockStatus = [IN_STOCK]
    // Assert: Only in-stock SKUs returned
  });

  it('should filter by stock status LOW_STOCK', async () => {
    // Arrange: Create SKU with availableGrams = 150, minOrderG = 100
    // Act: Filter by stockStatus = [LOW_STOCK]
    // Assert: SKU is returned (150 < 200)
  });

  it('should filter by stock status OUT_OF_STOCK', async () => {
    // Arrange: Create out-of-stock SKUs (inStock=false, soldOut=true)
    // Act: Filter by stockStatus = [OUT_OF_STOCK]
    // Assert: Out-of-stock SKUs returned
  });

  it('should filter by length range', async () => {
    // Arrange: Create SKUs with lengths 40, 50, 60 cm
    // Act: Filter by lengthRange = { min: 45, max: 55 }
    // Assert: Only 50cm SKU returned
  });

  it('should filter by available grams range', async () => {
    // Arrange: Create SKUs with 100, 500, 1000 grams
    // Act: Filter by availableGramsRange = { min: 200, max: 800 }
    // Assert: Only 500g SKU returned
  });

  it('should combine multiple filters with AND logic', async () => {
    // Arrange: Create various SKUs
    // Act: Filter by category=LUXE AND stockStatus=IN_STOCK AND structure=rovné
    // Assert: Only SKUs matching all criteria returned
  });
});
```

#### Test Suite 3: Sorting

```typescript
describe('Warehouse Sorting', () => {
  it('should sort by SKU code ascending', async () => {
    // Arrange: Create SKUs with codes B, A, C
    // Act: Sort by sku, direction=asc
    // Assert: Order is A, B, C
  });

  it('should sort by price descending', async () => {
    // Arrange: Create SKUs with prices 10, 30, 20
    // Act: Sort by pricePerGramCzk, direction=desc
    // Assert: Order is 30, 20, 10
  });

  it('should sort by available grams ascending', async () => {
    // Arrange: Create SKUs with 500, 100, 300 grams
    // Act: Sort by availableGrams, direction=asc
    // Assert: Order is 100, 300, 500
  });

  it('should apply default sort when not specified', async () => {
    // Arrange: Create SKUs with various listing priorities
    // Act: Fetch without sort params
    // Assert: Sorted by listingPriority DESC, createdAt DESC
  });
});
```

#### Test Suite 4: Pagination

```typescript
describe('Warehouse Pagination', () => {
  it('should return correct page of results', async () => {
    // Arrange: Create 50 SKUs
    // Act: Fetch page=2, pageSize=25
    // Assert: SKUs 26-50 returned
  });

  it('should return correct pagination metadata', async () => {
    // Arrange: Create 45 SKUs
    // Act: Fetch page=1, pageSize=25
    // Assert: total=45, totalPages=2, hasNextPage=true
  });

  it('should handle last page correctly', async () => {
    // Arrange: Create 45 SKUs
    // Act: Fetch page=2, pageSize=25
    // Assert: 20 SKUs returned, hasNextPage=false
  });

  it('should return empty array for page beyond last', async () => {
    // Arrange: Create 25 SKUs
    // Act: Fetch page=10, pageSize=25
    // Assert: Empty array, pagination shows page 10 of 1
  });
});
```

#### Test Suite 5: Aggregations

```typescript
describe('Warehouse Aggregations', () => {
  it('should calculate total stock counts correctly', async () => {
    // Arrange: Create 10 in-stock, 5 low-stock, 3 out-of-stock SKUs
    // Act: Fetch with includeAggregations=true
    // Assert: totalInStock=10, totalLowStock=5, totalOutOfStock=3
  });

  it('should calculate total available grams correctly', async () => {
    // Arrange: Create SKUs with 100, 200, 300 grams
    // Act: Fetch with includeAggregations=true
    // Assert: totalAvailableGrams=600
  });

  it('should calculate total value correctly', async () => {
    // Arrange: Create SKUs with different prices and quantities
    // Act: Fetch with includeAggregations=true
    // Assert: totalValue = sum(availableGrams * pricePerGramCzk)
  });

  it('should reflect filtered results in aggregations', async () => {
    // Arrange: Create 20 SKUs, 10 are LUXE
    // Act: Filter by customerCategory=LUXE with includeAggregations=true
    // Assert: Aggregations only count LUXE SKUs
  });
});
```

### 7.2 Integration Tests

```typescript
describe('Warehouse API Integration', () => {
  it('should handle full filter + sort + pagination flow', async () => {
    // Arrange: Create 100 SKUs with various attributes
    // Act: GET /api/admin/warehouse/skus with complex filters
    // Assert: Correct filtered, sorted, paginated results
  });

  it('should handle concurrent filter requests', async () => {
    // Arrange: Create SKUs
    // Act: Send 10 simultaneous filter requests
    // Assert: All return correct results, no conflicts
  });

  it('should maintain filter state across page changes', async () => {
    // Arrange: Create 50 SKUs
    // Act: Apply filters, fetch page 1, then page 2
    // Assert: Same filters applied on page 2
  });
});
```

### 7.3 Performance Tests

```typescript
describe('Warehouse Performance', () => {
  it('should handle 10,000 SKUs without timeout', async () => {
    // Arrange: Create 10,000 SKUs
    // Act: Fetch with filters
    // Assert: Response time < 2 seconds
  });

  it('should efficiently handle complex multi-filter queries', async () => {
    // Arrange: Create 5,000 SKUs
    // Act: Apply 5+ filters simultaneously
    // Assert: Response time < 3 seconds
  });

  it('should use indexes for common queries', async () => {
    // Arrange: Create 10,000 SKUs
    // Act: Query with indexed fields
    // Assert: Database explains show index usage
  });
});
```

### 7.4 UI Tests (E2E)

```typescript
describe('Warehouse UI E2E', () => {
  it('should apply filters and show results', async () => {
    // Arrange: Navigate to warehouse page
    // Act: Select filters, click Apply
    // Assert: Table updates with filtered results
  });

  it('should reset filters correctly', async () => {
    // Arrange: Apply filters
    // Act: Click Reset button
    // Assert: All filters cleared, full list shown
  });

  it('should handle bulk selection and update', async () => {
    // Arrange: Display SKU list
    // Act: Select multiple SKUs, apply bulk action
    // Assert: SKUs updated, success message shown
  });

  it('should show loading states correctly', async () => {
    // Arrange: Navigate to warehouse page
    // Act: Apply filters (slow network simulated)
    // Assert: Loading skeletons shown during fetch
  });

  it('should show error states for failed requests', async () => {
    // Arrange: Simulate network failure
    // Act: Apply filters
    // Assert: Error message shown, retry option available
  });
});
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Backend**:
- [ ] Add database indexes to SKU model
- [ ] Create `/api/admin/warehouse/skus` endpoint with basic filtering
- [ ] Implement query builder for Prisma where clauses
- [ ] Add pagination logic
- [ ] Add sorting logic
- [ ] Write unit tests for query builder

**Frontend**:
- [ ] Create warehouse filter types and interfaces
- [ ] Set up state management (Context or Zustand)
- [ ] Create basic page layout structure

**Deliverables**:
- API endpoint responding to basic filters
- Database indexes in place
- Basic page layout

### Phase 2: Core Filtering (Week 2)

**Backend**:
- [ ] Implement all filter types (category, stock status, etc.)
- [ ] Add stock status computation logic
- [ ] Implement `/api/admin/warehouse/filter-options` endpoint
- [ ] Add request validation
- [ ] Write integration tests

**Frontend**:
- [ ] Create Filter Panel component
- [ ] Create Search Bar component
- [ ] Implement filter application logic
- [ ] Add URL state synchronization (query params)
- [ ] Create filter state persistence (localStorage)

**Deliverables**:
- Fully functional filtering API
- Working filter UI
- URL-based filter state

### Phase 3: UI Components (Week 3)

**Frontend**:
- [ ] Create SKU Table component
- [ ] Create Summary Cards component
- [ ] Create Pagination component
- [ ] Implement sorting UI
- [ ] Add loading states and skeletons
- [ ] Add empty state illustrations

**Backend**:
- [ ] Add aggregations calculation
- [ ] Optimize queries with includes

**Deliverables**:
- Complete UI with all components
- Aggregations in API response
- Smooth loading states

### Phase 4: Advanced Features (Week 4)

**Backend**:
- [ ] Implement bulk update endpoint
- [ ] Add export functionality (CSV/Excel)
- [ ] Add saved filter views (database model)

**Frontend**:
- [ ] Create Bulk Actions toolbar
- [ ] Implement multi-select functionality
- [ ] Add export button and download logic
- [ ] Create saved views UI
- [ ] Add filter presets

**Deliverables**:
- Bulk operations working
- Export functionality
- Saved filter views

### Phase 5: Polish & Optimization (Week 5)

**Backend**:
- [ ] Add response caching (Redis)
- [ ] Optimize slow queries
- [ ] Add rate limiting
- [ ] Add monitoring and logging

**Frontend**:
- [ ] Mobile responsive design
- [ ] Accessibility improvements
- [ ] Performance optimization (lazy loading)
- [ ] Add keyboard shortcuts
- [ ] Error boundary implementation

**Testing**:
- [ ] E2E tests with Playwright
- [ ] Performance testing with 10k+ SKUs
- [ ] Load testing
- [ ] Browser compatibility testing

**Deliverables**:
- Production-ready system
- Full test coverage
- Performance benchmarks

---

## Appendix

### A. Database Migration Script

```sql
-- Add indexes for filtering and sorting
CREATE INDEX idx_sku_customer_category ON "skus"("customerCategory");
CREATE INDEX idx_sku_sale_mode ON "skus"("saleMode");
CREATE INDEX idx_sku_structure ON "skus"("structure");
CREATE INDEX idx_sku_shade ON "skus"("shade");
CREATE INDEX idx_sku_length_cm ON "skus"("lengthCm");
CREATE INDEX idx_sku_in_stock ON "skus"("inStock");
CREATE INDEX idx_sku_is_listed ON "skus"("isListed");
CREATE INDEX idx_sku_listing_priority ON "skus"("listingPriority");
CREATE INDEX idx_sku_created_at ON "skus"("createdAt");
CREATE INDEX idx_sku_updated_at ON "skus"("updatedAt");
CREATE INDEX idx_sku_in_stock_since ON "skus"("inStockSince");
CREATE INDEX idx_sku_available_grams ON "skus"("availableGrams");

-- Composite indexes for common queries
CREATE INDEX idx_sku_in_stock_listed ON "skus"("inStock", "isListed");
CREATE INDEX idx_sku_category_stock ON "skus"("customerCategory", "inStock");
CREATE INDEX idx_sku_mode_grams ON "skus"("saleMode", "availableGrams");
```

### B. Example Filter Presets

```json
{
  "presets": [
    {
      "name": "Low Stock Alert",
      "filters": {
        "stockStatus": ["LOW_STOCK"],
        "isListed": true
      }
    },
    {
      "name": "Platinum In Stock",
      "filters": {
        "customerCategory": ["PLATINUM_EDITION"],
        "stockStatus": ["IN_STOCK"]
      }
    },
    {
      "name": "Unlisted Items",
      "filters": {
        "isListed": false
      }
    },
    {
      "name": "Recent Additions",
      "filters": {
        "createdDateRange": {
          "from": "last_7_days"
        }
      },
      "sortBy": "createdAt",
      "sortDirection": "desc"
    }
  ]
}
```

### C. Monitoring Metrics

**Key Metrics to Track**:
- Average API response time
- Filter query performance (by filter type)
- Page load time
- Cache hit rate
- Error rate
- Concurrent users
- Popular filter combinations
- Export usage

**Alerts**:
- Response time > 3 seconds
- Error rate > 5%
- Database connection pool exhaustion
- Low stock count exceeds threshold

---

**End of Design Document**
