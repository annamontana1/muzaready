# CURSOR HANDOFF SUMMARY - VlasyX Standard, LUXE & Platinum

## Overview

Two complete Czech specifications have been created for Cursor implementation. All requirements have been validated, verified for architectural conflicts, and enriched with concrete examples and test flows.

**Status**: ✅ Ready for implementation

---

## 📁 Specification Files

### 1. **Standard & LUXE Specification** (VlasyX - bulk products)
**Location**: `/tmp/cursor-zadani-standard-luxe.md`

**What it covers**:
- Catalog card structure (product name without length, structure display, pricing)
- Product grouping logic (GROUP BY: `customerCategory + shadeName + structure`)
- Detail page customization (length dropdown, gram spinner, ending selection)
- Dynamic pricing with ending fees
- Stock management and checkout deduction
- Fallback priority for quick-add
- Concrete 6-SKU example showing how they group into 4 catalog cards
- 5 test flows with expected behavior

**Key Specifications**:
- **Min grams**: 50g (global minimum)
- **Max grams**: `availableGrams` of selected lengthCm (dynamic)
- **Gram step**: +10g increments via scroll/spinner UI
- **Catalog card price display**: "Cena za 100g / {shortestLengthWithStock}cm"
- **Quick-add from card**: 100g + shortest length with ≥100g stock
- **Structure field**: Read-only display in detail page

### 2. **Platinum Specification** (VlasyY - piece products)
**Location**: `/tmp/cursor-platinum-formaty.md`

**What it covers**:
- Unified name format across all surfaces
- Automatic name generation in admin (no manual typing)
- Automatic slug generation (read-only)
- Product display on catalog cards with inStock logic
- WeightGrams support in database
- Admin helper functions
- 3 test SKU examples
- Step-by-step implementation guide

**Key Format**:
```
Name: {lengthCm} cm · Platinum · odstín #{shade} · {weightGrams} g
Slug: platinum-odstin-{shade}-{lengthCm}cm-{weightGrams}g
```

**Example**:
```
Name: 60 cm · Platinum · odstín #6 · 168 g
Slug: platinum-odstin-6-60cm-168g
```

---

## 🏗️ Architecture Validation

**Finding**: ✅ Both Standard/LUXE and Platinum can coexist without breaking existing code

### Database Status
- ✅ `Sku.structure` — already exists
- ✅ `Sku.lengthCm` — already exists
- ✅ `Sku.availableGrams` — already exists
- ✅ `Sku.pricePerGramCzk` — already exists
- ✅ `Sku.customerCategory` (STANDARD, LUXE, PLATINUM_EDITION) — already exists
- ✅ `OrderItem.grams`, `pricePerGram`, `ending` — already exist
- ✅ `Sku.weightGrams` — already exists

**Migration Required**: ❌ NONE

### API Status
- ✅ `/api/katalog/unified` — returns `structure` field, needs aggregation logic only
- ✅ `/api/admin/skus` — accepts `structure` parameter
- ✅ `/api/checkout` — handles `grams` and `ending` fields

---

## 🔄 Implementation Breakdown

### **Phase 1: Standard & LUXE (Backend)**

**File**: `/app/api/katalog/unified/route.ts`

Updates needed:
1. Add SKU aggregation logic (GROUP BY: `customerCategory + shadeName + structure`)
2. For each group, find shortest lengthCm with ≥100g stock
3. Return `shortestLength`, `shortestLengthPrice` (price for 100g)
4. Handle fallback: if no length has ≥100g, return `specialPrice: "Individuální cena"`

**File**: `/app/api/checkout/route.ts`

Updates needed:
1. Validate: `availableGrams >= requestedGrams`
2. Deduct: `sku.availableGrams -= requestedGrams`
3. Store in OrderItem: `grams`, `lengthCm`, `pricePerGram`, `ending`

### **Phase 2: Standard & LUXE (Frontend)**

**File**: `/components/CatalogCard.tsx`

Updates needed:
1. Display `structure` field
2. Display "Cena za 100g / {shortestLength}cm"
3. "Do košíku" → adds 100g + shortestLength + NONE ending

**File**: `/app/sku-detail/[id]/page.tsx` (new or update)

Updates needed:
1. Dropdown for lengthCm (only lengths with ≥100g stock)
2. Scroll/spinner input for grams (min: 50g, max: availableGrams of selected length, step: +10g)
3. Dropdown for ending (KERATIN, PÁSKY, TRESSY, NONE)
4. Live price calculation with ending fees
5. Show price breakdown: base + fee = total
6. "Přidat do košíku" button (enabled when all selections made)
7. Update max grams dynamically when lengthCm changes

**Pricing Calculation**:
```javascript
const ENDING_FEES = {
  'NONE': { fee: 0, feeType: 'flat' },
  'KERATIN': { fee: 5, feeType: 'per_gram' },      // +5 Kč/g
  'PASKY': { fee: 200, feeType: 'flat' },          // +200 Kč fixně
  'TRESSY': { fee: 150, feeType: 'flat' }          // +150 Kč fixně
};

const calculatePrice = (grams, pricePerGram, endingType) => {
  const basePrice = grams * pricePerGram;
  if (!ENDING_FEES[endingType]) return basePrice;
  const { fee, feeType } = ENDING_FEES[endingType];
  return feeType === 'per_gram'
    ? basePrice + (grams * fee)
    : basePrice + fee;
};
```

