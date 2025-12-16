# 🔐 Kontrola Vercel Environment Variables

## Proč to potřebuješ zkontrolovat

V lokálních `.env` souborech byl nalezen **špatný databázový heslo**:
- ❌ Špatné heslo: `nezjat-kosRo8-ciccoj` nebo `amobenecanto8A`
- ✅ Správné heslo: `tuchaw-gidqup-peVho0`

**Pokud Vercel používá špatné heslo, aplikace nemůže se připojit k databázi!**

---

## 🎯 Krok za krokem kontrola

### 1. Přihlášení do Vercel

- [ ] Otevři prohlížeč a jdi na [vercel.com](https://vercel.com)
- [ ] Přihlas se svým účtem
- [ ] Měl by ses dostat na Dashboard se seznamem projektů

### 2. Najdi správný projekt

- [ ] V seznamu projektů hledej projekt **"muzaready"** (nebo podobný název)
- [ ] Klikni na projekt - dostaneš se na stránku projektu
- [ ] Zkontroluj, že je to správný projekt (podle URL nebo deployment history)

### 3. Navigace do Environment Variables

- [ ] V horní menu projektu najdi záložku **"Settings"**
- [ ] Klikni na "Settings"
- [ ] V levém sidebaru najdi sekci **"Environment Variables"**
- [ ] Klikni na "Environment Variables"

### 4. Najdi DATABASE_URL proměnnou

- [ ] Projdi seznam environment variables
- [ ] Najdi proměnnou s názvem **`DATABASE_URL`**
- [ ] Všimni si, ve kterých prostředích je nastavena:
  - Production
  - Preview
  - Development

### 5. Zkontroluj heslo v DATABASE_URL

DATABASE_URL má tento formát:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

- [ ] Klikni na ikonu **"oka"** (👁️) nebo tlačítko "Reveal" u DATABASE_URL
- [ ] Zkopíruj hodnotu do textového editoru
- [ ] Najdi část mezi `:` a `@` - to je heslo
- [ ] **Zkontroluj, zda heslo je: `tuchaw-gidqup-peVho0`**

---

## ⚠️ Co dělat pokud je heslo ŠPATNÉ

### Varianta A: Heslo je špatně v Production

- [ ] Klikni na tlačítko **"Edit"** (tužka) u DATABASE_URL proměnné
- [ ] V dialogu uvidíš hodnotu - **změň heslo** z:
  ```
  postgresql://neondb_owner:STARÉ_ŠPATNÉ_HESLO@ep-...
  ```
  na:
  ```
  postgresql://neondb_owner:tuchaw-gidqup-peVho0@ep-...
  ```
- [ ] **DŮLEŽITÉ:** Ujisti se, že je zaškrtnuto správné prostředí (Production)
- [ ] Klikni na **"Save"**

### Varianta B: Heslo je špatně ve všech prostředích

- [ ] **Smaž** starou DATABASE_URL proměnnou (tlačítko "Delete")
- [ ] Klikni na tlačítko **"Add New"** nebo **"Add Variable"**
- [ ] Do pole "Name" napiš: `DATABASE_URL`
- [ ] Do pole "Value" vlož **CELÝ** connection string se správným heslem:
  ```
  postgresql://neondb_owner:tuchaw-gidqup-peVho0@ep-dark-brook-a5awpqx7.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```
- [ ] Zaškrtni všechna potřebná prostředí:
  - ✅ Production
  - ✅ Preview
  - ✅ Development (volitelně)
- [ ] Klikni na **"Save"**

---

## 🚀 KRITICKÝ KROK: Redeploy bez cache

**⚠️ VAROVÁNÍ:** Změna environment variables se neprojeví automaticky! Musíš vynutit nový deployment.

### Proč je to důležité?

1. **Vercel cachuje** buildy a environment variables
2. Bez redeploye aplikace **stále používá staré hodnoty**
3. Cache může způsobit, že změny neuvidíš ani po týdnu!

### Jak správně redeploy

- [ ] V projektu jdi na záložku **"Deployments"**
- [ ] Najdi **poslední (nejnovější) deployment** - měl by být úplně nahoře
- [ ] Klikni na tlačítko **"..." (tři tečky)** vpravo u deploymentu
- [ ] Z menu vyber **"Redeploy"**
- [ ] **KRITICKÉ:** V dialogu **NEZAŠKRTÁVEJ** "Use existing Build Cache"
- [ ] Ujisti se, že checkbox **"Use existing Build Cache" je VYPNUTÝ** ❌
- [ ] Klikni na **"Redeploy"** tlačítko

### Po redeployi

- [ ] Počkej, až deployment dokončí (obvykle 2-5 minut)
- [ ] Zelená fajfka = úspěch ✅
- [ ] Otevři aplikaci na production URL
- [ ] Zkus funkce, které potřebují databázi (např. přihlášení)

---

## 🔍 Jak ověřit, že to funguje

### Test 1: Přihlášení do admin panelu

- [ ] Jdi na: `https://tvoje-domena.vercel.app/admin/login`
- [ ] Zadej přihlašovací údaje
- [ ] **Pokud se přihlásíš = databáze funguje ✅**
- [ ] **Pokud chyba = stále špatné heslo ❌**

### Test 2: Kontrola logs

- [ ] V Vercel projektu jdi na záložku **"Logs"**
- [ ] Vyfiltruj chyby: vyber "Errors" z filtru
- [ ] Hledej chyby typu:
  - `password authentication failed`
  - `connection refused`
  - `ECONNREFUSED`
- [ ] **Žádné chyby = vše OK ✅**

---

## 📋 Checklist pro rychlou kontrolu

```
✅ Jsem přihlášený do Vercel
✅ Našel jsem správný projekt (muzaready)
✅ Otevřel jsem Settings → Environment Variables
✅ Našel jsem DATABASE_URL
✅ Zkontroloval jsem heslo: tuchaw-gidqup-peVho0
✅ Pokud bylo špatně, upravil jsem ho
✅ Udělal jsem Redeploy BEZ cache
✅ Počkal jsem na dokončení deploymentu
✅ Otestoval jsem aplikaci (přihlášení funguje)
```

---

## 🆘 Časté problémy

### "Stále to nefunguje i po změně"

→ Pravděpodobně jsi použil cache při redeployi
→ Řešení: Udělej redeploy znovu a **NEZAŠKRTÁVEJ** "Use existing Build Cache"

### "Nemohu najít DATABASE_URL v Vercel"

→ Proměnná možná vůbec není nastavená
→ Řešení: Přidej ji manuálně (viz Varianta B výše)

### "Heslo je správné, ale stále chyby"

→ Zkontroluj CELÝ connection string (host, port, database name)
→ Možná je problém i s jiným parametrem, ne jen heslem
→ Správný formát:
```
postgresql://neondb_owner:tuchaw-gidqup-peVho0@ep-dark-brook-a5awpqx7.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### "Po redeployi je stránka prázdná"

→ Možná build error
→ Jdi na Deployments → klikni na deployment → zkontroluj "Build Logs"
→ Hledej červené chyby

---

## 🎯 Shrnutí

1. **Najdi projekt** v Vercel dashboardu
2. **Settings** → **Environment Variables**
3. **Zkontroluj DATABASE_URL** - heslo musí být: `tuchaw-gidqup-peVho0`
4. **Změň** pokud je špatně
5. **REDEPLOY BEZ CACHE** - to je nejdůležitější krok!
6. **Otestuj** aplikaci

---

**Vytvořeno:** 2025-12-16
**Pro projekt:** muzaready
**Správné DB heslo:** `tuchaw-gidqup-peVho0`
