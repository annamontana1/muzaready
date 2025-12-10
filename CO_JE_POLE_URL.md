# 📍 CO JE POLE URL V BOOKMARKU

## 🔍 Kde najdeš pole URL:

Když vytvoříš nový bookmark (Cmd+D nebo Ctrl+D), otevře se okno:

```
┌─────────────────────────────────────┐
│ Přidat záložku                      │
├─────────────────────────────────────┤
│ Název: [___________________]        │ ← Sem napíšeš název
│                                      │
│ URL:   [___________________]        │ ← TOHLE JE POLE URL!
│                                      │   Sem vložíš JavaScript kód
│                                      │
│ [Zrušit]  [Uložit]                  │
└─────────────────────────────────────┘
```

---

## 📋 KROK ZA KROKEM:

### 1. Stiskni Cmd + D (Mac) nebo Ctrl + D (Windows)
   → Otevře se okno "Přidat záložku"

### 2. V okně uvidíš:
   - **Název:** (prázdné pole) ← Sem napíšeš "Změnit email v objednávce"
   - **URL:** (obsahuje aktuální adresu) ← TOHLE JE POLE URL!

### 3. V poli URL:
   - **Vymaž** celý text (aktuální URL stránky)
   - **Vlož** JavaScript kód (celý jako jeden řádek)

### 4. Klikni "Uložit"

---

## 💡 JAK VYPADÁ POLE URL:

**Před úpravou:**
```
URL: [https://muzaready-bahy.vercel.app/admin/objednavky]
```

**Po úpravě:**
```
URL: [javascript:(function(){const orderId=prompt('Zadej ID objednávky:');...})()]
```

---

## 🎯 CO DĚLAT:

1. **Klikni do pole URL** (myší)
2. **Vyber celý text** (Cmd+A nebo Ctrl+A)
3. **Smaž ho** (Backspace nebo Delete)
4. **Vlož JavaScript kód** (Cmd+V nebo Ctrl+V)
5. **Ulož** (Enter nebo klikni na "Uložit")

---

## ⚠️ DŮLEŽITÉ:

- **JavaScript kód musí začínat:** `javascript:`
- **Musí být celý jako jeden řádek** (bez zalomení)
- **Zkopíruj celý kód najednou**

---

## 🔄 ALTERNATIVNÍ ZPŮSOB:

Pokud nevíš, kde je pole URL, můžeš:

1. **Upravit existující bookmark:**
   - Otevři Bookmarks (Cmd+Option+B nebo Ctrl+Shift+O)
   - Najdi nějaký bookmark
   - Klikni pravým tlačítkem → "Edit" nebo "Upravit"
   - Uvidíš pole URL

2. **Nebo použij jednodušší řešení:**
   - Počkej na automatický deployment
   - Pak budeš moci použít novou funkci s promptem
