# ÚKOL: Deploy Instagram objednávek na produkci (www.muzahair.cz)

## Problém
Instagram objednávky jsou v kódu (commit `59bd5de`), ale **nejsou na produkci www.muzahair.cz**.

## Příčina
Existuje více Vercel projektů:
- `jevg-ones-projects/muzaready` - připojený lokálně
- `annamontana1s-projects/muzaready-bahy` - jiný projekt

Doména **www.muzahair.cz** pravděpodobně směřuje na jiný Vercel projekt.

---

## Řešení - Kroky

### 1. Zjistit, který Vercel projekt obsluhuje www.muzahair.cz

1. Jdi na https://vercel.com
2. Přihlas se (možná je to pod jiným účtem!)
3. Najdi projekt s doménou **www.muzahair.cz**
4. Zapamatuj si název projektu

### 2. Připojit GitHub repo k tomu projektu

V Vercel dashboardu:
1. Otevři správný projekt
2. **Settings** → **Git**
3. Zkontroluj, že je připojen k `annamontana1/muzaready`
4. Zkontroluj, že **Production Branch** = `main`

### 3. Spustit deploy

**Možnost A - Přes Vercel dashboard:**
1. Jdi do **Deployments**
2. Klikni na nejnovější → tři tečky (⋯) → **Redeploy**
3. Zaškrtni **"Redeploy without using cache"**

**Možnost B - Přes CLI:**
```bash
cd ~/muzaready
vercel --prod --force
```

---

## Ověření

Po deployi jdi na:
- https://www.muzahair.cz/admin/objednavky

Mělo by tam být růžové tlačítko **"Instagram objednávka"** vedle zeleného tlačítka "🧪 Test".

---

## Technické detaily

- Kód je hotový a funguje lokálně
- Commit: `59bd5de feat: Add manual order creation for Instagram orders with Zásilkovna widget`
- Komponenta: `app/admin/objednavky/components/CreateOrderModal.tsx`
- Tlačítko je v: `app/admin/objednavky/page.tsx` (řádek 332-341)

---

## Účty na Vercelu

| Účet | Projekt |
|------|---------|
| `zenuly3-2957` | `jevg-ones-projects/muzaready` |
| `annamontana1` | `annamontana1s-projects/muzaready-bahy` |

**Najdi, pod kterým účtem je www.muzahair.cz!**

---

*Vytvořeno: 2026-01-28*
