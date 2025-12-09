# 🔍 Diagnostika: Supabase MCP vs Lokální Připojení

## ✅ Co funguje

### Supabase MCP (Cursor integrace)
- ✅ **Databáze je aktivní a dostupná**
- ✅ **Připojení funguje** přes MCP
- ✅ **V databázi je 1 objednávka:**
  - ID: `test-order-1765216851.558210`
  - Email: `test-order-1765216851.558210@example.com`
  - Status: `pending`
  - Total: `5100 CZK`

### Projekt URL
- ✅ **Supabase Project URL:** `https://bcbqrhkoosopmtrryrcy.supabase.co`
- ✅ **Database Host:** `db.bcbqrhkoosopmtrryrcy.supabase.co:5432`

---

## ❌ Co nefunguje

### Lokální připojení přes Prisma
- ❌ **Connection refused** na `localhost:3000`
- ❌ **Chyba:** `Can't reach database server at db.bcbqrhkoosopmtrryrcy.supabase.co:5432`

---

## 🔍 Analýza problému

### Problém NENÍ v:
- ✅ Databázi samotné (funguje přes MCP)
- ✅ Projektu (je aktivní)
- ✅ Schema (tabulky existují)

### Problém JE pravděpodobně v:
1. **Heslo v `.env.local`** - může být nesprávné
2. **Síťové připojení** - firewall nebo IP whitelist
3. **SSL/TLS konfigurace** - možná chybí správné certifikáty

---

## 💡 Řešení

### Krok 1: Resetuj heslo v Supabase

1. **Jdi na:** https://supabase.com/dashboard
2. **Vyber projekt:** `bcbqrhkoosopmtrryrcy`
3. **Settings → Database → Reset database password**
4. **Vytvoř nové heslo** (např.: `muza2024secure`)
5. **Zkopíruj si ho!**

### Krok 2: Zkopíruj connection string

V Supabase Dashboard:
- **Settings → Database → Connection string**
- **Direct connection** (port 5432)
- Zkopíruj a nahraď `[YOUR_PASSWORD]` novým heslem

### Krok 3: Aktualizuj `.env.local`

```bash
DATABASE_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**Nahraď `NOVE_HESLO`** heslem z kroku 1.

### Krok 4: Test připojení

```bash
# Test přes Node.js
node test-db-connection.js

# Test přes curl
curl http://localhost:3000/api/health
```

**Očekávaný výsledek:**
```json
{"ok":true,"db":"up","dbSource":"DIRECT_URL (direct/5432)",...}
```

---

## 🔐 Alternativa: Použij Pooled Connection

Pokud direct connection nefunguje, zkus pooled connection (port 6543):

```bash
DATABASE_URL=postgresql://postgres.NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?sslmode=require
DIRECT_URL=postgresql://postgres.NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**Poznámka:** Pooled connection používá jiný formát:
- `postgres.NOVE_HESLO` místo `postgres:NOVE_HESLO`
- Port `6543` místo `5432`

---

## 📊 Aktuální stav

| Komponenta | Status | Poznámka |
|------------|--------|----------|
| Supabase MCP | ✅ Funguje | Připojení přes Cursor |
| Databáze | ✅ Aktivní | Projekt není paused |
| Lokální Prisma | ❌ Ne funguje | Connection refused |
| Vercel Produkce | ✅ Funguje | Podle předchozích testů |

---

## 🚀 Rychlé řešení

**Nejjednodušší:** Resetuj heslo v Supabase a použij nové heslo v `.env.local`

1. Supabase Dashboard → Settings → Database → Reset password
2. Vytvoř nové heslo
3. Aktualizuj `.env.local`
4. Restartuj server: `npm run dev`
5. Test: `curl http://localhost:3000/api/health`

---

**Poznámka:** Pokud to stále nefunguje po resetu hesla, problém může být v síťovém připojení nebo firewall. V takovém případě použij produkci (Vercel), kde databáze funguje.

