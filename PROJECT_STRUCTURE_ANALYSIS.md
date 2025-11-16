# Detailní rozbor struktury projektu Muza Ready

## 1. CatalogCard komponenta

**Umístění:** `/Users/annaz/Desktop/muzaready/components/CatalogCard.tsx`

### Popis
Jednotná katalogová karta pro dva typy položek:
- **BULK** (konfigurabilní produkty): Zobrazuje cenu za gram, umožňuje "Vybrat parametry" → `/produkt/[slug]` nebo "Do košíku"
- **PIECE** (fixní SKU položky): Zobrazuje fixní cenu, umožňuje přímé přidání do košíku nebo "Zadat poptávku"

### Klíčové vlastnosti
```typescript
interface CatalogCardProps {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string;
  name: string;
  tier: string; // "Standard" | "LUXE" | "Platinum edition"
  shade?: number; // 1-10
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightGrams?: number;
  pricePerGramCzk?: number; // BULK
  priceCzk?: number; // PIECE
  inStock: boolean;
  imageUrl?: string;
}
```

### Styling
- **Kontejner:** `bg-white rounded-xl shadow-light hover:shadow-card-hover border border-gray-200`
- **Tier Badge:** Gradientní pozadí podle tier (Standard/LUXE/Platinum)
- **Favorite Button:** V pravém horním rohu
- **ImageSection:** 4:5 aspect ratio s color gradientem podle odstínu vlasů
- **CTA Tlačítka:** `bg-burgundy text-white py-2 px-4 rounded-lg`
- **Out of stock:** Černá overley `bg-black/50` s textem "Vyprodáno"

### Currency management
- Používá `usePreferences()` hook pro přepínání CZK/EUR
- Default rate: 1 / 25.5
- Zobrazuje obě ceny (primární a konverzní)

---

## 2. Implementace košíku

### 2.1 SKU Cart Context (Primární)
**Umístění:** `/Users/annaz/Desktop/muzaready/contexts/SkuCartContext.tsx`

```typescript
interface SkuCartItem {
  skuId: string;
  skuName: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  shade: string | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  ending: 'KERATIN' | 'PASKY' | 'TRESSY' | 'NONE';
  assemblyFeeType: 'FLAT' | 'PER_GRAM';
  assemblyFeeCzk: number;
  assemblyFeeTotal: number;
  lineGrandTotal: number;
  quantity: number;
  addedAt: number;
}
```

### Metody
- `addToCart(item)` - Přidá nebo aktualizuje počet (merges grams pro BULK_G)
- `removeFromCart(skuId)` - Odebere položku
- `updateQuantity(skuId, quantity)` - Změní počet
- `updateGrams(skuId, grams)` - Speciální pro BULK_G items (přepočítá assembly fee)
- `clearCart()` - Vymaže celý košík
- `getTotalItems()` - Vrátí celkový počet položek
- `getTotalPrice()` - Vrátí součet lineGrandTotal
- `getTotalWithShipping(cost)` - Cena + doprava

### Storage
- **Key:** `'sku-cart'`
- **Versionování:** `CART_VERSION = 2`
- **Format:** `{ version: 2, items: [], savedAt: ISO string }`
- **Migration:** Kontrola verze při načítání

### Hook
```typescript
export function useSkuCart() {
  const context = useContext(SkuCartContext);
  if (context === undefined) {
    throw new Error('useSkuCart must be used within a SkuCartProvider');
  }
  return context;
}

// Legacy alias
export function useCart() {
  return useSkuCart();
}
```

### 2.2 Legální Cart Context
**Umístění:** `/Users/annaz/Desktop/muzaready/contexts/CartContext.tsx`

Starší implementace pro Product/ProductVariant (pro backward compatibility). Používá stejné localStorage principy ale s jiným datovým modelem.

### 2.3 Hook Export
**Umístění:** `/Users/annaz/Desktop/muzaready/hooks/useCart.ts`

Re-exportuje `useSkuCart` z SkuCartContext pro kompatibilitu.

### 2.4 Cart Page
**Umístění:** `/Users/annaz/Desktop/muzaready/app/sku-kosik/page.tsx`

- Načítá košík z localStorage
- Zobrazuje seznam položek s:
  - Kategorie badge (STANDARD/LUXE/PLATINUM_EDITION)
  - Zakončení (KERATIN/PASKY/TRESSY/NONE)
  - Lineární a grandiózní cenu
  - Možnost odstranění
- CTA: Vytvoření objednávky (email input → POST `/api/admin/orders`)

---

## 3. Organizace produktů

### 3.1 Product Schema (Prisma)
**Umístění:** `/Users/annaz/Desktop/muzaready/prisma/schema.prisma`

