# ANALÝZA FEASIBILITY: Standard & LUXE (VlasyX) – Architektura bez Délky v Názvu

## EXECUTIVE SUMMARY

✅ **ZÁVĚR: Task je technicky PROVEDITELNÝ bez kritických porušení.**

Požadovaná architektura Standard & LUXE se dá implementovat s **minimálním dopadem** na stávající kód. Nejde o "revolutionary" změnu – jde spíš o **rozšíření** stávajícího systému do nové dimenze (struktura).

---

## 📊 ANALÝZA AKTUÁLNÍHO STAVU

### 1. PRISMA SCHEMA – Co Máš Nyní

**SKU Model** (lines 107-139):
```prisma
model Sku {
  id               String            @id @default(cuid())
  sku              String            @unique
  name             String?
  shade            String?           // "1", "2", ..., "10" nebo "Platinum blond"
  shadeName        String?           // "Platinum blond", "Černá"
  lengthCm         Int?              // 45, 50, 55, 60, ...
  structure        String?           // ✅ JIŽ EXISTUJE! "WAVES", "STRAIGHT", atd.
  saleMode         SaleMode          // PIECE_BY_WEIGHT | BULK_G
  pricePerGramCzk  Int
  weightTotalG     Int?
  availableGrams   Int?
  // ...
}
```

**KLÍČOVÝ NÁLEZ**: Pole `structure` už v databázi existuje!

Tvůj model umožňuje už nyní ukládat strukturu pro každý SKU. To znamená, že databáze je **připravená na Standard/LUXE** bez migrace.

---

### 2. KATALOG API – Co Vrací

**Endpoint**: `/app/api/katalog/unified/route.ts` (lines 1-100)

```typescript
// PIECE items (SKUs):
items.push({
  type: 'PIECE',
  id: sku.id,
  name: sku.name,
  tier: sku.customerCategory, // "STANDARD", "LUXE", "PLATINUM_EDITION"
  shade: sku.shade,
  shadeName: sku.shadeName,
  structure: sku.structure,    // ✅ JIŽ SE VRACÍ V RESPONSE!
  lengthCm: sku.lengthCm,
  // ...
});
```

**KLÍČOVÝ NÁLEZ**: API už vracíhod `structure` pro každý SKU.

Frontend máinformace k dispozici. Stačí je správně zobrazit.

---

### 3. SKU ADMIN API – Co Umožňuje

**POST `/app/api/admin/skus/route.ts`** (lines 21-79):

```typescript
const {
  sku,
  name,
  shade,
  shadeName,
  lengthCm,
  structure,    // ✅ PARAMETR JIŽ EXISTUJE
  saleMode,
  pricePerGramCzk,
  weightTotalG,
  availableGrams,
  // ...
} = body;

const newSku = await prisma.sku.create({
  data: {
    // ...
    structure: structure || null,
    // ...
  },
});
```

**KLÍČOVÝ NÁLEZ**: Admin API už přijímá a ukládá `structure` do DB.

Znamená to, že tvoj konfigurátor-SKU u Cursora (ČÁST 2) **už umožňuje vytvářet SKU se strukturou**.

---

## 🏗️ ARCHITEKTURA STANDARD/LUXE – Jak to Bude Fungovat

### Vrstva 1: Databáze

**Aktuálně**: SKU tabulka s polem `structure`

**Stav**: ✅ PŘIPRAVENO – Žádná migrace potřeba

### Vrstva 2: Catalog API

**Vrstva 2a**: Načítání z DB
- API vrací: `tier`, `shade`, `shadeName`, `structure`, `lengthCm`, `inStock`, `availableGrams`
- Stav: ✅ HOTOVO – Endpoint `/katalog/unified` už to dělá

**Vrstva 2b**: Filtrování & Agregace (NOVÉ)
- Potřeba: Seskupit SKU po (shade + structure) kombinaci
- Najít nejkratší délku ≥100g v skladě
- Fallback priority: 45 → 40 → 50 → 55 → ...
- Stav: ❌ NOVÉ – Musí se implementovat v `/katalog/unified` nebo nový endpoint

### Vrstva 3: Frontend Katalog Karta

**Co se změní**:
```
STARÁ ARCHITEKTURA (Platinum):
┌─────────────────────────────┐
│ 60 cm · Platinum · #6 · 168g│  ← Délka JE v názvu
│ Cena: 8500 Kč              │
│ [🛒 Do košíku]             │
└─────────────────────────────┘

NOVÁ ARCHITEKTURA (Standard/LUXE):
┌─────────────────────────────┐
│ Standard – Platinum blond    │  ← Délka NENÍ v názvu
│ Vlnky (WAVES)              │  ← Struktura viditel
│ Cena za 100g/45cm: 5490 Kč │  ← Cena za 100g + nejkratší délka
│ [🛒 Do košíku 100g/45cm]   │  ← CTA s konkrétní délkou
└─────────────────────────────┘
```

