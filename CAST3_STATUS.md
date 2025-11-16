# ČÁST 3 - Analýza Stavu

## Situace

Analizoval jsem ČÁST 3 specifikaci a aktuální kód. Nalezl jsem **ROZPOR**:

### Co specifikace vyžaduje:
1. **PDP** - Načíst cenu z `/api/price-matrix/lookup?line=X&segment=Y&lengthCm=Z`
2. **Katalog karta** - Zobrazit "Cena za 100g / 45cm: XXXX Kč"
3. **Košík** - Uložit snapshot `pricePerGramCzk` v čase nákupu
4. **API** - Nový endpoint GET `/api/price-matrix/lookup`

### Co ve skutečnosti existuje:
1. **PDP** - Používá `/api/quote` (komplexnější endpoint)
2. **Katalog karta** - Existuje `CatalogCard.tsx`, ale má TODO komentáře
3. **Košík** - Existuje `/app/sku-kosik/page.tsx` s úplnou implementací
4. **API** - Máš 13+ endpoints včetně `/api/price-matrix/lookup`, ale primární je `/api/quote`

### Infrastruktura:
✅ PriceMatrix model v DB
✅ SKU model se všemi poli
✅ Všechny potřebné API endpointy
✅ Detail stránka s cenami
✅ Košík se správou objednávek

## Otázka pro tebe:

**Máš 2 možnosti:**

### Možnost A: Implementovat ČÁST 3 PŘESNĚ PODLE SPECIFIKACE
- Přepsat PDP na `/api/price-matrix/lookup`
- Aktualizovat CatalogCard přesně dle specifikace
- Přepsat košík na snapshot architektura
- Čas: 3-4 hodiny
- Výhoda: Jednoduší, přehlednější kód
- Nevýhoda: Nahradí funkční `/api/quote` systém

### Možnost B: Ověřit a Doupravit Existující ČÁST 3
- Nechat `/api/quote` (je lepší)
- Opravit CatalogCard (už existuje, jen má TODOs)
- Ověřit košík (je fakt kompletní)
- Čas: 1-2 hodiny
- Výhoda: Zachovej lepší architekturu
- Nevýhoda: Není 100% podle specifikace

## Moje doporučení:
**Možnost B** - Tvůj kód je kvalitnější než specifikace. Specifikace byla psaná PŘED tím, než jsi viděla ten `/api/quote` system.

---

**Rozhodnutí:**
Řekni kterou zvolíš a pokračuji.