#### Product model
```prisma
model Product {
  id                       String
  name                     String
  category                 String?
  tier                     String
  base_price_per_100g_45cm Float
  set_id                   String?
  cartItems                CartItem[]
  favorites                Favorite[]
  variants                 Variant[]
}

model Variant {
  id        String
  productId String
  name      String
  price     Float
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

#### SKU model
```prisma
model Sku {
  id                String
  sku               String @unique
  name              String?
  productId         String?
  shade             String?
  shadeName         String?
  shadeHex          String?
  lengthCm          Int?
  structure         String?
  ending            String?
  saleMode          SaleMode // PIECE_BY_WEIGHT | BULK_G
  pricePerGramCzk   Float?
  weightTotalG      Int?
  weightGrams       Int?
  priceCzkTotal     Float?
  soldOut           Boolean @default(false)
  availableGrams    Int?
  minOrderG         Int?
  stepG             Int?
  inStock           Boolean @default(false)
  inStockSince      DateTime?
  customerCategory  CustomerCategory? // STANDARD | LUXE | PLATINUM_EDITION
  isListed          Boolean @default(false)
  listingPriority   Int?
  reservedUntil     DateTime?
  orderItems        OrderItem[]
  movements         StockMovement[]
}

model OrderItem {
  id               String
  orderId          String
  skuId            String
  assemblyFeeCzk   Int?
  assemblyFeeTotal Int?
  assemblyFeeType  String?
  grams            Int
  lineTotal        Int
  pricePerGram     Int
  saleMode         SaleMode
  sku              Sku @relation(fields: [skuId], references: [id])
}

model PriceMatrix {
  id               String
  category         String
  tier             String
  shadeRangeStart  Int?
  shadeRangeEnd    Int?
  lengthCm         Int
  pricePerGramCzk  Decimal
  pricePerGramEur  Decimal?
  
  @@unique([category, tier, shadeRangeStart, shadeRangeEnd, lengthCm])
  @@index([category, tier])
}

enum SaleMode {
  PIECE_BY_WEIGHT
  BULK_G
}

enum CustomerCategory {
  STANDARD
  LUXE
  PLATINUM_EDITION
}

enum EndingOption {
  KERATIN
  PASKY
  TRESSY
  NONE
}
```

### 3.2 TypeScript Product Types
**Umístění:** `/Users/annaz/Desktop/muzaready/types/product.ts`

```typescript
export type ProductTier = "Standard" | "LUXE" | "Platinum edition";
export type HairStructure = "rovné" | "mírně vlnité" | "vlnité" | "kudrnaté";
export type HairEnding = "keratin" | "microkeratin" | "nano_tapes" | "vlasove_tresy";

interface Product {
  id: string;
  sku: string;
  slug: string;
  category: ProductCategory;
  tier: ProductTier;
  name: string;
  description: string;
  variants: ProductVariant[];
  images: { main, hover, gallery[], structure_detail?, ending_detail? };
  base_price_per_100g_45cm: number;
  in_stock: boolean;
  stock_quantity?: number;
  lead_time_days?: number;
  meta_title: string;
  meta_description: string;
  features: string[];
  care_instructions: string;
  how_to_use: string;
  average_rating: number;
  review_count: number;
}

interface ProductVariant {
  id: string;
  sku: string;
  shade: number; // 1-10
  shade_name: string;
  shade_hex: string;
  length_cm: number; // 35-90
  weight_g: number; // 50-300, step 10g
  structure: HairStructure;
  ending: HairEnding;
  price_czk: number;
  in_stock: boolean;
  stock_quantity: number;
  ribbon_color: string;
}
```

### 3.3 Hair Colors Database
```typescript
export const HAIR_COLORS: Record<number, HairColor> = {
  1: { code: 1, name: "Černá", hex: "#1A1A1A", ... },
  2: { code: 2, name: "Velmi tmavá hnědá", hex: "#2C2416", ... },
  // ... až do 10 (Platinová blond)
}
```

### 3.4 Category Configuration
```typescript
export const CATEGORY_RULES: CategoryConfig = {
  nebarvene_panenske: {
    shades: { standard: [1,2,3,4,5], luxe: [1,2,3,4,5], platinum: [1-9] },
    lengths_cm: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    weights_g: ["50-100", "100-120", "120-150", "150-180", "180-230", "230+"],
    structures: ["rovné", "mírně vlnité", "vlnité", "kudrnaté"],
    endings: ["keratin", "microkeratin", "nano_tapes", "vlasove_tresy"],
    tiers: ["Standard", "LUXE", "Platinum edition"],
  },
  barvene_blond: { ... }
}
```

### 3.5 API Endpoints

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/products` | GET | Vrátí seznam produktů |
| `/api/products/[id]` | GET | Detail produktu |
| `/api/catalog` | GET | Katalog (s filtry) |
| `/api/catalog/[slug]` | GET | Detail podle slug |
| `/api/admin/skus` | GET/POST | Správa SKU |
| `/api/admin/skus/[id]` | PATCH/DELETE | Detail SKU |
| `/api/admin/skus/create-from-wizard` | POST | Vytvoření SKU |
| `/api/price-matrix` | GET | Ceník |
| `/api/exchange-rate` | GET | Kurz CZK/EUR |
| `/api/admin/orders` | POST | Vytvoření objednávky |
| `/api/admin/stock` | GET/PATCH | Správa skladu |

