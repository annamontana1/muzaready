# ČÁST 3 - Frontend Price Display: Codebase Analysis

## Executive Summary

The codebase has a **well-established foundation** for implementing frontend price display functionality. Most of the required database models, APIs, and component infrastructure are already in place. The SKU-based system is fully operational with a functional detail page and cart system.

---

## 1. PRISMA SCHEMA MODELS

### ✅ PriceMatrix Model EXISTS
**Location:** `/Users/annaz/Desktop/muzaready/prisma/schema.prisma` (lines 153-165)

```prisma
model PriceMatrix {
  id              String   @id @default(cuid())
  category        String
  tier            String
  lengthCm        Int
  pricePerGramCzk Decimal
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([category, tier, lengthCm])
  @@index([category, tier])
  @@map("price_matrix")
}
```

**Status:** Fully implemented with:
- Unique constraint on (category, tier, lengthCm)
- Index on (category, tier) for efficient lookups
- Decimal type for pricePerGramCzk (proper for financial data)

---

### ✅ SKU Model EXISTS
**Location:** `/Users/annaz/Desktop/muzaready/prisma/schema.prisma` (lines 107-138)

```prisma
model Sku {
  id               String            @id @default(cuid())
  sku              String            @unique
  name             String?
  productId        String?
  shade            String?
  shadeName        String?
  shadeHex         String?
  lengthCm         Int?
  structure        String?
  ending           String?
  ribbonColor      String?
  saleMode         SaleMode          // PIECE_BY_WEIGHT | BULK_G
  pricePerGramCzk  Int               // Price per gram in CZK
  weightTotalG     Int?              // Total weight for PIECE_BY_WEIGHT
  soldOut          Boolean           @default(false)
  availableGrams   Int?              // Available grams for BULK_G
  minOrderG        Int?              // Minimum order grams for BULK_G
  stepG            Int?              // Step grams for BULK_G
  inStock          Boolean           @default(false)
  inStockSince     DateTime?
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  customerCategory CustomerCategory? // STANDARD | LUXE | PLATINUM_EDITION
  isListed         Boolean           @default(false)
  listingPriority  Int?
  reservedUntil    DateTime?
  orderItems       OrderItem[]
  movements        StockMovement[]

  @@map("skus")
}
```

**Key fields for ČÁST 3:**
- ✅ `lengthCm` - Hair length in centimeters
- ✅ `pricePerGramCzk` - Price per gram (fallback if not in matrix)
- ✅ `weightGrams` → stored as `weightTotalG` for PIECE_BY_WEIGHT items
- ✅ `customerCategory` - Tier mapping (STANDARD/LUXE/PLATINUM_EDITION)
- ✅ `shade` - Used for category detection (barvene vs nebarvene)
- ✅ `structure` - Hair structure info

**Note:** Fields `type`, `line`, `segment`, `defaultG`, `defaultLengthCm` are NOT in the SKU model. These are NOT needed - the system uses:
- `saleMode` instead of `type` (PIECE_BY_WEIGHT vs BULK_G)
- `customerCategory` instead of `line` (STANDARD/LUXE/PLATINUM_EDITION)
- `shade` for segment detection (1-4 = nebarvene, 5-10 = barvene)
- `minOrderG` instead of `defaultG`
- `lengthCm` instead of `defaultLengthCm`

---

## 2. SKU DETAIL PAGE

**Location:** `/Users/annaz/Desktop/muzaready/app/sku-detail/[id]/page.tsx`

### Current Implementation:
- ✅ Full client-side component (use client)
- ✅ Loads SKU via `/api/sku/public/{id}`
- ✅ Shows all SKU details with proper formatting
- ✅ Handles both PIECE_BY_WEIGHT and BULK_G sale modes
- ✅ Configuration UI for:
  - Ending selection (NONE, KERATIN, PASKY, TRESSY)
  - Grams input for BULK_G items
- ✅ Quote calculation via `/api/quote` endpoint
- ✅ Full pricing breakdown display including assembly fees
- ✅ Add to cart functionality (stores in localStorage with timestamps)
- ✅ Quantity selector for multiple units
- ✅ Breadcrumb navigation
- ✅ Stock information display

