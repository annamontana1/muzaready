# Warehouse Scanner System - Skladový Skener

Systém pro skenování QR kódů produktů v skladě a automatické vytváření objednávek. Plně funkční PWA aplikace pro počítače, tablety a mobilní telefony.

## Jak to funguje

### 1. Skenování produktů
1. Jděte na adresu: `/admin/warehouse-scanner`
2. Klikněte na tlačítko "Spustit skenování" pro aktivaci kamery
3. Naskenujte QR kód na balení vlásů
4. Systém automaticky:
   - Vyhledá produkt v databázi
   - Ověří dostupnost zásob
   - Přidá položku do nákupního seznamu
   - Zobrazí cenu a počet položek

### 2. Vytvoření objednávky
1. Jakmile skončite se skenováním produktů
2. Klikněte na tlačítko "Dokončit a vytvořit objednávku"
3. Vyplňte údaje zákazníka:
   - Email
   - Jméno a příjmení
   - Telefon (volitelné)
   - Adresa (ulice, město, PSČ)
   - Země (výchozí: CZ)
   - Způsob doručení (standard/express)
   - Způsob platby (bankovní převod/GoPay/hotovost)

4. Objednávka je vytvořena a:
   - Zásoby jsou automaticky sníženy
   - Je zaznamenán pohyb zásob (audit trail)
   - Relace je uzavřena a připravena k dalšímu použití

## Soubory a komponenty

### Databázové modely (Prisma)
- **ScanSession** (`prisma/schema.prisma:293-305`)
  - Sleduje jednu skenovanou relaci
  - Stav: `scanning`, `completed`, `synced`
  - Obsahuje součet ceny a počet položek

- **ScanItem** (`prisma/schema.prisma:308-321`)
  - Jednotlivá skenovaná položka
  - Vztah k SKU a relaci
  - Cena a množství

### API Endpoints

#### 1. SKU Lookup - `/api/admin/scan-sku`
```
GET /api/admin/scan-sku?sku=VLASYX-BULK-001
```
Vrací informace o produktu:
- ID, název, tvar, délka
- Ceny (Kč, EUR)
- Dostupné množství
- Stav zásob

**Odpověď:**
```json
{
  "success": true,
  "sku": {
    "id": "clc123...",
    "skuCode": "VLASYX-BULK-001",
    "name": "Test VlasyX",
    "pricePerGramCzk": 18.50,
    "inStock": true
  }
}
```

#### 2. Scan Session - `/api/admin/scan-session`

**GET** - Načtení relace
```
GET /api/admin/scan-session?sessionId=clc456...
```

**POST** - Vytvoření, přidání položky, aktualizace stavu

Vytvoření nové relace:
```json
{
  "action": "create"
}
```

Přidání položky:
```json
{
  "action": "addItem",
  "sessionId": "clc456...",
  "skuId": "clc123...",
  "skuName": "Product Name",
  "price": 1850,  // v korunách
  "quantity": 1
}
```

Aktualizace stavu:
```json
{
  "action": "updateStatus",
  "sessionId": "clc456...",
  "status": "completed"  // scanning, completed, synced
}
```

#### 3. Scan Orders - `/api/admin/scan-orders`

**POST** - Vytvoření objednávky z relace
```json
{
  "sessionId": "clc456...",
  "email": "customer@example.com",
  "firstName": "Jan",
  "lastName": "Novák",
  "phone": "+420732123456",
  "streetAddress": "Ulice 123",
  "city": "Praha",
  "zipCode": "11000",
  "country": "CZ",
  "deliveryMethod": "standard",
  "paymentMethod": "bank_transfer"
}
```

Funkce:
- Vytvoří Order záznam
- Vytvoří OrderItem pro každou skenovanou položku
- Snižuje zásoby přes StockMovement (OUT)
- Aktualizuje dostupné gramy na SKU
- Označí relaci jako `synced`

**Odpověď:**
```json
{
  "success": true,
  "message": "Objednávka byla úspěšně vytvořena",
  "order": {
    "id": "clc789...",
    "email": "customer@example.com",
    "total": 10250,
    "itemCount": 2,
    "status": "awaiting_payment"
  }
}
```

### Frontend komponenta
**Soubor:** `/app/admin/warehouse-scanner/page.tsx`