### **Phase 3: Platinum (Backend)**

**Status**: ✅ No backend changes needed

Platinum already supports:
- `customerCategory = PLATINUM_EDITION`
- `weightGrams` field in Sku model
- Piece-by-weight sales mode

### **Phase 4: Platinum (Frontend)**

**File**: `/app/admin/konfigurator-sku/page.tsx` (admin panel)

Updates needed:
1. Add helper functions:
   - `generatePlatinumName(lengthCm, shade, weightGrams)`
   - `generatePlatinumSlug(lengthCm, shade, weightGrams)`
2. When admin selects Platinum line:
   - Show inputs: lengthCm, shade (1-10), weightGrams
   - Auto-generate name and slug as fields change
   - Show live preview of generated name
   - Make slug read-only and auto-generated

3. When saving: store auto-generated name and slug

**File**: `/components/CatalogCard.tsx` (Platinum display)

Updates needed (if not already done):
1. Display Platinum products with full name: "60 cm · Platinum · odstín #6 · 168 g"
2. If `inStock === true` → "🛒 Do košíku"
3. If `inStock === false` → "❌ Dočasně vyprodáno" + "📧 Zadat poptávku"

**File**: `/app/sku-detail/[id]/page.tsx` (Platinum detail)

Updates needed (if not already done):
1. Display Platinum product with full name
2. Show lengthCm, weightGrams, price
3. Dropdown for ending selection
4. Dynamic price calculation with ending fees
5. "Přidat do košíku" button

---

## 📋 Key Concepts to Remember

### Seskupení (Grouping) Example
```
6 SKUs in database:

SKU #1: Standard, Platinum blond, WAVES, 45cm, 140g
SKU #2: Standard, Platinum blond, WAVES, 50cm, 600g
SKU #3: Standard, Platinum blond, WAVES, 55cm, 700g
SKU #4: Standard, Černá, WAVES, 45cm, 145g
SKU #5: Standard, Platinum blond, STRAIGHT, 50cm, 150g
SKU #6: LUXE, Platinum blond, WAVES, 45cm, 120g

GROUP BY: customerCategory + shadeName + structure

Result: 4 CARDS

1. Standard – Platinum blond · Vlnky (SKU #1, #2, #3)
   Shortest with ≥100g: 45cm (140g)
   Available lengths: 45cm (140g), 50cm (600g), 55cm (700g)

2. Standard – Černá · Vlnky (SKU #4)
   Shortest with ≥100g: 45cm (145g)

3. Standard – Platinum blond · Rovné (SKU #5)
   Shortest with ≥100g: 50cm (150g)

4. LUXE – Platinum blond · Vlnky (SKU #6)
   Shortest with ≥100g: 45cm (120g)
```

### Dynamic Max Grams
When customer selects a length in detail page:
- 45cm selected → max = 140g
- 50cm selected → max = 600g
- 55cm selected → max = 700g

This changes as customer switches lengths.

### Fallback Priority
When quick-adding from card, select shortest available length:
**Order**: 45 → 40 → 50 → 55 → 60 → 65 → 70 → 75 → 80

Only consider lengths with ≥100g stock.
If none have ≥100g → show "Individuální cena" instead of "Do košíku"

---

## ✅ Test Flows

### Standard/LUXE Tests
1. **Katalog zobrazení** — Verify card shows correct name, structure, price
2. **Quick add** — Verify 100g + shortest length added to cart
3. **Detail customization** — Verify dropdown/spinner/ending selection works
4. **Dynamic max** — Verify max grams updates when length changes
5. **Stock deduction** — Verify grams subtracted from database after checkout

### Platinum Tests
1. **Admin auto-generation** — Name/slug auto-generate as fields change
2. **Catalog inStock=true** — Card shows "🛒 Do košíku"
3. **Catalog inStock=false** — Card shows "❌ Vyprodáno" + "📧 Zadat poptávku"
4. **Detail view** — Full name, price, ending selection shown correctly
5. **Build pass** — `npm run build` completes without errors

---

## 🚀 Getting Started for Cursor

1. **Read the specifications first**:
   - `/tmp/cursor-zadani-standard-luxe.md` (Standard/LUXE)
   - `/tmp/cursor-platinum-formaty.md` (Platinum)

2. **Start with Standard/LUXE backend** (API aggregation and checkout logic)

3. **Then Standard/LUXE frontend** (CatalogCard + detail page)

4. **Finally Platinum** (admin auto-generation + display)

5. **Run tests** according to test flows in each specification

6. **Build and verify**: `npm run build` must pass

---

## 📞 Quick Reference

**No Database Migrations Needed**: ✅ All fields already exist

**No Breaking Changes**: ✅ Existing Platinum/products unaffected

**Zero New Dependencies**: ✅ Uses existing Prisma, React, TypeScript

**Estimated Effort**: 3-4 hours implementation + 1 hour testing

---

## Files Created by Analysis

- ✅ `/Users/annaz/Desktop/muzaready/ANALIZA_FEASIBILITY_STANDARD_LUXE.md` — Detailed feasibility analysis
- ✅ `/tmp/cursor-zadani-standard-luxe.md` — Standard/LUXE specification (Czech)
- ✅ `/tmp/cursor-platinum-formaty.md` — Platinum specification (Czech)
- ✅ This summary document

All specifications are complete, verified, and ready for implementation.
