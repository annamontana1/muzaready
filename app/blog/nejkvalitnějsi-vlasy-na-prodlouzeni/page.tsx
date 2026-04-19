import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Jak poznat nejkvalitnější vlasy na prodloužení — průvodce 2026 | Múza Hair',
  description:
    'Kompletní průvodce jak poznat nejkvalitnější vlasy na prodloužení v roce 2026. Panenské vlasy Praha, certifikát původu, srovnání kvality Standard vs LUXE vs Platinum.',
  keywords: [
    'nejkvalitnější vlasy na prodloužení',
    'jak poznat kvalitní vlasy na prodloužení',
    'panenské vlasy Praha',
    'certifikované vlasy na prodloužení',
    'nejlepší vlasy na prodloužení 2026',
  ],
  authors: [{ name: 'Múza Hair' }],
  openGraph: {
    title: 'Jak poznat nejkvalitnější vlasy na prodloužení — průvodce 2026 | Múza Hair',
    description:
      'Kompletní průvodce jak poznat nejkvalitnější vlasy na prodloužení. 5 klíčových kritérií, srovnání tříd kvality a rady od expertů z Prahy.',
    type: 'article',
    url: 'https://muzahair.cz/blog/nejkvalitnějsi-vlasy-na-prodlouzeni',
    publishedTime: '2026-01-15T09:00:00+01:00',
    modifiedTime: '2026-04-19T10:00:00+02:00',
    authors: ['Múza Hair'],
    tags: [
      'nejkvalitnější vlasy na prodloužení',
      'panenské vlasy',
      'kvalita vlasů',
      'slovanské vlasy',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jak poznat nejkvalitnější vlasy na prodloužení — průvodce 2026',
    description:
      'Kompletní průvodce jak poznat nejkvalitnější vlasy na prodloužení. Panenské vlasy Praha, 5 kritérií kvality.',
  },
  alternates: {
    canonical: 'https://muzahair.cz/blog/nejkvalitnějsi-vlasy-na-prodlouzeni',
  },
};

// ─── Structured Data ──────────────────────────────────────────────────────────

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jak poznat nejkvalitnější vlasy na prodloužení — kompletní průvodce 2026',
  description:
    'Kompletní průvodce jak poznat nejkvalitnější vlasy na prodloužení v roce 2026. Panenské vlasy Praha, certifikát původu, srovnání kvality Standard vs LUXE vs Platinum.',
  image: 'https://muzahair.cz/og-image.jpg',
  datePublished: '2026-01-15T09:00:00+01:00',
  dateModified: '2026-04-19T10:00:00+02:00',
  author: {
    '@type': 'Organization',
    name: 'Múza Hair',
    url: 'https://muzahair.cz',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Múza Hair',
    logo: {
      '@type': 'ImageObject',
      url: 'https://muzahair.cz/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://muzahair.cz/blog/nejkvalitnějsi-vlasy-na-prodlouzeni',
  },
  keywords:
    'nejkvalitnější vlasy na prodloužení, panenské vlasy Praha, certifikované vlasy na prodloužení, slovanské vlasy, kvalita vlasů',
  articleSection: 'Průvodce',
  inLanguage: 'cs-CZ',
  wordCount: 3800,
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Co jsou panenské vlasy a proč jsou nejkvalitnější?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Panenské vlasy (virgin hair) jsou vlasy, které nikdy nebyly chemicky ošetřeny — nebarveny, neodbarven ani jinak upraveny. Mají zachovanou přirozenou kutikulu, přirozenou pigmentaci a plnou strukturu vlasového vlákna. Jsou to nejkvalitnější vlasy na trhu, protože si zachovávají přirozený lesk, pružnost a dlouhou životnost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak dlouho vydrží kvalitní vlasy na prodloužení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kvalitní panenské slovanské vlasy při správné péči vydrží 12–24 měsíců nošení. Standardní vlasy s odstraněnou kutikulou vydržívají obvykle 3–6 měsíců. Délka životnosti závisí na metodě prodloužení, každodenní péči, způsobu mytí a použití tepelných nástrojů.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak poznat, zda jsou vlasy ošetřeny silikonem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vlasy ošetřené silikonem jsou zpočátku lesklé a hladké, ale po prvním mytí rychle ztrácejí lesk, začnou se splétat a jejich kvalita rapidně klesá. Pravé panenské vlasy si zachovají přirozený lesk i po mnohonásobném mytí. Dalším testem je přiložit vlasy ke svíčce — panenské vlasy se spálí podobně jako lidský vlas, zatímco syntetické nebo silikonem ošetřené mohou reagovat odlišně.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proč jsou slovanské vlasy lepší než asijské vlasy na prodloužení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Slovanské vlasy jsou přirozeně jemnější, světlejší a strukturou velmi blízké vlasům středoevropských žen. Jsou snáze barvitelné na světlé odstíny bez silného odbarňování, lépe splývají s přírodními evropskými vlasy a vypadají přirozeněji. Asijské vlasy jsou silnější, tmavší a mají odlišnou strukturu kutikuly, díky čemuž jsou hůře barvitelné a mohou na světlejších Evropankách vypadat nepřirozeně.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kde koupit certifikované vlasy na prodloužení v Praze?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Múza Hair nabízí certifikované vlasy na prodloužení v Praze od roku 2016. Všechny naše vlasy mají certifikát původu, pochází od slovanských a českých dárců a jsou k dispozici ve třech třídách kvality: Standard, LUXE a Platinum. Navštivte náš e-shop nebo se objednejte na konzultaci v naší pražské provozovně.',
      },
    },
  ],
};

