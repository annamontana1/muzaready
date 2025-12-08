# 🔧 Řešení pro lokální vývoj

## Situace

- ✅ **Produkce (Vercel):** Funguje s Supabase PostgreSQL
- ❌ **Lokální vývoj:** Supabase připojení nefunguje (connection refused)
- ✅ **Máš lokální SQLite:** `dev.db` soubor existuje

## Problém

Prisma schema je nastavené na `provider = "postgresql"`, ale pro lokální vývoj chceš použít SQLite.

## Řešení: Použij lokální SQLite pro vývoj

### Možnost 1: Dva Prisma schemas (doporučeno)

Vytvoř `prisma/schema.sqlite.prisma` pro lokální vývoj:

```bash
# Zkopíruj schema
cp prisma/schema.prisma prisma/schema.sqlite.prisma

# Uprav provider na SQLite
# V schema.sqlite.prisma změň:
# provider = "postgresql" → provider = "sqlite"
```

Pak použij:
```bash
# Pro lokální vývoj
DATABASE_URL=file:./dev.db
npx prisma generate --schema=./prisma/schema.sqlite.prisma

# Pro produkci (Vercel automaticky)
DATABASE_URL=postgresql://... (Supabase)
npx prisma generate --schema=./prisma/schema.prisma
```

### Možnost 2: Dočasně změň schema na SQLite

⚠️ **POZOR:** Toto změní schema pro všechny prostředí!

```bash
# V prisma/schema.prisma změň:
provider = "sqlite"  # místo "postgresql"

# V .env.local:
DATABASE_URL=file:./dev.db
DIRECT_URL=file:./dev.db

# Regeneruj Prisma client
npx prisma generate
npx prisma migrate dev
```

**Nevýhoda:** Musíš pak změnit zpět na PostgreSQL před deployem.

### Možnost 3: Oprav Supabase připojení (pokud chceš používat Supabase lokálně)

1. **Zkontroluj Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Settings → Database → Connection Pooling
   - Zkontroluj, jestli není IP whitelist

2. **Zkus použít pooler port (6543):**
   ```bash
   DATABASE_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true
   ```

3. **Zkontroluj firewall:**
   - Supabase může blokovat připojení z některých IP adres
   - Zkus z jiné sítě nebo VPN

## Doporučené řešení

**Pro rychlý lokální vývoj:** Použij lokální SQLite

1. Vytvoř `.env.local.dev`:
   ```bash
   DATABASE_URL=file:./dev.db
   DIRECT_URL=file:./dev.db
   ```

2. Dočasně změň Prisma schema na SQLite (nebo použij možnost 1 s dvěma schemas)

3. Spusť migrace:
   ```bash
   npx prisma migrate dev --name init_sqlite
   ```

4. Restartuj server:
   ```bash
   npm run dev
   ```

**Výhody lokálního SQLite:**
- ✅ Rychlejší (žádné síťové latence)
- ✅ Funguje offline
- ✅ Žádné problémy s připojením
- ✅ Ideální pro vývoj

**Nevýhody:**
- ❌ Data nejsou synchronizovaná s produkcí
- ❌ Musíš mít lokální data

---

## Aktuální stav

- **Produkce:** ✅ Funguje (Supabase PostgreSQL na Vercel)
- **Lokální:** ❌ Supabase connection refused
- **Řešení:** Použij lokální SQLite pro vývoj

