# E-Commerce Price Display Flow Analysis
## Muza Hair E-Shop - Complete Technical Analysis

---

## EXECUTIVE SUMMARY

The application has **TWO PARALLEL PRICING SYSTEMS** that operate independently:

1. **BULK Product System (Standard/LUXE)** - Uses Database Price Matrix via `/api/price-matrix`
2. **PIECE/SKU System (Platinum & Unique Items)** - Uses SKU-specific prices via `/api/quote`

The issue is that these systems sometimes use **different price sources** and there's **incomplete integration** between them. Additionally, there are cached prices in localStorage that may become stale.

---

## SYSTEM ARCHITECTURE

### Data Models

```
Product (Database)
├─ base_price_per_100g_45cm (used for BULK items in catalog)
├─ tier (Standard/LUXE/Platinum edition)
├─ category (nebarvene_panenske/barvene_blond)
└─ variants (ProductVariant)

SKU (Database)
├─ pricePerGramCzk (price per gram)
├─ customerCategory (STANDARD/LUXE/PLATINUM_EDITION)
├─ saleMode (PIECE_BY_WEIGHT or BULK_G)
├─ weightTotalG (for PIECE_BY_WEIGHT items)
├─ availableGrams (for BULK_G items)
└─ name, shade, lengthCm, structure

PriceMatrix (Database)
├─ category (nebarvene/barvene)
├─ tier (standard/luxe/platinum)
├─ lengthCm
└─ pricePerGramCzk
```

---

## PRICING FLOW BY PAGE/COMPONENT

### 1. **ProductCard Component** (`/components/ProductCard.tsx`)
**Used in**: Category listing pages (e.g., `/vlasy-k-prodlouzeni/nebarvene-panenske`)

**Pricing Source**: `product.base_price_per_100g_45cm`
- Directly from Product database field
- Uses `priceCalculator.formatPrice(displayPrice)`
- **Status**: WORKING - Static price per 100g @ 45cm
- **Display**: Shows base price, not calculated per variant
- **Problem**: Doesn't reflect actual configured price (ignores length multipliers)

**Code Path**:
```typescript
const displayPrice = product.base_price_per_100g_45cm;  // Line 67
<p className="text-base font-semibold text-burgundy">
  {priceCalculator.formatPrice(displayPrice)}
</p>
```

---

### 2. **Product Detail Page** (`/app/produkt/[slug]/page.tsx`)
**Purpose**: Product detail with configurator

**Pricing Source**: `ProductConfigurator` component using `/api/price-matrix`
- Loads price matrix on mount
- Calculates price based on selected length/weight
- **Status**: WORKING - Calculates configured prices dynamically
- **Uses**: `product.base_price_per_100g_45cm` as fallback if matrix unavailable

**Code Path**:
```typescript
// ProductConfigurator.tsx
const res = await fetch('/api/price-matrix');
const data = await res.json();
setPriceMatrix(data);
```

---

### 3. **SKU Detail Page** (`/app/sku-detail/[id]/page.tsx`)
**Purpose**: Configure individual SKU and get quote

**Pricing Method**: Calls `/api/quote` endpoint
- Fetches SKU from `/api/admin/skus`
- Shows `pricePerGramCzk` directly from SKU
- User configures grams and ending type
- Calls `POST /api/quote` with SKU ID and parameters
- **Status**: WORKING - Correctly calls quote API
- **Shows**: Detailed price breakdown (vlasy + assembly fee)

**Code Path**:
```typescript
// SKU detail page.tsx Line 65
const res = await fetch(`/api/admin/skus`);
const data: Sku[] = await res.json();

// Line 95-98: Calculate quote
const res = await fetch('/api/quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lines }),
});
```

**Storage**: Saves quoted prices to localStorage with key `sku-cart`
```typescript
localStorage.setItem('sku-cart', JSON.stringify(cart));
```

---

### 4. **Catalog Page** (`/app/katalog/page.tsx`)
**Purpose**: Unified product listing (BULK + PIECE)

**Pricing Sources**:
- **BULK items**: `pricePerGramCzk` from `/api/katalog/unified`
- **PIECE items**: `priceCzk` calculated from `/api/katalog/unified`

**Source API**: `/api/katalog/unified/route.ts`
```typescript
// Line 57: BULK products
pricePerGramCzk: product.base_price_per_100g_45cm,

// Line 89: PIECE SKUs
priceCzk: Math.round(sku.pricePerGramCzk * (sku.weightTotalG || 100)),
```