### Price Display Features:
1. **SKU Base Price:** Shows `pricePerGramCzk` formatted as currency per gram
2. **Quote System:** 
   - Calculates price via `/api/quote` API
   - Displays breakdown: Hair + Assembly Fee = Total
   - Uses `formatPrice()` utility for CZK formatting
3. **Assembly Fee Handling:**
   - KERATIN: 5 CZK per gram (PER_GRAM)
   - PASKY: 200 CZK flat (FLAT)
   - TRESSY: 150 CZK flat (FLAT)
   - NONE: 0 CZK

### What EXISTS for Price Display:
```javascript
// Quote structure returned from /api/quote
{
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  assemblyFeeType: string;
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;
}
```

---

## 3. CATALOG CARD COMPONENT

**Location:** `/Users/annaz/Desktop/muzaready/components/CatalogCard.tsx`

### Current Implementation:
- ✅ Unified card for both BULK and PIECE items
- ✅ Props interface with clear type discrimination

```typescript
interface CatalogCardProps {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string;
  name: string;
  tier: string;
  shade?: number;
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightGrams?: number;        // For PIECE items
  pricePerGramCzk?: number; // BULK: price per gram
  priceCzk?: number;        // PIECE: fixed price
  inStock: boolean;
  imageUrl?: string;
}
```

### Price Display:
- **BULK Items:** Shows `od {pricePerGramCzk}/g` (from... per gram)
- **PIECE Items:** Shows fixed `priceCzk` or "Cena na dotaz"
- Uses `priceCalculator.formatPrice()` for formatting

### Current Limitations:
- BULK items: "Do košíku" button has TODO comment (not fully implemented)
- PIECE items: "Do košíku" button also has TODO comment
- NO direct price calculation on card - redirects to detail page or configurator

---

## 4. CART PAGE (SKU Cart)

**Location:** `/Users/annaz/Desktop/muzaready/app/sku-kosik/page.tsx`

### Current Implementation:
- ✅ Loads cart from localStorage
- ✅ Displays full item details:
  - SKU name + category badge
  - Grams, price per gram, ending type
  - Pricing breakdown (Hair + Assembly Fee = Total)
- ✅ Item removal and cart clearing
- ✅ Order total calculation
- ✅ Email input validation
- ✅ Order creation via `/api/orders` endpoint
- ✅ Success page with order ID

### Price Display in Cart:
```
Item Details:
├── Gramy: {grams}g
├── Cena za 1g: {formatPrice(pricePerGram)}
├── Zakončení: {ending label}
└── Pricing Breakdown:
    ├── Vlasy: {formatPrice(lineTotal)}
    ├── Zakončení: {formatPrice(assemblyFeeTotal)} [if > 0]
    └── Celkem za 1 ks: {formatPrice(lineGrandTotal)}
```

---

## 5. API ENDPOINTS FOR PRICE HANDLING

### ✅ 5.1 GET /api/sku/public/[id]
**Location:** `/Users/annaz/Desktop/muzaready/app/api/sku/public/[id]/route.ts`

**Purpose:** Fetch public SKU details (no auth required)
**Used by:** SKU detail page (`/app/sku-detail/[id]/page.tsx`)

**Response:**
```json
{
  "id": "string",
  "sku": "string",
  "name": "string | null",
  "customerCategory": "STANDARD | LUXE | PLATINUM_EDITION",
  "shade": "string | null",
  "shadeName": "string | null",
  "lengthCm": "number | null",
  "structure": "string | null",
  "saleMode": "PIECE_BY_WEIGHT | BULK_G",
  "pricePerGramCzk": "number",
  "weightTotalG": "number | null",
  "availableGrams": "number | null",
  "minOrderG": "number | null",
  "stepG": "number | null",
  "inStock": "boolean",
  "soldOut": "boolean"
}
```

---

### ✅ 5.2 POST /api/quote
**Location:** `/Users/annaz/Desktop/muzaready/app/api/quote/route.ts`

**Purpose:** Calculate quote for cart items with price matrix lookup

