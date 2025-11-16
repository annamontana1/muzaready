# ČÁST 3 - Frontend Price Display Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │ SKU Detail Page  │         │  Cart Page       │             │
│  │ /sku-detail/[id]│         │  /sku-kosik      │             │
│  │                  │         │                  │             │
│  │  • Load SKU      │         │  • Load from     │             │
│  │  • Show details  │         │    localStorage  │             │
│  │  • Input grams   │         │  • Show items    │             │
│  │  • Select ending │         │  • Remove items  │             │
│  │  • Calculate Q   │         │  • Show total    │             │
│  │  • Add to cart   │         │  • Create order  │             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                            │                       │
│  ┌────────▼──────────────────────────────┐                     │
│  │   localStorage                        │                     │
│  │   sku-cart: CartItem[]                │                     │
│  │   ├─ skuId, grams, pricePerGram      │                     │
│  │   ├─ ending, assemblyFeeType         │                     │
│  │   └─ lineGrandTotal, addedAt         │                     │
│  └────────┬──────────────────────────────┘                     │
│           │                                                     │
│  ┌────────▼──────────────────────────────┐                     │
│  │    CatalogCard Component              │                     │
│  │    /components/CatalogCard.tsx        │                     │
│  │                                       │                     │
│  │  BULK Items:                          │                     │
│  │  • Shows pricePerGramCzk as "od.../g" │                     │
│  │  • "Do košíku" → add to cart          │                     │
│  │                                       │                     │
│  │  PIECE Items:                         │                     │
│  │  • Shows fixed priceCzk               │                     │
│  │  • Links to /sku-detail               │                     │
│  └────────┬──────────────────────────────┘                     │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
            │ API Calls
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                       API LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┐    ┌──────────────────────────┐  │
│  │ GET /api/sku/public/[id] │    │ POST /api/quote          │  │
│  │                          │    │                          │  │
│  │ Returns:                 │    │ Request:                 │  │
│  │ ├─ id, sku, name         │    │ ├─ skuId                 │  │
│  │ ├─ lengthCm              │    │ ├─ wantedGrams           │  │
│  │ ├─ pricePerGramCzk       │    │ └─ ending                │  │
│  │ ├─ weightTotalG          │    │                          │  │
│  │ ├─ availableGrams        │    │ Returns:                 │  │
│  │ ├─ saleMode              │    │ ├─ grams                 │  │
│  │ └─ customerCategory      │    │ ├─ pricePerGram          │  │
│  └──────────────────────────┘    │ ├─ lineTotal             │  │
│                                  │ ├─ assemblyFeeTotal      │  │
│  ┌──────────────────────────┐    │ └─ lineGrandTotal        │  │
│  │ POST /api/orders         │    └──────────────────────────┘  │
│  │                          │                                   │
│  │ Request:                 │    ┌──────────────────────────┐  │
│  │ ├─ email                 │    │ GET /api/price-matrix/   │  │
│  │ └─ items[]               │    │     lookup               │  │
│  │                          │    │                          │  │
│  │ Returns:                 │    │ Query params:            │  │
│  │ └─ orderId               │    │ ├─ line (tier)           │  │
│  └──────────────────────────┘    │ ├─ segment (category)    │  │
│                                  │ └─ lengthCm              │  │
│                                  │                          │  │
│                                  │ Returns:                 │  │
│                                  │ ├─ found: boolean        │  │
│                                  │ ├─ pricePerGramCzk       │  │
│                                  │ └─ pricePer100g          │  │
│                                  └──────────────────────────┘  │
│                                                                 │
└───────────┬─────────────────────────────────────────────────────┘
            │
            │ Business Logic (lib/)
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  stock.ts - Main Quote Logic                            │  │
│  │                                                          │  │
│  │  quoteCartLines(lines)                                  │  │
│  │  ├─ Load price matrix (getPriceMatrixLookup)            │  │
│  │  ├─ For each SKU:                                       │  │
│  │  │  ├─ Determine category from shade (1-4 vs 5-10)      │  │
│  │  │  ├─ Determine tier from customerCategory             │  │
│  │  │  ├─ Build matrix key: ${category}_${tier}_${length}  │  │
│  │  │  ├─ Lookup price (fallback to SKU.pricePerGramCzk)   │  │
│  │  │  ├─ Calculate grams (PIECE vs BULK)                  │  │
│  │  │  ├─ lineTotal = pricePerGram × grams                 │  │
│  │  │  ├─ Calculate assembly fee (calculateAssemblyFee)    │  │
│  │  │  └─ lineGrandTotal = lineTotal + assemblyFeeTotal    │  │
│  │  └─ Return items[] + total                              │  │
│  │                                                          │  │
│  │  Assembly Fee Config:                                   │  │
│  │  ├─ NONE: 0 CZK (flat)                                  │  │
│  │  ├─ KERATIN: 5 CZK/gram                                 │  │
│  │  ├─ PASKY: 200 CZK (flat)                               │  │
│  │  └─ TRESSY: 150 CZK (flat)                              │  │
│  │                                                          │  │
│  │  Helper Functions:                                      │  │
│  │  ├─ validateBulkChoice(grams, min, step) → boolean      │  │
│  │  ├─ calculateAssemblyFee(ending, grams) → fee object    │  │
│  │  └─ getPriceMatrixLookup() → Map<key, price>           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  price-matrix-helper.ts - Utility Functions             │  │
│  │                                                          │  │
│  │  ├─ getPriceFromMatrix(category, tier, length)          │  │
│  │  ├─ calculatePrice(pricePerGram, grams)                 │  │
│  │  ├─ calculateBulkPrice(ppg, grams, finishingFee)        │  │
│  │  ├─ calculatePlatinumPrice(ppg, weight)                 │  │
│  │  ├─ formatPrice(price) → "xxx CZK"                      │  │
│  │  └─ generateUniqueSKU(baseSKU, existing[])              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└───────────┬─────────────────────────────────────────────────────┘
            │
            │ Database Queries
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                    DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PriceMatrix Table                                       │  │
│  │                                                          │  │
│  │  Unique Constraint: (category, tier, lengthCm)           │  │
│  │  Index: (category, tier)                                 │  │
│  │                                                          │  │
│  │  Schema:                                                 │  │
│  │  ├─ id: String (PK)                                      │  │
│  │  ├─ category: String      (nebarvene / barvene)          │  │
│  │  ├─ tier: String          (standard / luxe / platinum)   │  │
│  │  ├─ lengthCm: Int         (40, 45, 50, etc)              │  │
│  │  ├─ pricePerGramCzk: Decimal (150.50, 200.00, etc)       │  │
│  │  └─ timestamps                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SKU Table (Relevant Fields)                             │  │
│  │                                                          │  │
│  │  ├─ id: String (PK)                                      │  │
│  │  ├─ sku: String (unique SKU code)                        │  │
│  │  ├─ name: String                                         │  │
│  │  ├─ shade: String       (1-4 = nebarvene, 5-10 = bare)  │  │
│  │  ├─ lengthCm: Int       (must match priceMatrix)         │  │
│  │  ├─ saleMode: Enum      (PIECE_BY_WEIGHT / BULK_G)      │  │
│  │  ├─ pricePerGramCzk: Int (fallback if not in matrix)     │  │
│  │  ├─ customerCategory: Enum (STANDARD/LUXE/PLATINUM)      │  │
│  │  │                                                       │  │
│  │  │ For PIECE_BY_WEIGHT:                                  │  │
│  │  ├─ weightTotalG: Int                                    │  │
│  │  │                                                       │  │
│  │  │ For BULK_G:                                           │  │
│  │  ├─ availableGrams: Int                                  │  │
│  │  ├─ minOrderG: Int                                       │  │
│  │  └─ stepG: Int                                           │  │
│  │                                                          │  │
│  │  ├─ inStock: Boolean                                     │  │
│  │  ├─ isListed: Boolean                                    │  │
│  │  └─ listingPriority: Int                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OrderItem Table (Stores Price Snapshots)                │  │
│  │                                                          │  │
│  │  ├─ id: String (PK)                                      │  │
│  │  ├─ orderId: String (FK to Order)                        │  │
│  │  ├─ skuId: String (FK to SKU)                            │  │
│  │  ├─ grams: Int                                           │  │
│  │  ├─ pricePerGram: Int                                    │  │
│  │  ├─ lineTotal: Int                                       │  │
│  │  ├─ ending: EndingOption (NONE/KERATIN/PASKY/TRESSY)    │  │
│  │  ├─ assemblyFeeType: String (FLAT / PER_GRAM)            │  │
│  │  ├─ assemblyFeeCzk: Int                                  │  │
│  │  ├─ assemblyFeeTotal: Int                                │  │
│  │  ├─ nameSnapshot: String (price captured at order time)  │  │
│  │  └─ createdAt: DateTime                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────┐
│  User views SKU     │
└──────────┬──────────┘
           │
           ▼
   GET /api/sku/public/[id]
   (Fetch SKU details)
           │
           ▼
   ┌───────────────────────┐
   │ SKU Detail Page       │
   │ Display info          │
   │ Show base price       │
   └───────────┬───────────┘
               │
       ┌───────┴────────┐
       │ User Input:    │
       │ • Select ending│
       │ • Enter grams  │
       └───────┬────────┘
               │
               ▼
   ┌────────────────────────────┐
   │ User clicks                │
   │ "Spočítat cenu"            │
   └────────────┬───────────────┘
                │
                ▼
       POST /api/quote
       {
         lines: [{
           skuId: "...",
           wantedGrams: 100,
           ending: "KERATIN"
         }]
       }
                │
                ▼
   ┌──────────────────────────────┐
   │ Quote API Handler            │
   │                              │
   │ 1. Load Price Matrix         │
   │ 2. For each SKU:             │
   │    • Detect category & tier  │
   │    • Build matrix key        │
   │    • Lookup price            │
   │    • Fallback to SKU price   │
   │ 3. Calculate assembly fee    │
   │ 4. Return breakdown          │
   └────────────┬─────────────────┘
                │
                ▼
       ┌─────────────────────┐
       │ Price Breakdown:    │
       │ • Hair: 100g × 200  │
       │ • Assembly: 500     │
       │ • Total: 20500      │
       └──────────┬──────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ SKU Detail Page              │
   │ Display Quote & Quantity     │
   │ "Přidat do košíku" button    │
   └──────────┬───────────────────┘
              │
              ▼
   User clicks "Přidat do košíku"
              │
              ▼
   Store in localStorage:
   sku-cart: CartItem[]
              │
              ▼
   Navigate to /sku-kosik
              │
              ▼
   ┌──────────────────────────────┐
   │ Cart Page                    │
   │ Load from localStorage       │
   │ Display all items            │
   │ Show totals                  │
   │ Email input                  │
   │ "Pokračovat k platbě" button │
   └──────────┬───────────────────┘
              │
              ▼
   User clicks "Pokračovat k platbě"
              │
              ▼
       POST /api/orders
       {
         email: "user@example.cz",
         items: [...]
       }
              │
              ▼
   ┌──────────────────────────────┐
   │ Orders API Handler           │
   │                              │
   │ 1. Create Order record       │
   │ 2. For each item:            │
   │    • Create OrderItem        │
   │    • Store price snapshot    │
   │ 3. Return orderId            │
   │ 4. Send confirmation email   │
   │ 5. Redirect to payment       │
   └──────────┬───────────────────┘
              │
              ▼
   Success page with order ID
   (Clear localStorage)
              │
              ▼
   Redirect to GoPay payment