**Stav komponenty**: ⚠️ ROZŠÍŘÍ SE
- Musí přijmout `structure` z API
- Musí zobrazit struktur v UI
- Musí počítat cenu za 100g s nejkratší délkou (logic)

### Vrstva 4: Frontend Detail (PDP)

**Co se změní**:
```
DETAIL (NOVÝ):
┌─────────────────────────────────────┐
│ Standard – Platinum blond           │
│ Vlnky                               │
│                                     │
│ Dostupné délky:                    │
│ ☐ 45 cm (140g v stock)             │
│ ☐ 50 cm (155g v stock)             │
│ ☑ 55 cm (168g v stock) – Vybrán   │
│ ☐ 60 cm (155g v stock)             │
│                                     │
│ Gramy: [150_] g (min 100, max 168) │
│ Zakončení: [Keratin ▼]             │
│ Cena: 8235 Kč                      │
│ [🛒 Přidat do košíku]              │
└─────────────────────────────────────┘
```

**Logika**:
1. Dropdown délky (NOVÝ) – filtruje dostupné gramy
2. Input gramů – validuje, počítá cenu
3. Dropdown zakončení – počítá fee
4. Cena = (gramy × cena za gram) + fee

**Stav**: ⚠️ NOVÝ COMPONENT POTŘEBA
- Při SM, lengthCm, grams změní → cena se přepočítá
- Struktura je READ-ONLY (nelze měnit)

### Vrstva 5: Stock Management

**Problém**: Jak odečíst z DB když customer objedná?

**Aktuálně**: Checkout API (`/app/api/checkout/route.ts`) vytváří Order, ale **neodečítá** z `availableGrams` SKU.

**Řešení pro Standard/LUXE**:

```typescript
// Při checkout:
// 1. Načti SKU s danou strukturou a délkou
const sku = await prisma.sku.findUnique({
  where: { id: skuId },
});

// 2. Ověř dostupnost
if ((sku.availableGrams || 0) < requestedGrams) {
  return error('Není dost v skladě');
}

// 3. Odečti gramy
await prisma.sku.update({
  where: { id: skuId },
  data: {
    availableGrams: {
      decrement: requestedGrams,
    },
  },
});

// 4. Ulož info do OrderItem
// (už se ukládá nameSnapshot, pricePerGram, grams, ending atd.)
```

**Stav**: ⚠️ LOGIKA PŘIDÁ SE – Checkout API se musí updatovat

---

## ✅ KOMPATIBILITA S EXISTUJÍCÍM KODEM

### 1. Nebude to Pořbídat Platinum?

**ODPOVĚĎ: NE** – Platinum zůstane v `customerCategory='PLATINUM_EDITION'`

```typescript
// V `/katalog/unified`:
if (sku.customerCategory === 'PLATINUM_EDITION') {
  // Platinum karta: "$lengthCm cm · Platinum · #$shade · $gramsg"
  items.push({ type: 'PIECE', /* ... */ });
} else if (['STANDARD', 'LUXE'].includes(sku.customerCategory)) {
  // Standard/LUXE karta: "$name" bez délky
  items.push({ /* ... */ });
}
```

Žádné breaking changes.

### 2. Bude to Pořbídat CartItem?

**ODPOVĚĎ: NE** – CartItem/OrderItem struktura se nezmění

```typescript
// CartItem (existující) zůstane stejný:
{
  skuId: "xxx",
  grams: 150,
  lengthCm: 50,  // NOVÉ: bude se ukládat
  ending: "KERATIN",
  pricePerGram: 54.9,
  totalPrice: 8235,
  // ...
}
```

Jen se přidá `lengthCm` do CartItem (pokud tam ještě není).

### 3. Bude to Pořbídat OrderItem?

**ODPOVĚĎ: NE** – OrderItem model má všechno potřebné

```prisma
model OrderItem {
  // ...
  grams            Int          // ✅ Existuje
  pricePerGram     Int          // ✅ Existuje
  ending           EndingOption // ✅ Existuje
  nameSnapshot     String?      // ✅ Existuje (za cenu v čase nákupu)
  // ...
}
```

Stav je zvlášť – není potřeba ukládat lengthCm do OrderItem (už je v SKU).

---

## 🚨 POTENCIÁLNÍ PROBLÉMY & ŘEŠENÍ

### Problem #1: Jak Seskupit SKU po (shade + structure)?

