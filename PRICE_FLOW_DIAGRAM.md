# Price Display Flow Diagram

## Complete Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER FACING PAGES                       │
└─────────────────────────────────────────────────────────────────┘

1. CATALOG PAGE (/app/katalog/page.tsx)
   ├─ BULK Products
   │  └─ /api/katalog/unified
   │     └─ mockProducts (empty!)
   │        └─ product.base_price_per_100g_45cm
   │           └─ Display: "1,234 Kč/100g"
   │
   └─ PIECE (SKU) Items
      └─ /api/katalog/unified
         └─ SKU database
            └─ Math.round(sku.pricePerGramCzk * weightG)
               └─ Display: "5,678 Kč"


2. PRODUCT DETAIL PAGE (/app/produkt/[slug]/page.tsx)
   └─ ProductConfigurator Component
      ├─ Load: /api/price-matrix
      │  └─ PriceMatrix DB
      │     └─ category + tier + lengthCm = pricePerGramCzk
      │
      └─ Calculate:
         └─ selectedLength × selectedWeight × pricePerGramCzk
            └─ Display: "X,XXX Kč"


3. SKU DETAIL PAGE (/app/sku-detail/[id]/page.tsx)
   ├─ Load: /api/admin/skus (fetches ALL SKUs! 🔴)
   │  └─ SKU DB
   │     └─ Display: sku.pricePerGramCzk
   │
   └─ Quote Calculation: POST /api/quote
      └─ /lib/stock.ts::quoteCartLines
         ├─ Load: /api/price-matrix
         │  └─ PriceMatrix DB
         │     └─ Try lookup: ${category}_${tier}_${lengthCm}
         │
         └─ Determine Price:
            ├─ IF matrix entry exists → use matrixPrice
            └─ ELSE → use sku.pricePerGramCzk
            
            Then:
            └─ Add Assembly Fee:
               ├─ KERATIN: pricePerGram × grams
               ├─ PASKY: 200 Kč flat
               ├─ TRESSY: 150 Kč flat
               └─ NONE: 0 Kč
            
            Result:
            └─ Store in localStorage: sku-cart
               └─ Save full quote breakdown


4. SKU CART PAGE (/app/sku-kosik/page.tsx)
   └─ Load: localStorage.getItem('sku-cart')
      └─ Display quoted prices (may be stale! 🔴)
         ├─ vlasy: pricePerGram × grams
         ├─ assembly: assemblyFeeTotal
         └─ total: lineGrandTotal


5. BULK CART PAGE (/app/kosik/page.tsx)
   └─ Load: localStorage.getItem('cart') via CartContext
      ├─ CartContext.getTotalPrice():
      │  └─ items.reduce((total, item) => {
      │     total + item.product.base_price_per_100g_45cm × qty
      │  })
      │
      └─ Display: incorrect price! 🔴
         └─ Only uses base price, ignores length/weight config


┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PAGES                                 │
└─────────────────────────────────────────────────────────────────┘

6. ADMIN PRICE MATRIX PAGE (/app/admin/cenik/page.tsx)
   └─ Manage: POST /api/price-matrix
      └─ Upsert PriceMatrix entries
         ├─ category (nebarvene/barvene)
         ├─ tier (standard/luxe/platinum)
         ├─ lengthCm
         └─ pricePerGramCzk


7. ADMIN SKU CONFIGURATOR (/app/admin/konfigurator-sku/page.tsx)
   ├─ VlasyXTab (BULK_G items)
   │  └─ Creates SKUs with:
   │     ├─ saleMode: BULK_G
   │     ├─ availableGrams
   │     ├─ minOrderG
   │     ├─ stepG
   │     └─ pricePerGramCzk (from matrix or override)
   │
   └─ PlatinumTab (PIECE_BY_WEIGHT items)
      └─ Creates SKUs with:
         ├─ saleMode: PIECE_BY_WEIGHT
         ├─ weightTotalG
         └─ pricePerGramCzk (from matrix or fixed)


┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER DETAIL                            │
└─────────────────────────────────────────────────────────────────┘

API: /api/quote (POST)
─────────────────
Input:
{
  lines: [
    {
      skuId: "abc123",
      wantedGrams: 100,        // for BULK_G
      ending: "KERATIN"
    }
  ]
}

