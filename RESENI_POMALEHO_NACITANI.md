# 🔧 Řešení pomalého načítání localhost

## ✅ Problém identifikován

**Příčina:** Supabase databáze není dostupná (connection refused na portu 5432)

**Důsledek:** Stránky, které potřebují databázi, se načítají pomalu nebo vůbec

## 🚀 Rychlé řešení

### Krok 1: Zkontroluj Supabase Dashboard

1. Otevři: **https://supabase.com/dashboard**
2. Najdi projekt s databází `db.bcbqrhkoosopmtrryrcy.supabase.co`
3. **Pokud je projekt pozastavený (paused):**
   - Klikni na tlačítko **"Resume"** nebo **"Restore"**
   - Počkej **1-2 minuty** na aktivaci
4. **Pokud projekt běží:**
   - Zkontroluj, jestli máš správné credentials v `.env.local`

### Krok 2: Otestuj připojení

```bash
# Zkontroluj health check
curl http://localhost:3000/api/health

# Mělo by vrátit:
# {"ok":true,"db":"up",...}
```

### Krok 3: Pokud databáze stále není dostupná

#### Možnost A: Obnov Supabase projekt
- Free tier Supabase se může pozastavit po nečinnosti
- Resume projekt v dashboardu
- Počkej na aktivaci (1-2 minuty)

#### Možnost B: Zkontroluj internetové připojení
```bash
# Test ping
ping db.bcbqrhkoosopmtrryrcy.supabase.co

# Test portu
nc -zv db.bcbqrhkoosopmtrryrcy.supabase.co 5432
```

#### Možnost C: Použij pooler port (6543)
V `.env.local` zkus změnit port na 6543:
```bash
DATABASE_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true
```

## 📊 Aktuální stav

- ✅ **Next.js server:** Běží rychle (start za 1.3s)
- ✅ **API endpoint `/api/ok`:** Funguje (0.29s)
- ✅ **Homepage:** Načítá se
- ❌ **Databáze:** Není dostupná (connection refused)

## 🔍 Diagnostika

```bash
# Zkontroluj, jestli server běží
lsof -ti:3000

# Zkontroluj health check
curl http://localhost:3000/api/health

# Zkontroluj logy
tail -f /tmp/dev-server.log
```

## 💡 Tipy

1. **Supabase Free Tier:** Projekty se mohou pozastavit po nečinnosti
2. **Pooler vs Direct:** Zkus použít pooler port (6543) místo direct (5432)
3. **Lokální vývoj:** Pro rychlý vývoj můžeš použít lokální SQLite (ale musíš změnit Prisma schema)

---

**Další kroky:**
1. Zkontroluj Supabase dashboard
2. Resume projekt, pokud je pozastavený
3. Počkej 1-2 minuty
4. Zkus znovu: `curl http://localhost:3000/api/health`