**Problém**: V DB máš 100+ SKU. Kterých 40 představují "40 typů" (5 barev × 8 struktur)?

**Řešení**: Přidat logiku v `/katalog/unified`:

```typescript
// Seskup SKU po (tier, shade, structure)
const groupedByCard = new Map<string, Sku[]>();

for (const sku of skus) {
  const key = `${sku.customerCategory}|${sku.shade}|${sku.structure}`;
  if (!groupedByCard.has(key)) {
    groupedByCard.set(key, []);
  }
  groupedByCard.get(key)!.push(sku);
}

// Pro každou skupinu: najdi nejkratší délku s ≥100g v stock
const catalogCards = [];
for (const [key, skuList] of groupedByCard.entries()) {
  const inStock = skuList
    .filter(s => s.inStock && (s.availableGrams || 0) >= 100)
    .sort((a, b) => (a.lengthCm || 999) - (b.lengthCm || 999));

  if (inStock.length === 0) continue; // Není v skladě

  const shortestWithStock = inStock[0];
  catalogCards.push({
    // ... karta
    shortestLength: shortestWithStock.lengthCm,
    shortestLengthPrice: shortestWithStock.pricePerGramCzk,
  });
}
```

**Práce**: ~30 minut psaní + testování

### Problem #2: Jak Validovat Grams v PDP?

**Problém**: Customer vybere "55 cm", ale "55 cm" má jen 140g v stock. Customer nechce koupit 140g, chce koupit 160g. Co se stane?

**Řešení**: Maximální grams = dostupné gramy pro danou délku

```typescript
// PDP komponenta:
const [selectedLength, setSelectedLength] = useState<number | null>(null);
const [selectedGrams, setSelectedGrams] = useState<number>(100);

// Když změní délku:
const onLengthChange = (newLength: number) => {
  const sku = skus.find(s => s.lengthCm === newLength);
  const maxGrams = sku?.availableGrams || 100;
  setSelectedLength(newLength);
  setSelectedGrams(Math.min(selectedGrams, maxGrams)); // Cap na dostupné
};

// Validace eingabet gramů:
<input
  type="number"
  min={minOrderG || 50}
  max={maxAvailableGrams}
  value={selectedGrams}
  onChange={(e) => setSelectedGrams(Math.min(parseInt(e.target.value), maxAvailableGrams))}
/>
```

**Práce**: ~20 minut

### Problem #3: Checkout – Odečet Stock

**Problém**: Když customer objedná "150g délka 55cm", jak odebeš z DB?

**Řešení**: V checkout přidej stock deduction:

```typescript
// /app/api/checkout/route.ts
for (const item of items) {
  // Zkontroluj stock
  const sku = await prisma.sku.findUnique({
    where: { id: item.skuId },
  });

  if ((sku.availableGrams || 0) < item.grams) {
    return error('Stock není dostupný');
  }

  // Odečti grams
  await prisma.sku.update({
    where: { id: item.skuId },
    data: {
      availableGrams: {
        decrement: item.grams,
      },
    },
  });

  // Ulož do OrderItem
  // ...
}
```

**Práce**: ~30 minut

---

## 📋 CHECKLIST: Co se Musí Implementovat

### Backend

- [ ] **Katalog API** (`/katalog/unified`):
  - [ ] Seskupit SKU po (shade + structure)
  - [ ] Pro každou skupinu: najdi nejkratší délku s ≥100g stock
  - [ ] Vrať cenu za 100g s tou délkou
  - [ ] Vrať fallback priority

- [ ] **Checkout API** (`/checkout`):
  - [ ] Validuj stock před order creation
  - [ ] Odečti `availableGrams` z SKU
  - [ ] Ulož `lengthCm` do CartItem/OrderItem

### Frontend

- [ ] **Catalog Card** (`/components/CatalogCard.tsx`):
  - [ ] Zobrazuj `structure` v UI
  - [ ] Zobrazuj cenu "za 100g / {shortestLength}cm"
  - [ ] "Do košíku" button vloží 100g + shortestLength

- [ ] **PDP Detail** (`/app/sku-detail/[id]/page.tsx`):
  - [ ] Dropdown pro výběr lengthCm
  - [ ] Input pro grams (s max validací)
  - [ ] Dropdown pro ending (existuje)
  - [ ] Cena = (grams × pricePerGram) + endingFee
  - [ ] Struktura je read-only display

### Admin

- [ ] **SKU Konfigurator** (Cursor ČÁST 2):
  - [ ] Přidej dropdown pro `structure` výběr
  - [ ] Vrácení `structure` do POST API

---

## 🎯 IMPACT ASSESSMENT

### Co se NEZMĚNÍ (Zero Impact)

