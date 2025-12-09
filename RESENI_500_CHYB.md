# 🔧 Řešení 500 chyb na localhost:3000

## ❌ Problém

API endpointy vrací 500 chyby:
- `/api/auth/session` - 500
- `/api/admin/login` - 500  
- `/api/exchange-rate` - 500

**Příčina:** Supabase databáze není dostupná lokálně
```
Can't reach database server at db.bcbqrhkoosopmtrryrcy.supabase.co:5432
```

---

## ✅ Řešení

### Možnost 1: Obnov Supabase projekt (Doporučeno pro produkci)

1. **Jdi na Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Najdi projekt s databází `db.bcbqrhkoosopmtrryrcy.supabase.co`

2. **Zkontroluj status projektu:**
   - Pokud je **pozastavený (paused)**, klikni **"Resume"**
   - Počkej **1-2 minuty** na aktivaci

3. **Zkontroluj připojení:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Mělo by vrátit: `{"ok":true,"db":"up",...}`

4. **Restartuj dev server:**
   ```bash
   # Zastav server (Ctrl+C)
   npm run dev
   ```

---

### Možnost 2: Použij produkci (Nejjednodušší)

Pokud produkce funguje, můžeš pracovat přímo tam:
- **URL:** https://muzaready-iota.vercel.app/admin/objednavky
- **Výhoda:** Databáze funguje, všechny funkce jsou dostupné
- **Nevýhoda:** Změny musíš pushnout do gitu

---

### Možnost 3: Dočasně ignoruj chyby (Pro testování UI)

Pokud chceš jen testovat UI bez databáze:

1. **Otevři admin panel:**
   ```
   http://localhost:3000/admin/objednavky
   ```

2. **Chyby v konzoli ignoruj** - UI se načte i bez databáze

3. **Pro testování funkcí použij produkci**

---

## 🔍 Diagnostika

### Zkontroluj, jestli databáze funguje:

```bash
# Health check
curl http://localhost:3000/api/health

# Mělo by vrátit:
# {"ok":true,"db":"up",...}  ✅ Databáze funguje
# {"ok":false,"db":"down",...}  ❌ Databáze nefunguje
```

### Zkontroluj Supabase připojení:

```bash
# Test ping
ping db.bcbqrhkoosopmtrryrcy.supabase.co

# Test portu
nc -zv db.bcbqrhkoosopmtrryrcy.supabase.co 5432
```

---

## 💡 Rychlé řešení (Teď)

**Pro lokální vývoj:**
1. Zkontroluj Supabase dashboard
2. Resume projekt, pokud je pozastavený
3. Počkej 1-2 minuty
4. Restartuj server: `npm run dev`

**Pro testování:**
- Použij produkci: https://muzaready-iota.vercel.app/admin/objednavky
- Všechny funkce tam fungují

---

## 📊 Aktuální stav

- ✅ **Server běží:** localhost:3000
- ✅ **Kód je správný:** API endpointy jsou OK
- ❌ **Databáze není dostupná:** Supabase connection refused

**Řešení:** Obnov Supabase projekt nebo použij produkci.

---

**Poznámka:** Tyto chyby neovlivní UI - admin panel se načte, jen některé funkce nebudou fungovat bez databáze.