```

---

## Key Technical Details

### Price Matrix Lookup Strategy

1. **Category Detection**
   - From SKU.shade field
   - Rules: 1-4 = nebarvene, 5-10 = barvene

2. **Tier Detection**
   - From SKU.customerCategory field
   - Maps: STANDARD→standard, LUXE→luxe, PLATINUM_EDITION→platinum

3. **Lookup Key Construction**
   - Format: `${category}_${tier}_${lengthCm}`
   - Example: `nebarvene_standard_40`

4. **Price Lookup**
   - Query PriceMatrix with unique constraint: (category, tier, lengthCm)
   - If not found: Fall back to SKU.pricePerGramCzk
   - Return price as Decimal

5. **Assembly Fee Calculation**
   - Based on EndingOption enum
   - FLAT fees: apply once per item
   - PER_GRAM fees: multiply by grams

---

## Error Handling Flow

```
Price Lookup Error Scenarios:
├─ Price matrix entry missing
│  └─ Fall back to SKU.pricePerGramCzk
├─ SKU not found
│  └─ Throw "SKU nenalezeno"
├─ Insufficient grams available
│  └─ Throw "Máme jen {available}g, ale chceš {wanted}g"
├─ Invalid bulk quantity
│  └─ Throw "Zvol množství ≥ {min}g a po {step}g kroku"
└─ PIECE already sold out
   └─ Throw "Culík bereits není dostupný"
```

---

## Performance Considerations

1. **Price Matrix Caching**
   - Load once per quote calculation
   - Currently no client-side caching
   - Recommended: Cache for 5-10 minutes

2. **SKU Queries**
   - Indexed by id (primary key)
   - Single fetch per SKU detail page

3. **Database Indexes**
   - PriceMatrix: index on (category, tier) for filtered queries
   - PriceMatrix: unique constraint on (category, tier, lengthCm)

4. **API Response Size**
   - SKU API: ~2KB per SKU
   - Quote API: ~1KB per item
   - Price Matrix: ~100KB full load (1000 entries)

---

**Architecture Version:** 1.0
**Last Updated:** November 14, 2025
**Status:** Ready for Implementation