**Status**: PARTIALLY WORKING
- BULK prices: from Product.base_price_per_100g_45cm
- PIECE prices: calculated inline, may not match quote API result

---

### 5. **SKU Cart Page** (`/app/sku-kosik/page.tsx`)
**Purpose**: Shopping cart for SKU purchases

**Pricing Source**: localStorage `sku-cart`
- Loads quoted prices from localStorage
- Displays breakdown: vlasy + assembly fees
- **Status**: WORKING but depends on quote API being called first
- **Risk**: Shows stale prices if localStorage not cleared

**LocalStorage Structure**:
```typescript
{
  skuId: string;
  grams: number;
  pricePerGram: number;          // From quote API
  lineTotal: number;             // grams × pricePerGram
  ending: string;
  assemblyFeeType: string;
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;        // lineTotal + assemblyFeeTotal
}
```

---

### 6. **Regular Cart Page** (`/app/kosik/page.tsx`)
**Purpose**: Shopping cart for Product purchases (BULK)

**Pricing Source**: CartContext (localStorage `cart`)
- Uses `product.base_price_per_100g_45cm`
- **Problem**: Only shows base price, doesn't calculate configured length/weight
- **Status**: INCOMPLETE - Doesn't account for actual configuration

**Code Path**:
```typescript
// CartContext.tsx Line 99-101
const getTotalPrice = () => {
  return items.reduce((total, item) => {
    const price = item.product.base_price_per_100g_45cm || 0;
    return total + price * item.quantity;
  }, 0);
};
```

---

## API ENDPOINTS ANALYSIS

### `/api/quote` (Route: `POST`)
**File**: `/app/api/quote/route.ts`

**Purpose**: Calculate quote for SKU items with assembly fees

**Input**:
```typescript
{
  lines: Array<{
    skuId: string;
    wantedGrams?: number;    // For BULK_G items
    ending?: string;         // NONE, KERATIN, PASKY, TRESSY
  }>
}
```

**Output**:
```typescript
{
  items: Array<{
    sku: Sku;
    grams: number;
    pricePerGram: number;          // From matrix or SKU fallback
    lineTotal: number;             // grams × pricePerGram
    ending: string;
    assemblyFeeType: string;
    assemblyFeeCzk: number;        // Per-gram or flat
    assemblyFeeTotal: number;
    lineGrandTotal: number;        // lineTotal + assemblyFeeTotal
    snapshotName: string;
  }>,
  total: number;
}
```

**Pricing Logic** (`/lib/stock.ts`):
```typescript
// Line 88-101: Determine price source
let pricePerGram = sku.pricePerGramCzk;

// Try to look up from matrix first
const category = sku.shade?.includes('BLONDE') ? 'barvene' : 'nebarvene';
const matrixKey = `${category}_${tier}_${sku.lengthCm}`;
const matrixPrice = priceMatrixMap.get(matrixKey);
if (matrixPrice !== undefined) {
  pricePerGram = matrixPrice;  // USE MATRIX PRICE
}
```

**Status**: WORKING - Correctly uses price matrix when available, falls back to SKU price

---

### `/api/price-matrix` (Routes: `GET`, `POST`)
**File**: `/app/api/price-matrix/route.ts`

**GET**: Fetch price matrix entries with optional filters
```
GET /api/price-matrix?category=nebarvene&tier=standard
```

**POST**: Create/upsert price matrix entries
```
POST /api/price-matrix
{
  entries: Array<{
    category: string;
    tier: string;
    lengthCm: number;
    pricePerGramCzk: number;
  }>
}
```

**Status**: WORKING - Correctly manages price matrix

---

### `/api/admin/skus` (Routes: `GET`, `POST`)
**File**: `/app/api/admin/skus/route.ts`

**Purpose**: Manage SKUs

**Returns**: All SKU objects with `pricePerGramCzk` field

**Status**: WORKING

---

### `/api/katalog/unified` (Route: `GET`)
**File**: `/app/api/katalog/unified/route.ts`

**Purpose**: Unified catalog API for both BULK and PIECE items

**Returns**:
- BULK: From `mockProducts` (in-memory, not from database)
- PIECE: From SKU database table

**Pricing**:
```typescript
// BULK (line 57)
pricePerGramCzk: product.base_price_per_100g_45cm,

// PIECE (line 89)
priceCzk: Math.round(sku.pricePerGramCzk * (sku.weightTotalG || 100)),
```

