# 🚚 Analýza dopravních služeb

**Datum analýzy:** 16. prosince 2025
**Autor:** Claude Code
**Cíl:** Komplexní analýza stavu integrace dopravních služeb a doporučení pro implementaci

---

## 📦 POŽADOVANÍ DOPRAVCI

1. **Zásilkovna (Packeta)** - Nejpopulárnější služba pickup pointů v ČR
2. **GLS** - Mezinárodní kurýrní služba
3. **DPD** - Mezinárodní kurýrní služba
4. **Česká pošta** - Státní poštovní služba

---

## ✅ CO EXISTUJE

### 1. Základní tracking number funkcionalita ✅

**Schema (Prisma):**
```typescript
model Order {
  trackingNumber String?  // Line 100 v schema.prisma
  shippedAt      DateTime?
  deliveryStatus String @default("pending") // pending, shipped, delivered, returned
  deliveryMethod String @default("standard") // standard, express, pickup
}
```

### 2. Admin UI pro vytváření zásilek ✅

**Soubor:** `/app/admin/objednavky/[id]/components/CreateShipmentModal.tsx`

**Podporované dopravce:**
- ✅ Zásilkovna
- ✅ DPD
- ✅ FedEx
- ✅ GLS
- ✅ UPS
- ✅ Jiný dopravce

**Funkce:**
- Výběr dopravce z dropdown menu
- Zadání tracking number (minimálně 3 znaky, max 100 znaků)
- Výběr položek k odeslání (checkboxy)
- Poznámky k zásilce (max 500 znaků)
- Validace formuláře
- Automatické nastavení `deliveryStatus = 'shipped'`

### 3. API endpoint pro vytváření zásilek ✅

**Soubor:** `/app/api/admin/orders/[id]/shipments/route.ts`

**POST /api/admin/orders/[id]/shipments**
```typescript
// Request Body:
{
  carrier: "zasilkovna" | "dpd" | "fedex" | "gls" | "ups" | "other",
  trackingNumber: "ABC123456",
  items: ["item1", "item2"],  // optional
  notes: "Special handling required"  // optional
}

// Response:
{
  success: true,
  message: "Shipment created with carrier zasilkovna. Tracking: ABC123456",
  shipment: {...},
  order: {...}
}
```

**Validace:**
- ✅ Carrier musí být jeden z podporovaných
- ✅ Tracking number je povinný
- ✅ Validace items proti order.items
- ✅ Automatické nastavení `shippedAt = now()`
- ✅ Aktualizace `deliveryStatus = 'shipped'`

**Validované carriers:** `['zasilkovna', 'dpd', 'fedex', 'gls', 'ups', 'other']`

### 4. Zobrazení zásilky v admin panelu ✅

**Soubor:** `/app/admin/objednavky/[id]/components/ShipmentHistory.tsx`

**Funkce:**
- Zobrazení tracking number
- Datum odeslání (`shippedAt`)
- Status doručení (`deliveryStatus`)
- Empty state pro objednávky bez zásilky
- Info banner: "Tento systém podporuje zatím pouze jednu zásilku na objednávku"

### 5. Customer tracking page ✅

**Soubor:** `/app/sledovani-objednavky/page.tsx`

**Funkce:**
- Vyhledání objednávky podle email + order ID
- Zobrazení tracking number
- **HARDCODED LINK na Českou poštu:**
  ```typescript
  href={`https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=${order.trackingNumber}`}
  ```
- Status timeline
- Položky objednávky
- Kontaktní informace

**⚠️ PROBLÉM:** Link na tracking je napevno nastaven na Českou poštu pro všechny dopravce!

---

## ❌ CO CHYBÍ

### 1. Automatické vytváření zásilky u dopravců ❌

**Co chybí:**
- API integrace se Zásilkovnou
- API integrace s GLS
- API integrace s DPD
- API integrace s Českou poštou
- Automatické získání tracking number z API dopravce
- Automatické vytvoření štítku

