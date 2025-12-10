# 🎯 JEDNODUCHÝ NÁVOD - ZMĚNA EMAILU BEZ CONSOLE

## ⚠️ Co jsi viděl:
- HTML kód stránky (to není Console!)
- Console je jiné okno/tool

---

## ✅ NEJLEPŠÍ ŘEŠENÍ: Použij Bookmarklet

### Krok 1: Vytvoř Bookmarklet

1. Otevři stránku s objednávkami:
   ```
   https://muzaready-bahy.vercel.app/admin/objednavky
   ```

2. Vytvoř nový bookmark (záložku):
   - **Chrome/Safari:** `Cmd + D` (Mac) nebo `Ctrl + D` (Windows)
   - Nebo klikni na hvězdičku v adresním řádku

3. **Název:** "Změnit email v objednávce"
4. **URL:** Zkopíruj tento kód:
   ```javascript
   javascript:(function(){const orderId=prompt('Zadej ID objednávky:');if(!orderId)return;const newEmail=prompt('Zadej nový email:');if(!newEmail)return;fetch(`/api/admin/orders/${orderId}`,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({email:newEmail})}).then(r=>r.json()).then(d=>{if(d.error)alert('Chyba: '+d.error);else{alert('✅ Email změněn na: '+d.email);location.reload()}}).catch(e=>alert('Chyba: '+e))})()
   ```

5. Ulož bookmark

### Krok 2: Použij Bookmarklet

1. Otevři stránku s objednávkami
2. Klikni na bookmark "Změnit email v objednávce"
3. Zadej ID objednávky (např. `cmiyhid5k0006l704btc83biw`)
4. Zadej nový email (např. `tvuj-email@gmail.com`)
5. Hotovo! Email je změněn

---

## 🔄 ALTERNATIVNÍ ŘEŠENÍ: Vytvoř novou test objednávku

### Jednodušší způsob - počkej na deployment

1. Počkej, až Vercel nasadí nové změny (automaticky za 2 hodiny nebo při dalším push)
2. Pak budeš moci:
   - Vytvořit test objednávku s promptem pro email
   - Nebo změnit email v edit stránce

---

## 📋 CO JE CONSOLE:

Console je **Developer Tools** - speciální okno pro vývojáře.

**Jak vypadá:**
- Otevře se **dole** nebo **vpravo** na stránce
- Má záložky: **Elements**, **Console**, **Sources**, **Network**...
- V záložce **Console** vidíš prázdné pole s kurzorem `> _`

**NENÍ to:**
- ❌ HTML kód stránky
- ❌ Zdrojový kód stránky
- ❌ Text na stránce

**JE to:**
- ✅ Speciální nástroj pro vývojáře
- ✅ Místo, kde můžeš spustit JavaScript kód
- ✅ Otevře se přes klávesovou zkratku nebo pravý klik

---

## 💡 NEJLEPŠÍ ŘEŠENÍ PRO TEBE:

**Počkej na automatický deployment** - Vercel automaticky nasadí nové změny za 2 hodiny nebo při dalším push. Pak budeš moci:

1. Vytvořit test objednávku s promptem pro email
2. Nebo změnit email v edit stránce (po deploymentu)

**Nebo použij Bookmarklet** (viz výše) - funguje i bez deploymentu!
