# Price Display System - Quick Reference Guide

## What You Need To Know (TL;DR)

### The Problem
Your app has **2 completely separate pricing systems**:
1. **BULK products** - Show base price, don't calculate with length/weight
2. **SKU items** - Use quote API, but store stale prices in localStorage

Result: Prices shown in catalog might be different from actual price at checkout.

---

## Quick Lookup Table

| Page | System | Price Source | Issue | Fix Priority |
|------|--------|--------------|-------|--------------|
| `/katalog` | BULK + PIECE | `base_price` + calculated | PIECE calc unvalidated | Medium |
| `/produkt/[slug]` | BULK | `/api/price-matrix` | Works correctly | None |
| `/sku-detail/[id]` | PIECE | `/api/quote` | Works correctly | Low |
| `/kosik` (BULK cart) | BULK | `base_price_per_100g_45cm` | WRONG! Ignores config | CRITICAL |
| `/sku-kosik` (PIECE cart) | PIECE | localStorage | STALE PRICES! | CRITICAL |

---

## Critical Bugs (Fix These Now!)

### Bug 1: BULK Cart Shows Wrong Total
**Location**: `/contexts/CartContext.tsx` lines 97-102

**Problem**: 
```typescript
// WRONG - ignores length/weight configuration
const getTotalPrice = () => {
  return items.reduce((total, item) => {
    const price = item.product.base_price_per_100g_45cm || 0;
    return total + price * item.quantity;
  }, 0);
};
```

**Why It's Wrong**: 
- Shows base price per 100g @ 45cm
- Doesn't account for actual configuration (e.g., if user selected 60cm or 150g)
- Total shown in `/app/kosik` is incorrect

**Quick Fix**:
```typescript
// When adding to cart, store actual configured price
// OR recalculate at checkout time using product configuration
```

---

### Bug 2: SKU Cart Stores Stale Prices
**Location**: `/app/sku-detail/[id]/page.tsx` line 139

**Problem**: 
```typescript
// Prices stored in localStorage become stale
localStorage.setItem('sku-cart', JSON.stringify(cart));
```

**Why It's Wrong**:
- If admin updates price matrix, user's cart still shows old price
- User sees "500 Kč" but pays 400 Kč at checkout (or vice versa)
- No way to update prices after item added to cart

**Quick Fix**:
```typescript
// Add timestamp to cart items
// Check if price > 24 hours old before checkout
// Show warning if price changed
// Or recalculate price in POST /api/orders
```

---

### Bug 3: mockProducts is Empty
**Location**: `/lib/mock-products.ts`

**Problem**: 
```typescript
// Returns empty array!
export const mockProducts: Product[] = generateMockProducts();
```

**Why It's Wrong**:
- `/api/katalog/unified` uses `mockProducts` for BULK items
- Returns empty, so BULK items don't show in catalog
- Only PIECE (SKU) items display

**Quick Fix**:
```typescript
// Option 1: Load from database
// Option 2: Seed with sample data
// Option 3: Fetch from /api/products instead
```

---

## Medium Priority Issues

### Issue 4: Inefficient SKU Fetching
**Location**: `/app/sku-detail/[id]/page.tsx` line 65

**Problem**: 
```typescript
// Fetches ALL SKUs instead of just one
const res = await fetch(`/api/admin/skus`);
const data: Sku[] = await res.json();
const found = data.find((s) => s.id === skuId);
```

**Fix**: Create `/api/admin/skus/[id]` endpoint

---

### Issue 5: Price Matrix Tier Mapping Bug
**Location**: `/lib/stock.ts` lines 93-95

**Problem**:
```typescript
let tier = sku.customerCategory?.toLowerCase() || 'standard';
if (tier === 'platinum_edition') tier = 'platinum';
if (tier === 'luxe_edition') tier = 'luxe';
```

**Why**: `customerCategory` is UPPERCASE enum (PLATINUM_EDITION), but after `.toLowerCase()` becomes `platinum_edition` which matches the condition. But what if it's just `PLATINUM`?

**Fix**:
```typescript
const tierMap = {
  'STANDARD': 'standard',
  'LUXE': 'luxe',
  'PLATINUM_EDITION': 'platinum'
};
const tier = tierMap[sku.customerCategory] || 'standard';
```

---

## Where Prices Come From

### Static (No Calculation)
- `ProductCard.tsx` → `product.base_price_per_100g_45cm`
- Catalog → Same as above