Process:
1. Fetch SKU from DB
2. Fetch PriceMatrix entries
3. Build matrixKey = "${category}_${tier}_${lengthCm}"
4. Look up matrix entry
5. If found → use matrixPrice
   Else     → use sku.pricePerGramCzk
6. Calculate assembly fee based on ending
7. Return quote

Output:
{
  items: [
    {
      grams: 100,
      pricePerGram: 85.50,          // From matrix or SKU
      lineTotal: 8550,              // 100 × 85.50
      assemblyFeeType: "PER_GRAM",
      assemblyFeeCzk: 5,            // Keratin = 5/gram
      assemblyFeeTotal: 500,        // 5 × 100
      lineGrandTotal: 9050          // 8550 + 500
    }
  ],
  total: 9050
}

Status: WORKING ✓


API: /api/price-matrix (GET/POST)
──────────────────────────
GET /api/price-matrix?category=nebarvene&tier=standard
└─ Returns: Array<{
     id, category, tier, lengthCm, pricePerGramCzk
   }>

POST /api/price-matrix
└─ Input: { entries: [...] }
└─ Upserts into DB

Status: WORKING ✓


API: /api/admin/skus (GET)
────────────────────
GET /api/admin/skus
└─ Returns: ALL SKUs (inefficient! 🔴)
│
└─ Should be: GET /api/admin/skus/[id] (missing!)

Status: PARTIALLY WORKING ⚠


API: /api/katalog/unified (GET)
───────────────────────────
Returns:
{
  type: "BULK" | "PIECE",
  id, name, tier, shade, lengthCm,
  pricePerGramCzk (BULK) OR priceCzk (PIECE),
  inStock, priority
}

BULK path:  mockProducts (empty!)
PIECE path: SKU database

Status: PARTIALLY WORKING ⚠


┌─────────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                                │
└─────────────────────────────────────────────────────────────────┘

Product Table
─────────────
├─ id, name, category, tier
├─ base_price_per_100g_45cm     ← USED BY: ProductCard, Catalog
├─ in_stock
└─ variants []

SKU Table
─────────
├─ id, sku, name
├─ customerCategory (STANDARD/LUXE/PLATINUM_EDITION)
├─ saleMode (PIECE_BY_WEIGHT | BULK_G)
├─ pricePerGramCzk              ← USED BY: Quote API (fallback)
├─ weightTotalG (for PIECE)
├─ availableGrams (for BULK)
├─ minOrderG, stepG
├─ shade, shadeName, lengthCm, structure
├─ inStock, soldOut
└─ isListed, listingPriority

PriceMatrix Table
──────────────────
├─ id
├─ category (nebarvene/barvene)
├─ tier (standard/luxe/platinum)
├─ lengthCm
└─ pricePerGramCzk              ← USED BY: Quote API, ProductConfigurator


┌─────────────────────────────────────────────────────────────────┐
│                     CACHING ISSUES                              │
└─────────────────────────────────────────────────────────────────┘

localStorage Cache:
───────────────────

Key: "cart" (BULK products)
├─ Stored by: CartContext.tsx
├─ Content: Product + variant + quantity
├─ Price: base_price_per_100g_45cm (WRONG! 🔴)
│  └─ Doesn't account for configured length/weight
│
└─ Risk: Incorrect total calculation

Key: "sku-cart" (PIECE items)
├─ Stored by: /app/sku-detail/[id]/page.tsx
├─ Content: Full quote breakdown
│  ├─ pricePerGram
│  ├─ lineTotal
│  ├─ assemblyFeeTotal
│  └─ lineGrandTotal
│
└─ Risk: STALE PRICES 🔴
   └─ If admin updates price matrix after user adds to cart,
      user sees old price in cart
   └─ User pays old price even though prices changed


In-Memory Cache:
────────────────

mockProducts: /lib/mock-products.ts
├─ Status: EMPTY (all products removed)
├─ Used by: /api/katalog/unified (BULK items)
└─ Result: No BULK items display in catalog 🔴


┌─────────────────────────────────────────────────────────────────┐
│                     IDENTIFIED PROBLEMS                         │
└─────────────────────────────────────────────────────────────────┘

