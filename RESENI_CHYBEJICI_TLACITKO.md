# 🔧 Řešení: Chybí tlačítko "Vytvořit test objednávku"

## ✅ Tlačítko je v kódu

Tlačítko **je vytvořené** v souboru `app/admin/objednavky/page.tsx` na řádku 313-319.

## Proč ho nevidíš?

### Možnost 1: Server neběží nebo není restartovaný

**Řešení:**
```bash
# Restartuj dev server
npm run dev
```

Pak obnov stránku v prohlížeči (Ctrl+F5 nebo Cmd+Shift+R pro hard refresh).

---

### Možnost 2: Koukáš na produkci (Vercel), kde ještě nejsou změny

**Řešení:**
1. **Commitni změny:**
   ```bash
   git add app/admin/objednavky/page.tsx app/api/admin/test-order/route.ts
   git commit -m "feat: add test order creation button and API endpoint"
   ```

2. **Pushni do main:**
   ```bash
   git push origin main
   ```

3. **Počkej na Vercel deploy** (1-3 minuty)

4. **Zkontroluj produkci:**
   ```
   https://muzaready-iota.vercel.app/admin/objednavky
   ```

---

### Možnost 3: Cache prohlížeče

**Řešení:**
- **Hard refresh:** Ctrl+F5 (Windows/Linux) nebo Cmd+Shift+R (Mac)
- Nebo otevři v anonymním okně (Incognito/Private)

---

### Možnost 4: Tlačítko je skryté (responsive design)

**Řešení:**
- Zkontroluj, jestli máš dostatečně široké okno
- Tlačítko je vpravo vedle nadpisu "Správa Objednávek"

---

## 🔍 Jak zkontrolovat, jestli tlačítko existuje

### 1. Zkontroluj v kódu:
```bash
grep -n "Vytvořit test objednávku" app/admin/objednavky/page.tsx
```

Mělo by vrátit: `318:          ➕ Vytvořit test objednávku`

### 2. Zkontroluj v Developer Console:
Otevři Developer Console (F12) a zadej:
```javascript
// Zkontroluj, jestli tlačítko existuje v DOM
document.querySelector('button[title*="test objednávku"]')
```

Pokud vrátí `null`, tlačítko není v DOM (možná server neběží nebo cache).

---

## 🚀 Rychlé řešení

### Pokud pracuješ lokálně:

1. **Spusť server:**
   ```bash
   npm run dev
   ```

2. **Otevři admin panel:**
   ```
   http://localhost:3000/admin/objednavky
   ```

3. **Hard refresh:** Ctrl+F5

### Pokud koukáš na produkci:

1. **Commitni a pushni změny:**
   ```bash
   git add .
   git commit -m "feat: add test order button"
   git push origin main
   ```

2. **Počkej na deploy** (1-3 min)

3. **Zkontroluj produkci**

---

## 💡 Alternativa: Použij Developer Console

I když tlačítko nevidíš, můžeš vytvořit test objednávku přes Developer Console:

1. Otevři admin panel
2. Otevři Developer Console (F12)
3. Zadej:
   ```javascript
   fetch('/api/admin/test-order', {method: 'POST', credentials: 'include'})
     .then(r => r.json())
     .then(data => {
       console.log('✅', data);
       window.location.reload();
     });
   ```

---

**Kde by mělo tlačítko být:**
- Vpravo vedle nadpisu "Správa Objednávek"
- Zelené tlačítko s textem "➕ Vytvořit test objednávku"