**Důsledek:**
- Admin musí ručně vytvořit zásilku v systému dopravce
- Admin musí ručně zkopírovat tracking number do systému
- Riziko chyb při přepisování

### 2. Automatický tisk štítků ❌

**Co chybí:**
- API volání pro získání PDF štítku
- UI tlačítko "Vytisknout štítek"
- Možnost hromadného tisku štítků

**Důsledek:**
- Admin musí tisknout štítky přes rozhraní dopravce

### 3. Sledování statusu zásilky v reálném čase ❌

**Co chybí:**
- Webhook notifikace od dopravců
- Automatická aktualizace `deliveryStatus`
- Historie statusů zásilky
- Notifikace zákazníka při změně statusu

**Důsledek:**
- Admin musí ručně měnit status
- Zákazník neví, kde je zásilka

### 4. Dynamické tracking linky podle dopravce ❌

**Co chybí:**
- Logika pro generování tracking URL podle dopravce
- Univerzální tracking komponenta

**Aktuální problém:**
```typescript
// ŠPATNĚ - všechny zásilky vedou na Českou poštu
<a href={`https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=${order.trackingNumber}`}>
```

**Co by mělo být:**
```typescript
// SPRÁVNĚ - tracking URL podle dopravce
const getTrackingUrl = (carrier: string, trackingNumber: string) => {
  switch(carrier) {
    case 'zasilkovna':
      return `https://tracking.packeta.com/cz/?id=${trackingNumber}`;
    case 'gls':
      return `https://gls-group.eu/CZ/cs/sledovani-zasilek?match=${trackingNumber}`;
    case 'dpd':
      return `https://tracking.dpd.de/parcelstatus?query=${trackingNumber}`;
    case 'ceska-posta':
      return `https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=${trackingNumber}`;
    default:
      return null;
  }
}
```

### 5. Uložení dopravce v databázi ❌

**Co chybí v schema.prisma:**
```typescript
model Order {
  // ... stávající pole
  carrier String?  // 'zasilkovna', 'gls', 'dpd', 'ceska-posta', 'other'
}
```

**Důsledek:**
- Nelze dynamicky generovat tracking linky
- Nelze filtrovat objednávky podle dopravce
- Nelze analyzovat statistiky podle dopravců

### 6. Separate Shipment model ❌

**Co by mohlo být v budoucnu:**
```typescript
model Shipment {
  id             String   @id @default(cuid())
  orderId        String
  carrier        String   // 'zasilkovna', 'gls', 'dpd', etc.
  trackingNumber String
  status         String   // 'pending', 'shipped', 'in_transit', 'delivered', 'returned'
  shippedAt      DateTime
  deliveredAt    DateTime?
  labelUrl       String?  // URL to PDF label
  items          Json     // Array of order item IDs
  notes          String?

  order Order @relation(fields: [orderId], references: [id])

  @@map("shipments")
}
```

**Výhody:**
- Podpora více zásilek na objednávku
- Historie všech zásilek
- Tracking více zásilek najednou

---

## 💡 DOPORUČENÉ ŘEŠENÍ

### Přístup 1: MANUÁLNÍ (Aktuální stav + malé vylepšení) ⭐⭐⭐⭐⭐

**Výhody:**
- ✅ Žádné dodatečné náklady za API
- ✅ Bez závislosti na externích službách
- ✅ Jednoduché a spolehlivé
- ✅ Rychlá implementace (2-3 hodiny)

**Co implementovat:**
1. Přidat pole `carrier` do Order modelu
2. Uložit carrier při vytváření zásilky
3. Dynamicky generovat tracking linky podle dopravce
4. Vylepšit CreateShipmentModal (hint s tracking formátem pro každého dopravce)

**Dopad:**
- Admin stále vytváří zásilky ručně u dopravce
- Ale systém umí správně zobrazit tracking link zákazníkovi
- Nulové provozní náklady

**Vhodné pro:**
- E-shopy s 5-50 objednávkami denně
- Začínající e-shopy
- Nízký rozpočet

### Přístup 2: ČÁSTEČNÁ INTEGRACE (API jen pro tracking) ⭐⭐⭐⭐

**Výhody:**
- ✅ Automatické aktualizace statusu zásilky
- ✅ Zákazník vidí reálný stav
- ✅ Nižší náklady než plná integrace
- ❌ Admin stále vytváří zásilky ručně

**Co implementovat:**
1. Webhook endpoint pro notifikace od dopravců
2. Automatická aktualizace `deliveryStatus`
3. Email notifikace zákazníka při změně statusu
4. Polling API dopravců pro aktualizaci statusu (fallback)

**Implementační čas:** 8-12 hodin

**Vhodné pro:**
- E-shopy s 50-200 objednávkami denně
- Zákazníci vyžadují aktuální info o zásilce

### Přístup 3: PLNÁ INTEGRACE (API pro vytváření + tracking + tisk) ⭐⭐⭐

**Výhody:**
- ✅ Plně automatické vytváření zásilek
- ✅ Automatický tisk štítků
- ✅ Automatické tracking
- ❌ Vysoké náklady na vývoj
- ❌ Závislost na API dopravců
- ❌ Nutnost správy API klíčů

**Co implementovat:**
1. API integrace se všemi dopravci
2. Automatické vytváření zásilky při změně statusu
3. Získání a uložení PDF štítku
4. Webhook endpoint pro notifikace
5. Error handling a retry logika

**Implementační čas:** 40-60 hodin

**Vhodné pro:**
- E-shopy s 200+ objednávkami denně
- Velké e-shopy s vysokou automatizací
- Vysoký rozpočet na vývoj

### Přístup 4: MULTI-CARRIER AGREGÁTOR (např. Balíkobot) ⭐⭐⭐⭐

**Použití služby třetí strany:**
- **Balíkobot** (https://balikobot.docs.apiary.io/)
- **ShipMonk**
- **Zásilkovna API** (podporuje i jiné dopravce)

**Výhody:**
- ✅ Jedna API pro všechny dopravce
- ✅ Jednotná dokumentace
- ✅ Předplacené poštovné
- ✅ Vyjednané ceny
- ✅ Podpora a helpdesk
- ❌ Měsíční poplatek (cca 500-2000 Kč/měsíc)

**Implementační čas:** 20-30 hodin

**Vhodné pro:**
- E-shopy s 50+ objednávkami denně
- E-shopy používající více dopravců
- Střední rozpočet

---

## 🔧 KDE IMPLEMENTOVAT

### Krok 1: Přidání pole `carrier` do databáze

**Soubor:** `/prisma/schema.prisma`

```typescript
model Order {
  // ... stávající pole
  carrier        String?  // Přidat toto pole
  trackingNumber String?
  // ...
}
```

**Migrace:**
```bash
npx prisma migrate dev --name add_carrier_to_orders
npx prisma generate
```

### Krok 2: Aktualizace API endpointu

**Soubor:** `/app/api/admin/orders/[id]/shipments/route.ts`

**Změny:**
```typescript
// Line 120-130: Uložit carrier do databáze
const updatedOrder = await prisma.order.update({
  where: { id },
  data: {
    deliveryStatus: 'shipped',
    carrier: carrier,  // ← PŘIDAT TOTO
    trackingNumber: trackingNumber,
    shippedAt: new Date(),
    lastStatusChangeAt: new Date(),
  },
  // ...
});
```

### Krok 3: Tracking URL helper

**Nový soubor:** `/lib/shipping.ts`

```typescript
export const TRACKING_URLS = {
  zasilkovna: (tracking: string) => `https://tracking.packeta.com/cz/?id=${tracking}`,
  gls: (tracking: string) => `https://gls-group.eu/CZ/cs/sledovani-zasilek?match=${tracking}`,
  dpd: (tracking: string) => `https://tracking.dpd.de/parcelstatus?query=${tracking}`,
  'ceska-posta': (tracking: string) => `https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers=${tracking}`,
  fedex: (tracking: string) => `https://www.fedex.com/fedextrack/?trknbr=${tracking}`,
  ups: (tracking: string) => `https://www.ups.com/track?tracknum=${tracking}`,
} as const;

