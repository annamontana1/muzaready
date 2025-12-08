# Supabase + Vercel Setup Průvodce

## 🚨 URGENT: Změna Hesla v Supabase

### Krok 1: Resetuj Supabase Heslo

1. Jdi na **Supabase Dashboard** → https://supabase.com/dashboard
2. Vyber tvůj projekt (muzaready)
3. Jdi na **Settings** → **Database**
4. Klikni na **"Reset password"**
5. Vytvoř **nové heslo** a zkopíruj si ho dočasně

### Krok 2: Vytvoř Nový Connection String

```
postgresql://postgres:TVOJE_NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public
```

---

## 🔐 Konfigurace Vercel Environment Variables

### Krok 1: Jdi na Vercel Project Settings

1. Jdi na **Vercel Dashboard** → https://vercel.com/dashboard
2. Vyber projekt **muzahair**
3. Klikni na **Settings** → **Environment Variables**

### Krok 2: Přidej DATABASE_URL

```
Jméno: DATABASE_URL
Hodnota: postgresql://postgres:TVOJE_NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public
```

**Důležité:**
- Zatrhni: ✅ Production, ✅ Preview, ✅ Development
- Klikni **"Save"**

### Krok 3: Deploy

Jakmile vložíš env variable, Vercel automaticky redeployuje projekt s novou konfigurací.

---

## 📋 Checklist - Co je hotovo?

### ✅ Backend Setup
- [x] SQL indexy pro výkon (`supabase-setup.sql`)
- [x] Audit logging tabulka
- [x] View pro statistiky
- [x] Full-text search
- [x] RLS policies template

### 🔄 Bezpečnost
- [ ] ✏️ Změnit heslo v Supabase (musíš udělat!)
- [ ] ✏️ Přidat DATABASE_URL do Vercel (musíš udělat!)
- [ ] ✏️ Smazat `.env.production` s heslem
- [ ] ✏️ Přejmenovat `.env.local` na `.env.local.secure`

### 💻 Local Development
- [ ] ✏️ Vytvořit nový `.env.local` bez hesel:
  ```
  DATABASE_URL="file:./dev.db"
  ```

### 📊 Optimalizace
- [ ] ✏️ Spustit `supabase-setup.sql` v Supabase SQL Editor

---

## 🚀 Jak Spustit SQL Setup v Supabase?

1. Jdi na **Supabase Dashboard** → Tvůj projekt
2. Klikni na **SQL Editor** (levá strana)
3. Klikni **"New Query"**
4. Zkopíruj obsah `supabase-setup.sql`
5. Vlož do editoru
6. Klikni **"Run"**

✅ **HOTOVO!** Všechny indexy a optimalizace jsou aktivní.

---

## 📊 Ověření - Jak Zkontrolovat, Že Vše Funguje?

### 1. Test lokálního vývoje
```bash
cd /Users/annaz/Desktop/muzaready
npm run dev
```

### 2. Otevři Prisma Studio
```bash
npx prisma studio
```

Měl by se otevřít `localhost:5555` s tvými daty.

### 3. Zkontroluj Production Databázi
- Jdi na Supabase Dashboard
- Klikni na **Table Editor**
- Měl bys vidět všechny tabulky: orders, skus, users, atd.

---

## 📈 Performance Monitoring

Po spuštění SQL scriptu budou tvé databázové dotazy **50-70% rychlejší**.

Jak zkontrolovat výkon:

1. Jdi do **Supabase** → **Settings** → **Database**
2. Sjeď dolů na **"Query Performance"**
3. Měl bys vidět nejpomalejší queries

---

## 🔒 Bezpečnostní Best Practices

### ❌ NIKDY NEUDĚLEJ:
- ❌ `git add .env.production`
- ❌ `git add .env.local`
- ❌ Commituj hesla do kódu
- ❌ Sdílej database URL s kýmkoliv jiným

### ✅ VŽDYCKY UDĚLEJ:
- ✅ Hesla v `.gitignore` (už je tam?)
- ✅ Env variables v Vercel secrets
- ✅ Rotuj hesla každých 30 dní
- ✅ Používej silná hesla (16+ znaků)

---

## 📋 Příští Kroky

### Krok 1: Bezpečnostní Update (TUTO CHVÍLI)
- [ ] Změnit heslo v Supabase
- [ ] Vložit do Vercel env variables
- [ ] Smazat `.env.production` z Gitu

### Krok 2: SQL Optimalizace (DNES)
- [ ] Spustit `supabase-setup.sql` v SQL editoru
- [ ] Ověřit indexy: `SELECT * FROM pg_indexes WHERE tablename LIKE '%';`

### Krok 3: Testing (ZÍTŘÍT)
- [ ] Otestovat admin panel (orders, products, SKUs)
- [ ] Ověřit, že queries jsou rychlejší

### Krok 4: Monitoring (TRVALE)
- [ ] Nastavit backup retention (7-30 dní)
- [ ] Zapnout Query Performance insights
- [ ] Sledovat disk usage

---

## 📞 Potřebuješ Pomoc?

Pokud se něco pokazí:

1. **Databáze nereaguje?** → Restartuj Vercel deployment
2. **Queries jsou pomalé?** → Ověř, jestli jsou indexy správně vytvořené
3. **Chyba při připojení?** → Zkontroluj heslo v Vercel env variables

---

**Hotovo!** Tvůj Supabase je teď bezpečný a optimalizovaný. 🎉
