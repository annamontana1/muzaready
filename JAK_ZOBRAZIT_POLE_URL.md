# 🔍 JAK ZOBRAZIT POLE URL V BOOKMARKU

## ⚠️ Pokud vidíš jen "Název" a "Složku":

Některé prohlížeče skrývají pole URL v základním zobrazení. Musíš ho zobrazit:

---

## 🍎 SAFARI (Mac)

### Metoda 1: Upravit existující bookmark
1. Otevři Bookmarks: `Cmd + Option + B`
2. Najdi nějaký existující bookmark
3. Klikni na něj **pravým tlačítkem**
4. Vyber **"Edit Address"** nebo **"Upravit adresu"**
5. Uvidíš pole URL

### Metoda 2: Vytvořit nový bookmark
1. Stiskni `Cmd + D`
2. Pokud nevidíš pole URL, klikni na **"More Options"** nebo **"Více možností"**
3. Pak uvidíš pole URL

---

## 🌐 CHROME (Mac/Windows)

### Metoda 1: Upravit existující bookmark
1. Otevři Bookmarks: `Cmd + Shift + O` (Mac) nebo `Ctrl + Shift + O` (Windows)
2. Najdi nějaký existující bookmark
3. Klikni na něj **pravým tlačítkem**
4. Vyber **"Edit"** nebo **"Upravit"**
5. Uvidíš pole URL

### Metoda 2: Vytvořit nový bookmark
1. Stiskni `Cmd + D` (Mac) nebo `Ctrl + D` (Windows)
2. Pokud nevidíš pole URL, klikni na šipku dolů nebo **"More"**
3. Pak uvidíš pole URL

---

## 💡 NEJLEPŠÍ ŘEŠENÍ: Upravit existující bookmark

### Krok 1: Otevři Bookmarks Manager
- **Mac:** `Cmd + Option + B` (Safari) nebo `Cmd + Shift + O` (Chrome)
- **Windows:** `Ctrl + Shift + O` (Chrome)

### Krok 2: Najdi nějaký bookmark
- Můžeš použít jakýkoliv existující bookmark
- Nebo vytvoř nový prázdný bookmark

### Krok 3: Uprav bookmark
- Klikni **pravým tlačítkem** na bookmark
- Vyber **"Edit"** nebo **"Upravit"**
- Uvidíš pole URL

### Krok 4: Vlož JavaScript kód
- V poli URL vymaž celý text
- Vlož JavaScript kód
- Ulož

---

## 🔄 NEBO: Počkej na automatický deployment

**Nejjednodušší řešení** - počkej, až Vercel automaticky nasadí nové změny. Pak budeš moci:

1. **Vytvořit test objednávku s promptem:**
   - Klikneš na "Vytvořit test objednávku"
   - Zobrazí se prompt: "Zadej email pro test objednávku"
   - Zadáš email → hotovo

2. **Změnit email v edit stránce:**
   - Po deploymentu bude pole pro email viditelné
   - Můžeš změnit email přímo v UI

---

## ⏰ Kdy bude deployment?

- **Automaticky:** Za 2 hodiny (když Vercel limit resetuje)
- **Nebo:** Při dalším push na GitHub (pokud někdo pushne změny)

---

## ✅ CO DOPORUČUJI:

**Počkej na automatický deployment** - je to nejjednodušší řešení. Pak budeš moci použít novou funkci s promptem přímo v UI, bez nutnosti vytvářet bookmarklet.