**Request:**
```json
{
  "lines": [
    {
      "skuId": "string",
      "wantedGrams": "number (optional, for BULK_G)",
      "ending": "NONE | KERATIN | PASKY | TRESSY"
    }
  ]
}
```

**Response:**
```json
{
  "items": [
    {
      "sku": "SKU object",
      "grams": "number",
      "pricePerGram": "number (from matrix or SKU fallback)",
      "lineTotal": "number (grams * pricePerGram)",
      "ending": "string",
      "assemblyFeeType": "FLAT | PER_GRAM",
      "assemblyFeeCzk": "number",
      "assemblyFeeTotal": "number",
      "lineGrandTotal": "number (lineTotal + assemblyFeeTotal)",
      "snapshotName": "string"
    }
  ],
  "total": "number"
}
```

**Logic in `/lib/stock.ts`:**
- Loads price matrix via `getPriceMatrixLookup()`
- For each SKU, determines category and tier from SKU data
- Looks up price in matrix using: `${category}_${tier}_${lengthCm}`
- Falls back to `sku.pricePerGramCzk` if not found in matrix
- Calculates assembly fees based on ending type
- Returns detailed item breakdown

---

### ✅ 5.3 GET /api/price-matrix/lookup
**Location:** `/Users/annaz/Desktop/muzaready/app/api/price-matrix/lookup/route.ts`

**Purpose:** Look up price from matrix by line/segment/length

**Parameters:**
```
GET /api/price-matrix/lookup?line=STANDARD&segment=NEBARVENE&lengthCm=40
```

**Response (if found):**
```json
{
  "found": true,
  "pricePerGramCzk": "number",
  "pricePer100g": "number"
}
```

**Note:** This endpoint uses different parameter names:
- `line` → maps to tier (STANDARD → standard, LUXE → luxe, PLATINUM → platinum)
- `segment` → maps to category (NEBARVENE → nebarvene, BARVENE → barvene)
- `lengthCm` → length in cm

---

### ✅ 5.4 GET /api/price-matrix (Bulk read)
**Location:** `/Users/annaz/Desktop/muzaready/app/api/price-matrix/route.ts`

**Purpose:** Get all price matrix entries with optional filters

**Parameters:**
```
GET /api/price-matrix?category=nebarvene&tier=standard
```

**Response:**
```json
[
  {
    "id": "string",
    "category": "string",
    "tier": "string",
    "lengthCm": "number",
    "pricePerGramCzk": "Decimal"
  }
]
```

---

### ✅ 5.5 POST /api/price-matrix (Bulk write)
**Location:** `/Users/annaz/Desktop/muzaready/app/api/price-matrix/route.ts`

**Purpose:** Create or upsert price matrix entries

**Request:**
```json
{
  "entries": [
    {
      "category": "nebarvene",
      "tier": "standard",
      "lengthCm": 40,
      "pricePerGramCzk": 150
    }
  ]
}
```

---

### ✅ 5.6 POST /api/orders
**Location:** Assumed to exist (used by cart page)

**Purpose:** Create order from cart items

**Request:**
```json
{
  "email": "string",
  "items": [
    {
      "skuId": "string",
      "grams": "number",
      "pricePerGram": "number",
      "lineTotal": "number",
      "ending": "string",
      "assemblyFeeType": "string",
      "assemblyFeeCzk": "number",
      "assemblyFeeTotal": "number",
      "lineGrandTotal": "number"
    }
  ]
}
```

---

## 6. API ENDPOINT DIRECTORY STRUCTURE

```
/app/api/
├── admin/
│   ├── products/
│   ├── skus/
│   │   ├── [id]/
│   │   └── create-from-wizard/
│   ├── cenik/
│   │   ├── delete/
│   │   ├── get/
│   │   └── save/
│   ├── orders/
│   ├── stock/
│   └── login/
├── catalog/
│   └── [slug]/
├── products/
│   └── [id]/
├── sku/
│   ├── public/
│   │   └── [id]/
│   ├── [id]/
│   └── route.ts
├── price-matrix/
│   ├── lookup/
│   ├── [id]/
│   └── route.ts
├── quote/
│   └── route.ts
├── orders/
│   └── [id]/
├── checkout/
├── gopay/
└── katalog/
```

