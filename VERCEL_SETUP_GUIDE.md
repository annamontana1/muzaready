# 🚀 Vercel Setup Guide - Krok za krokem

**Pro kolegu:** Jak nastavit Vercel environment variables a dostat deployment do fungujícího stavu.

---

## ⏱️ Čas: ~5 minut

---

## 📋 KROK 1: Otevři Vercel Dashboard

1. Jdi na https://vercel.com
2. Login do svého účtu
3. Najdi projekt **"muzaready"** (nebo **"muzaready-bahy"**)
4. Klikni na projekt

---

## 🔧 KROK 2: Otevři Environment Variables

1. V projektu klikni na **"Settings"** (horní menu)
2. V levém menu klikni na **"Environment Variables"**
3. Měl bys vidět seznam existujících proměnných (nebo prázdnou stránku)

---

## ✅ KROK 3: Přidej 3 kritické proměnné

### Proměnná 1: DATABASE_URL

**Name:**
```
DATABASE_URL
```

**Value:**
```
libsql://lg-jevgone.aws-ap-south-1.turso.io
```

**Environments:** (zaškrtni všechny 3)
- ✅ Production
- ✅ Preview
- ✅ Development

**Klikni:** "Add" nebo "Save"

---

### Proměnná 2: TURSO_AUTH_TOKEN

**Name:**
```
TURSO_AUTH_TOKEN
```

**Value:**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzI4OTI4NDYsImlkIjoiMzMwYzA2MWItNzBiYi00ZGJiLThiNzAtZWQwY2ExNmE0YzJmIn0.B03p0SIx3XN2kaSPIQS4yiJ37wtkz5O90NRmNUXCNSWOPPHBd0_-xHw03k9WLJcbglCcnk7Q6B-1ykMB9UvJDA
```

**Environments:** (zaškrtni všechny 3)
- ✅ Production
- ✅ Preview
- ✅ Development

**Klikni:** "Add" nebo "Save"

---

### Proměnná 3: SESSION_SECRET

**Name:**
```
SESSION_SECRET
```

**Value:**
```
muzaready-super-secret-session-key-production-2025-v1
```

**Environments:** (zaškrtni všechny 3)
- ✅ Production
- ✅ Preview
- ✅ Development

**Klikni:** "Add" nebo "Save"

---

## 🔄 KROK 4: Re-deploy

### Automatický způsob (doporučeno):
Vercel by měl automaticky detekovat nový push na GitHub a spustit nový deployment.

**Zkontroluj:**
1. Jdi na **"Deployments"** tab (horní menu)
2. Měl bys vidět nový deployment **"Building..."** nebo **"Queued"**
3. Počkej 2-3 minuty

### Manuální způsob (pokud auto-deploy nefunguje):
1. Jdi na **"Deployments"** tab
2. Najdi poslední deployment (i když failed)
3. Klikni na **"..." menu** (tři tečky)
4. Klikni **"Redeploy"**
5. Zaškrtni **"Use existing Build Cache"** (rychlejší)
6. Klikni **"Redeploy"**
7. Počkej 2-3 minuty

---

## ✅ KROK 5: Zkontroluj deployment

### Jak poznat, že to funguje:

1. **V Deployments tab:**
   - Status by měl být: **"Ready"** (zelený) ✅
   - Nebo: **"Building..."** (žlutý) - počkej
   - NEBO: **"Failed"** (červený) - něco je špatně

2. **Pokud je "Ready" (zelené):**
   - 🎉 **Hotovo!** Deployment úspěšný!
   - Klikni na deployment → **"Visit"** button
   - Měl bys vidět web běžet

3. **Pokud je "Failed" (červené):**
   - Klikni na failed deployment
   - Klikni na **"View Build Logs"**
   - Pošli screenshot chyby (červený text)
   - Podíváme se na to společně

---

## 🧪 KROK 6: Test v produkci

Pokud deployment prošel (zelený):

1. Otevři production URL (např. https://muzaready-bahy.vercel.app)
2. Zkontroluj základní funkce:
   - [ ] Homepage načte
   - [ ] Admin login funguje (`/admin/login`)
   - [ ] Orders list načte (`/admin/objednavky`)
   - [ ] Detail objednávky funguje

---

## ❓ FAQ - Časté problémy

### Q: "Build trvá moc dlouho (>5 min)"
**A:** Pravděpodobně se zasekl. Zruš build a spusť znovu:
- Deployments → ... → Cancel Build
- Pak znovu Redeploy

### Q: "Stále failed, i po nastavení env vars"
**A:** Pošli screenshot Build Logs. Možné příčiny:
- TypeScript errors (nepravděpodobné, lokálně build prošel)
- Database connection issue (zkontroluj, že DATABASE_URL + TOKEN jsou správně)
- Missing package (npm install issue)

### Q: "Deploy prošel, ale admin login nefunguje"
**A:** Zkontroluj SESSION_SECRET:
- Musí být nastavený
- Minimálně 32 znaků
- Pro všechny environments (Production + Preview)

### Q: "Deploy prošel, ale /admin/objednavky vrací 500"
**A:** Database connection issue:
- Zkontroluj DATABASE_URL (správná Turso URL?)
- Zkontroluj TURSO_AUTH_TOKEN (správný token?)
- Zkus pustit: `npx prisma db push` lokálně s Turso credentials

---

## 📸 Screenshots pro debugování

Pokud něco nefunguje, pošli screenshot:

1. **Environment Variables page** (Settings → Environment Variables)
   - Ať vidím, že všechny 3 proměnné jsou nastavené
   - Můžeš zamaskovat část tokenů (*** části)

2. **Build Logs** (z failed deploymentu)
   - Červený error text
   - Posledních 50 řádků

3. **Deployment status** (Deployments tab)
   - Ready/Failed status
   - Deployment URL

---

## ✅ Checklist

- [ ] 1. Otevřel jsem Vercel Dashboard
- [ ] 2. Našel jsem projekt "muzaready"
- [ ] 3. Otevřel jsem Settings → Environment Variables
- [ ] 4. Přidal jsem DATABASE_URL (pro Production + Preview + Development)
- [ ] 5. Přidal jsem TURSO_AUTH_TOKEN (pro Production + Preview + Development)
- [ ] 6. Přidal jsem SESSION_SECRET (pro Production + Preview + Development)
- [ ] 7. Spustil jsem Re-deploy (automaticky nebo manuálně)
- [ ] 8. Počkal jsem 2-3 minuty na build
- [ ] 9. Build status je **"Ready"** (zelený) ✅
- [ ] 10. Otevřel jsem production URL a web funguje 🎉

---

## 🎉 Po úspěšném deploymentu

**Gratuluji!** Web je live na produkci! 🚀

**Next steps:**
1. Otevři admin panel: https://your-domain.vercel.app/admin/login
2. Login: `admin@example.com` / `admin123`
3. Zkontroluj Orders list, Detail, všechny features
4. Pokud vše funguje → **DEPLOYMENT 100% HOTOVÝ!**

---

**Created:** 4. prosince 2025
**For:** Teammate (Vercel account owner)
**Time:** ~5 minutes
**Difficulty:** Easy (copy-paste environment variables)