export const getTrackingUrl = (carrier: string | null, trackingNumber: string): string | null => {
  if (!carrier || !trackingNumber) return null;

  const urlGenerator = TRACKING_URLS[carrier as keyof typeof TRACKING_URLS];
  return urlGenerator ? urlGenerator(trackingNumber) : null;
};

export const getCarrierName = (carrier: string | null): string => {
  const names: Record<string, string> = {
    zasilkovna: 'Zásilkovna',
    gls: 'GLS',
    dpd: 'DPD',
    'ceska-posta': 'Česká pošta',
    fedex: 'FedEx',
    ups: 'UPS',
    other: 'Jiný dopravce',
  };

  return carrier ? names[carrier] || carrier : 'Neznámý';
};
```

### Krok 4: Aktualizace customer tracking page

**Soubor:** `/app/sledovani-objednavky/page.tsx`

**Změny:**
```typescript
import { getTrackingUrl, getCarrierName } from '@/lib/shipping';

// ...

// Line 228-241: Nahradit hardcoded link
{order.trackingNumber && (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="text-sm text-gray-600 mb-1">Dopravce:</p>
    <p className="text-lg font-semibold text-gray-900 mb-2">
      {getCarrierName(order.carrier)}
    </p>
    <p className="text-sm text-gray-600 mb-1">Číslo sledování:</p>
    <p className="text-lg font-bold text-blue-800 mb-2">{order.trackingNumber}</p>

    {getTrackingUrl(order.carrier, order.trackingNumber) && (
      <a
        href={getTrackingUrl(order.carrier, order.trackingNumber)!}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 underline inline-block"
      >
        Sledovat zásilku →
      </a>
    )}
  </div>
)}
```

### Krok 5: Aktualizace admin UI

**Soubor:** `/app/admin/objednavky/[id]/components/ShipmentHistory.tsx`

**Změny:**
```typescript
import { getCarrierName } from '@/lib/shipping';