---

## 4. Existující modály/dialogy

### 4.1 WholesaleRegistrationModal
**Umístění:** `/Users/annaz/Desktop/muzaready/components/WholesaleRegistrationModal.tsx`

**Styling:**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
    <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-burgundy">Registrace na velkoobchod</h2>
      <button className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
    </div>
    <form className="p-6 space-y-4">
      {/* Fields */}
    </form>
  </div>
</div>
```

**Vlastnosti:**
- `isOpen` | `onClose` props
- Sticky header s title a close buttonem
- Scrollable body (max-h-screen)
- Error/success states
- Loading state na submit buttonech
- Form fields v grid layout (md:grid-cols-2)

### 4.2 ScrollPicker (Modal variant)
**Umístění:** `/Users/annaz/Desktop/muzaready/components/ScrollPicker.tsx`

**Mobile Bottom Sheet Styling (lines 126-183):**
```tsx
{isMobile && isOpen && (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />
    
    {/* Bottom Sheet */}
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button>Zrušit</button>
        <h3 className="text-lg font-semibold text-burgundy">{label}</h3>
        <button>Hotovo</button>
      </div>
      
      {/* Scrollable Options */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Options with conditional styling */}
        </div>
      </div>
    </div>
  </>
)}
```

**Desktop Dropdown Styling (lines 186-214):**
```tsx
<div className="absolute z-50 mt-2 w-full bg-white border-2 border-burgundy/30 rounded-lg shadow-xl max-h-80 overflow-y-auto">
  {/* Options */}
</div>
```

### 4.3 SearchOverlay
**Umístění:** `/Users/annaz/Desktop/muzaready/components/SearchOverlay.tsx`

**Styling:**
```tsx
className="fixed inset-0 bg-white z-[100] overflow-y-auto lg:hidden"
```

**Vlastnosti:**
- Fullscreen na mobile (hidden na desktop)
- Auto-focus input při otevření
- ESC zavření
- Blokování scroll na body
- Search history v localStorage

### 4.4 ProductCard (Potenciální modal)
**Umístění:** `/Users/annaz/Desktop/muzaready/components/ProductCard.tsx`

Obsahuje příklad modálního backendu:
```tsx
className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
```

---

## 5. Preferences Context

**Umístění:** `/Users/annaz/Desktop/muzaready/lib/preferences-context.tsx`

```typescript
interface PreferencesContextValue {
  language: 'cs' | 'en';
  currency: 'CZK' | 'EUR';
  exchangeRate: number;
  setLanguage(lang): void;
  setCurrency(curr): void;
  refreshExchangeRate(): Promise<void>;
}
```

**Features:**
- localStorage persistence (`preferredLanguage`, `preferredCurrency`)
- Detekce prohlížeče (navigator.language)
- Dynamický kurz z `/api/exchange-rate`
- Default rate: 1/25.5

---

## Souhrn klíčových cest

| Komponenta | Cesta |
|-----------|------|
| CatalogCard | `/components/CatalogCard.tsx` |
| SkuCartContext | `/contexts/SkuCartContext.tsx` |
| CartContext (legacy) | `/contexts/CartContext.tsx` |
| useCart hook | `/hooks/useCart.ts` |
| Product types | `/types/product.ts` |
| Cart types | `/types/cart.ts` |
| Preferences | `/lib/preferences-context.tsx` |
| Cart page | `/app/sku-kosik/page.tsx` |
| Wholesale Modal | `/components/WholesaleRegistrationModal.tsx` |
| ScrollPicker | `/components/ScrollPicker.tsx` |
| SearchOverlay | `/components/SearchOverlay.tsx` |
| Prisma schema | `/prisma/schema.prisma` |

---

## Styling patterns

### Modal Container
```tailwindcss
fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
```

### Modal Content
```tailwindcss
bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto
```

### Modal Header
```tailwindcss
sticky top-0 bg-white border-b p-6 flex justify-between items-center
```

### Modal Buttons
- Primary: `bg-burgundy text-white py-2 rounded-md hover:bg-maroon`
- Secondary: `bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300`

### Form Inputs
```tailwindcss
w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500
```

### Badge/Tier Labels
```tailwindcss
px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r [gradient-class] shadow-light
```
