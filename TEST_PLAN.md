# 🧪 TEST PLAN - Nové funkce e-shopu

## 1. Test automatického odečítání zásob při zaplacení

**Kroky:**
1. Jdi na `/admin/objednavky`
2. Klikni na "Vytvořit test objednávku"
3. Otevři detail objednávky
4. Zkontroluj aktuální stav zásob SKU (před zaplacením)
5. Klikni na "Označit jako zaplaceno"
6. Zkontroluj:
   - ✅ Zásoby byly odečteny (jdi na `/admin/sklad`)
   - ✅ Faktura byla vytvořena (v sekci "Platba" v detailu objednávky)
   - ✅ Email byl odeslán (zkontroluj email zákazníka)
   - ✅ OrderStatus se změnil na "processing"

**Očekávaný výsledek:**
- Zásoby se odečtou automaticky
- Faktura se vytvoří a odešle emailem
- Email potvrzení platby byl odeslán

---

## 2. Test automatického workflow

**Kroky:**
1. V detailu zaplacené objednávky
2. Klikni na "Označit jako odesláno"
3. Zkontroluj:
   - ✅ Email o odeslání byl odeslán
   - ✅ DeliveryStatus = "shipped"
4. Klikni na "Označit jako doručeno"
5. Zkontroluj:
   - ✅ Email o doručení byl odeslán
   - ✅ OrderStatus se automaticky změnil na "completed"
   - ✅ DeliveryStatus = "delivered"

**Očekávaný výsledek:**
- Po doručení se automaticky nastaví "completed"
- Emaily jsou odeslány správně

---

## 3. Test Customer Tracking Page

**Kroky:**
1. Jdi na `/sledovani-objednavky`
2. Zadej email a ID objednávky
3. Zkontroluj:
   - ✅ Zobrazení status badges
   - ✅ Tracking číslo (pokud existuje)
   - ✅ Historie změn
   - ✅ Detaily objednávky

**Očekávaný výsledek:**
- Všechny informace jsou zobrazeny správně
- Status badges jsou barevně rozlišené

---

## 4. Test refund workflow

**Kroky:**
1. V detailu zaplacené objednávky
2. Klikni na "Označit jako refunded"
3. Potvrď refund
4. Zkontroluj:
   - ✅ Zásoby byly vráceny na sklad (jdi na `/admin/sklad`)
   - ✅ Email o refundu byl odeslán
   - ✅ PaymentStatus = "refunded"
   - ✅ StockMovement záznamy byly vytvořeny (typ "IN")

**Očekávaný výsledek:**
- Zásoby se vrátí na sklad
- Email o refundu byl odeslán
- StockMovement záznamy jsou správné

---

## 5. Test automatického skrytí produktů mimo sklad

**Kroky:**
1. Jdi na `/katalog`
2. Zkontroluj, že produkty s `inStock: false` nebo `soldOut: true` se nezobrazují
3. V admin panelu označ SKU jako `soldOut: true`
4. Obnov katalog
5. Zkontroluj, že produkt zmizel

**Očekávaný výsledek:**
- Produkty mimo sklad se nezobrazují v katalogu

---

## 6. Test Low Stock Alerts

**Kroky:**
1. Jdi na `/admin` (dashboard)
2. Zkontroluj sekci "Upozornění na nízké zásoby"
3. Měly by se zobrazit SKU s:
   - `availableGrams < 100` (pro BULK_G)
   - `soldOut: true`
   - `inStock: false`

**Očekávaný výsledek:**
- Low stock alerty se zobrazují na dashboardu

---

## 7. Test Stock Validation při Checkoutu

**Kroky:**
1. Jdi na `/katalog`
2. Přidej produkt do košíku
3. V admin panelu označ SKU jako `soldOut: true`
4. Pokus se dokončit objednávku
5. Zkontroluj:
   - ✅ Objednávka se nevytvoří
   - ✅ Zobrazí se chybová hláška o nedostupnosti

**Očekávaný výsledek:**
- Checkout selže, pokud produkt není na skladě

---

## 📝 Poznámky k testování

- **Email notifikace:** Zkontroluj emailovou schránku zákazníka (nebo použij test email)
- **Zásoby:** Vždy zkontroluj `/admin/sklad` před a po změně statusu
- **StockMovement:** Zkontroluj v databázi nebo v admin panelu (pokud je tam sekce)
- **Faktura:** Měla by se vytvořit automaticky při zaplacení

---

## ✅ Checklist dokončení testů

- [ ] Test automatického odečítání zásob
- [ ] Test automatického workflow
- [ ] Test Customer Tracking Page
- [ ] Test refund workflow
- [ ] Test automatického skrytí produktů
- [ ] Test Low Stock Alerts
- [ ] Test Stock Validation při Checkoutu
