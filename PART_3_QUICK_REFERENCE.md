# CZĘŚĆ 3 - Quick Reference Guide

## Current State: READY FOR IMPLEMENTATION

The codebase has **95% of the infrastructure** needed for CZĘŚĆ 3 (Frontend Price Display).

---

## Key Findings

### Database (100% Ready)
```
PriceMatrix:  category, tier, lengthCm → pricePerGramCzk
SKU:          All fields present for price display
OrderItem:    Stores pricing snapshots
```

### Pages (60% Ready)
```
✅ SKU Detail:      /sku-detail/[id] - FULL IMPLEMENTATION
✅ Cart:            /sku-kosik - FULL IMPLEMENTATION  
⚠️  Catalog Cards:   /components/CatalogCard.tsx - TODO buttons
❌ Listing Pages:    Missing (need to create)
❌ Checkout:        Missing (need to create)
```

### APIs (100% Ready)
```
✅ GET /api/sku/public/[id]           - Fetch SKU details
✅ POST /api/quote                    - Calculate prices
✅ GET /api/price-matrix/lookup       - Direct lookup
✅ GET/POST /api/price-matrix         - Manage matrix
✅ POST /api/orders                   - Create orders
```

### Business Logic (100% Ready)
```
✅ Price matrix lookup with SKU fallback
✅ Assembly fee calculation (FLAT & PER_GRAM)
✅ BULK_G vs PIECE_BY_WEIGHT handling
✅ Tier mapping (STANDARD/LUXE/PLATINUM_EDITION)
✅ Category detection (barvene vs nebarvene)
```

---

## Critical File Locations

| What | Where |
|------|-------|
| **Prisma Schema** | `/prisma/schema.prisma` (lines 107-165) |
| **SKU Detail Page** | `/app/sku-detail/[id]/page.tsx` |
| **Cart Page** | `/app/sku-kosik/page.tsx` |
| **Card Component** | `/components/CatalogCard.tsx` |
| **Price Logic** | `/lib/stock.ts` |
| **Quote API** | `/app/api/quote/route.ts` |
| **SKU API** | `/app/api/sku/public/[id]/route.ts` |
| **Price Matrix API** | `/app/api/price-matrix/route.ts` |

---

## How Price Lookup Works

```
User Action → API Call → Price Matrix Lookup → Assembly Fee → Display

1. User views SKU
   ↓
2. GET /api/sku/public/[id]
   ↓
3. User selects ending & grams
   ↓
4. POST /api/quote
   ├─ Load price matrix from DB
   ├─ Create key: ${category}_${tier}_${lengthCm}
   ├─ Look up price (or fall back to SKU.pricePerGramCzk)
   ├─ Calculate assembly fee
   └─ Return breakdown
   ↓
5. Display quote to user
   ├─ Hair price: grams × pricePerGram
   ├─ Assembly fee: based on ending
   └─ Total: sum
```

---

## Assembly Fee Configuration

```javascript
NONE:    0 CZK (flat)
KERATIN: 5 CZK per gram
PASKY:   200 CZK flat
TRESSY:  150 CZK flat
```

---

## Price Matrix Key Format

```
${category}_${tier}_${lengthCm}

Examples:
- nebarvene_standard_40    → Nebarvené Standard, 40cm
- barvene_luxe_45          → Barvené LUXE, 45cm
- nebarvene_platinum_50    → Nebarvené Platinum, 50cm
```

---

## What's Implemented

### SKU Detail Page Features
- Loads SKU from database
- Shows all product information
- Ending selection UI (NONE, KERATIN, PASKY, TRESSY)
- Grams input for BULK_G items
- Quote calculation with "Spočítat cenu" button
- Full pricing breakdown display:
  - Hair: {grams}g × {price}/g = {total}
  - Assembly: {fee type} = {total}
  - Grand Total: {final price}
- Quantity selector (1+)
- Add to cart button
- Breadcrumb navigation

### Cart Page Features
- Loads cart from localStorage
- Shows each item with:
  - Name + tier badge
  - Configuration (grams, ending)
  - Pricing breakdown
- Item removal
- Cart total calculation
- Order creation with email
- Success page with order ID

### Components
- CatalogCard with BULK vs PIECE support
- Price formatting (Kč)
- Tier badges (Standard, LUXE, Platinum)
- Stock status indicators

---

## What Needs Development

### High Priority
1. [ ] Catalog listing pages with prices
2. [ ] Search results with prices
3. [ ] Checkout page (final confirmation)
4. [ ] Order history page

### Medium Priority
1. [ ] Real-time price updates as user changes config
2. [ ] Price comparison display (per 100g, per 45cm)
3. [ ] Price breakdown tooltips
4. [ ] Admin price matrix UI

### Low Priority
1. [ ] Price discount display (if applicable)
2. [ ] Price trend indicators
3. [ ] Bulk price import/export
4. [ ] Price audit trails

---

## Code Quality Notes

### Strengths
- Well-separated concerns (API, business logic, UI)
- Type-safe with TypeScript interfaces
- Proper error handling in quote logic
- Clean component structure
- Database constraints ensure data integrity

### Areas for Improvement
- CatalogCard has TODO comments on add-to-cart buttons
- No client-side price caching (could optimize)
- Price matrix key construction is string-based (fragile)
- Limited validation of price matrix entries

---

## Testing Checklist

Before CZĘŚĆ 3 launch, test:

```
[ ] Price matrix lookups with all category/tier/length combos
[ ] Assembly fee calculation for all ending types
[ ] Fallback to SKU price when matrix price missing
[ ] Cart with multiple items and different endings
[ ] Price persistence in orders
[ ] Edge cases: very large/small grams, missing lengths
[ ] Performance: price matrix with 1000+ entries
[ ] localStorage persistence across page refreshes
```

---

## Developer Quick Tips

### To fetch SKU:
```typescript
const res = await fetch(`/api/sku/public/${skuId}`);
const sku = await res.json();
```

### To calculate quote:
```typescript
const res = await fetch('/api/quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lines: [{ skuId, wantedGrams, ending }]
  })
});
const { items } = await res.json();
```

### To format price:
```typescript
new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price);
```

### To detect category:
```typescript
const shadeCode = parseInt(sku.shade, 10);
const category = (shadeCode >= 5 && shadeCode <= 10) 
  ? 'barvene' 
  : 'nebarvene';
```

### To detect tier:
```typescript
const tierMap = {
  'STANDARD': 'standard',
  'LUXE': 'luxe',
  'PLATINUM_EDITION': 'platinum',
};
const tier = tierMap[sku.customerCategory] || 'standard';
```

---

## Next Steps

1. Create listing pages with CatalogCard components
2. Implement search results page
3. Create checkout page with order review
4. Add price validation before order creation
5. Implement client-side caching for price matrix
6. Create admin UI for price matrix management
7. Write unit tests for quote calculation
8. Add integration tests for price flows
9. Performance test with large price matrices
10. Deploy and monitor price calculation performance

---

**Document Version:** 1.0
**Generated:** November 14, 2025
**Status:** Ready for Development