✅ Platinum (VlasyY) – Zůstane jak je
✅ Prisma schema – Žádná migrace
✅ Product model (mock data) – Žádné změny
✅ Price Matrix – Stejný lookup (line, segment, lengthCm)
✅ Ending fees – Stejná logika
✅ OrderItem struktura – Kompatibilní

### Co se ZMĚNÍ (Managed Impact)

⚠️ **Catalog API** – Logika na agregaci SKU
⚠️ **Catalog Card** – Nové UI fields (struktura)
⚠️ **PDP Detail** – Nový Length dropdown
⚠️ **Checkout** – Stock deduction logic
⚠️ **Admin Konfigurator** – Structure field

### Odhad Práce

| Komponenta | Čas | Složitost |
|---|---|---|
| Katalog API seskupení | 45 min | 🟡 Medium |
| CatalogCard rozšíření | 30 min | 🟢 Low |
| PDP Detail – lengthCm dropdown | 60 min | 🟡 Medium |
| Checkout stock deduction | 30 min | 🟡 Medium |
| Admin struktura field | 20 min | 🟢 Low |
| **CELKEM** | **3-4 hodin** | 🟡 **Medium** |

---

## 🎬 IMPLEMENTAČNÍ PLÁN

### Fáze 1: Backend (1.5 hodiny)

1. Updatuj `/api/katalog/unified` s seskupením
2. Updatuj `/api/checkout` s stock deduction
3. Testy: Zkontroluj, že API vrací správné data

### Fáze 2: Frontend Katalog (1 hodina)

1. Updatuj `CatalogCard` – zobrazuj estruturu
2. Updatuj UI – "Cena za 100g / 45cm"
3. Testy: Zkontroluj, že se zobrazuje správně

### Fáze 3: Frontend Detail (1.5 hodiny)

1. Vytvoř nový Detail komponentu s lengthCm dropdown
2. Implementuj grams input s max validací
3. Implementuj cenu calculation
4. Testy: Zkontroluj všechny flow

### Fáze 4: Admin (0.5 hodin)

1. Updatuj SKU konfigurator – přidej struktura field
2. Ověř, že se struktura uloží do DB

### Fáze 5: Testing & Refinement (0.5 hodin)

1. Manuální test: Vytvoř testovací Standard SKU
2. Test checkout: Zkontroluj, že se stock odečte
3. Build: `npm run build` – musí PASS

---

## 🚀 GO/NO-GO ROZHODNUTÍ

### ✅ RECOMMENDATION: GO

**Důvody:**
1. Databáze JIŽ EXISTUJE – `structure` pole je přítomné
2. API JIŽ VRACÍ data – `/katalog/unified` má struktura v response
3. Admin JIŽ PŘIJÍMÁ – `/api/admin/skus` umožňuje struktura
4. ZERO breaking changes – Platinum a ostatní zůstanou
5. REALISTICKÝ odhad – 3-4 hodin pro kompletní implementaci
6. NIŽKÉHO RIZIKA – Všechny změny jsou izolované

### ⚠️ POTENCIÁLNÍ RIZIKA

1. **Stock Deduction Logic** – Musí se udělat správně, jinak se bude překupovat
   - Řešení: Transactional update s concurrent request handling

2. **Length Fallback Priority** – Pokud je logika špatná, card se neobjeví
   - Řešení: Jasné testovací scénáře s různými délkami v stock

3. **PDP vs Card Logic** – Dvě různá místa počítají cenu
   - Řešení: Extrahuj cenu calculation do shared utility

---

## 📝 ZÁVĚREČNÉ SHRNUTÍ

**Standard & LUXE architektura JE PROVEDITELNÁ** a nebude pořbídat existující kód. Jde o **přirozené rozšíření** stávajícího systému, který už má všechny potřebné základy.

Klíčový zážitek: **`structure` pole už v DB existuje a API ho vrací.** To znamená, že 60% práce je už hotové – zbývá jen UI a business logika.

**Next Step**: Jakmile si budeš jistá, dej mi Clear Green Light a vytvoření detailní specifikaci pro Cursora s přesnými instrukcemi na implementaci.

---

## 🔗 REFERENCE K EXISTUJÍCÍMU KÓDU

- Prisma schema: `/prisma/schema.prisma` (lines 107-139)
- Catalog API: `/app/api/katalog/unified/route.ts` (lines 1-100)
- Admin SKU: `/app/api/admin/skus/route.ts` (lines 21-79)
- Checkout: `/app/api/checkout/route.ts` (lines 1-75)
- CatalogCard: `/components/CatalogCard.tsx`
- PDP Detail: `/app/sku-detail/[id]/page.tsx`
