# 🚀 TESTOVÁNÍ NA PRODUKCI - VERCEL

## ✅ Proč testovat na produkci?

- ✅ **Localhost nefunguje** - problémy s Supabase připojením
- ✅ **Všechny změny jsou nasazeny** - pushnuto na main branch
- ✅ **Všechno funguje správně** - produkční databáze a konfigurace
- ✅ **Email notifikace fungují** - pokud je RESEND_API_KEY nastaven

---

## 🌐 PRODUKČNÍ URL

### Admin Panel
```
https://muzaready-iota.vercel.app/admin
```

### Customer Tracking
```
https://muzaready-iota.vercel.app/sledovani-objednavky
```

### Katalog
```
https://muzaready-iota.vercel.app/katalog
```

---

## 📋 VŠECHNY ZMĚNY JSOU NASAZENY

✅ Automatické odečítání zásob při zaplacení  
✅ Automatické vytváření faktury  
✅ Email notifikace (order, payment, shipping, delivery, refund)  
✅ Automatické workflow (processing → completed)  
✅ Refund handling (vrácení zásob)  
✅ Customer tracking page (vylepšený)  
✅ Low stock alerts  

---

## 🚀 JAK TESTOVAT

### Krok 1: Otevři Admin Panel
```
https://muzaready-iota.vercel.app/admin
```

### Krok 2: Přihlas se jako admin
- Pokud ještě nemáš účet, vytvoř ho přes `/admin/setup`

### Krok 3: Vytvoř test objednávku
1. Jdi na: `/admin/objednavky`
2. Klikni na tlačítko **"➕ Vytvořit test objednávku"**
3. Otevři detail objednávky (klikni na ID)

### Krok 4: Test automatického odečítání zásob
1. Zapiš si aktuální stav zásob SKU (jdi na `/admin/sklad`)
2. V detailu objednávky klikni na **"Označit jako zaplaceno"**
3. Zkontroluj:
   - ✅ Zásoby byly odečteny (`/admin/sklad`)
   - ✅ Faktura byla vytvořena (sekce "Platba" v detailu)
   - ✅ OrderStatus = "processing"

### Krok 5: Test automatického workflow
1. Klikni na **"Označit jako odesláno"**
   - ✅ DeliveryStatus = "shipped"
   - ✅ Email o odeslání byl odeslán
2. Klikni na **"Označit jako doručeno"**
   - ✅ OrderStatus se automaticky změnil na **"completed"**
   - ✅ DeliveryStatus = "delivered"
   - ✅ Email o doručení byl odeslán

### Krok 6: Test Customer Tracking Page
1. Zkopíruj ID objednávky a email z detailu
2. Jdi na: `/sledovani-objednavky`
3. Zadej email a ID objednávky
4. Zkontroluj:
   - ✅ Status badges jsou zobrazeny
   - ✅ Tracking číslo (pokud existuje)
   - ✅ Detaily objednávky

### Krok 7: Test refund workflow
1. Vrať se do detailu objednávky
2. Zapiš si aktuální stav zásob (před refundem)
3. Klikni na **"Označit jako refunded"**
4. Potvrď refund
5. Zkontroluj:
   - ✅ Zásoby byly vráceny na sklad (`/admin/sklad`)
   - ✅ PaymentStatus = "refunded"
   - ✅ Email o refundu byl odeslán

### Krok 8: Test Low Stock Alerts
1. Jdi na: `/admin` (dashboard)
2. Zkontroluj sekci **"⚠️ Upozornění na nízké zásoby"**
3. Měly by se zobrazit SKU s nízkými zásobami

---

## 📧 Email notifikace

**Pokud je RESEND_API_KEY nastaven v Vercel:**
- Emaily se pošlou skutečně
- Zkontroluj emailovou schránku zákazníka

**Pokud není RESEND_API_KEY nastaven:**
- Emaily se nepošlou, ale funkce fungují
- Všechny ostatní funkce jsou dostupné

---

## ⚠️ POZOR

- ✅ Testuješ na **produkční databázi**
- ✅ Vytváříš **skutečné objednávky**
- ✅ Můžeš použít **test email** pro notifikace
- ✅ Všechny změny jsou **trvalé**

---

## 🔍 Co kontrolovat

### V Admin Panelu:
- ✅ Zásoby před/po změně statusu (`/admin/sklad`)
- ✅ Faktura v sekci "Platba" v detailu objednávky
- ✅ Status změny v UI
- ✅ Low stock alerts na dashboardu

### V Emailu (pokud je RESEND_API_KEY):
- ✅ Order confirmation email
- ✅ Payment confirmation email
- ✅ Shipping notification email
- ✅ Delivery confirmation email
- ✅ Refund email

---

## ✅ Checklist

- [ ] Test automatického odečítání zásob
- [ ] Test automatického workflow
- [ ] Test Customer Tracking Page
- [ ] Test refund workflow
- [ ] Test Low Stock Alerts
- [ ] Test email notifikace (pokud je RESEND_API_KEY)

---

## 🎉 Hotovo!

Pokud všechny testy projdou, všechny nové funkce fungují správně!