// Přidat zobrazení dopravce do shipment card (line 160-199)
<div className="flex items-start">
  <dt className="text-sm font-medium text-gray-500 w-40 flex-shrink-0">
    Dopravce:
  </dt>
  <dd className="text-sm text-gray-900 font-medium">
    {getCarrierName(order.carrier)}
  </dd>
</div>
```

### Krok 6: Hints pro tracking formáty

**Soubor:** `/app/admin/objednavky/[id]/components/CreateShipmentModal.tsx`

**Změny:**
```typescript
const getTrackingHint = (carrier: CarrierType): string => {
  const hints: Record<CarrierType, string> = {
    zasilkovna: 'Např. Z123456789',
    gls: 'Např. 12345678',
    dpd: 'Např. 09010000000000',
    fedex: 'Např. 123456789012',
    ups: 'Např. 1Z999AA10123456784',
    other: 'Zadejte sledovací číslo',
  };

  return hints[carrier] || 'Zadejte sledovací číslo';
};

// V input pro tracking number (line 229-244):
<input
  // ...
  placeholder={getTrackingHint(carrier)}
  // ...
/>
<p className="mt-1 text-sm text-gray-500">
  {getTrackingHint(carrier)}
</p>
```

---

## ⏱️ ODHAD ČASU

### Přístup 1: MANUÁLNÍ s vylepšením (DOPORUČENO) ⭐

| Úkol | Čas |
|------|-----|
| Přidání `carrier` do schema + migrace | 15 min |
| Aktualizace shipments API | 30 min |
| Vytvoření `lib/shipping.ts` helper | 30 min |
| Aktualizace customer tracking page | 45 min |
| Aktualizace admin ShipmentHistory | 30 min |
| Přidání hints do CreateShipmentModal | 30 min |
| Testování | 30 min |
| **CELKEM** | **3-4 hodiny** |

### Přístup 2: ČÁSTEČNÁ INTEGRACE (Tracking API)

| Úkol | Čas |
|------|-----|
| Vše z Přístupu 1 | 4 h |
| Webhook endpoint pro notifikace | 3 h |
| Polling service pro status update | 2 h |
| Email notifikace při změně statusu | 2 h |
| Error handling a retry logika | 2 h |
| Testování | 2 h |
| **CELKEM** | **15-18 hodin** |

### Přístup 3: PLNÁ INTEGRACE

| Úkol | Čas |
|------|-----|
| Zásilkovna API integrace | 12 h |
| GLS API integrace | 12 h |
| DPD API integrace | 12 h |
| Česká pošta API integrace | 12 h |
| Webhook handling | 4 h |
| Tisk štítků | 4 h |
| Error handling a retry | 6 h |
| Testování | 8 h |
| **CELKEM** | **70-80 hodin** |

### Přístup 4: MULTI-CARRIER AGREGÁTOR

| Úkol | Čas |
|------|-----|
| Integrace Balíkobot API | 12 h |
| UI pro správu API klíčů | 4 h |
| Webhook handling | 4 h |
| Tisk štítků | 3 h |
| Testování | 5 h |
| **CELKEM** | **28-32 hodin** |
| **Měsíční náklady** | **500-2000 Kč** |

---

## 📚 API DOKUMENTACE

### Zásilkovna (Packeta)

**Oficiální dokumentace:** https://docs.packeta.com/

**API typ:** SOAP + REST
**Autentizace:** API key + API password
**Klíčové funkce:**
- Vytvoření zásilky
- Získání PDF štítku
- Tracking status
- Seznam pickup pointů

**Poznámky:**
- Od 1.9.2021 je povinné uvádět hmotnost zásilky
- PHP knihovna dostupná: https://github.com/Salamek/zasilkovna
- Trackování: `https://tracking.packeta.com/cz/?id={TRACKING_ID}`

