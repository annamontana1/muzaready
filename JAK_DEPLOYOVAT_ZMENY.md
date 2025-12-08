# 🚀 Jak deployovat změny na Vercel

## 🔍 Problém

**Vercel deployuje jen z `main` branch**, ale tvoje změny jsou na `feature/orders-api` branch.

Proto se změny neobjevují na https://muzaready-iota.vercel.app

## ✅ Řešení

### Možnost 1: Merge do main (doporučeno)

```bash
# 1. Přepni se na main
git checkout main

# 2. Stáhni nejnovější změny
git pull origin main

# 3. Merge feature branch
git merge feature/orders-api

# 4. Pushni do main
git push origin main

# 5. Vercel automaticky deployuje (běží 1-3 minuty)
```

### Možnost 2: Vytvoř Pull Request

1. **Pushni změny do remote:**
   ```bash
   git push origin feature/orders-api
   ```

2. **Vytvoř PR na GitHubu:**
   - Jdi na: https://github.com/annamontana1/muzaready
   - Klikni "New Pull Request"
   - Base: `main` ← Compare: `feature/orders-api`
   - Vytvoř PR a merge

3. **Vercel automaticky deployuje** po merge do main

### Možnost 3: Změň Vercel konfiguraci (dočasně)

Pokud chceš deployovat přímo z `feature/orders-api`:

1. **V `vercel.json` změň:**
   ```json
   "git": {
     "deploymentEnabled": {
       "main": true,
       "feature/orders-api": true  // Přidej tuto řádku
     }
   }
   ```

2. **Nebo v Vercel Dashboard:**
   - Settings → Git → Production Branch
   - Změň na `feature/orders-api`

⚠️ **POZOR:** Toto je jen dočasné řešení. Pro produkci by měl být `main`.

## 📊 Aktuální stav

- **Lokální branch:** `feature/orders-api` ✅
- **Vercel deployuje z:** `main` ❌
- **Změny v main:** Nejsou (jsou jen v feature branch)

## 🎯 Doporučený postup

1. **Commitni aktuální změny:**
   ```bash
   git add .
   git commit -m "feat: add AI CLI tool and project status docs"
   ```

2. **Pushni do remote:**
   ```bash
   git push origin feature/orders-api
   ```

3. **Merge do main:**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/orders-api
   git push origin main
   ```

4. **Počkej na Vercel deploy** (1-3 minuty)

5. **Zkontroluj:** https://muzaready-iota.vercel.app

---

## 🔍 Jak zkontrolovat, jestli deploy proběhl?

```bash
# Zkontroluj Vercel deployment status
curl https://muzaready-iota.vercel.app/api/ok

# Nebo jdi na Vercel Dashboard:
# https://vercel.com/dashboard → muzaready-iota → Deployments
```

---

**Tip:** Vždycky když děláš změny, které chceš mít na produkci:
1. Commitni změny
2. Pushni do feature branch
3. Merge do main
4. Vercel automaticky deployuje