**Status**: PARTIALLY WORKING
- BULK prices: From mock/database Product
- PIECE prices: Calculated but may differ from quote API

---

## CACHING AND STATE MANAGEMENT

### 1. **localStorage Caching**

**Key: `sku-cart`** (SKU cart items)
- Location: Set in `/app/sku-detail/[id]/page.tsx` line 139
- Content: Array of quoted items with prices
- **Issue**: Prices are snapshot-based, may become stale if:
  - Price matrix is updated
  - Assembly fees change
  - Product goes out of stock

**Key: `cart`** (BULK product cart)
- Location: Used in `CartContext.tsx`
- Content: Product + variant + quantity
- **Issue**: Only stores base price, doesn't calculate actual price with configuration

---

### 2. **In-Memory Caching**

**mockProducts** (`/lib/mock-products.ts`)
- Used by `/api/katalog/unified` for BULK items
- **Status**: Currently empty (all products removed for manual entry)

---

## PRICE CALCULATION METHODS

### Method 1: Static Base Price (Fastest)
Used by: ProductCard, regular cart
```
price = product.base_price_per_100g_45cm
```
**Problem**: Doesn't account for length/weight variations

---

### Method 2: Price Matrix + Configuration (Flexible)
Used by: ProductConfigurator, SKU detail
```
price = priceMatrix[category][tier][lengthCm] * grams + assemblyFee
```
**Problem**: Requires 2 API calls (fetch matrix, then calculate)

---

### Method 3: SKU Snapshot (Most Accurate)
Used by: Quote API
```
price = sku.pricePerGramCzk * grams + assemblyFee
Falls back to: priceMatrix if available
```
**Advantage**: Uses actual SKU prices
**Problem**: Different SKUs may use different pricing methods

---

## IDENTIFIED ISSUES AND DISCONNECTS

### Issue 1: Two Parallel Pricing Systems
**Problem**: BULK products and SKU items use completely different pricing paths
- BULK: Uses `product.base_price_per_100g_45cm` directly
- SKU: Uses quote API with matrix lookups
- **Result**: Same product configuration might show different prices in catalog vs detail

---

### Issue 2: Mock Products Not Populated
**Status**: `/lib/mock-products.ts` returns empty array
**Location**: `/app/api/katalog/unified` uses `mockProducts`
**Impact**: 
- BULK items in catalog might not show
- Only PIECE (SKU) items display correctly

---

### Issue 3: Price Matrix Lookup in Quote API
**Location**: `/lib/stock.ts` lines 88-101
**Problem**: Tier mapping is inconsistent
```typescript
let tier = sku.customerCategory?.toLowerCase() || 'standard';
if (tier === 'platinum_edition') tier = 'platinum';
if (tier === 'luxe_edition') tier = 'luxe';
```
**Issue**: customerCategory is UPPERCASE (STANDARD, LUXE, PLATINUM_EDITION) but tier comparison might fail

---

### Issue 4: Price Display Doesn't Always Call Quote API
**Component**: Catalog card shows `pricePerGramCzk` or `priceCzk`
**Problem**: These are NOT verified by quote API
- No validation of stock
- No validation of minimum order quantities
- Assembly fees not applied

---

### Issue 5: localStorage Prices Become Stale
**Issue**: SKU cart items store full price breakdown in localStorage
**Risk**: If prices change in database, cart shows old prices
**Example**:
1. User adds item to cart (price = 500 Kč)
2. Admin updates price matrix (price now = 400 Kč)
3. User still sees 500 Kč in cart
4. Pays 500 Kč at checkout

---

### Issue 6: Cart Total Price Calculation
**File**: `CartContext.tsx` lines 97-102
**Problem**: Only uses `base_price_per_100g_45cm`, ignores actual configuration
```typescript
const getTotalPrice = () => {
  return items.reduce((total, item) => {
    const price = item.product.base_price_per_100g_45cm || 0;  // WRONG!
    return total + price * item.quantity;
  }, 0);
};
```
**Impact**: Shows incorrect totals in `/app/kosik`

---

### Issue 7: SKU Detail Page Always Calls /api/admin/skus
**File**: `/app/sku-detail/[id]/page.tsx` line 65
**Problem**: Fetches ALL SKUs instead of single SKU by ID
```typescript
const res = await fetch(`/api/admin/skus`);  // Should be `/api/admin/skus/${skuId}`
const data: Sku[] = await res.json();
const found = data.find((s) => s.id === skuId);
```
**Impact**: Inefficient, may be slow with many SKUs