const breadcrumbItems = [
  { name: 'Domů', url: 'https://muzahair.cz' },
  { name: 'Blog', url: 'https://muzahair.cz/blog' },
  {
    name: 'Nejkvalitnější vlasy na prodloužení',
    url: 'https://muzahair.cz/blog/nejkvalitnějsi-vlasy-na-prodlouzeni',
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function NejkvalitnějsiVlasyPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <article className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* ── Breadcrumb ────────────────────────────────────────────────── */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-600 flex-wrap">
              <li>
                <Link href="/" className="hover:text-burgundy transition">
                  Domů
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-burgundy transition">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-burgundy font-medium">
                Nejkvalitnější vlasy na prodloužení
              </li>
            </ol>
          </nav>

          {/* ── Article Header ────────────────────────────────────────────── */}
          <header className="mb-10">
            <div className="mb-4">
              <span className="px-3 py-1 bg-burgundy/10 text-burgundy rounded-full text-sm font-medium">
                Průvodce & Rady
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-5 leading-tight">
              Jak poznat nejkvalitnější vlasy na prodloužení — kompletní průvodce 2026
            </h1>

            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Na trhu jsou tisíce nabídek vlasů na prodloužení. Ceny se liší o stovky procent
              a marketingové sliby znějí přesvědčivě u všech. Jak tedy skutečně poznat,
              co jsou nejkvalitnější vlasy na prodloužení — a proč na tom záleží více,
              než si mnohé ženy uvědomují?
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-burgundy">Múza Hair</span>
                <span>— Praha, od 2016</span>
              </div>
              <div className="flex items-center gap-2">
                <time dateTime="2026-01-15">15. ledna 2026</time>
              </div>
              <div className="flex items-center gap-2">
                <span>Aktualizováno:</span>
                <time dateTime="2026-04-19">19. dubna 2026</time>
              </div>
              <div className="flex items-center gap-2">
                8 min čtení
              </div>
            </div>
          </header>

          {/* ── Hero Banner ───────────────────────────────────────────────── */}
          <div className="aspect-video bg-gradient-to-br from-burgundy/20 to-maroon/20 rounded-xl mb-10 flex items-center justify-center">
            <div className="text-center px-8">
              <p className="text-burgundy font-playfair text-2xl md:text-3xl font-semibold">
                Průvodce kvalitou vlasů
              </p>
              <p className="text-burgundy/70 mt-2 text-sm">
                Panenské slovanské vlasy · Praha od 2016
              </p>
            </div>
          </div>

          {/* ── Table of Contents ─────────────────────────────────────────── */}
          <nav
            className="bg-ivory rounded-xl p-6 mb-10 border border-burgundy/10"
            aria-label="Obsah článku"
          >
            <p className="font-semibold text-burgundy mb-3 font-playfair text-lg">
              Obsah článku
            </p>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#proc-na-kvalite-zalezi" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">1.</span>
                  Proč na kvalitě vlasů tak záleží
                </a>
              </li>
              <li>
                <a href="#co-jsou-panenske-vlasy" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">2.</span>
                  Co jsou panenské vlasy a proč jsou nejkvalitnější?
                </a>
              </li>
              <li>
                <a href="#5-kriterii" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">3.</span>
                  5 kritérií jak poznat kvalitní vlasy na prodloužení
                </a>
              </li>
              <li>
                <a href="#srovnani-kvality" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">4.</span>
                  Srovnání kvality: Standard vs LUXE vs Platinum
                </a>
              </li>
              <li>
                <a href="#slovanske-vlasy" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">5.</span>
                  Proč jsou slovanské vlasy nejkvalitnější pro Evropanky?
                </a>
              </li>
              <li>
                <a href="#jak-dlouho-vydrzi" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">6.</span>
                  Jak dlouho vydrží kvalitní vlasy na prodloužení?
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-burgundy transition flex items-center gap-2">
                  <span className="text-burgundy font-bold">7.</span>
                  Nejčastější otázky (FAQ)
                </a>
              </li>
            </ol>
          </nav>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <div className="prose prose-lg max-w-none text-gray-800">

            {/* Section 1 — Proč na kvalitě záleží */}
            <section id="proc-na-kvalite-zalezi" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Proč na kvalitě vlasů na prodloužení tak záleží
              </h2>

              <p className="mb-4 leading-relaxed">
                Prodloužení vlasů je investice — nejen finanční, ale také časová. Dobré aplikaci
                předchází konzultace, příprava a samotné sezení, které může trvat několik hodin.
                Investujete-li do levných vlasů nízké kvality, riskujete, že budou vypadat
                nepřirozeně, rychle se zpletenec a ztratí lesk už po prvním mytí.
              </p>

              <p className="mb-4 leading-relaxed">
                Na druhou stranu nejkvalitnější vlasy na prodloužení — pravé panenské vlasy
                ze slovanských a českých zdrojů — vydrží při správné péči rok i déle, jdou
                barvit, tvarovat teplem a splývají s vašimi přirozenými vlasy tak dokonale,
                že je od sebe nerozeznáte ani zprostředka.
              </p>

              <p className="mb-4 leading-relaxed">
                V Múza Hair se věnujeme prémiovým vlasovým prodloužením od roku 2016.
                Za tu dobu jsme otestovali desítky dodavatelů, prošli stovkami
                konzultací a naučili se přesně, co dělá vlasy skutečně výjimečnými.
                V tomto průvodci sdílíme vše, co potřebujete vědět, abyste se
                při příštím nákupu rozhodli správně.
              </p>

              <div className="bg-burgundy/5 border-l-4 border-burgundy rounded-r-xl p-5 my-6">
                <p className="text-burgundy font-semibold mb-1">Klíčový poznatek</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Cena vlasů na prodloužení koreluje s jejich kvalitou jen tehdy, pokud víte,
                  na co se ptát. Levné vlasy jsou téměř vždy kompromisem — buď v původu,
                  nebo ve zpracování. Přeplacenost ale také existuje. Znalost pěti
                  základních kritérií vám pomůže nakupovat chytře.
                </p>
              </div>
            </section>

            {/* Section 2 — Co jsou panenské vlasy */}
            <section id="co-jsou-panenske-vlasy" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Co jsou panenské vlasy a proč jsou nejkvalitnější?
              </h2>

              <p className="mb-4 leading-relaxed">
                Termín <strong className="text-burgundy">panenské vlasy</strong> (anglicky
                &quot;virgin hair&quot;) označuje vlasy, které od dárce prošly minimálním nebo
                žádným chemickým zpracováním. Konkrétně to znamená:
              </p>

              <ul className="space-y-3 mb-6 ml-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-600 text-lg flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-burgundy">Žádné barvení:</strong> vlasy si zachovávají
                    přirozenou pigmentaci a strukturu vlákna.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-600 text-lg flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-burgundy">Neodstraněná kutikula:</strong> ochranná
                    vnější vrstva vlasu je neporušená a orientovaná jednosměrně.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-600 text-lg flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-burgundy">Žádný silikon:</strong> vlasy nejsou
                    potaženy silikonem, který maskuje poškození, ale po prvním mytí mizí.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-green-600 text-lg flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-burgundy">Přirozená pružnost:</strong> zdravý vlas
                    se natáhne o 30–50 % své délky a vrátí se zpět — panenský vlas tuto
                    vlastnost plně zachovává.
                  </span>
                </li>
              </ul>

              <p className="mb-4 leading-relaxed">
                Proč je to tak důležité? Kutikula je jako střecha domu — chrání vnitřní
                strukturu vlasu. Pokud je neporušená a jednosměrně orientovaná (všechny
                šupiny směřují od kořene ke špičce), vlasy se nemotají, jsou přirozeně
                lesklé a snáze se udržují. Vlasy s odstraněnou nebo poškozenou kutikulou
                rychle vysychají, zplstí a začínají připomínat koudelí.
              </p>

              <p className="mb-4 leading-relaxed">
                Na světovém trhu se pravé panenské vlasy vyskytují ve třech hlavních
                kategoriích podle geografického původu:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-ivory rounded-xl p-5 border border-gray-100">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">
                    Slovanské vlasy
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Nejjemnější, nejsvětlejší, strukturou nejpodobnější vlasům středoevropských
                    žen. Ideální pro barvení. Nejdražší a nejžádanější kategorie.
                  </p>
                </div>
                <div className="bg-ivory rounded-xl p-5 border border-gray-100">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">
                    Indické vlasy
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Silnější, tmavší a výrazně kudrnatější než slovanské. Vhodné pro tmavší
                    odstíny. Nejrozšířenější kategorie na světovém trhu.
                  </p>
                </div>
                <div className="bg-ivory rounded-xl p-5 border border-gray-100">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">
                    Asijské vlasy
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Nejsilnější, kulaté v průřezu, výrazně lesklé. Obtížně barvitelné
                    na světlé odstíny. Pro Evropanky méně vhodné.
                  </p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed">
                Pro ženy ve střední Evropě — ať již Češky, Slovenky nebo jiné Slovanky —
                jsou <Link href="/slovanske-vlasy-na-prodlouzeni" className="text-burgundy hover:text-maroon underline decoration-dotted">slovanské vlasy na prodloužení</Link> jednoznačně
                nejlepší volbou. Jejich přirozená jemnost a barva se snoubí s evropskými
                vlasy tak harmonicky, že okolí prodloužení vůbec nepostřehne.
              </p>
            </section>

            {/* Section 3 — 5 kritérií */}
            <section id="5-kriterii" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                5 kritérií jak poznat kvalitní vlasy na prodloužení
              </h2>

              <p className="mb-6 leading-relaxed">
                Níže najdete pět konkrétních kritérií, která skutečně rozhodují o kvalitě
                a trvanlivosti vlasů na prodloužení. Při každém nákupu se dodavatele
                na tyto body přímo zeptejte — odpovědi hodně napoví.
              </p>

              {/* Kriterium 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    1
                  </span>
                  <h3 className="text-2xl font-playfair text-burgundy">
                    Původ vlasů: slovanský vs. asijský
                  </h3>
                </div>
                <p className="mb-3 leading-relaxed ml-12">
                  Geografický původ vlasů je první a nejdůležitější kritérium. Vlasy se liší
                  strukturou, tloušťkou, leskem i způsobem reakce na barvení.
                </p>
                <div className="ml-12 bg-ivory rounded-xl p-5">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-burgundy mb-2">Slovanské / české vlasy</p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex gap-2"><span className="text-green-600">✓</span> Průměr vlasu 60–70 mikronů</li>
                        <li className="flex gap-2"><span className="text-green-600">✓</span> Přirozeně světlejší odstíny</li>
                        <li className="flex gap-2"><span className="text-green-600">✓</span> Snadno barvitelné</li>
                        <li className="flex gap-2"><span className="text-green-600">✓</span> Jemná textura</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 mb-2">Asijské vlasy</p>
                      <ul className="space-y-1 text-gray-600">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Průměr vlasu 80–100 mikronů</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Tmavé, těžko odbarvitelné</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Hůře splývají s evropskými vlasy</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Hrubší textura</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="mt-3 ml-12 text-sm text-gray-600">
                  <strong>Jak to zjistit:</strong> Zeptejte se dodavatele na certifikát původu
                  nebo dokumentaci dárce. Poctivé firmy jako Múza Hair tento doklad na vyžádání
                  poskytnou.
                </p>
              </div>

              {/* Kriterium 2 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    2
                  </span>
                  <h3 className="text-2xl font-playfair text-burgundy">
                    Kutikula: zachována nebo odstraněna?
                  </h3>
                </div>
                <p className="mb-3 leading-relaxed ml-12">
                  Kutikula je vnější ochranná vrstva každého vlasového vlákna. Tvoří ji
                  překrývající se šupiny orientované jedním směrem — od kořene ke konci.
                  Tato orientace je zásadní: vlasy s jednosměrnou kutikulou se neomotávají,
                  jsou přirozeně lesklé a vydržují.
                </p>
                <div className="ml-12 grid md:grid-cols-2 gap-4 my-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="font-semibold text-green-800 mb-2">
                      Vlasy se zachovanou kutikulou (Remy / panenské)
                    </p>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>Šupiny jednosměrně orientovány</li>
                      <li>Přirozený lesk bez silikonu</li>
                      <li>Nevzniká tření → neplstí se</li>
                      <li>Vydržují 12–24 měsíců</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="font-semibold text-red-800 mb-2">
                      Vlasy s odstraněnou kutikulou (Non-Remy)
                    </p>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>Bez ochranné vrstvy</li>
                      <li>Potaženy silikonem (krátkodobé)</li>
                      <li>Rychle se spletou a suší</li>
                      <li>Vydržují jen 3–6 měsíců</li>
                    </ul>
                  </div>
                </div>
                <p className="ml-12 text-sm text-gray-600">
                  <strong>Test v praxi:</strong> Přejeďte prsty po prameni vlasů od konce ke
                  kořeni. Vlasy s jednosměrnou kutikulou budou klást odpor (jako kočičí srst
                  pohlazenou na špatnou stranu), zatímco non-remy vlasy se budou hladit hladce
                  v obou směrech.
                </p>
              </div>

              {/* Kriterium 3 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    3
                  </span>
                  <h3 className="text-2xl font-playfair text-burgundy">
                    Chemické ošetření: silikon vs. přirozené
                  </h3>
                </div>
                <p className="mb-3 leading-relaxed ml-12">
                  Jedním z nejčastějších triků v odvětví vlasových prodloužení je potažení
                  vlasů nízké kvality vrstvou silikonu. Výsledkem je dočasně krásný, lesklý
                  a hladký pramen — jenže po prvním mytí šamponem silikon zmizí a pravá
                  (nízká) kvalita se odhalí. Vlasy se začnou splétat, lámat a ztrácet objem.
                </p>
                <div className="ml-12 bg-amber-50 border border-amber-200 rounded-xl p-5 my-4">
                  <p className="font-semibold text-amber-800 mb-3">
                    Jak odhalit silikonové vlasy
                  </p>
                  <ol className="space-y-2 text-sm text-amber-700">
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">1.</span>
                      Omyjte malý pramen čistou vodou bez kondicionéru — silikonové vlasy se
                      okamžitě nafouknou a začnou se splétat.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">2.</span>
                      Přiložte vlas k tělu — pravé vlasy mají přirozenou teplotu, syntetické
                      (nebo silně ošetřené) se chovají plasticky.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">3.</span>
                      Zkuste vlas natáhnout — panenský vlas má pružnost, silikonový se spíše
                      zlomí, protože vlákno je pod vrstvou silikonu poškozené.
                    </li>
                  </ol>
                </div>
                <p className="ml-12 text-sm text-gray-600">
                  Pravé panenské vlasy ze slovanských zdrojů nepotřebují silikonovou úpravu —
                  jsou přirozeně lesklé a zdravé. Pokud dodavatel nedokáže jasně říci,
                  zda jsou vlasy chemicky ošetřeny, je to varovný signál.
                </p>
              </div>

              {/* Kriterium 4 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    4
                  </span>
                  <h3 className="text-2xl font-playfair text-burgundy">
                    Jeden dárce vs. více dárců
                  </h3>
                </div>
                <p className="mb-3 leading-relaxed ml-12">
                  Vlasy od jednoho dárce (single donor) jsou nejvyšší možnou třídou kvality.
                  Celý pramen pochází z jedné hlavy, takže je konzistentní v tloušťce,
                  barvě, struktuře a reakci na barvení. Naopak vlasy sbírané od více dárců
                  a mixované dohromady mohou mít různou texturu a reagovat na ošetření
                  nepředvídatelně.
                </p>
                <div className="ml-12 grid md:grid-cols-2 gap-4 my-4">
                  <div className="bg-ivory rounded-xl p-4 border border-burgundy/20">
                    <p className="font-semibold text-burgundy mb-2">Jeden dárce (Single Donor)</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex gap-2"><span className="text-green-600">✓</span> Konzistentní tloušťka od kořene ke konci</li>
                      <li className="flex gap-2"><span className="text-green-600">✓</span> Jednotná barva a struktura</li>
                      <li className="flex gap-2"><span className="text-green-600">✓</span> Předvídatelná reakce na barvení</li>
                      <li className="flex gap-2"><span className="text-green-600">✓</span> Naše Platinum třída</li>
                    </ul>
                  </div>
                  <div className="bg-ivory rounded-xl p-4 border border-gray-200">
                    <p className="font-semibold text-gray-600 mb-2">Více dárců (Multi Donor)</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex gap-2"><span className="text-amber-500">~</span> Může být tloušťkově nekonzistentní</li>
                      <li className="flex gap-2"><span className="text-amber-500">~</span> Mírné variace v barvě</li>
                      <li className="flex gap-2"><span className="text-amber-500">~</span> Stále kvalitní při správném třídění</li>
                      <li className="flex gap-2"><span className="text-amber-500">~</span> Naše Standard a LUXE třída</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Kriterium 5 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 bg-burgundy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    5
                  </span>
                  <h3 className="text-2xl font-playfair text-burgundy">
                    Certifikát původu
                  </h3>
                </div>
                <p className="mb-3 leading-relaxed ml-12">
                  Certifikát původu je doklad, který uvádí, odkud vlasy pocházejí, jak byly
                  zpracovány a zda splňují hygienické a etické standardy. V Evropě zatím
                  neexistuje jednotná legislativní norma pro vlasy na prodloužení, a proto
                  je certifikát od seriózního výrobce nebo dodavatele cenným ukazatelem
                  kvality a transparentnosti.
                </p>
                <div className="ml-12 bg-burgundy/5 border border-burgundy/20 rounded-xl p-5 my-4">
                  <p className="font-semibold text-burgundy mb-3">
                    Co by měl certifikovaný dodavatel garantovat:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy font-bold mt-0.5">→</span>
                      Geografický původ vlasů (země, region)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy font-bold mt-0.5">→</span>
                      Potvrzení dobrovolnosti daru a etického odběru
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy font-bold mt-0.5">→</span>
                      Způsob zpracování (remy / panenské / bez silikonu)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy font-bold mt-0.5">→</span>
                      Splnění hygienických norem (dezinfekce, testování)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy font-bold mt-0.5">→</span>
                      Identifikace šarže pro dohledatelnost
                    </li>
                  </ul>
                </div>
                <p className="ml-12 text-sm text-gray-600">
                  Múza Hair jako český výrobce a dodavatel vlasových prodloužení
                  pracuje výhradně s prověřenými zdroji, u nichž garantujeme
                  etický odběr a transparentní původ každé šarže. Pro naše{' '}
                  <Link
                    href="/panenenske-vlasy-praha"
                    className="text-burgundy hover:text-maroon underline decoration-dotted"
                  >
                    panenské vlasy Praha
                  </Link>{' '}
                  vydáváme certifikát na vyžádání.
                </p>
              </div>
            </section>

            {/* Section 4 — Srovnání kvality */}
            <section id="srovnani-kvality" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Srovnání kvality: Standard vs LUXE vs Platinum
              </h2>

              <p className="mb-6 leading-relaxed">
                Múza Hair nabízí vlasy na prodloužení ve třech jasně definovaných třídách
                kvality. Každá třída je optimalizována pro jiný typ zákaznice — od těch,
                kteří hledají vynikající poměr cena/výkon, po ty, kteří chtějí absolutní
                maximum bez kompromisů.
              </p>

              {/* Comparison Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-burgundy text-white">
                      <th className="text-left p-3 font-semibold rounded-tl-lg">Parametr</th>
                      <th className="text-center p-3 font-semibold">Standard</th>
                      <th className="text-center p-3 font-semibold bg-burgundy/80">LUXE</th>
                      <th className="text-center p-3 font-semibold rounded-tr-lg">Platinum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 bg-white">
                      <td className="p-3 font-medium text-gray-700">Původ vlasů</td>
                      <td className="p-3 text-center text-gray-600">Slovanský mix</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Slovanský výběr</td>
                      <td className="p-3 text-center text-burgundy font-bold">Český / ruský</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="p-3 font-medium text-gray-700">Kutikula</td>
                      <td className="p-3 text-center text-gray-600">Zachována, Remy</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Zachována, Remy+</td>
                      <td className="p-3 text-center text-burgundy font-bold">Panenská, nedotčená</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-white">
                      <td className="p-3 font-medium text-gray-700">Chemické ošetření</td>
                      <td className="p-3 text-center text-gray-600">Minimální</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Žádné</td>
                      <td className="p-3 text-center text-burgundy font-bold">Žádné</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="p-3 font-medium text-gray-700">Počet dárců</td>
                      <td className="p-3 text-center text-gray-600">Více dárců</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Více dárců, tříděno</td>
                      <td className="p-3 text-center text-burgundy font-bold">1 dárce</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-white">
                      <td className="p-3 font-medium text-gray-700">Barvitelnost</td>
                      <td className="p-3 text-center text-gray-600">Střední tóny</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Až po blond</td>
                      <td className="p-3 text-center text-burgundy font-bold">Plná paleta</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="p-3 font-medium text-gray-700">Délka nošení</td>
                      <td className="p-3 text-center text-gray-600">8–12 měsíců</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">12–18 měsíců</td>
                      <td className="p-3 text-center text-burgundy font-bold">18–24+ měsíců</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-medium text-gray-700 rounded-bl-lg">Certifikát původu</td>
                      <td className="p-3 text-center text-gray-600">Na vyžádání</td>
                      <td className="p-3 text-center text-burgundy font-medium bg-burgundy/5">Standardně</td>
                      <td className="p-3 text-center text-burgundy font-bold rounded-br-lg">Standardně + audit</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-3 gap-5 mb-6">
                <div className="bg-ivory rounded-xl p-5 border border-gray-200">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">Standard</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Ideální pro zákaznice, které s prodloužením teprve začínají nebo hledají
                    ekonomičtější alternativu bez kompromisů na přirozeném vzhledu.
                  </p>
                  <Link
                    href="/vlasy-k-prodlouzeni"
                    className="text-sm text-burgundy hover:text-maroon underline font-medium"
                  >
                    Prohlédnout Standard kolekci →
                  </Link>
                </div>
                <div className="bg-burgundy/5 rounded-xl p-5 border border-burgundy/20">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">
                    LUXE
                    <span className="ml-2 text-xs bg-burgundy text-white px-2 py-0.5 rounded-full">Nejoblíbenější</span>
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Nejpopulárnější volba. Vynikající poměr cena/výkon — panenské slovanské vlasy
                    vybrané pro konzistenci a barvitelnost, bez kompromisů na kvalitě.
                  </p>
                  <Link
                    href="/luxusni-vlasy-na-prodlouzeni"
                    className="text-sm text-burgundy hover:text-maroon underline font-medium"
                  >
                    Prohlédnout LUXE kolekci →
                  </Link>
                </div>
                <div className="bg-ivory rounded-xl p-5 border border-gray-200">
                  <p className="font-playfair text-burgundy font-semibold text-lg mb-2">Platinum</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Absolutní špička. Vlasy od jednoho dárce, zcela panenské, s plnou dokumentací.
                    Pro klientky, které chtějí to nejlepší bez jakýchkoliv kompromisů.
                  </p>
                  <Link
                    href="/ceske-vlasy-na-prodlouzeni"
                    className="text-sm text-burgundy hover:text-maroon underline font-medium"
                  >
                    Prohlédnout Platinum kolekci →
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 5 — Proč slovanské vlasy */}
            <section id="slovanske-vlasy" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Proč jsou slovanské vlasy nejkvalitnější pro Evropanky?
              </h2>

              <p className="mb-4 leading-relaxed">
                Otázka &quot;kde koupit nejkvalitnější vlasy na prodloužení&quot; se ve střední
                Evropě opakuje stále dokola. A odpověď odborníků je konzistentní: pokud jste
                Evropanka, hledejte slovanský nebo český původ. Tady je proč.
              </p>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                1. Genetická podobnost
              </h3>
              <p className="mb-4 leading-relaxed">
                Struktura slovanského vlasu je geneticky nejblíže středoevropskému vlasu.
                Průměr vlákna, tvar průřezu (eliptický vs. kulatý), přirozená pigmentace
                i způsob reakce na teplo — vše si je velmi blízké. Výsledkem je bezešvé
                splývání s vašimi vlastními vlasy.
              </p>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                2. Přirozené světlé tóny bez odbarvování
              </h3>
              <p className="mb-4 leading-relaxed">
                Velká část českých a slovenských zákaznic má vlasy v odstínech od tmavé blond
                po světle hnědou. Slovanské vlasy se přirozeně vyskytují v podobném barevném
                spektru — odpadá proto nutnost agresivního odbarvování, které by jinak
                zhoršovalo kvalitu vlasů. Chcete přirozený balayage nebo světlou blond? Se
                slovanskými vlasy je to hračka.
              </p>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                3. Jemnost a objem
              </h3>
              <p className="mb-4 leading-relaxed">
                Slovanský vlas je přirozeně jemnější než asijský nebo indický. To má dvě
                důsledky: splývají přirozeněji a vytvářejí dokonalý objem bez viditelné
                hranice mezi vlastními a přidanými vlasy. Nikdo nerozezná, kde vaše vlasy
                končí a prodloužení začíná.
              </p>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                4. Etické aspekty a traceabilita
              </h3>
              <p className="mb-4 leading-relaxed">
                Slovanské vlasy sbírané v Čechách, na Slovensku nebo v Rusku pocházejí
                od dobrovolných dárkyň, které vědomě prodávají své vlasy za férovou odměnu.
                Tento model je transparentní a etický, na rozdíl od části globálního trhu,
                kde původ vlasů bývá nejasný nebo sporný. Jako firma se sídlem v Praze
                máme přímý přístup k ověřeným dárcům — a naši zákazníci to vědí.
              </p>

              <div className="bg-ivory rounded-xl p-6 my-6 border-l-4 border-burgundy">
                <p className="font-semibold text-burgundy mb-2">Věděli jste?</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Múza Hair vznikla v Praze v roce 2016 jako první český specializovaný
                  výrobce a distributor prémiových vlasových prodloužení. Za deset let
                  jsme zpracovali vlasy od více než 2 000 dárkyň ze Čech, Slovenska
                  a dalších slovanských zemí. Každý pramen je sledovatelný zpět ke svému
                  zdroji.
                </p>
              </div>
            </section>

            {/* Section 6 — Jak dlouho vydrží */}
            <section id="jak-dlouho-vydrzi" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Jak dlouho vydrží kvalitní vlasy na prodloužení?
              </h2>

              <p className="mb-4 leading-relaxed">
                Životnost vlasů na prodloužení závisí na třech klíčových faktorech:
                kvalitě samotných vlasů, metodě aplikace a každodenní péči. Pojďme se
                na každý faktor podívat podrobněji.
              </p>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                Životnost dle třídy kvality
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-24 text-right text-sm font-semibold text-burgundy">Standard</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-burgundy/60 rounded-full" style={{ width: '50%' }} />
                  </div>
                  <div className="flex-shrink-0 w-28 text-sm text-gray-600">8–12 měsíců</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-24 text-right text-sm font-semibold text-burgundy">LUXE</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-burgundy/80 rounded-full" style={{ width: '70%' }} />
                  </div>
                  <div className="flex-shrink-0 w-28 text-sm text-gray-600">12–18 měsíců</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-24 text-right text-sm font-semibold text-burgundy">Platinum</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-burgundy rounded-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex-shrink-0 w-28 text-sm text-gray-600">18–24+ měsíců</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-burgundy mb-3 mt-6">
                Jak prodloužit životnost vlasů — 7 pravidel
              </h3>

              <ol className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <p className="font-semibold text-gray-800">Používejte sulfátový šampon</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Šampony bez sulfátů jsou šetrnější k prodloužením — neodmašťují
                      kutikulu tak agresivně a zachovávají přirozený lesk vlasů déle.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <p className="font-semibold text-gray-800">Česejte od konců ke kořenům</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Nikdy nečešte vlasy s nárazy od kořene — rozčesávejte nejprve konce
                      a postupujte nahoru. Předejdete trhání a mechanickému poškození.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <p className="font-semibold text-gray-800">Žárovky a kulmy na nižší teplotu</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tepelné stylingové nástroje používejte na maximálně 180 °C. Vyšší
                      teploty jsou zbytečné a zbytečně degradují kutikulu.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <div>
                    <p className="font-semibold text-gray-800">Spěte s copánkem nebo volným drdolem</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Noční tření vlasů o polštář je jednou z největších příčin mechanického
                      poškození. Hedvábný polštář nebo vlasy spletené do copánku před spaním
                      výrazně prodlouží životnost prodloužení.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">5</span>
                  <div>
                    <p className="font-semibold text-gray-800">Hydratujte pravidelně</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Prodloužení nemají přirozené mazání z pokožky hlavy u svých konců.
                      Nanášejte lehký vlasový olej nebo sérum na středy a konce 2–3× týdně.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">6</span>
                  <div>
                    <p className="font-semibold text-gray-800">Neplávejte bez ochrany</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Chlorovaná voda a mořská sůl degradují kutikulu. Před plaváním
                      vlasy natřete kondicionérem nebo olejem — vytvoří ochrannou
                      vrstvu. Po koupání ihned opláchněte čistou vodou.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-sm">7</span>
                  <div>
                    <p className="font-semibold text-gray-800">Pravidelné kontroly a maintenance</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Nechejte si prodloužení zkontrolovat každých 6–8 týdnů. Prevence
                      je mnohem levnější než oprava poškozených vlasů nebo jejich
                      předčasná výměna.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="bg-burgundy text-white rounded-xl p-6 my-6">
                <p className="font-playfair text-xl mb-2">Rekapitulace</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  Nejkvalitnější vlasy na prodloužení — panenské slovanské — vydrží při
                  správné péči 18–24 měsíců nebo déle. To je 3–4× více než levné vlasy
                  nízké kvality. Zdánlivě vyšší pořizovací cena se tak v přepočtu na měsíc
                  nošení ukáže jako výrazně ekonomičtější volba.
                </p>
              </div>
            </section>

            {/* Section 7 — FAQ */}
            <section id="faq" className="mb-12">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Nejčastější otázky o kvalitě vlasů na prodloužení
              </h2>

              <div className="space-y-4">
                {/* FAQ 1 */}
                <details className="group bg-ivory rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-burgundy/5 transition">
                    <span className="font-semibold text-burgundy pr-4">
                      Co jsou panenské vlasy a proč jsou nejkvalitnější?
                    </span>
                    <span className="flex-shrink-0 text-burgundy transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      Panenské vlasy (virgin hair) jsou vlasy, které nikdy nebyly chemicky
                      ošetřeny — nebarveny, neodbarven ani jinak upraveny. Mají zachovanou
                      přirozenou kutikulu, přirozenou pigmentaci a plnou strukturu vlasového
                      vlákna. Jsou to nejkvalitnější vlasy na trhu, protože si zachovávají
                      přirozený lesk, pružnost a dlouhou životnost. Oproti běžným remy vlasům
                      vydržívají výrazně déle a lépe reagují na barvení a tepelnou úpravu.
                    </p>
                  </div>
                </details>

                {/* FAQ 2 */}
                <details className="group bg-ivory rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-burgundy/5 transition">
                    <span className="font-semibold text-burgundy pr-4">
                      Jak dlouho vydrží kvalitní vlasy na prodloužení?
                    </span>
                    <span className="flex-shrink-0 text-burgundy transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      Kvalitní panenské slovanské vlasy při správné péči vydrží 12–24 měsíců
                      nošení. Standardní vlasy s odstraněnou kutikulou vydržívají obvykle
                      3–6 měsíců. Délka životnosti závisí na metodě prodloužení, každodenní
                      péči, způsobu mytí a použití tepelných nástrojů. Správná péče dokáže
                      životnost prodloužit o dalších 30–50 %.
                    </p>
                  </div>
                </details>

                {/* FAQ 3 */}
                <details className="group bg-ivory rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-burgundy/5 transition">
                    <span className="font-semibold text-burgundy pr-4">
                      Jak poznat, zda jsou vlasy ošetřeny silikonem?
                    </span>
                    <span className="flex-shrink-0 text-burgundy transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      Vlasy ošetřené silikonem jsou zpočátku lesklé a hladké, ale po prvním
                      mytí rychle ztrácejí lesk, začnou se splétat a jejich kvalita rapidně
                      klesá. Pravé panenské vlasy si zachovají přirozený lesk i po mnohonásobném
                      mytí. Dalším testem je omytí malého pramene čistou vodou bez kondicionéru —
                      silikonové vlasy se okamžitě nafouknou a začnou se splétat. Panenský vlas
                      se chová přirozeně.
                    </p>
                  </div>
                </details>

                {/* FAQ 4 */}
                <details className="group bg-ivory rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-burgundy/5 transition">
                    <span className="font-semibold text-burgundy pr-4">
                      Proč jsou slovanské vlasy lepší než asijské vlasy na prodloužení?
                    </span>
                    <span className="flex-shrink-0 text-burgundy transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      Slovanské vlasy jsou přirozeně jemnější, světlejší a strukturou velmi
                      blízké vlasům středoevropských žen. Jsou snáze barvitelné na světlé
                      odstíny bez silného odbarňování, lépe splývají s přírodními evropskými
                      vlasy a vypadají přirozeněji. Asijské vlasy jsou silnější, tmavší
                      a mají odlišnou strukturu kutikuly, díky čemuž jsou hůře barvitelné
                      a mohou na světlejších Evropankách vypadat nepřirozeně.
                    </p>
                  </div>
                </details>

                {/* FAQ 5 */}
                <details className="group bg-ivory rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-burgundy/5 transition">
                    <span className="font-semibold text-burgundy pr-4">
                      Kde koupit certifikované vlasy na prodloužení v Praze?
                    </span>
                    <span className="flex-shrink-0 text-burgundy transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-4">
                      Múza Hair nabízí certifikované vlasy na prodloužení v Praze od roku 2016.
                      Všechny naše vlasy mají certifikát původu, pochází od slovanských
                      a českých dárců a jsou k dispozici ve třech třídách kvality: Standard,
                      LUXE a Platinum. Navštivte náš{' '}
                      <Link
                        href="/vlasy-k-prodlouzeni"
                        className="text-burgundy hover:text-maroon underline"
                      >
                        e-shop
                      </Link>{' '}
                      nebo se objednejte na konzultaci v naší pražské provozovně.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            {/* ── Závěr ──────────────────────────────────────────────────────── */}
            <section className="mb-10">
              <h2 className="text-3xl font-playfair text-burgundy mb-5">
                Závěr: Jak vybrat nejkvalitnější vlasy na prodloužení v 2026
              </h2>

              <p className="mb-4 leading-relaxed">
                Trh s vlasovými prodlouženími je přesycen nabídkami a marketingovými hesly.
                Orientovat se v něm není snadné — ale s tímto průvodcem v ruce máte výhodu.
                Připomeňme si pět klíčových kritérií:
              </p>

              <div className="bg-burgundy/5 rounded-xl p-6 mb-6 border border-burgundy/20">
                <ol className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <span><strong className="text-burgundy">Původ vlasů</strong> — slovanský nebo český původ je pro Evropanky ideální.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <span><strong className="text-burgundy">Zachovaná kutikula (Remy/panenské)</strong> — šupiny jednosměrně orientované, bez silikonu.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <span><strong className="text-burgundy">Žádné chemické ošetření</strong> — panenské vlasy nepotřebují silikon ani odbarvování.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <span><strong className="text-burgundy">Jeden dárce</strong> — konzistentní tloušťka a barva, ideálně u Platinum třídy.</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                    <span><strong className="text-burgundy">Certifikát původu</strong> — transparentní doklad etického a sledovatelného zdroje.</span>
                  </li>
                </ol>
              </div>

              <p className="mb-4 leading-relaxed">
                Múza Hair tyto standardy naplňuje u každé šarže. Jsme česká firma s pražským
                zázemím — ne anonymní dropshipping z druhého konce světa. Každý pramen,
                který opustí naše sklady, splňuje přísná kritéria kvality, která jsme si
                za 10 let existence nastavili.
              </p>

              <p className="leading-relaxed">
                Máte otázky nebo chcete pomoci s výběrem? Neváhejte nás{' '}
                <Link href="/kontakt" className="text-burgundy hover:text-maroon underline">
                  kontaktovat
                </Link>{' '}
                nebo navštivte naši{' '}
                <Link href="/koupit-vlasy-na-prodlouzeni-praha" className="text-burgundy hover:text-maroon underline">
                  pražskou prodejnu
                </Link>
                . Rádi vás provedeme výběrem vlasů, které budou dokonale odpovídat vašim
                přirozeným vlasům a vašemu životnímu stylu.
              </p>
            </section>

          </div>{/* end prose */}

          {/* ── Tags ────────────────────────────────────────────────────────── */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Štítky:</span>
              {[
                'nejkvalitnější vlasy na prodloužení',
                'panenské vlasy Praha',
                'jak poznat kvalitní vlasy',
                'slovanské vlasy',
                'certifikované vlasy na prodloužení',
                'Remy vlasy',
                'nejlepší vlasy na prodloužení 2026',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-ivory text-gray-700 rounded-full text-xs border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── CTA Block ───────────────────────────────────────────────────── */}
          <div className="mt-12 bg-burgundy rounded-2xl p-8 text-center text-white">
            <p className="font-playfair text-2xl md:text-3xl mb-3">
              Připraveny vyzkoušet nejkvalitnější vlasy?
            </p>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Prohlédněte si naši kolekci panenských slovanských vlasů — ve třídách Standard,
              LUXE i Platinum. Doručení po celé ČR, konzultace v Praze.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 bg-white text-burgundy rounded-full font-semibold hover:bg-ivory transition"
              >
                Zobrazit produkty
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
              >
                Objednat konzultaci
              </Link>
            </div>
          </div>

          {/* ── Related Articles ────────────────────────────────────────────── */}
          <div className="mt-12">
            <h3 className="text-2xl font-playfair text-burgundy mb-6">
              Mohlo by vás také zajímat
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              <Link
                href="/slovanske-vlasy-na-prodlouzeni"
                className="bg-ivory rounded-xl p-5 hover:shadow-medium transition border border-gray-100 group"
              >
                <span className="text-xs text-burgundy font-medium bg-burgundy/10 px-2 py-0.5 rounded-full">
                  Průvodce
                </span>
                <h4 className="text-base font-semibold text-burgundy mt-3 mb-2 group-hover:text-maroon transition">
                  Slovanské vlasy na prodloužení
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vše o slovanských vlasech — původ, vlastnosti a proč jsou nejlepší volbou
                  pro Evropanky.
                </p>
              </Link>
              <Link
                href="/luxusni-vlasy-na-prodlouzeni"
                className="bg-ivory rounded-xl p-5 hover:shadow-medium transition border border-gray-100 group"
              >
                <span className="text-xs text-burgundy font-medium bg-burgundy/10 px-2 py-0.5 rounded-full">
                  Kolekce
                </span>
                <h4 className="text-base font-semibold text-burgundy mt-3 mb-2 group-hover:text-maroon transition">
                  Luxusní vlasy na prodloužení
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Naše prémiová LUXE kolekce — panenské slovanské vlasy vybrané pro
                  maximální konzistenci a barvitelnost.
                </p>
              </Link>
              <Link
                href="/metody-zakonceni"
                className="bg-ivory rounded-xl p-5 hover:shadow-medium transition border border-gray-100 group"
              >
                <span className="text-xs text-burgundy font-medium bg-burgundy/10 px-2 py-0.5 rounded-full">
                  Průvodce
                </span>
                <h4 className="text-base font-semibold text-burgundy mt-3 mb-2 group-hover:text-maroon transition">
                  Metody prodloužení vlasů
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Keratin, clip-in, tape-in nebo mikroringy? Přehled metod a jak vybrat
                  tu správnou pro vaše vlasy.
                </p>
              </Link>
            </div>
          </div>

        </div>{/* end container */}
      </article>
    </>
  );
}