### Dynamic (Calculated)
- `ProductConfigurator.tsx` → Fetch `/api/price-matrix` → Calculate
- `sku-detail/[id]` → POST `/api/quote` → Get calculated price

### Cached (localStorage)
- `/app/kosik` → `localStorage.getItem('cart')` [WRONG]
- `/app/sku-kosik` → `localStorage.getItem('sku-cart')` [STALE RISK]

---

## File Map: Where Prices Are Used

```
DISPLAYING PRICES:
├─ ProductCard.tsx → base_price_per_100g_45cm
├─ CatalogCard.tsx → pricePerGramCzk or priceCzk
├─ ProductConfigurator.tsx → calculated from matrix
├─ /sku-detail/[id]/page.tsx → pricePerGramCzk
├─ /kosik/page.tsx → base_price (WRONG!)
└─ /sku-kosik/page.tsx → quote breakdown

CALCULATING PRICES:
├─ /lib/price-calculator.ts → Static formulas
├─ /lib/price-matrix-helper.ts → Matrix lookup
├─ /lib/stock.ts → Quote calculation
└─ ProductConfigurator.tsx → Frontend calculation

FETCHING PRICES:
├─ /api/price-matrix → Price matrix CRUD
├─ /api/quote → Quote calculation
├─ /api/admin/skus → SKU management
└─ /api/katalog/unified → Catalog API

CACHING PRICES:
├─ localStorage "cart" → BULK cart
├─ localStorage "sku-cart" → PIECE cart
└─ mockProducts → in-memory BULK items
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/price-matrix` | GET | Fetch matrix entries | Working |
| `/api/price-matrix` | POST | Create/update matrix | Working |
| `/api/quote` | POST | Calculate quote | Working |
| `/api/admin/skus` | GET | Fetch all SKUs | Working (inefficient) |
| `/api/admin/skus` | POST | Create SKU | Working |
| `/api/admin/skus/[id]` | GET | Fetch single SKU | MISSING |
| `/api/katalog/unified` | GET | Unified catalog | Partially working |

---

## Data Model Quick Reference

### Product
```
base_price_per_100g_45cm: number (per 100g @ 45cm)
tier: 'Standard' | 'LUXE' | 'Platinum edition'
category: 'nebarvene_panenske' | 'barvene_blond'
```

### SKU
```
pricePerGramCzk: number (per gram)
customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION'
saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G'
lengthCm: number (important for matrix lookup!)
```

### PriceMatrix
```
category: 'nebarvene' | 'barvene'
tier: 'standard' | 'luxe' | 'platinum'
lengthCm: number (35-90)
pricePerGramCzk: number
```

---

## Quote API Input/Output

**Input**:
```json
{
  "lines": [
    {
      "skuId": "abc123",
      "wantedGrams": 100,
      "ending": "KERATIN"
    }
  ]
}
```

**Output**:
```json
{
  "items": [
    {
      "grams": 100,
      "pricePerGram": 85.5,
      "lineTotal": 8550,
      "assemblyFeeType": "PER_GRAM",
      "assemblyFeeCzk": 5,
      "assemblyFeeTotal": 500,
      "lineGrandTotal": 9050
    }
  ],
  "total": 9050
}
```

---

## Assembly Fees

```
KERATIN: 5 Kč per gram
PASKY:   200 Kč flat
TRESSY:  150 Kč flat
NONE:    0 Kč
```

Example: 100g × 85.50 Kč/g + 5 Kč/g × 100g = 9,050 Kč

---

## Testing Checklist

- [ ] Add item to BULK cart, change length - does total update?
- [ ] Add item to BULK cart, change weight - does total update?
- [ ] Add item to SKU cart, update price matrix - does cart show new price?
- [ ] Check `/katalog` - do BULK items show?
- [ ] Check `/katalog` - do PIECE items show?
- [ ] Check `/sku-detail/[id]` - does quote calculate correctly?
- [ ] Change assembly fee - does quote update?

---

## Recommended Reading Order

1. `PRICE_FLOW_DIAGRAM.md` - Visual overview
2. `PRICE_DISPLAY_ANALYSIS.md` - Detailed technical analysis
3. Code files mentioned above

---

## Emergency Fixes (If You Have 30 Minutes)

1. **Fix BULK cart total**: Recalculate in CartContext.getTotalPrice()
2. **Validate prices at checkout**: Call `/api/quote` before order creation
3. **Fix mockProducts**: Seed with sample data or remove from catalog

