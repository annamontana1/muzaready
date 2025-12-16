# 🗺️ Mapa Vercel projektů - DŮLEŽITÉ!

## 🎯 Cíl: Opravit login na muzaready-iota.vercel.app

---

## 📋 Co víme s jistotou

### Z lokálního `.vercel/project.json`:
```json
{
  "projectId": "prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9",
  "orgId": "team_ACUl63lYRYufpNPAS7uNrMjz",
  "projectName": "muzaready"
}
```

**To znamená:**
- Tento lokální projekt je připojený k Vercel projektu s ID: `prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9`
- Na Vercelu se projekt pravděpodobně jmenuje: **"muzaready"**
- Tento projekt by měl obsluhovat: `muzaready-iota.vercel.app`

---

## 🔍 Projekty, které jsi zmiňoval

### 1. muzaready-iota.vercel.app ⭐ HLAVNÍ
- **Status**: Nefunguje login (405 error)
- **Potřebujeme opravit**: ✅ ANO - TOHLE JE PRIORITA!
- **Správné heslo DB**: `tuchaw-gidqup-peVho0`

### 2. muzaready-bahy.vercel.app
- **Status**: Nefunguje login (405 error)
- **Poznámka**: Možná testovací/staging projekt?
- **Potřebujeme opravit**: ❓ Záleží na tobě

### 3. Další projekty?
- Zmiňoval jsi "X projektů" - potřebujeme zjistit, které jsou důležité

---

## 🔑 Database hesla - CHAOS!

Našel jsem v kódu několik různých hesel:

### ❌ STARÁ/ŠPATNÁ hesla (NEPOUŽÍVAT):
```
amobenecanto8A
nezjat-kosRo8-ciccoj
```

### ✅ AKTUÁLNÍ/SPRÁVNÉ heslo:
```
tuchaw-gidqup-peVho0
```

**TENTO musíš nastavit ve VŠECH Vercel projektech, které chceš aby fungovaly!**

---

## 📝 JEDNODUCHÝ PLÁN - CO UDĚLAT

### Krok 1: Zjisti, které projekty máš na Vercelu

1. Přihlas se na: https://vercel.com
2. V levém menu klikni na **"Overview"** nebo **"Projects"**
3. **Udělej screenshot všech projektů, které tam vidíš**
4. Pošli mi ten screenshot - pak ti řeknu, který je který

### Krok 2: Najdi projekt "muzaready" (ID: prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9)

Možná se jmenuje:
- `muzaready`
- `muzaready-iota`
- Nebo úplně jinak!

**Jak ho najdeš:**
1. Otevři každý projekt
2. Jdi do **Settings** → **General**
3. Úplně dole by mělo být **Project ID**
4. Když najdeš projekt s ID `prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9`, to je TEN SPRÁVNÝ!

### Krok 3: V tom správném projektu zkontroluj heslo

1. **Settings** → **Environment Variables**
2. Najdi `DATABASE_URL`
3. Zkontroluj, jestli obsahuje heslo: `tuchaw-gidqup-peVho0`
4. Pokud NE, klikni **Edit** a změň ho na:
```
postgresql://postgres:tuchaw-gidqup-peVho0@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?sslmode=require
```

### Krok 4: Spusť redeploy BEZ CACHE

1. **Deployments** → nejnovější deployment
2. Klikni na tři tečky (⋯) → **Redeploy**
3. **DŮLEŽITÉ:** Zaškrtni **"Redeploy without using cache"**
4. Klikni **Redeploy**

---

## 🆘 POMOC - pokud se ztratíš

**Udělej toto:**

1. **Screenshot Vercel projektů:**
   - Jdi na https://vercel.com
   - Udělej screenshot stránky s přehledem projektů
   - Pošli mi to

2. **Screenshot Production URL:**
   - Pro každý projekt, který vypadá důležitě:
   - Otevři ho
   - Udělaj screenshot, kde je vidět **Production URL** (nahoře)
   - Pošli mi to

3. **Já ti pak řeknu:**
   - Který projekt je ten správný
   - Co přesně v něm změnit
   - Jak spustit redeploy

---

## ✅ Co funguje LOKÁLNĚ (pro porovnání)

```bash
# Lokální test login:
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@muzahair.cz","password":"admin123"}'

# Výsledek:
{
  "success": true,
  "message": "Přihlášení bylo úspěšné",
  "admin": {
    "name": "Administrator",
    "email": "admin@muzahair.cz",
    "role": "admin"
  }
}
```

**Tohle STEJNĚ musí fungovat na produkci po opravě!**

---

## 🎯 TL;DR - Co potřebuji od tebe

**POŠLI MI SCREENSHOT:**
1. Přehled všech Vercel projektů (Projects page)
2. Pro každý projekt: Production URL

**Já ti pak řeknu:**
- Který projekt opravit
- Přesné kroky co udělat

---

**Vytvořeno:** 2025-12-15 21:15 CET
**Status:** Čekám na screenshot Vercel projektů
