# OG Image - Instrukce k vytvoření

## ⚠️ DŮLEŽITÉ

Pro správné fungování Open Graph (WhatsApp, Facebook, Instagram preview) potřebuješ vytvořit **skutečný PNG nebo JPG obrázek**.

## Požadavky na OG Image:

### Technické specifikace:
- **Rozměr:** 1200 x 630 px (poměr 1.91:1)
- **Formát:** JPG nebo PNG
- **Velikost:** Max 8 MB (doporučeno pod 300 KB)
- **Název souboru:** `og-image.jpg` nebo `og-image.png`
- **Umístění:** `/public/og-image.jpg`

### Design doporučení:
✅ Logo/název MÙZA HAIR (velké, čitelné)
✅ Tagline: "Pravé vlasy k prodloužení Praha"
✅ Emoji: 💎 🇨🇿 ⭐
✅ Brand colors: Burgundy (#8B4049), Ivory (#FFF9F0)
✅ Stručný USP: "Vlastní barvírna • Český výrobce • Od 2016"
✅ URL: muza-hair-shop.vercel.app

### Jak vytvořit:

#### Možnost 1: Canva (nejjednodušší)
1. Jdi na https://www.canva.com
2. Vytvoř "Custom Size" 1200 x 630 px
3. Použij gradient pozadí (burgundy → maroon)
4. Přidej text:
   - "MÙZA HAIR" (velké, bold, Georgia font)
   - "Pravé vlasy k prodloužení Praha"
   - "💎 Vlastní barvírna • 🇨🇿 Český výrobce • ⭐ Od 2016"
   - "Standard • LUXE • Platinum Edition"
5. Stáhni jako JPG
6. Přejmenuj na `og-image.jpg`
7. Ulož do `/public/og-image.jpg`

#### Možnost 2: Figma
1. Vytvoř frame 1200 x 630 px
2. Stejný design jako výše
3. Export as JPG/PNG

#### Možnost 3: Photoshop/GIMP
1. Nový soubor 1200 x 630 px, 72 DPI
2. Stejný design jako výše
3. Save for Web as JPG

## Placeholder SVG

V současnosti máme SVG placeholder (`og-image.svg`), ale ten **NEFUNGUJE** pro Open Graph.
Musíš vytvořit PNG/JPG verzi!

## Testování

Po vytvoření otestuj na:
1. https://www.opengraph.xyz
2. https://developers.facebook.com/tools/debug/
3. Pošli odkaz na WhatsApp

## Současný stav:
❌ SVG placeholder (nefunguje pro OG)
⏳ Čeká na vytvoření JPG/PNG verze

## Reference v kódu:
- `/app/layout.tsx` → řádek 52: `url: '/og-image.jpg'`
- `/components/StructuredData.tsx` → řádek 15: `'https://muza-hair-shop.vercel.app/og-image.jpg'`