**API Endpoints actively used for price display:**
1. ✅ GET `/api/sku/public/[id]` - SKU detail fetch
2. ✅ POST `/api/quote` - Price calculation
3. ✅ GET `/api/price-matrix/lookup` - Price matrix lookup (available but not actively used in current flow)
4. ✅ POST `/api/orders` - Order creation

---

## 7. HELPER LIBRARIES & UTILITIES

### 7.1 Stock Functions
**Location:** `/Users/annaz/Desktop/muzaready/lib/stock.ts`

**Key Functions:**
```typescript
// Assembly fee calculation
calculateAssemblyFee(ending, grams)
  → { assemblyFeeType, assemblyFeeCzk, assemblyFeeTotal }

// Validate bulk purchase
validateBulkChoice(grams, min, step) → boolean

// Quote entire cart
quoteCartLines(lines) 
  → { items: [...], total: number }

// Get price matrix map
getPriceMatrixLookup() → Map<string, number>
```

**Assembly Fee Config:**
```javascript
{
  NONE: { type: 'FLAT', price: 0 },
  KERATIN: { type: 'PER_GRAM', pricePerGram: 5 },
  PASKY: { type: 'FLAT', price: 200 },
  TRESSY: { type: 'FLAT', price: 150 }
}
```

### 7.2 Price Matrix Helper
**Location:** `/Users/annaz/Desktop/muzaready/lib/price-matrix-helper.ts`

**Key Functions:**
```typescript
getPriceFromMatrix(category, tier, lengthCm)
  → Promise<number | null>

calculatePrice(pricePerGram, grams) → number

calculateBulkPrice(pricePerGram, grams, finishingAddPrice) → number

calculatePlatinumPrice(pricePerGram, weightGrams) → number

formatPrice(price) → string (Kč format)

generateUniqueSKU(baseSKU, existingSKUs) → string
```

### 7.3 Price Calculator
**Location:** `/Users/annaz/Desktop/muzaready/lib/price-calculator.ts`
(Used in components)

Used by CatalogCard and ProductCard for formatting prices

---

## SUMMARY: WHAT EXISTS FOR CZĘŚĆ 3

### Database Level:
- ✅ **PriceMatrix** model with unique constraint on (category, tier, lengthCm)
- ✅ **SKU** model with all required fields for price display
- ✅ **OrderItem** model for order storage with pricing snapshots

### Frontend Pages:
- ✅ **SKU Detail Page** (`/sku-detail/[id]`) - Full product page with quote calculation
- ✅ **Cart Page** (`/sku-kosik`) - Cart display with pricing breakdown
- ✅ **Catalog Card Component** - Product card with price display (BULK: per gram, PIECE: fixed)

### API Endpoints:
- ✅ GET `/api/sku/public/[id]` - Fetch SKU details
- ✅ POST `/api/quote` - Calculate prices with matrix lookup
- ✅ GET `/api/price-matrix/lookup` - Direct matrix lookup
- ✅ GET/POST `/api/price-matrix` - Manage price matrix
- ✅ POST `/api/orders` - Create orders

### Business Logic:
- ✅ **Price Matrix Lookup** - Automatic lookup with SKU fallback
- ✅ **Assembly Fee Calculation** - FLAT and PER_GRAM support
- ✅ **BULK_G vs PIECE_BY_WEIGHT** - Different price models
- ✅ **Tier Mapping** - STANDARD/LUXE/PLATINUM_EDITION support
- ✅ **Category Detection** - Barvene vs Nebarvene from shade code

---

## WHAT NEEDS TO BE CREATED FOR CZĘŚĆ 3

Based on the analysis, CZĘŚĆ 3 implementation should focus on:

### 1. **Frontend Components Enhancement**
- [ ] **Price Display Integration** in catalog/listing pages
- [ ] **Real-time Price Updates** as users change configuration
- [ ] **Price Comparison Display** (price per 100g, per 45cm length)
- [ ] **Price Trend Indicators** (if needed)
- [ ] **Bulk Order Calculator** for custom configurations

