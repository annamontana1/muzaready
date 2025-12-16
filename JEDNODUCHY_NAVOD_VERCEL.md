# 🚀 Jednoduchý návod: Jak opravit produkci na Vercel

## 📋 Co se děje?

Tvoje aplikace **funguje perfektně lokálně** (localhost:3001), ale **nefunguje na produkci** (muzaready-iota.vercel.app). Problém je, že Vercel buď nemá aktuální kód, nebo nasazuje špatný projekt. Všechny opravy máš v GitHubu, ale Vercel je prostě nezobrazuje.

---

## ✅ Krok za krokem - Jak to opravit

### 1️⃣ Přihlas se do Vercel
- Jdi na: **https://vercel.com**
- Klikni na **Log In**
- Přihlas se svým účtem (GitHub/GitLab/Email)

### 2️⃣ Najdi SPRÁVNÝ projekt
- Na hlavní stránce uvidíš **seznam všech projektů**
- Hledej projekt s názvem: **"muzaready"** nebo podobným
- ⚠️ **POZOR:** Pokud vidíš více projektů, vyber ten, který má:
  - ✅ URL: `muzaready-iota.vercel.app` NEBO
  - ✅ Connected to GitHub repository: `muzaready`

### 3️⃣ Zkontroluj napojení na GitHub
- Klikni na projekt **muzaready**
- V horním menu klikni na **Settings**
- V levém menu klikni na **Git**
- Zkontroluj:
  - ✅ **Repository:** Musí být `zen/muzaready` (nebo tvoje GitHub username)
  - ✅ **Branch:** Musí být `main`

**Pokud JE správně → pokračuj na krok 4**
**Pokud NENÍ → klikni na "Disconnect" a znovu připoj správný repozitář**

### 4️⃣ Vynuť nové nasazení
- V horním menu klikni na **Deployments**
- Najdi **poslední deployment** (první řádek v seznamu)
- Klikni na tři tečky **"..."** vpravo
- Vyber: **"Redeploy"**
- V popup okně klikni: **"Redeploy"** (znovu potvrď)

### 5️⃣ Počkej na dokončení (2-3 minuty)
- Uvidíš **živý progress** nasazení
- Čekej, dokud neuvidíš:
  - ✅ Zelený checkmark ✓
  - ✅ Nápis: **"Ready"** nebo **"Production"**

### 6️⃣ Otestuj produkční URL
- Otevři novou záložku
- Jdi na: **https://muzaready-iota.vercel.app/admin**
- Zkus se přihlásit:
  - Email: `admin@muzaready.cz`
  - Heslo: tvoje admin heslo

---

## 🎯 Jak poznám, že to funguje?

### ✅ ÚSPĚCH vypadá takto:
- Produkční URL se načte bez chyby 405
- Uvidíš přihlašovací formulář
- Po přihlášení se dostaneš do admin panelu
- Žádné chyby v konzoli (F12)

### ❌ Pokud stále nefunguje:
1. V Vercel projektu klikni na **Settings → Environment Variables**
2. Zkontroluj, že máš tyto proměnné:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (musí být: `https://muzaready-iota.vercel.app`)
3. Pokud nějaká chybí nebo je špatně → **napiš mi, pomůžu ti**

---

## 🆘 Rychlá pomoc

**Problém:** Nevidím projekt "muzaready" v seznamu
**Řešení:** Možná máš více Vercel účtů. Zkontroluj vpravo nahoře své jméno/avatar a přepni na správný tým/účet.

**Problém:** Deployment selhal (červená chyba)
**Řešení:** Klikni na failed deployment → zkopíruj chybovou hlášku → pošli mi ji.

**Problém:** Všechno zelené, ale stále 405
**Řešení:** Vyčkej 5 minut (může trvat propagace DNS/cache) a zkus Hard Refresh (Ctrl+Shift+R / Cmd+Shift+R).

---

**Vytvořeno:** 2025-12-16
**Účel:** Oprava produkčního nasazení bez technických detailů

🎉 **Držím palce!**
