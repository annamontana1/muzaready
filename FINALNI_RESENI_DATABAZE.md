# 🔧 Finální řešení: Databáze není dostupná

## ❌ Problém

Connection string je **správný**, ale databáze **stále není dostupná**:
```
Can't reach database server at db.bcbqrhkoosopmtrryrcy.supabase.co:5432
```

---

## 🔍 Co zkontrolovat v Supabase Dashboard

### 1. Project Status ⭐ NEJDŮLEŽITĚJŠÍ

**Kde najít:**
- Hlavní stránka projektu v Supabase Dashboard
- Nebo **Settings → General**

**Co zkontrolovat:**
- ✅ Projekt je **"Active"** (ne "Paused" nebo "Inactive")
- ✅ Pokud je **"Paused"**, klikni **"Resume"** nebo **"Restore"**
- ✅ Počkej **1-2 minuty** na aktivaci

**⚠️ Free tier Supabase se může pozastavit po nečinnosti!**

---

### 2. Database Password

**Kde zkontrolovat:**
- **Settings → Database → Database password**

**Co zkontrolovat:**
- ✅ Heslo v `.env.local` (`muzaisthebest`) odpovídá heslu v Supabase
- ✅ Pokud nevíš heslo, resetuj ho:
  - **Settings → Database → Reset database password**
  - Vytvoř nové heslo
  - Aktualizuj `.env.local` s novým heslem

---

### 3. Network Restrictions

**Kde zkontrolovat:**
- **Settings → Database → Network restrictions**

**Co zkontrolovat:**
- ✅ Není zapnutý **IP whitelist**, který by blokoval tvou IP
- ✅ Pokud je whitelist, přidej svou IP adresu

---

### 4. SQL Editor Test

**Kde najít:**
- **SQL Editor** (v levém menu Supabase Dashboard)

**Co zkusit:**
```sql
SELECT 1;
```

**Co to znamená:**
- ✅ Pokud funguje → Databáze je OK, problém je v connection stringu
- ❌ Pokud nefunguje → Databáze není dostupná (paused nebo jiný problém)

---

## ✅ Rychlé řešení

### Krok 1: Zkontroluj Project Status

1. Jdi na **Supabase Dashboard**
2. Najdi projekt `bcbqrhkoosopmtrryrcy`
3. **Zkontroluj status:**
   - Pokud je **"Paused"** → Klikni **"Resume"**
   - Pokud je **"Active"** → Pokračuj na krok 2

### Krok 2: Zkontroluj SQL Editor

1. Klikni na **SQL Editor** (levé menu)
2. Zkus: `SELECT 1;`
3. **Pokud funguje:**
   - Databáze je OK ✅
   - Problém je v connection stringu nebo hesle
4. **Pokud nefunguje:**
   - Databáze není dostupná
   - Projekt je pravděpodobně paused

### Krok 3: Zkontroluj heslo

1. **Settings → Database → Database password**
2. Pokud nevíš heslo, resetuj ho
3. Aktualizuj `.env.local` s novým heslem

---

## 💡 Alternativa: Použij produkci

**Pokud lokální databáze nefunguje, použij produkci:**

- **URL:** https://muzaready-iota.vercel.app/admin/objednavky
- **Výhoda:** Databáze tam funguje ✅
- **Všechny funkce jsou dostupné**

**Pro lokální vývoj:**
- Můžeš pracovat na produkci
- Nebo použij mock data pro UI testování

---

## 🎯 Kontrolní seznam

- [ ] Projekt není **paused** v Supabase Dashboard
- [ ] SQL Editor funguje (`SELECT 1;` funguje)
- [ ] Heslo v `.env.local` odpovídá Supabase
- [ ] Network restrictions neblokují tvou IP
- [ ] Connection string má správný formát
- [ ] Server je restartovaný (`npm run dev`)

---

## 📞 Pokud nic nepomůže

**Použij produkci:**
- https://muzaready-iota.vercel.app/admin/objednavky
- Tam databáze funguje ✅
- Všechny funkce jsou dostupné

**Nebo:**
- Zkontroluj Supabase support
- Možná je problém na straně Supabase

---

**Hlavní otázka:** Je projekt v Supabase Dashboard **"Active"** nebo **"Paused"**?