### 2. **Pages That Need Creation**
- [ ] **Catalog Listing Pages** - with filter by price, tier, category
- [ ] **Search Results Page** - showing prices for search results
- [ ] **Custom Hair Configurator** - real-time price calculation
- [ ] **Checkout Page** - final price confirmation
- [ ] **Order History** - with historical prices

### 3. **Price Display Features**
- [ ] **Dynamic Price Updates** - when customer changes parameters
- [ ] **Price Breakdown Tooltips** - explain price components
- [ ] **Discount Display** (if applicable)
- [ ] **Stock-based Price Adjustments** (if applicable)
- [ ] **Bulk Discount Calculator**

### 4. **Admin Features**
- [ ] **Price Matrix Management UI** - create/edit/delete prices
- [ ] **Price History Tracking** - audit trail for price changes
- [ ] **Bulk Price Import** - CSV/Excel upload
- [ ] **Price Report Generation** - cost analysis

### 5. **Testing & Validation**
- [ ] **Price Calculation Tests** - unit tests for quote logic
- [ ] **Price Matrix Coverage** - ensure all combinations have prices
- [ ] **Edge Cases** - very large/small grams, missing lengths
- [ ] **Performance Tests** - price matrix lookup performance

---

## KEY TECHNICAL NOTES

### Price Lookup Flow:
```
1. User views SKU detail → GET /api/sku/public/[id]
2. User selects ending + grams → POST /api/quote
3. Quote endpoint:
   a. Loads price matrix from DB
   b. Creates key: `${category}_${tier}_${lengthCm}`
   c. Looks up price in matrix
   d. Falls back to sku.pricePerGramCzk if not found
   e. Calculates assembly fee
   f. Returns detailed breakdown
4. User adds to cart (localStorage)
5. User views cart → GET items from localStorage
6. User creates order → POST /api/orders with cart items
```

### Category/Tier Detection:
- **Category:** From `shade` field (1-4 = nebarvene, 5-10 = barvene)
- **Tier:** From `customerCategory` field (STANDARD/LUXE/PLATINUM_EDITION)
- **Length:** From `lengthCm` field

### Important: Price Matrix Keys Format
The system uses: `${category}_${tier}_${lengthCm}`

Examples:
- `nebarvene_standard_40` → Standard nebarvené vlasy, 40cm
- `barvene_luxe_45` → LUXE barvené vlasy, 45cm
- `nebarvene_platinum_50` → Platinum nebarvené vlasy, 50cm

---

## RECOMMENDATIONS

### For Implementation:
1. **Use existing `/api/quote`** for all price calculations
2. **Always load price matrix at startup** to cache prices
3. **Store quote results** in order items to prevent price changes after quote
4. **Add price validation** before order creation
5. **Implement price cache** in client-side to avoid excessive API calls
6. **Add error handling** for missing price matrix entries

### For Testing:
1. Test price matrix lookup with all category/tier/length combinations
2. Test assembly fee calculation for all ending types
3. Test fallback to SKU price when matrix price missing
4. Test cart with multiple items and different endings
5. Test price persistence in orders

---

## File Locations Summary

| Component | Location |
|-----------|----------|
| SKU Detail Page | `/app/sku-detail/[id]/page.tsx` |
| Cart Page | `/app/sku-kosik/page.tsx` |
| Catalog Card | `/components/CatalogCard.tsx` |
| Stock Functions | `/lib/stock.ts` |
| Price Matrix Helper | `/lib/price-matrix-helper.ts` |
| Price Calculator | `/lib/price-calculator.ts` |
| SKU API (Public) | `/app/api/sku/public/[id]/route.ts` |
| Quote API | `/app/api/quote/route.ts` |
| Price Matrix API | `/app/api/price-matrix/route.ts` |
| Price Matrix Lookup | `/app/api/price-matrix/lookup/route.ts` |
| Orders API | `/app/api/orders/route.ts` (inferred) |
| Prisma Schema | `/prisma/schema.prisma` |

