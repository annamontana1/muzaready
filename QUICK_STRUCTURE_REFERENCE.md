# Muzaready - Rychlý přehled struktury projektu

## Absolutní cesty klíčových souborů

### Komponenty (Components)
- **CatalogCard** → `/Users/annaz/Desktop/muzaready/components/CatalogCard.tsx` (305 řádků)
- **WholesaleRegistrationModal** → `/Users/annaz/Desktop/muzaready/components/WholesaleRegistrationModal.tsx` (357 řádků)
- **ScrollPicker** → `/Users/annaz/Desktop/muzaready/components/ScrollPicker.tsx` (218 řádků)
- **SearchOverlay** → `/Users/annaz/Desktop/muzaready/components/SearchOverlay.tsx`
- **ProductConfigurator** → `/Users/annaz/Desktop/muzaready/components/ProductConfigurator.tsx` (287 řádků)
- **FavoriteButton** → `/Users/annaz/Desktop/muzaready/components/FavoriteButton.tsx`

### Kontexty (Contexts)
- **SkuCartContext (PRIMÁRNÍ)** → `/Users/annaz/Desktop/muzaready/contexts/SkuCartContext.tsx` (187 řádků)
- **CartContext (Legacy)** → `/Users/annaz/Desktop/muzaready/contexts/CartContext.tsx` (133 řádků)
- **FavoritesContext** → `/Users/annaz/Desktop/muzaready/contexts/FavoritesContext.tsx`

### Hooks
- **useCart** → `/Users/annaz/Desktop/muzaready/hooks/useCart.ts` (4 řádky - re-export)
- **useFavorites** → `/Users/annaz/Desktop/muzaready/hooks/useFavorites.ts` (8 řádků - wrapper)

### Types
- **Product types** → `/Users/annaz/Desktop/muzaready/types/product.ts` (315 řádků)
- **Cart types** → `/Users/annaz/Desktop/muzaready/types/cart.ts` (31 řádků)
- **Pricing types** → `/Users/annaz/Desktop/muzaready/types/pricing.ts`

### Lib & Utilities
- **PreferencesContext** → `/Users/annaz/Desktop/muzaready/lib/preferences-context.tsx` (87 řádků)
- **Price Calculator** → `/Users/annaz/Desktop/muzaready/lib/price-calculator.ts`
- **Price Matrix Helper** → `/Users/annaz/Desktop/muzaready/lib/price-matrix-helper.ts`
- **Stock Management** → `/Users/annaz/Desktop/muzaready/lib/stock.ts`

### Database
- **Prisma Schema** → `/Users/annaz/Desktop/muzaready/prisma/schema.prisma` (261 řádků)

### Stránky
- **Cart Page** → `/Users/annaz/Desktop/muzaready/app/sku-kosik/page.tsx` (250+ řádků)
- **Admin Pages** → `/Users/annaz/Desktop/muzaready/app/admin/` (10+ stránek)

---

## Quick Import Guide

### Komponenty
```tsx
import CatalogCard from '@/components/CatalogCard';
import WholesaleRegistrationModal from '@/components/WholesaleRegistrationModal';
import ScrollPicker from '@/components/ScrollPicker';
```

### Kontexty & Hooks
```tsx
import { SkuCartProvider, useSkuCart } from '@/contexts/SkuCartContext';
import { useCart } from '@/hooks/useCart';
import { usePreferences } from '@/lib/preferences-context';
import { useFavorites } from '@/hooks/useFavorites';
```

### Types
```tsx
import type { SkuCartItem, CartContextType } from '@/types/cart';
import type { Product, ProductVariant, HAIR_COLORS } from '@/types/product';
```

---

## Key Data Structures

### SkuCartItem
```typescript
{
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

### CatalogCardProps
```typescript
{
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string;
  name: string;
  tier: string;
  shade?: number;
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightGrams?: number;
  pricePerGramCzk?: number;
  priceCzk?: number;
  inStock: boolean;
}
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | List products |
| `/api/catalog` | GET | Catalog with filters |
| `/api/catalog/[slug]` | GET | Product detail |
| `/api/admin/skus` | GET/POST | Manage SKUs |
| `/api/admin/skus/[id]` | PATCH/DELETE | SKU detail |
| `/api/price-matrix` | GET | Price lookup |
| `/api/exchange-rate` | GET | CZK/EUR rate |
| `/api/admin/orders` | POST | Create order |

---

## Storage Keys

- `'sku-cart'` - Main cart (v2 versioned)
- `'preferredLanguage'` - cs | en
- `'preferredCurrency'` - CZK | EUR
- `'searchHistory'` - Array of search queries

---

## Color Palette

### Tier Badges
- Standard: `from-blue-100 to-blue-200`
- LUXE: `from-pink-100 to-pink-200`
- Platinum: `from-yellow-100 to-yellow-200`

### Primary
- Brand: `burgundy` (Tailwind custom color)
- Hover: `maroon`
- Neutral: `gray-*`

### Hair Colors (10 shades)
- 1: `#1A1A1A` (Černá)
- 10: `#E5D5B7` (Platinová blond)

---

## Development Patterns

### Adding item to cart
```typescript
const { addToCart } = useSkuCart();

addToCart({
  skuId: 'sku-123',
  skuName: 'Hair 45cm Standard',
  customerCategory: 'STANDARD',
  shade: 'black',
  saleMode: 'BULK_G',
  grams: 100,
  pricePerGram: 2.5,
  lineTotal: 250,
  ending: 'KERATIN',
  assemblyFeeType: 'PER_GRAM',
  assemblyFeeCzk: 5,
  assemblyFeeTotal: 500,
  lineGrandTotal: 750,
  quantity: 1,
});
```

### Currency display
```typescript
const { currency, exchangeRate } = usePreferences();

const formatted = new Intl.NumberFormat(
  currency === 'CZK' ? 'cs-CZ' : 'en-US',
  {
    style: 'currency',
    currency,
  }
).format(price);
```

### Mobile detection in components
```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

---

## Database Models Quick Reference

### Core Models
- `Product` - Configurable product definition
- `Variant` - Product variants
- `Sku` - Specific hair SKU instance
- `OrderItem` - Items in order (references SKU)
- `PriceMatrix` - Central pricing table

### Enums
- `SaleMode`: PIECE_BY_WEIGHT | BULK_G
- `CustomerCategory`: STANDARD | LUXE | PLATINUM_EDITION
- `EndingOption`: KERATIN | PASKY | TRESSY | NONE
- `MoveType`: IN | OUT | ADJUST (stock movements)

---

## File Sizes

| File | Lines | Size |
|------|-------|------|
| CatalogCard.tsx | 305 | 11 KB |
| SkuCartContext.tsx | 187 | 6 KB |
| WholesaleRegistrationModal.tsx | 357 | 12 KB |
| product.ts (types) | 315 | 8 KB |
| schema.prisma | 261 | 7 KB |

---

## Documentation Files Created

1. **PROJECT_STRUCTURE_ANALYSIS.md** (485 lines)
   - Detailed component breakdown
   - Complete API reference
   - Schema explanation
   
2. **CODE_SNIPPETS_REFERENCE.md** (519 lines)
   - 10 working code examples
   - Copy-paste patterns
   - Context implementations

Both files in: `/Users/annaz/Desktop/muzaready/`

