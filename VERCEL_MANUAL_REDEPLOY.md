# 🚨 URGENTNÍ: Manuální Redeploy na Vercelu

## Problém
Vercel nedeployuje automaticky změny z GitHubu. Admin login nefunguje kvůli starému buildu.

## Řešení (5 minut)

### KROK 1: Přihlaš se do Vercelu
1. Jdi na: **https://vercel.com**
2. Přihlaš se (pokud nejsi)

---

### KROK 2: Otevři projekt muzaready
1. Klikni na projekt: **muzaready**
2. NEBO jdi přímo na: **https://vercel.com/jevg-ones-projects/muzaready**

---

### KROK 3: Jdi do Deployments
1. V horním menu klikni na záložku: **"Deployments"**
2. Uvidíš seznam všech deploymentů

---

### KROK 4: Trigger Redeploy
1. Najdi **první deployment** v seznamu (nejnovější nahoře)
2. Klikni na **tři tečky** (...) vpravo od deploymentu
3. V menu klikni na: **"Redeploy"**
4. Objeví se dialog s otázkou

---

### KROK 5: Vypni cache (DŮLEŽITÉ!)
1. V dialogu **ODŠKRTNI** checkbox: ~~"Use existing Build Cache"~~
2. Checkbox musí být **prázdný** (nevyplněný)
3. Klikni na tlačítko: **"Redeploy"**

---

### KROK 6: Čekej na build (2-5 minut)
1. Uvidíš progress bar s "Building..."
2. Počkej, až se zobrazí: **"Deployment Ready"** nebo **"Ready"**
3. Status by měl být: ✅ **Ready**

---

### KROK 7: Test
Po dokončení buildu zkus:

**URL pro přihlášení:**
```
https://muzaready-iota.vercel.app/admin/login
```

**Credentials:**
- Email: `admin@muzahair.cz`
- Password: `admin123`

**Mělo by fungovat!** ✅

---

## Pokud stále nefunguje

### Alternativa: Reconnect GitHub

1. Jdi do: **Settings** → **Git**
2. Klikni: **"Disconnect"** (odpoj GitHub)
3. Klikni: **"Connect Git Repository"**
4. Vyber repozitář: `annamontana1/muzaready`
5. Confirm
6. Vercel začne automaticky deployovat

---

## Co se stalo?

- Vercel webhook přestal fungovat
- Nové commity na GitHubu se nedeployují automaticky
- Poslední funkční build je starý (~2-3 dny)
- Nové opravy (včetně admin login fixu) nejsou na produkci

---

## Screenshots kam klikat

### 1. Deployments tab
```
┌─────────────────────────────────────────────┐
│ muzaready                                    │
├─────────────────────────────────────────────┤
│ Overview  Deployments  Settings  Logs       │
│           ^^^^^^^^^^ (klikni sem)           │
└─────────────────────────────────────────────┘
```

### 2. Deployment list
```
┌─────────────────────────────────────────────────────┐
│ main    9a85c7a  12 minutes ago    Ready    [...]  │ <- klikni na ...
│ main    3255f48  45 minutes ago    Ready    [...]  │
└─────────────────────────────────────────────────────┘
```

### 3. Redeploy menu
```
┌────────────────────────┐
│ View Deployment        │
│ Visit Deployment       │
│ Redeploy              │ <- klikni sem
│ Delete                 │
└────────────────────────┘
```

### 4. Redeploy dialog
```
┌────────────────────────────────────────────┐
│ Redeploy to Production                     │
├────────────────────────────────────────────┤
│ ☐ Use existing Build Cache                │ <- MUSÍ BÝT PRÁZDNÉ!
│                                             │
│           [Cancel]    [Redeploy]           │ <- klikni Redeploy
└────────────────────────────────────────────┘
```

---

## Kontakt
Pokud to nefunguje, napiš:
- Screenshot Vercel dashboardu
- Chybovou hlášku z buildu (pokud je červená)

**Časový odhad:** 3-5 minut
**Náročnost:** Lehké (jen klikání)

---

✅ **Po redeployi by měl admin login fungovat normálně!**