---

## MISSING IMPLEMENTATIONS

### 1. Single SKU Endpoint
**Missing**: `/api/admin/skus/[id]`
**Needed for**: Efficient SKU fetching in detail page

---

### 2. Cart Recalculation
**Missing**: Mechanism to recalculate cart prices when database updates
**Current Workaround**: localStorage snapshot (unreliable)

---

### 3. SKU Stock Validation
**Location**: `/lib/stock.ts` line 113
```typescript
if (!sku.availableGrams || sku.availableGrams <= 0) {
  throw new Error(`"${sku.name}" nejsou skladem`);
}
```
**Issue**: Only checks if stock > 0, doesn't update stale cart items

---

### 4. Price Change Notifications
**Missing**: No way to alert users if prices change after adding to cart

---

## RECOMMENDATIONS

### Critical Fixes

1. **Fix cartContext.getTotalPrice()**
   - Call `/api/quote` for SKU items instead of using base price
   - Implement proper variant price lookup for BULK items

2. **Implement SKU price caching invalidation**
   - Add cache headers to `/api/quote`
   - Clear localStorage on price matrix updates
   - Add refresh button in cart

3. **Consolidate pricing logic**
   - Create single `priceCalculator` function for all pricing
   - Use `/api/quote` as single source of truth
   - Remove duplicate price calculations

4. **Add `/api/skus/[id]` endpoint**
   - Fetch single SKU instead of all SKUs
   - Improve performance

### Medium Priority

5. **Implement mock products in database**
   - Populate Products table instead of using in-memory mock
   - Makes catalog API consistent

6. **Add price validation in checkout**
   - Recalculate all prices before order creation
   - Ensure accuracy

7. **Add SKU stock update mechanism**
   - Update `availableGrams` when items added to cart
   - Prevent overselling

### Low Priority

8. **Add price history tracking**
   - Store historical prices in database
   - Allow price rollback

9. **Add A/B testing for price display**
   - Test matrix vs SKU pricing
   - Measure conversion impact

---

## FILE LOCATIONS SUMMARY

### Core Pricing Files
- `/lib/price-calculator.ts` - Static pricing logic
- `/lib/price-matrix-helper.ts` - Matrix lookup utilities
- `/lib/stock.ts` - Quote calculation logic
- `/types/pricing.ts` - Pricing types and config
- `/app/api/quote/route.ts` - Quote API
- `/app/api/price-matrix/route.ts` - Price matrix API

### Components Using Prices
- `/components/ProductCard.tsx` - Shows base price
- `/components/ProductConfigurator.tsx` - Calculates configured price
- `/components/CatalogCard.tsx` - Shows BULK or PIECE price
- `/app/sku-detail/[id]/page.tsx` - Shows quoted price

### Pages Using Prices
- `/app/produkt/[slug]/page.tsx` - Product detail with configurator
- `/app/sku-detail/[id]/page.tsx` - SKU detail with quote
- `/app/katalog/page.tsx` - Unified catalog
- `/app/kosik/page.tsx` - Product cart (BULK)
- `/app/sku-kosik/page.tsx` - SKU cart (PIECE)

### Admin Pages
- `/app/admin/produkty/page.tsx` - Product list
- `/app/admin/sklad/page.tsx` - SKU management
- `/app/admin/cenik/page.tsx` - Price matrix editor
- `/app/admin/konfigurator-sku/` - SKU configurator

---

## DATABASE SCHEMA RELATIONSHIPS

```
Product (base_price_per_100g_45cm)
  ↓
Variant (contains length_cm, price_czk)
  ↓
OrderItem (stores snapshot of price)
  ↓
Order

SKU (pricePerGramCzk)
  ↓
OrderItem (stores snapshot of price via quote API)
  ↓
Order

PriceMatrix (pricePerGramCzk)
  ↓
Used by Quote API
  ↓
SKU Cart
```

---

## CONCLUSION

The pricing system has **two distinct paths** that don't always align:

1. **BULK Path**: Product → base_price → display (simple but limited)
2. **SKU Path**: SKU → quote API → matrix lookup → display (complex but accurate)

**The main disconnect** is that the BULK cart doesn't recalculate prices based on configuration, and the SKU cart stores stale prices in localStorage.

**To fix**: Unify to use `/api/quote` for all pricing, ensure real-time calculation at checkout, and implement proper cache invalidation.

