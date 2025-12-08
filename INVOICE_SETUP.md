# 📄 Nastavení fakturačního systému

## 🚨 DŮLEŽITÉ: Spusť databázovou migraci

Aplikace právě spadá s chybou "Application error: a client-side exception has occurred", protože **Invoice tabulka ještě neexistuje v databázi**.

### Krok 1: Spusť SQL migraci v Supabase

1. **Otevři Supabase Dashboard**
   - Jdi na https://supabase.com/dashboard
   - Vyber svůj projekt: `muzaready`

2. **Otevři SQL Editor**
   - V levém menu klikni na **"SQL Editor"**
   - Nebo jdi přímo na: https://supabase.com/dashboard/project/bcbqrhkoosopmtrryrcy/sql

3. **Spusť migrační script**
   - Vytvoř nový query
   - Zkopíruj celý obsah souboru `prisma/invoice-migration.sql`
   - Klikni na **"Run"** (nebo stiskni `Cmd/Ctrl + Enter`)

4. **Ověř, že migrace proběhla úspěšně**
   - V levém menu klikni na **"Table Editor"**
   - Měl bys vidět novou tabulku **"invoices"**
   - V tabulce **"Order"** by měly být nové sloupce:
     - `companyName`
     - `ico`
     - `dic`
     - `billingStreet`
     - `billingCity`
     - `billingZipCode`
     - `billingCountry`

### Krok 2: Nastav environment variables pro faktury

V **Vercel Dashboard** (https://vercel.com/jevg-ones-projects/muzaready/settings/environment-variables) přidej tyto proměnné:

#### Dodavatel (Mùza Hair s.r.o.)
```
INVOICE_SUPPLIER_NAME=Mùza Hair s.r.o.
INVOICE_SUPPLIER_STREET=Tvoje ulice 123
INVOICE_SUPPLIER_CITY=Praha
INVOICE_SUPPLIER_ZIP=12000
INVOICE_SUPPLIER_ICO=12345678
INVOICE_SUPPLIER_DIC=CZ12345678
INVOICE_SUPPLIER_EMAIL=info@muzahair.cz
INVOICE_SUPPLIER_PHONE=+420 728 722 880
```

#### Bankovní údaje
```
INVOICE_BANK_ACCOUNT=123456789/0100
INVOICE_IBAN=CZ6501000000001234567890
INVOICE_SWIFT=KOMBCZPPXXX
```

### Krok 3: Redeploy aplikace

Po přidání environment variables:
1. Jdi do **Vercel Dashboard > Deployments**
2. Klikni na **"Redeploy"** u posledního deployme ntu
3. Nebo pushni prázdný commit:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

## ✅ Co bylo implementováno

### 1. Automatická fakturace po platbě
- Po úspěšné platbě přes GoPay se **automaticky vygeneruje faktura**
- PDF faktura se **automaticky odešle emailem** zákazníkovi
- Faktura obsahuje všechny potřebné údaje (IČO, DIČ, DPH 21%)

### 2. Manuální generování faktur v adminu
- V admin panelu > Objednávky > Detail objednávky > Tab **"Platba"**
- Tlačítko **"Vygenerovat fakturu"** (viditelné pouze pro zaplacené objednávky)
- Po kliknutí:
  - Vygeneruje se PDF faktura
  - Odešle se email zákazníkovi
  - Stáhne se PDF do prohlížeče
  - Zobrazí se info o faktuře (číslo, datum, status)

### 3. Tracking platby pro showroom
- V admin panelu > Detail objednávky > Tab **"Platba"**
- Tlačítko **"Upravit"** u způsobu platby
- Možnost vybrat:
  - 💳 **Karta (showroom)**
  - 💵 **Hotovost (showroom)**
  - 🌐 **GoPay (online platba)**
  - 🏦 **Bankovní převod**
- Po uložení se způsob platby zobrazí s ikonkou

### 4. Automatické číslování faktur
- Formát: **YYYY001**, **YYYY002** atd.
- Příklad: `2025001`, `2025002`...
- Každý rok začíná od 001

---

## 📱 Jak používat fakturační systém

### Pro online objednávky (GoPay):
1. Zákazník zaplatí přes GoPay
2. **Automaticky** se vygeneruje faktura
3. **Automaticky** se odešle email s PDF přílohou
4. V admin panelu je vidět číslo faktury a lze ji stáhnout

### Pro showroom prodeje:
1. Vytvoř objednávku v admin panelu (channel: `showroom`)
2. Vyber způsob platby: **Karta** nebo **Hotovost**
3. Označ objednávku jako **"Zaplaceno"**
4. Klikni na **"Vygenerovat fakturu"**
5. PDF se stáhne a odešle emailem zákazníkovi

---

## 🐛 Troubleshooting

### Aplikace stále ukazuje error
1. **Zkontroluj, že migrace proběhla** (tabulka `invoices` existuje v Supabase)
2. **Vyčkej 1-2 minuty** po pushnutí - Vercel automaticky deployuje
3. **Hard refresh** prohlížeče: `Cmd/Ctrl + Shift + R`
4. Zkontroluj Vercel logs: `npx vercel logs muzaready-iota.vercel.app`

### Faktura se negeneruje
1. Zkontroluj, že objednávka má `paymentStatus = 'paid'`
2. Zkontroluj, že `RESEND_API_KEY` je nastavený v Vercel environment variables
3. Zkontroluj Vercel logs pro error messages

### Email se neodes ílá
1. Zkontroluj `RESEND_API_KEY` v Vercel environment variables
2. Zkontroluj, že email adresa zákazníka je validní
3. Faktura se stále vygeneruje a uloží do DB, i když email selže

---

## 📞 Support

Pokud něco nefunguje, pošli screenshot error message nebo Vercel logs.
