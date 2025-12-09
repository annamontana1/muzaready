# 🔐 Rychlý návod: Reset hesla v Supabase

## 📋 Krok za krokem

### 1. Otevři Supabase Dashboard
- Jdi na: https://supabase.com/dashboard
- Vyber projekt: `bcbqrhkoosopmtrryrcy`

### 2. Jdi na Database Settings
- Klikni na **Settings** (⚙️ ikona v levém menu)
- Klikni na **Database**

### 3. Resetuj heslo
- Najdi sekci **"Database password"**
- Klikni na **"Reset database password"** nebo **"Change password"**
- Vytvoř **nové heslo** (např.: `muza2024secure`)
- **Zkopíruj si ho!** (budeš ho potřebovat)

### 4. Zkopíruj connection string
- V sekci **"Connection string"**
- Najdi **"Direct connection"**
- Zkopíruj connection string:
  ```
  postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
  ```

### 5. Aktualizuj `.env.local`

Otevři `.env.local` a nahraď:

```bash
# PŘED (se starým heslem):
DATABASE_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require

# PO (s novým heslem):
DATABASE_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**Nahraď `NOVE_HESLO`** heslem, které jsi vytvořila v kroku 3.

### 6. Restartuj server

```bash
# Zastav server (Ctrl+C)
npm run dev
```

### 7. Otestuj

```bash
curl http://localhost:3000/api/health
```

**Mělo by vrátit:**
```json
{"ok":true,"db":"up","dbSource":"DIRECT_URL (direct/5432)",...}
```

---

## ⚠️ Důležité: Aktualizuj také Vercel!

Po resetu hesla musíš aktualizovat **i produkci**:

1. **Jdi na:** https://vercel.com/dashboard
2. **Vyber projekt:** `muzaready-iota`
3. **Settings → Environment Variables**
4. **Aktualizuj:**
   - `DATABASE_URL` → s novým heslem
   - `DIRECT_URL` → s novým heslem
5. **Save** a počkej na redeploy

---

## 🔍 Jak zjistit, jestli heslo je správné (bez resetu)

### Test přes SQL Editor v Supabase:

1. **Otevři:** SQL Editor (v levém menu)
2. **Zkus:** `SELECT 1;`
3. **Pokud funguje:**
   - Databáze je OK ✅
   - Problém může být v hesle nebo connection stringu

### Test přes psql (pokud máš nainstalovaný):

```bash
psql "postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require" -c "SELECT 1;"
```

**Pokud funguje:** Heslo je správné ✅  
**Pokud nefunguje:** Heslo je špatné nebo databáze není dostupná ❌

---

## 💡 Nejjednodušší řešení

**Resetuj heslo a použij nové:**
1. Supabase Dashboard → Settings → Database → Reset password
2. Vytvoř nové heslo
3. Aktualizuj `.env.local`
4. Restartuj server
5. Otestuj

**Pokud to nefunguje:**
- Zkontroluj, jestli projekt není paused
- Nebo použij produkci (tam databáze funguje)

---

**Poznámka:** Heslo v Supabase Dashboard se nikdy nezobrazuje z bezpečnostních důvodů, takže nejlepší je ho resetovat a použít nové.