### GLS Czech Republic

**Oficiální dokumentace:** https://dev-portal.gls-group.net/

**API typ:** SOAP
**API endpoint:** `http://online.gls-czech.com/webservices/soap_server.php?wsdl&ver=14.05.20.01`
**Autentizace:** API credentials
**Klíčové funkce:**
- Vytvoření zásilky
- Tisk štítků
- ParcelShop tracking
- ShopDeliveryService (PSD)

**Poznámky:**
- MyGLS - webové rozhraní pro e-shopy s stovkami zásilek denně
- Trackování: `https://gls-group.eu/CZ/cs/sledovani-zasilek?match={TRACKING}`

### DPD Czech Republic

**Oficiální dokumentace:**
- GeoAPI: https://geoapi.dpd.cz/public-docs/docs/intro/
- Shipping API: https://nst-preprod.dpsin.dpdgroup.com/api/docs/
- ParcelShop: https://pickup.dpd.cz/integrace/en/

**API typ:** REST (GeoAPI), SOAP (legacy)
**Autentizace:** JWT token
**Klíčové funkce:**
- CRUD zásilek
- Tisk štítků
- Pickup objednávky
- ParcelShop integrace

**Poznámky:**
- Pro API klíč kontaktovat DPD zákaznický servis
- GeoAPI je modernější REST API
- Trackování: `https://tracking.dpd.de/parcelstatus?query={TRACKING}`

### Česká pošta

**Oficiální dokumentace:** https://www.ceskaposta.cz/en/napi/b2b

**API název:** B2BZasilka nAPI
**API typ:** REST
**Autentizace:** API key generovaný v Pošta Online
**Klíčové funkce:**
- POST sendParcel (hromadné zásilky, až 1000)
- POST parcelService (jednotlivé zásilky)
- GET tracking status

**Poznámky:**
- 4 testovací účty k dispozici
- Po registraci přístup přes Pošta Online → Business Services
- Trackování: `https://www.postaonline.cz/trackandtrace/-/zasilka/cislo?parcelNumbers={TRACKING}`

