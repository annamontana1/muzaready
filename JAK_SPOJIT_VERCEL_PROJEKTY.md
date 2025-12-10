# 🔗 Jak Spojit Dva Vercel Projekty

## 📋 Co jsou tyto projekty?

- **muzaready-bahy** - Pravděpodobně jeden deployment/branch
- **muzaready-ebhs** - Pravděpodobně druhý deployment/branch

## 🤔 Má to smysl spojit je?

### ✅ VÝHODY spojení:
1. **Jeden projekt** - jednodušší správa
2. **Sdílené environment variables** - nemusíš nastavovat dvakrát
3. **Jeden dashboard** - všechno na jednom místě
4. **Sdílené domény** - můžeš mít více domén na jednom projektu
5. **Lepší přehled** - všechny deploymenty na jednom místě

### ❌ NEVÝHODY spojení:
1. **Ztráta historie** - deployment historie se může ztratit
2. **Možné konflikty** - pokud mají různé konfigurace
3. **Složitější rollback** - pokud potřebuješ vrátit jeden projekt

## 🔧 Jak spojit projekty na Vercel

### Metoda 1: Přesunout deploymenty do jednoho projektu

1. **Jdi na Vercel Dashboard** → https://vercel.com/dashboard
2. **Vyber projekt `muzaready-bahy`** (nebo který chceš zachovat)
3. **Settings** → **General**
4. **Přidej GitHub repository** (pokud ještě není)
5. **Vyber projekt `muzaready-ebhs`**
6. **Settings** → **General** → **Delete Project**
7. **Přesuň všechny domény** z `muzaready-ebhs` do `muzaready-bahy`

### Metoda 2: Použít Vercel CLI

```bash
# Připoj se k Vercel
vercel login

# Linkni projekt
vercel link

# Zkontroluj projekty
vercel projects list
```

## ⚠️ Co se stane při spojení?

### 1. **Deployment historie**
- ✅ Deployment historie z obou projektů zůstane
- ⚠️ Ale může být složitější najít konkrétní deployment

### 2. **Environment Variables**
- ✅ Všechny env vars z obou projektů se spojí
- ⚠️ Pokud mají stejné názvy, může dojít ke konfliktu
- 💡 **Řešení:** Přejmenuj konfliktní proměnné před spojením

### 3. **Domény**
- ✅ Všechny domény z obou projektů budou dostupné
- ✅ Můžeš mít více domén na jednom projektu

### 4. **GitHub Integration**
- ✅ Pokud oba projekty používají stejný GitHub repo → žádný problém
- ⚠️ Pokud používají různé repo → musíš vybrat jedno

### 5. **Build Settings**
- ⚠️ Build settings se přepíší (zachová se z hlavního projektu)
- 💡 **Řešení:** Zkontroluj build settings před spojením

## 🎯 Doporučený postup

### Krok 1: Záloha
1. Exportuj environment variables z obou projektů
2. Zapiš si všechny domény
3. Zapiš si build settings

### Krok 2: Vyber hlavní projekt
- **Doporučuji:** `muzaready-bahy` (pokud je to hlavní/produkční)

### Krok 3: Přesuň domény
1. V `muzaready-ebhs` → **Settings** → **Domains**
2. Zkopíruj všechny domény
3. V `muzaready-bahy` → **Settings** → **Domains** → **Add Domain**
4. Přidej všechny domény

### Krok 4: Přesuň environment variables
1. V `muzaready-ebhs` → **Settings** → **Environment Variables**
2. Zkopíruj všechny proměnné
3. V `muzaready-bahy` → **Settings** → **Environment Variables**
4. Přidej všechny proměnné (zkontroluj konflikty)

### Krok 5: Smazat druhý projekt
1. V `muzaready-ebhs` → **Settings** → **General**
2. Scroll dolů → **Delete Project**
3. Potvrď smazání

## 💡 Alternativa: Použít Vercel Teams

Pokud chceš mít oba projekty, ale lepší přehled:
1. Vytvoř **Vercel Team**
2. Přesuň oba projekty do týmu
3. Máš lepší přehled, ale projekty zůstanou oddělené

## ❓ Kdy NESPOJOVAT projekty?

- Pokud mají **různé účely** (např. staging vs production)
- Pokud potřebuješ **nezávislé rollbacky**
- Pokud mají **různé GitHub repozitáře** a chceš je zachovat odděleně

## ✅ Kdy SPOJIT projekty?

- Pokud jsou to **stejné projekty** jen s různými názvy
- Pokud chceš **jednodušší správu**
- Pokud máš **stejný GitHub repo** pro oba

---

## 🚀 Rychlý postup (pokud chceš spojit)

1. **Záloha:** Exportuj env vars a zapiš si domény
2. **Vyber hlavní:** `muzaready-bahy`
3. **Přesuň domény:** Z `muzaready-ebhs` do `muzaready-bahy`
4. **Přesuň env vars:** Z `muzaready-ebhs` do `muzaready-bahy`
5. **Smazat:** `muzaready-ebhs` projekt

**Výsledek:** Jeden projekt `muzaready-bahy` se všemi deploymenty a doménami.

