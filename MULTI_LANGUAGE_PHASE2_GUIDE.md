# Multi-Language Phase 2 - Implementation Guide

## ✅ Phase 1 DOKONČENO (commit 0f038ce)
- Translation files (cs.json, en.json)
- LanguageContext + Provider
- LanguageSwitcher component

## 🔄 Phase 2 - CO ZBÝVÁ DODĚLAT

### 1. Integrovat LanguageSwitcher do Header.tsx

**Soubor:** `components/Header.tsx`

**Najdi řádek ~242-249** (stávající language select):
```tsx
<select
  value={language}
  onChange={(e) => setLanguage(e.target.value as 'cs' | 'en')}
  className="border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy"
>
  <option value="cs">🇨🇿 Čeština</option>
  <option value="en">🇬🇧 English</option>
</select>
```

**Nahraď za:**
```tsx
<LanguageSwitcher />
```

**A přidej import na začátek souboru:**
```tsx
import LanguageSwitcher from './LanguageSwitcher';
```

**Odstraň lokální state** (pokud existuje):
```tsx
// SMAZAT:
const [language, setLanguage] = useState<'cs' | 'en'>('cs');
```

---

### 2. Převést Header navigaci na translations

**Soubor:** `components/Header.tsx`

**Na začátek přidej:**
```tsx
'use client'; // Pokud už není

import { useTranslation } from '@/contexts/LanguageContext';

// V komponentě:
const { t } = useTranslation();
```

**Nahraď statické texty:**

**Navigace:**
```tsx
// BYLO:
<Link href="/">Domů</Link>

// ZMĚŇ NA:
<Link href="/">{t('nav.home')}</Link>
```

**Kompletní navigace:**
- `Domů` → `{t('nav.home')}`
- `Vlasy k prodloužení` → `{t('nav.hairExtensions')}`
- `Nebarvené panenské vlasy` → `{t('nav.hairExtensions_undyed')}`
- `Barvené vlasy` → `{t('nav.hairExtensions_dyed')}`
- `Příčesky a paruky` → `{t('nav.wigs')}`
- `Ofiny` → `{t('nav.wigs_bangs')}`
- `Toupee/tupé` → `{t('nav.wigs_toupee')}`
- `Vlasové tresy` → `{t('nav.wigs_wefts')}`
- `Pravé paruky` → `{t('nav.wigs_real')}`
- `Clip in vlasy` → `{t('nav.wigs_clipIn')}`
- `Clip in culík` → `{t('nav.wigs_clipInPonytail')}`
- `Příslušenství` → `{t('nav.accessories')}`
- `Metody zakončení` → `{t('nav.methods')}`
- `Velkoobchod` → `{t('nav.wholesale')}`
- `Showroom` → `{t('nav.showroom')}`
- `Kontakt` → `{t('nav.contact')}`

**Topbar:**
```tsx
// Instagram text:
// BYLO: "Sledujte nás na Instagramu a získejte voucher v hodnotě 500 Kč"
// ZMĚŇ NA: {t('header.topbar.instagram')}

// Location:
// BYLO: "Revoluční 8, Praha"
// ZMĚŇ NA: {t('header.topbar.location')}
```

**Akční tlačítka aria-labels:**
```tsx
// Search button:
aria-label={t('nav.search')} // nebo "Hledat"

// Account button:
aria-label={t('nav.myAccount')}

// Favorites button:
aria-label={t('nav.favorites')}

// Cart button:
aria-label={t('nav.cart')}
```

---

### 3. Převést Footer na translations

**Soubor:** `components/Footer.tsx`

**Přidej:**
```tsx
'use client';

import { useTranslation } from '@/contexts/LanguageContext';

// V komponentě:
const { t } = useTranslation();
```

**Nahraď texty:**
```tsx
// About section:
<h3>{t('footer.about.title')}</h3>
<p>{t('footer.about.description')}</p>

// Customer section:
<h3>{t('footer.customer.title')}</h3>
<Link href="/doprava">{t('footer.customer.shipping')}</Link>
<Link href="/vraceni">{t('footer.customer.returns')}</Link>
<Link href="/ochrana">{t('footer.customer.privacy')}</Link>
<Link href="/obchodni-podminky">{t('footer.customer.terms')}</Link>
<Link href="/faq">{t('footer.customer.faq')}</Link>

// Contact section:
<h3>{t('footer.contact.title')}</h3>
<p>{t('footer.contact.address')}</p>
<p>{t('footer.contact.phone')}</p>
<p>{t('footer.contact.email')}</p>
<p>{t('footer.contact.hours')}</p>

// Social section:
<h3>{t('footer.social.title')}</h3>

// Copyright:
<p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
<p>{t('footer.poweredBy')}</p>
```

