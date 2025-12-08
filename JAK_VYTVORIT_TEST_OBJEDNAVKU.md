# 🛒 Jak vytvořit test objednávku

## Metoda 1: Přes Admin Panel (Nejjednodušší) ⭐

### Krok 1: Otevři Admin Panel
```
http://localhost:3000/admin/objednavky
```
Nebo na produkci:
```
https://muzaready-iota.vercel.app/admin/objednavky
```

### Krok 2: Otevři Developer Console (F12)
V konzoli zadej:
```javascript
// Vytvoří test objednávku
fetch('/api/admin/test-order', {
  method: 'POST',
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('✅ Test objednávka vytvořena:', data);
  // Obnov stránku, aby se objednávka zobrazila
  window.location.reload();
})
.catch(err => console.error('❌ Chyba:', err));
```

---

## Metoda 2: Přes curl (Terminál)

### Lokálně:
```bash
# Nejdřív se přihlas do admin panelu v prohlížeči
# Pak zkopíruj session cookie a použij ho:

curl -X POST http://localhost:3000/api/admin/test-order \
  -H "Cookie: admin-session=TVOJE_SESSION_COOKIE" \
  -H "Content-Type: application/json"
```

### Na produkci:
```bash
curl -X POST https://muzaready-iota.vercel.app/api/admin/test-order \
  -H "Cookie: admin-session=TVOJE_SESSION_COOKIE" \
  -H "Content-Type: application/json"
```

---

## Metoda 3: Přes existující seed skript

Pokud máš lokální databázi (SQLite):
```bash
npm run seed
```

Tento skript vytvoří test objednávku automaticky.

---

## Metoda 4: Ručně přes API (Pokud máš SKU ID)

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+420123456789",
    "streetAddress": "Test 123",
    "city": "Praha",
    "zipCode": "11000",
    "deliveryMethod": "standard",
    "items": [
      {
        "skuId": "SKU_ID_ZDE",
        "skuName": "Test produkt",
        "quantity": 100,
        "lineTotal": 6500,
        "lineGrandTotal": 6650
      }
    ]
  }'
```

---

## ✅ Co se stane po vytvoření

1. **Test objednávka se vytvoří** s těmito údaji:
   - Email: `test-{timestamp}@example.com`
   - Status: `pending` / `unpaid` / `pending`
   - Celková cena: 6,650 Kč
   - První dostupný SKU z databáze

2. **Můžeš ji vidět v admin panelu:**
   - Seznam objednávek: `/admin/objednavky`
   - Detail objednávky: `/admin/objednavky/{orderId}`

3. **Můžeš testovat:**
   - ✅ Filtry (podle statusu, emailu, kanálu)
   - ✅ Paginace
   - ✅ Sorting
   - ✅ Bulk actions
   - ✅ Capture Payment
   - ✅ Create Shipment
   - ✅ Edit metadata
   - ✅ CSV export

---

## 🔍 Jak zjistit ID vytvořené objednávky

Po vytvoření přes API dostaneš odpověď:
```json
{
  "success": true,
  "message": "Test objednávka byla úspěšně vytvořena",
  "order": {
    "id": "clx1234567890",
    "email": "test-1234567890@example.com",
    "total": 6650,
    "status": "pending"
  }
}
```

Nebo se podívej do admin panelu - objednávka se zobrazí v seznamu.

---

## 💡 Tip

**Pro vytvoření více test objednávek s různými statusy:**
1. Vytvoř první test objednávku (pending/unpaid)
2. V admin panelu ji označ jako "Zaplaceno" (Capture Payment)
3. Vytvoř další test objednávku
4. Atd.

Nebo můžeš upravit API endpoint, aby vytvářel více objednávek najednou.

---

**Nejjednodušší způsob:** Metoda 1 (přes Developer Console v admin panelu) ⭐

