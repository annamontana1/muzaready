# 🚀 INSTRUKCE PRO KOLEGU - Připojení Supabase k Vercelu

**Čas:** 5 minut
**Obtížnost:** Snadné (copy-paste)

---

## ✅ KROK 1: Spusť migrace (vytvoř tabulky v databázi)

Na svém počítači v terminálu:

```bash
cd muzaready
./run-migrations.sh
```

**Co to udělá:** Vytvoří všechny tabulky v Supabase databázi (AdminUser, Order, Product, atd.)

**Pokud selže:** Zkontroluj v Supabase Dashboard, že databáze není pozastavená (paused).

---

## ✅ KROK 2: Přidej environment variables do Vercelu

1. Otevři: https://vercel.com
2. Klikni na projekt **muzaready**
3. Klikni **Settings** (nahoře)
4. V levém menu klikni **Environment Variables**

**Pro každou z těchto 3 proměnných klikni "Add New":**

### 2.1 DATABASE_URL

**Name:**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?schema=public
```

**Environments:** ☑ Production, ☑ Preview, ☑ Development
Klikni **Save**

---

### 2.2 DIRECT_URL

**Name:**
```
DIRECT_URL
```

**Value:**
```
postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public
```

**Environments:** ☑ Production, ☑ Preview, ☑ Development
Klikni **Save**

---

### 2.3 SESSION_SECRET

**Name:**
```
SESSION_SECRET
```

**Value:**
```
vqJ7D566WTG7YNVjema8XujjohEgMBwVD7qHmWoDzWc=
```

**Environments:** ☑ Production, ☑ Preview, ☑ Development
Klikni **Save**

---

## ✅ KROK 3: Redeploy

1. V Vercelu klikni na **Deployments** (nahoře)
2. Najdi poslední deployment
3. Klikni na **...** (tři tečky) → **Redeploy**
4. Klikni **Redeploy**

Počkej 2-3 minuty, až se deployment dokončí (zelený ✅ Ready).

---

## 🎉 HOTOVO!

Web by měl být živě na: **https://muzaready.vercel.app**

**Test:** Otevři https://muzaready.vercel.app/api/ok
Mělo by to vrátit: `{"ok":true}`

---

## ❓ Troubleshooting

### Migrace selhaly (KROK 1)
- Zkontroluj Supabase Dashboard, že databáze není pozastavená
- Zkus znovu spustit `./run-migrations.sh`

### Deployment selhal (KROK 3)
- Zkontroluj, že jsi přidal všechny 3 environment variables
- Zkontroluj, že všechny mají zaškrtnuté Production, Preview, Development
- Zkus redeploy znovu

### Web nefunguje
- Otevři Vercel → Deployments → klikni na poslední deployment → zkontroluj logy
- Mělo by tam být: "Database connection: OK"

---

**Poznámky:**
- `DATABASE_URL` používá port **6543** (connection pooler, lepší výkon)
- `DIRECT_URL` používá port **5432** (přímé spojení, nutné pro migrace)
- `SESSION_SECRET` je náhodný bezpečný klíč pro session cookies

---

**Vytvořeno:** 2025-12-07
**Pro:** Deployment muzaready na Vercel s Supabase PostgreSQL