---

### 4. Převést Homepage na translations

**Soubor:** `app/page.tsx`

**POZNÁMKA:** Homepage je už **server component** (ISR), takže NEMŮŽEŠ použít `useTranslation()` hook!

**Řešení - 2 možnosti:**

#### **Možnost A: Změnit homepage na client component**
```tsx
'use client';

import { useTranslation } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      {/* ... */}
    </div>
  );
}
```

#### **Možnost B: Vytvořit client komponentu pro texty**
```tsx
// app/page.tsx (server component)
import HomeContent from '@/components/HomeContent';

export default function HomePage() {
  return <HomeContent />;
}

// components/HomeContent.tsx (client component)
'use client';

import { useTranslation } from '@/contexts/LanguageContext';

export default function HomeContent() {
  const { t } = useTranslation();
  // ... veškerý obsah homepage s translations
}
```

**Texty k nahrazení:**

**Hero section:**
```tsx
<h1>{t('home.hero.title')}</h1>
<p>{t('home.hero.subtitle')}</p>
<p>{t('home.hero.description')}</p>
<button>{t('home.hero.cta')}</button>
```

**Features:**
```tsx
<h3>{t('home.features.quality.title')}</h3>
<p>{t('home.features.quality.description')}</p>

<h3>{t('home.features.coloring.title')}</h3>
<p>{t('home.features.coloring.description')}</p>

<h3>{t('home.features.delivery.title')}</h3>
<p>{t('home.features.delivery.description')}</p>

<h3>{t('home.features.warranty.title')}</h3>
<p>{t('home.features.warranty.description')}</p>
```

**Categories:**
```tsx
<h2>{t('home.categories.undyed.title')}</h2>
<p>{t('home.categories.undyed.description')}</p>
<span>{t('home.categories.undyed.from')}</span>

<h2>{t('home.categories.dyed.title')}</h2>
<p>{t('home.categories.dyed.description')}</p>
<span>{t('home.categories.dyed.from')}</span>
```

**Why Us section:**
```tsx
<h2>{t('home.whyUs.title')}</h2>
<p>{t('home.whyUs.subtitle')}</p>

<li>{t('home.whyUs.reasons.quality')}</li>
<li>{t('home.whyUs.reasons.experience')}</li>
<li>{t('home.whyUs.reasons.service')}</li>
<li>{t('home.whyUs.reasons.price')}</li>
```

---

### 5. Commit & Push

```bash
git add -A
git commit -m "feat: Multi-language Phase 2 - UI translations (CZ/EN)

- Integrován LanguageSwitcher do Header.tsx
- Převedena Header navigace na translations
- Převeden Footer na translations
- Převedena Homepage na translations
- Všechny statické texty nyní podporují CZ/EN

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

### 6. Test v produkci

Po deployi na Vercel:

1. **Otevři** https://www.muzahair.cz
2. **Klikni** na language switcher (🇨🇿/🇬🇧)
3. **Ověř** že se mění:
   - Navigace v Header
   - Texty v Footer
   - Homepage hero, features, categories
4. **Zkontroluj** localStorage v devtools:
   - `language: "cs"` nebo `"en"`
5. **Refreshni** stránku → jazyk zůstane uložený

---

## 🎯 OČEKÁVANÝ VÝSLEDEK

Po Phase 2:
- ✅ Celý Header v CZ/EN
- ✅ Celý Footer v CZ/EN
- ✅ Homepage v CZ/EN
- ✅ Language switcher funguje
- ✅ Volba jazyka se ukládá v localStorage
- ✅ Po refreshi zůstane vybraný jazyk

---

## 📊 CO JEŠTĚ ZBÝVÁ (Fáze 3 - Optional)

- Multi-language support pro **produkty v DB** (názvy, popisy)
- Multi-language support pro **blog články**
- Multi-language support pro **katalogové stránky**
- Multi-language support pro **checkout flow**
- Multi-language support pro **admin panel**

Tyto věci můžeš dodělat postupně podle priority.
