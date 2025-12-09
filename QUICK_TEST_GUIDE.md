# 🚀 RYCHLÝ PRŮVODCE TESTOVÁNÍM

## Krok 1: Spusť dev server

```bash
npm run dev
```

Otevři: http://localhost:3000/admin

---

## Krok 2: Přihlas se jako admin

Pokud ještě nemáš admin účet, vytvoř ho přes `/admin/setup`

---

## Krok 3: Vytvoř test objednávku

1. Jdi na: http://localhost:3000/admin/objednavky
2. Klikni na tlačítko **"➕ Vytvořit test objednávku"**
3. Otevři detail objednávky (klikni na ID)

---

## Krok 4: Test automatického odečítání zásob

### Před zaplacením:
1. Zapiš si aktuální stav zásob SKU (jdi na `/admin/sklad`)
2. Vrať se do detailu objednávky

### Po zaplacení:
1. Klikni na **"Označit jako zaplaceno"**
2. Zkontroluj:
   - ✅ Zásoby byly odečteny (`/admin/sklad`)
   - ✅ Faktura byla vytvořena (sekce "Platba" v detailu)
   - ✅ OrderStatus = "processing"
   - ✅ V konzoli vidíš log: "📄 Invoice ... generated"

---

## Krok 5: Test automatického workflow

1. Klikni na **"Označit jako odesláno"**
   - ✅ DeliveryStatus = "shipped"
   - ✅ Email o odeslání byl odeslán (konzole)

2. Klikni na **"Označit jako doručeno"**
   - ✅ OrderStatus se automaticky změnil na **"completed"**
   - ✅ DeliveryStatus = "delivered"
   - ✅ Email o doručení byl odeslán (konzole)

---

## Krok 6: Test Customer Tracking Page

1. Zkopíruj ID objednávky a email z detailu
2. Jdi na: http://localhost:3000/sledovani-objednavky
3. Zadej email a ID objednávky
4. Zkontroluj:
   - ✅ Status badges jsou zobrazeny
   - ✅ Tracking číslo (pokud existuje)
   - ✅ Detaily objednávky

---

## Krok 7: Test refund workflow

1. Vrať se do detailu objednávky
2. Zapiš si aktuální stav zásob (před refundem)
3. Klikni na **"Označit jako refunded"**
4. Potvrď refund
5. Zkontroluj:
   - ✅ Zásoby byly vráceny na sklad (`/admin/sklad`)
   - ✅ PaymentStatus = "refunded"
   - ✅ Email o refundu byl odeslán (konzole)

---

## Krok 8: Test Low Stock Alerts

1. Jdi na: http://localhost:3000/admin (dashboard)
2. Zkontroluj sekci **"⚠️ Upozornění na nízké zásoby"**
3. Měly by se zobrazit SKU s nízkými zásobami

---

## 📧 Email notifikace

**Pokud máš RESEND_API_KEY:**
- Emaily se pošlou skutečně
- Zkontroluj emailovou schránku zákazníka

**Pokud nemáš RESEND_API_KEY:**
- Emaily se nepošlou, ale v konzoli uvidíš logy:
  - `Order confirmation email sent: ...`
  - `Payment confirmation email sent: ...`
  - `Shipping notification email sent: ...`
  - `Delivery confirmation email sent: ...`
  - `Order cancellation email sent: ...`

---

## 🔍 Co kontrolovat v konzoli

Při každé změně statusu bys měl vidět:
- `✅ Order ... paid and stock deducted` (při zaplacení)
- `📄 Invoice ... generated and sent` (při zaplacení)
- `Shipping notification email sent` (při odeslání)
- `Delivery confirmation email sent` (při doručení)
- `Order cancellation email sent` (při refundu)

---

## ⚠️ Časté problémy

**Zásoby se neodečtou:**
- Zkontroluj, že SKU má `inStock: true` a `soldOut: false`
- Zkontroluj konzoli pro chybové hlášky

**Faktura se nevytvoří:**
- Zkontroluj, že objednávka je skutečně zaplacena (`paymentStatus: 'paid'`)
- Zkontroluj konzoli pro chybové hlášky

**Email se nepošle:**
- Zkontroluj, že máš `RESEND_API_KEY` v `.env.local`
- Zkontroluj konzoli pro chybové hlášky

---

## ✅ Checklist

- [ ] Test automatického odečítání zásob ✅
- [ ] Test automatického workflow ✅
- [ ] Test Customer Tracking Page ✅
- [ ] Test refund workflow ✅
- [ ] Test Low Stock Alerts ✅

---

## 🎉 Hotovo!

Pokud všechny testy projdou, všechny nové funkce fungují správně!
