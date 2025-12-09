# 🔍 Kontrola Supabase nastavení

## ✅ Co vidím z tvého screenshotu

- **Project URL:** `https://bcbqrhkoosopmtrryrcy.supabase.co` ✅
- **Data API:** Pravděpodobně zapnutá ✅
- **Exposed schemas:** `public`, `graphql_public` ✅
- **Max rows:** 1000 ✅

---

## 🔧 Co zkontrolovat v Supabase Dashboard

### 1. Database Settings (Settings → Database)

**Zkontroluj:**
- ✅ **Connection string** - měl by být ve formátu:
  ```
  postgresql://postgres:[PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
  ```
- ✅ **Connection pooling** - měl by být zapnutý
- ✅ **Direct connection** - port 5432
- ✅ **Pooled connection** - port 6543

### 2. Project Status

**Zkontroluj:**
- ✅ Projekt není **paused** (pozastavený)
- ✅ Projekt má **active** status
- ✅ Database je **running**

### 3. Connection Info

**Zkontroluj:**
- ✅ **Host:** `db.bcbqrhkoosopmtrryrcy.supabase.co`
- ✅ **Port:** `5432` (direct) nebo `6543` (pooled)
- ✅ **Database:** `postgres`
- ✅ **User:** `postgres`
- ✅ **Password:** (mělo by být nastavené)

---

## 🔍 Jak zkontrolovat, jestli databáze funguje

### Z Supabase Dashboard:

1. **Settings → Database → Connection string**
   - Zkopíruj connection string
   - Měl by být ve formátu: `postgresql://postgres:...@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres`

2. **SQL Editor**
   - Klikni na "SQL Editor" v levém menu
   - Zkus jednoduchý dotaz: `SELECT 1;`
   - Pokud funguje, databáze je dostupná ✅

### Z terminálu:

```bash
# Test připojení
curl http://localhost:3000/api/health

# Mělo by vrátit:
# {"ok":true,"db":"up",...}  ✅ Funguje
# {"ok":false,"db":"down",...}  ❌ Ne funguje
```

---

## 🚨 Časté problémy a řešení

### Problém 1: Projekt je paused

**Řešení:**
1. Jdi na **Project Settings**
2. Klikni **"Resume"** nebo **"Restore"**
3. Počkej 1-2 minuty

### Problém 2: Špatný connection string

**Řešení:**
1. Jdi na **Settings → Database**
2. Klikni **"Connection string"**
3. Zkopíruj **Connection pooling** (port 6543) nebo **Direct connection** (port 5432)
4. Aktualizuj `.env.local`:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
   ```

### Problém 3: Firewall/IP whitelist

**Řešení:**
1. Jdi na **Settings → Database**
2. Zkontroluj **Network restrictions**
3. Pokud je whitelist, přidej svou IP adresu

### Problém 4: Heslo bylo změněno

**Řešení:**
1. Jdi na **Settings → Database**
2. Klikni **"Reset database password"**
3. Vytvoř nové heslo
4. Aktualizuj `.env.local` s novým heslem

---

## ✅ Kontrolní seznam

- [ ] Projekt není paused
- [ ] Connection string je správný
- [ ] Heslo v `.env.local` odpovídá Supabase
- [ ] Port je správný (5432 pro direct, 6543 pro pooled)
- [ ] SQL Editor funguje (můžeš spustit dotaz)
- [ ] Health check vrací `{"ok":true,"db":"up"}`

---

## 🎯 Rychlé řešení

**Pokud databáze stále nefunguje:**

1. **Zkontroluj SQL Editor:**
   - Otevři SQL Editor v Supabase
   - Zkus: `SELECT 1;`
   - Pokud funguje, databáze je OK, problém je v connection stringu

2. **Zkontroluj `.env.local`:**
   ```bash
   cat .env.local | grep DATABASE_URL
   ```
   - Mělo by obsahovat správný connection string

3. **Zkus použít pooled connection (6543):**
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true
   ```

4. **Restartuj server:**
   ```bash
   npm run dev
   ```

---

**Pokud nic nepomůže:** Použij produkci (https://muzaready-iota.vercel.app), tam databáze funguje ✅