🔴 CRITICAL ISSUES:

1. BULK cart uses base_price (ignores configuration)
   ├─ File: CartContext.tsx line 99-101
   ├─ Impact: Shows wrong totals in /app/kosik
   └─ Fix: Recalculate at checkout using /api/quote

2. SKU cart has stale prices in localStorage
   ├─ File: /app/sku-kosik/page.tsx
   ├─ Impact: User sees old price if admin updates prices
   └─ Fix: Validate prices before checkout

3. mockProducts is empty (breaks BULK catalog)
   ├─ File: /lib/mock-products.ts
   ├─ Impact: No BULK items display in /katalog
   └─ Fix: Populate from database or manual seed


⚠ MEDIUM ISSUES:

4. SKU fetch inefficient (gets all SKUs)
   ├─ File: /app/sku-detail/[id]/page.tsx line 65
   ├─ Impact: Slow with many SKUs
   └─ Fix: Create /api/admin/skus/[id] endpoint

5. Tier mapping inconsistent
   ├─ File: /lib/stock.ts lines 88-101
   ├─ Issue: UPPERCASE vs lowercase mismatch
   └─ Fix: Normalize case before lookup

6. Catalog prices not validated by quote API
   ├─ File: /app/api/katalog/unified/route.ts line 89
   ├─ Issue: PIECE price calculated without validation
   └─ Fix: Call quote API for accurate price


ℹ LOW PRIORITY:

7. No price change notifications
8. No cart refresh mechanism
9. No price history tracking


┌─────────────────────────────────────────────────────────────────┐
│                     PRICE CALCULATION PATHS                     │
└─────────────────────────────────────────────────────────────────┘

PATH 1: Static Display (Fastest, Least Accurate)
─────────────────────────────────────────────────
ProductCard Component
  └─ product.base_price_per_100g_45cm
     └─ Display "1,234 Kč/100g"
     
Used by: Listing pages, product cards
Problem: Doesn't account for length/weight variations


PATH 2: Dynamic Calculation (Flexible)
──────────────────────────────────────
ProductConfigurator
  ├─ Fetch /api/price-matrix
  ├─ Select length × weight
  └─ Calculate: pricePerGram × grams
     └─ Display "X,XXX Kč"
     
Used by: Product detail pages
Problem: Two API calls, requires configuration


PATH 3: Quote Snapshot (Most Accurate, Slowest)
───────────────────────────────────────────────
SKU Detail Page
  ├─ Fetch SKU data
  ├─ POST /api/quote with config
  ├─ Quote API:
  │  ├─ Fetch price matrix
  │  ├─ Try matrix lookup
  │  └─ Add assembly fees
  └─ Store result in localStorage
     └─ Display full breakdown
     
Used by: SKU detail pages
Problem: Stale cache, multiple API calls


DECISION TREE:
──────────────

Is this a PRODUCT (BULK)?
├─ YES: Use ProductConfigurator + /api/price-matrix
│  └─ For detail pages
├─ NO: Is this a SKU (PIECE)?
   ├─ YES: Use Quote API + /api/quote
   │  └─ For detail pages or configurator
   └─ In Cart?
      ├─ YES: Validate price at checkout
      │  └─ Recalculate using /api/quote
      └─ NO: Display static price
         └─ May need validation later


┌─────────────────────────────────────────────────────────────────┐
│                     ASSEMBLY FEE LOGIC                          │
└─────────────────────────────────────────────────────────────────┘

Configuration: /lib/stock.ts (lines 11-18)

ASSEMBLY_FEE_CONFIG = {
  NONE:     { type: 'FLAT',     price: 0 },
  KERATIN:  { type: 'PER_GRAM', pricePerGram: 5 },     // 5 Kč/g
  PASKY:    { type: 'FLAT',     price: 200 },          // 200 Kč
  TRESSY:   { type: 'FLAT',     price: 150 },          // 150 Kč
}

Calculation:
FLAT:     assemblyFeeTotal = price (fixed)
PER_GRAM: assemblyFeeTotal = pricePerGram × grams

Example:
100g × 85.50 Kč = 8,550 Kč (vlasy)
+ 5 Kč/g × 100g = 500 Kč (KERATIN zakončení)
= 9,050 Kč total

