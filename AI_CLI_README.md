# 🤖 Claude.ai CLI Tool

Jednoduchý nástroj pro práci s Claude.ai (Anthropic) přímo z terminálu. Podporuje také OpenAI jako alternativu.

## 🚀 Rychlý start

### 1. Nastavení API klíčů

Vytvoř soubor `.env.local` v root projektu a přidej API klíč:

```bash
# Anthropic Claude (povinné pro default)
ANTHROPIC_API_KEY=sk-ant-tvuj-klic-zde

# OpenAI (volitelné, jen pokud chceš použít OpenAI)
OPENAI_API_KEY=sk-tvuj-klic-zde
```

**Kde získat API klíč:**
- **Claude.ai**: https://console.anthropic.com/ → Settings → API Keys
- **OpenAI** (volitelné): https://platform.openai.com/api-keys

### 2. Použití

#### Jednoduchý dotaz (Claude - default)
```bash
npm run ai "Jak vytvořit React komponentu?"
```

#### Použití OpenAI (volitelné)
```bash
npm run ai:openai "Rychlý dotaz"
```

#### Interaktivní chat režim
```bash
# Chat s Claude (default)
npm run ai:chat

# Chat s OpenAI
npm run ai:chat:openai
```

## 📝 Příklady

```bash
# Kódování s Claude
npm run ai "Jak napsat TypeScript funkci pro validaci emailu?"

# Vysvětlení konceptů
npm run ai "Co je React Server Components?"

# Refaktoring
npm run ai "Jak refaktorovat tuto funkci: [vlož kód]"

# Debugging
npm run ai "Proč tento kód nefunguje: [vlož kód]"
```

## 🎯 Funkce

- ✅ **Claude.ai jako default** (claude-3-5-sonnet)
- ✅ Podpora OpenAI jako alternativa
- ✅ Interaktivní chat režim
- ✅ Rychlé jednorázové dotazy
- ✅ Automatické načítání API klíčů z `.env.local`

## ⚙️ Konfigurace

### Změna defaultního modelu

Uprav `scripts/ai-cli.ts`:

```typescript
// OpenAI
await callOpenAI(prompt, 'gpt-4o'); // místo 'gpt-4o-mini'

// Claude
await callClaude(prompt, 'claude-3-opus-20240229'); // místo 'claude-3-5-sonnet'
```

### Dostupné modely

**OpenAI:**
- `gpt-4o-mini` (default, levný)
- `gpt-4o` (lepší kvalita)
- `gpt-4-turbo`
- `gpt-3.5-turbo`

**Anthropic:**
- `claude-3-5-sonnet-20241022` (default, doporučeno)
- `claude-3-opus-20240229` (nejlepší kvalita)
- `claude-3-haiku-20240307` (nejrychlejší)

## 🔒 Bezpečnost

- API klíče jsou uloženy v `.env.local` (není v gitu)
- `.env.local` je v `.gitignore`
- Nikdy nesdílej API klíče veřejně

## 💡 Tipy

1. **Interaktivní režim** je skvělý pro dlouhé konverzace s Claude
2. **Jednoduché dotazy** jsou rychlejší pro jednorázové otázky
3. **Claude** je skvělý pro komplexnější úlohy, analýzu kódu a detailní vysvětlení
4. Použij **OpenAI** jen pokud potřebuješ rychlejší odpovědi nebo máš OpenAI kredit

## 🐛 Řešení problémů

### Chyba: "API_KEY není nastaveno"
- Zkontroluj, že máš soubor `.env.local` v root projektu
- Ověř, že API klíč je správně zadaný (bez uvozovek)

### Chyba: "API error: 401"
- API klíč je neplatný nebo expiroval
- Zkontroluj klíč na příslušném portálu

### Chyba: "API error: 429"
- Překročený rate limit
- Počkej chvíli a zkus to znovu

## 📚 Další možnosti

Tento nástroj můžeš rozšířit o:
- Ukládání historie konverzací
- Podporu dalších AI providerů (Google Gemini, Mistral)
- Kontext z kódu (analýza souborů)
- Batch zpracování dotazů

---

**Vytvořeno pro:** Mùza Hair E-shop projekt
**Verze:** 1.0.0