Funkce:
- Inicializace kamery (html5-qrcode)
- Skenování QR kódů v reálném čase
- Prevence duplicitních skenů (1 sekunda)
- Zobrazení seznamu skenovaných položek
- Shrnutí (počet položek, celková cena)
- Tlačítko pro dokončení a vytvoření objednávky
- Obsluha chyb a stavy

**UI prvky:**
- Náhled z kamery (450px x viditelná výška)
- Seznam skenovaných položek s rollover efektem
- Informační panel se stávem relace
- Ovládací tlačítka (Spustit/Zastavit, Nová relace)

## Technologie

- **QR kód čtení:** html5-qrcode + html5-qr-code-styling
- **Kamera:** WebRTC API (přední fotoaparát pro počítač, hlavní kamera pro mobil)
- **Databáze:** SQLite s Prisma ORM
- **Backend:** Next.js API Routes (Node.js runtime)
- **Frontend:** Next.js 14 s React 18 a Tailwind CSS

## Jak nastavit QR kódy na produktech

Každý SKU potřebuje QR kód obsahující SKU kód. Příklady:
- `VLASYX-BULK-001`
- `PLATINUM-PIECE-001`

QR kódy lze generovat pomocí librarny `qrcode`:
```bash
npm install qrcode
```

Príklad generování QR kódu:
```javascript
const QRCode = require('qrcode');

QRCode.toFile('qr-code.png', 'VLASYX-BULK-001', {
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, (err) => {
  if (err) throw err;
  console.log('QR kód vytvořen!');
});
```

## Data flow

```
1. Skenování QR kódu
   ↓
2. Lookup SKU (GET /api/admin/scan-sku)
   ↓
3. Přidání do relace (POST /api/admin/scan-session?action=addItem)
   ↓
4. Zobrazení v seznamu
   ↓
5. Opakování pro další produkty
   ↓
6. Kliknutí "Dokončit"
   ↓
7. Updatování statusu relace (POST /api/admin/scan-session?action=updateStatus)
   ↓
8. Vytvoření objednávky (POST /api/admin/scan-orders)
   ↓
9. Snížení zásob (StockMovement)
   ↓
10. Označení relace jako synced
```

## Testing

### Test SKU lookup
```bash
curl "http://localhost:3000/api/admin/scan-sku?sku=VLASYX-BULK-001"
```

### Test vytvoření relace
```bash
curl -X POST http://localhost:3000/api/admin/scan-session \
  -H "Content-Type: application/json" \
  -d '{"action": "create"}'
```

### Test vytvoření objednávky
```bash
curl -X POST http://localhost:3000/api/admin/scan-orders \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "streetAddress": "Test St",
    "city": "Prague",
    "zipCode": "11000",
    "deliveryMethod": "standard",
    "paymentMethod": "bank_transfer"
  }'
```

## Integrace s Fakturoidem (Budoucí)

Plán pro budoucí verzi:
1. Po vytvoření objednávky zavolat Fakturoid API
2. Automatické vytvoření faktury
3. Zaslání faktury na email zákazníka
4. Synchronizace stavu objednávky s Fakturoidem

## Budoucí vylepšení

- [ ] Offline režim s Service Worker a IndexedDB
- [ ] Synchronizace offline dat
- [ ] Mobilní PWA instalace
- [ ] Barcode skenování (ne pouze QR)
- [ ] Tisk štítků pro balení
- [ ] Fakturoid integrace
- [ ] Statistiky skenování
- [ ] Vyhledávání produktů bez QR kódu
- [ ] Více způsobů platby (Stripe, PayPal)

## Běžné problémy

### Kamera nefunguje
- Zkontrolujte, zda máte povolení pro přístup k kameře
- Na HTTPS lokálku se povolení pamatuje
- Zkuste jiný prohlížeč (Chrome, Edge, Safari)

### SKU nenalezen
- Ověřte, že je SKU v databázi
- Zkontrolujte, že je SKU označen jako `inStock: true`
- Viz SKU číslo na QR kódu

### Zásoby se nesnižují
- Zkontrolujte, že `availableGrams` je vyplněné
- Ověřte, že StockMovement jsou vytvořeny
- Zkontrolujte Prisma Studio pro ladění

## Support

Pro hlášení chyb a issues:
1. Zkontrolujte server logy: `npm run dev`
2. Otevřete DevTools (F12) pro chyby na klientovi
3. Zkontrolujte Prisma Studio: `npx prisma studio`

---

**Poslední aktualizace:** 1. 12. 2025
