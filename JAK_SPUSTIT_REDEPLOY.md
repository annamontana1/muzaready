# 🔄 JAK SPUSTIT REDEPLOY V VERCEL

## ⚠️ Problém: Deployment je na starém commitu

**Aktuální deployment:** `b6b8d1b` (starý)  
**Nejnovější commit:** `da48670` (nový)  
**Chybí:** 4 commity s novými funkcemi

---

## ✅ ŘEŠENÍ: Manuální Redeploy

### Krok 1: Jdi na Vercel Dashboard
```
https://vercel.com/dashboard
```

### Krok 2: Vyber projekt
- Projekt: **muzaready-bahy**
- Nebo použij URL: `muzaready-bahy.vercel.app`

### Krok 3: Otevři Deployments
- Klikni na **"Deployments"** v horní liště
- Nebo jdi přímo na: `https://vercel.com/[tvuj-username]/muzaready-bahy/deployments`

### Krok 4: Spusť Redeploy
- Najdi deployment s commitem `b6b8d1b`
- Klikni na **"..."** (tři tečky) vedle deploymentu
- Vyber **"Redeploy"**
- Potvrď redeploy

### Krok 5: Počkej na dokončení
- Deployment může trvat **1-3 minuty**
- Počkej, až bude status **"Ready"**
- Pak zkus znovu otevřít edit stránku

---

## 🔍 Alternativní řešení: Zkontroluj GitHub

### Zkontroluj, jestli jsou všechny commity pushnuty:
```bash
git log origin/main --oneline -10
```

### Pokud chybí commity, pushni je:
```bash
git push origin main
```

Vercel automaticky nasadí nové změny po pushnutí.

---

## 📋 Co bude v novém deploymentu:

✅ Pole pro změnu emailu v edit stránce  
✅ Možnost změnit email v test objednávce  
✅ Tlačítko pro refund  
✅ Automatické vytváření faktury  
✅ Automatické workflow  
✅ Kompletní email notifikace  

---

## ⚠️ Důležité:

- Po redeployu **počkej 1-3 minuty**
- Pak zkus **hard refresh** (Cmd+Shift+R)
- Pole pro email by se mělo zobrazit

---

## 🎯 Očekávaný výsledek:

Po redeployu bys měl vidět v edit stránce:
- ✅ **Email zákazníka** (input pole) - na začátku formuláře
- ✅ Status objednávky
- ✅ Stav platby
- ✅ Stav doručení
