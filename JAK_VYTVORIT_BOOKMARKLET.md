# 🔖 JAK VYTVOŘIT BOOKMARKLET - KROK ZA KROKEM

## 📋 Kód pro bookmarklet:
```
javascript:(function(){const orderId=prompt('Zadej ID objednávky:');if(!orderId)return;const newEmail=prompt('Zadej nový email:');if(!newEmail)return;fetch(`/api/admin/orders/${orderId}`,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:newEmail})}).then(r=>r.json()).then(d=>{if(d.error)alert('Chyba: '+d.error);else{alert('✅ Email změněn na: '+d.email);location.reload()}}).catch(e=>alert('Chyba: '+e))})()
```

---

## 🍎 MAC - CHROME/SAFARI

### Krok 1: Otevři stránku s objednávkami
```
https://muzaready-bahy.vercel.app/admin/objednavky
```

### Krok 2: Vytvoř nový bookmark
- Stiskni: `Cmd + D` (nebo klikni na hvězdičku v adresním řádku)
- Nebo: Menu → Bookmarks → Add Bookmark

### Krok 3: Uprav bookmark
- **Název:** Změnit email v objednávce
- **URL:** Vymaž celý text v poli URL
- **Vlož tento kód:**
  ```
  javascript:(function(){const orderId=prompt('Zadej ID objednávky:');if(!orderId)return;const newEmail=prompt('Zadej nový email:');if(!newEmail)return;fetch(`/api/admin/orders/${orderId}`,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:newEmail})}).then(r=>r.json()).then(d=>{if(d.error)alert('Chyba: '+d.error);else{alert('✅ Email změněn na: '+d.email);location.reload()}}).catch(e=>alert('Chyba: '+e))})()
  ```
- Klikni **"Save"** nebo **"Uložit"**

### Krok 4: Použij bookmarklet
1. Otevři stránku s objednávkami
2. Klikni na bookmark "Změnit email v objednávce" (v záložkách nebo menu)
3. Zadej ID objednávky (např. `cmiyhid5k0006l704btc83biw`)
4. Zadej nový email (např. `tvuj-email@gmail.com`)
5. Hotovo! Email je změněn

---

## 💻 WINDOWS - CHROME/EDGE

### Krok 1: Otevři stránku s objednávkami
```
https://muzaready-bahy.vercel.app/admin/objednavky
```

### Krok 2: Vytvoř nový bookmark
- Stiskni: `Ctrl + D` (nebo klikni na hvězdičku v adresním řádku)
- Nebo: Menu → Bookmarks → Add Bookmark

### Krok 3: Uprav bookmark
- **Název:** Změnit email v objednávce
- **URL:** Vymaž celý text v poli URL
- **Vlož tento kód:**
  ```
  javascript:(function(){const orderId=prompt('Zadej ID objednávky:');if(!orderId)return;const newEmail=prompt('Zadej nový email:');if(!newEmail)return;fetch(`/api/admin/orders/${orderId}`,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:newEmail})}).then(r=>r.json()).then(d=>{if(d.error)alert('Chyba: '+d.error);else{alert('✅ Email změněn na: '+d.email);location.reload()}}).catch(e=>alert('Chyba: '+e))})()
  ```
- Klikni **"Save"** nebo **"Uložit"**

### Krok 4: Použij bookmarklet
1. Otevři stránku s objednávkami
2. Klikni na bookmark "Změnit email v objednávce"
3. Zadej ID objednávky
4. Zadej nový email
5. Hotovo!

---

## 📱 JAK TO FUNGUJE:

1. **Bookmarklet** je záložka s JavaScript kódem
2. Když na ni klikneš, spustí se JavaScript kód
3. Zobrazí se prompt pro zadání ID objednávky
4. Pak prompt pro zadání nového emailu
5. Email se změní přes API
6. Stránka se obnoví

---

## ⚠️ DŮLEŽITÉ:

- **Musíš být přihlášený jako admin** - jinak API vrátí chybu
- **ID objednávky** najdeš v URL nebo v detailu objednávky
- **Email musí být skutečný** (ne @example.com)

---

## 🔍 KDE NAJDEŠ ID OBJEDNÁVKY:

- V URL: `https://muzaready-bahy.vercel.app/admin/objednavky/cmiyhid5k0006l704btc83biw`
  → ID je: `cmiyhid5k0006l704btc83biw`
- V detailu objednávky: "ID: cmiyhid5k0006l704btc83biw"

---

## ✅ PO ZMĚNĚ EMAILU:

- Všechny další email notifikace půjdou na nový email
- Můžeš testovat všechny email notifikace
- Email se změní okamžitě (bez čekání na deployment)