### Third-Party Agregátory

#### Balíkobot
**Dokumentace:** https://balikobot.docs.apiary.io/
**Podporované dopravce:** 20+ dopravců (Zásilkovna, GLS, DPD, Česká pošta, PPL, Geis...)
**Výhody:**
- Jedna API pro všechny dopravce
- Předplacené poštovné
- Vyjednané ceny
- Česká podpora

#### AfterShip
**Dokumentace:** https://www.aftership.com/docs/tracking
**Zaměření:** Tracking API (neřeší vytváření zásilek)
**Podporované dopravce:** 1100+ dopravců globálně

#### TrackingMore
**Dokumentace:** https://www.trackingmore.com/api
**Zaměření:** Tracking API
**Podporované dopravce:** 1200+ dopravců globálně

---

## 🎯 ZÁVĚREČNÉ DOPORUČENÍ

### Pro váš e-shop doporučuji: **PŘÍSTUP 1 - MANUÁLNÍ s vylepšením** ⭐⭐⭐⭐⭐

**Proč:**
1. ✅ **Nízké náklady:** Žádné API poplatky, 3-4 hodiny vývoje
2. ✅ **Spolehlivost:** Žádná závislost na externích API
3. ✅ **Jednoduchost:** Snadná údržba a debugging
4. ✅ **Flexibilita:** Můžete používat jakéhokoliv dopravce
5. ✅ **Rychlé řešení:** Implementace během jednoho dne

**Co získáte:**
- ✅ Uložení dopravce v databázi
- ✅ Správné tracking linky pro zákazníky
- ✅ Hints pro tracking formáty v admin panelu
- ✅ Lepší UX pro adminy i zákazníky

**Co zůstane manuální:**
- ❌ Vytváření zásilky u dopravce (web rozhraní)
- ❌ Kopírování tracking number do systému
- ❌ Tisk štítků přes web dopravce

**Kdy upgradovat na Přístup 4 (Balíkobot):**
- Když budete mít 50+ objednávek denně
- Když ruční práce zabere více než 1-2 hodiny denně
- Když chcete automatizovat tisk štítků

---

## 📊 RYCHLÁ DECISION MATRIX

| Objednávky/den | Doporučené řešení | Implementační čas | Měsíční náklady |
|----------------|-------------------|-------------------|-----------------|
| 1-20 | Přístup 1 (Manuální+) | 3-4 h | 0 Kč |
| 20-50 | Přístup 1 (Manuální+) | 3-4 h | 0 Kč |
| 50-100 | Přístup 4 (Balíkobot) | 28-32 h | 500-1500 Kč |
| 100-200 | Přístup 4 (Balíkobot) | 28-32 h | 1000-2000 Kč |
| 200+ | Přístup 3 (Plná integrace) | 70-80 h | 0 Kč (API zdarma) |

---

## ✅ AKČNÍ KROKY

### Krok 1: Rychlé vylepšení (3-4 hodiny)
1. ✅ Přidat `carrier` pole do Order modelu
2. ✅ Vytvořit `lib/shipping.ts` helper
3. ✅ Aktualizovat shipments API
4. ✅ Aktualizovat customer tracking page
5. ✅ Aktualizovat admin UI
6. ✅ Otestovat

### Krok 2: Monitoring (1-2 měsíce)
- Sledovat počet objednávek denně
- Měřit čas strávený manuálním vytvářením zásilek
- Sbírat feedback od zákazníků

### Krok 3: Rozhodnutí o upgrade (podle metriky)
- Pokud > 50 objednávek/den → zvážit Balíkobot
- Pokud > 200 objednávek/den → zvážit plnou integraci
- Pokud < 50 objednávek/den → zůstat u manuálního

---

**Vytvořeno:** 16. prosince 2025
**Autor:** Claude Code Sonnet 4.5
**Verze dokumentu:** 1.0
