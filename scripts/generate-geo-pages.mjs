#!/usr/bin/env node
// Generátor geo landing pages pro muzahair.cz
// Spustit: node scripts/generate-geo-pages.mjs

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(__dirname, '..', 'app');

// ─── DATA ─────────────────────────────────────────────────────────────────────
const cities = [
  // Krajská města
  { name: 'Plzeň',              nameFrom: 'z Plzně',              nameTo: 'do Plzně',              nameIn: 'v Plzni',              slug: 'plzen',                distanceKm: 91,  trainTime: '1,5 hodiny',   carTime: '1 hodinu po D5',          category: 'regional' },
  { name: 'Karlovy Vary',       nameFrom: 'z Karlových Varů',     nameTo: 'do Karlových Varů',     nameIn: 'v Karlových Varech',   slug: 'karlovy-vary',         distanceKm: 128, trainTime: '2,5 hodiny',   carTime: '1,5 hodiny po D6',        category: 'regional' },
  { name: 'Ústí nad Labem',     nameFrom: 'z Ústí nad Labem',     nameTo: 'do Ústí nad Labem',     nameIn: 'v Ústí nad Labem',     slug: 'usti-nad-labem',       distanceKm: 83,  trainTime: '1 hodinu',     carTime: '1 hodinu po D8',          category: 'regional' },
  { name: 'Liberec',            nameFrom: 'z Liberce',            nameTo: 'do Liberce',            nameIn: 'v Liberci',            slug: 'liberec',              distanceKm: 105, trainTime: '1,5 hodiny',   carTime: '1,5 hodiny',              category: 'regional' },
  { name: 'Hradec Králové',     nameFrom: 'z Hradce Králové',     nameTo: 'do Hradce Králové',     nameIn: 'v Hradci Králové',     slug: 'hradec-kralove',       distanceKm: 112, trainTime: '1,5 hodiny',   carTime: '1,5 hodiny po D11',       category: 'regional' },
  { name: 'Pardubice',          nameFrom: 'z Pardubic',           nameTo: 'do Pardubic',           nameIn: 'v Pardubicích',        slug: 'pardubice',            distanceKm: 120, trainTime: '1,5 hodiny',   carTime: '1,5 hodiny po D11',       category: 'regional' },
  { name: 'Jihlava',            nameFrom: 'z Jihlavy',            nameTo: 'do Jihlavy',            nameIn: 'v Jihlavě',            slug: 'jihlava',              distanceKm: 131, trainTime: '2 hodiny',     carTime: '1,5 hodiny po D1',        category: 'regional' },
  { name: 'České Budějovice',   nameFrom: 'z Českých Budějovic',  nameTo: 'do Českých Budějovic',  nameIn: 'v Českých Budějovicích', slug: 'ceske-budejovice',   distanceKm: 151, trainTime: '2,5 hodiny',   carTime: '2 hodiny po D3',          category: 'regional' },
  { name: 'Olomouc',            nameFrom: 'z Olomouce',           nameTo: 'do Olomouce',           nameIn: 'v Olomouci',           slug: 'olomouc',              distanceKm: 280, trainTime: '3 hodiny',     carTime: '3 hodiny po D1',          category: 'regional' },
  { name: 'Zlín',               nameFrom: 'Ze Zlína',             nameTo: 'do Zlína',              nameIn: 've Zlíně',             slug: 'zlin',                 distanceKm: 316, trainTime: '3,5 hodiny',   carTime: '3,5 hodiny',              category: 'regional' },

  // Ostatní větší města
  { name: 'Most',               nameFrom: 'z Mostu',              nameTo: 'do Mostu',              nameIn: 'v Mostě',              slug: 'most',                 distanceKm: 80,  trainTime: '1 hodinu',     carTime: '1 hodinu po D8',          category: 'major' },
  { name: 'Opava',              nameFrom: 'z Opavy',              nameTo: 'do Opavy',              nameIn: 'v Opavě',              slug: 'opava',                distanceKm: 358, trainTime: '4 hodiny',     carTime: '4 hodiny',                category: 'major' },
  { name: 'Frýdek-Místek',      nameFrom: 'z Frýdku-Místku',      nameTo: 'do Frýdku-Místku',      nameIn: 've Frýdku-Místku',     slug: 'frydek-mistek',        distanceKm: 346, trainTime: '3,5 hodiny',   carTime: '3,5 hodiny',              category: 'major' },
  { name: 'Teplice',            nameFrom: 'z Teplic',             nameTo: 'do Teplic',             nameIn: 'v Teplicích',          slug: 'teplice',              distanceKm: 84,  trainTime: '1 hodinu',     carTime: '1 hodinu po D8',          category: 'major' },
  { name: 'Děčín',              nameFrom: 'z Děčína',             nameTo: 'do Děčína',             nameIn: 'v Děčíně',             slug: 'decin',                distanceKm: 110, trainTime: '1,5 hodiny',   carTime: '1,5 hodiny po D8',        category: 'major' },
  { name: 'Chomutov',           nameFrom: 'z Chomutova',          nameTo: 'do Chomutova',          nameIn: 'v Chomutově',          slug: 'chomutov',             distanceKm: 100, trainTime: '1,5 hodiny',   carTime: '1 hodinu',                category: 'major' },
  { name: 'Přerov',             nameFrom: 'z Přerova',            nameTo: 'do Přerova',            nameIn: 'v Přerově',            slug: 'prerov',               distanceKm: 271, trainTime: '2,5 hodiny',   carTime: '2,5 hodiny po D1',        category: 'major' },
  { name: 'Karviná',            nameFrom: 'z Karviné',            nameTo: 'do Karviné',            nameIn: 'v Karviné',            slug: 'karvina',              distanceKm: 356, trainTime: '4 hodiny',     carTime: '4 hodiny',                category: 'major' },
  { name: 'Znojmo',             nameFrom: 'Ze Znojma',            nameTo: 'do Znojma',             nameIn: 've Znojmě',            slug: 'znojmo',               distanceKm: 247, trainTime: '2,5 hodiny',   carTime: '2,5 hodiny',              category: 'major' },
  { name: 'Mladá Boleslav',     nameFrom: 'z Mladé Boleslavi',    nameTo: 'do Mladé Boleslavi',    nameIn: 'v Mladé Boleslavi',    slug: 'mlada-boleslav',       distanceKm: 59,  trainTime: '1 hodinu',     carTime: '45 minut po D10',         category: 'major' },
  { name: 'Prostějov',          nameFrom: 'z Prostějova',         nameTo: 'do Prostějova',         nameIn: 'v Prostějově',         slug: 'prostejov',            distanceKm: 250, trainTime: '2,5 hodiny',   carTime: '2,5 hodiny po D1',        category: 'major' },
  { name: 'Havířov',            nameFrom: 'z Havířova',           nameTo: 'do Havířova',           nameIn: 'v Havířově',           slug: 'havirov',              distanceKm: 350, trainTime: '4 hodiny',     carTime: '4 hodiny',                category: 'major' },

  // Středočeský kraj — okolí Prahy
  { name: 'Kladno',             nameFrom: 'z Kladna',             nameTo: 'do Kladna',             nameIn: 'v Kladně',             slug: 'kladno',               distanceKm: 27,  trainTime: '35 minut',     carTime: '30 minut po D7',          category: 'central' },
  { name: 'Příbram',            nameFrom: 'z Příbrami',           nameTo: 'do Příbrami',           nameIn: 'v Příbrami',           slug: 'pribram',              distanceKm: 60,  trainTime: '1 hodinu',     carTime: '45 minut po D4',          category: 'central' },
  { name: 'Kolín',              nameFrom: 'z Kolína',             nameTo: 'do Kolína',             nameIn: 'v Kolíně',             slug: 'kolin',                distanceKm: 58,  trainTime: '50 minut',     carTime: '50 minut po D11',         category: 'central' },
  { name: 'Mělník',             nameFrom: 'z Mělníka',            nameTo: 'do Mělníka',            nameIn: 'v Mělníku',            slug: 'melnik',               distanceKm: 39,  trainTime: '50 minut',     carTime: '40 minut',                category: 'central' },
  { name: 'Beroun',             nameFrom: 'z Berouna',            nameTo: 'do Berouna',            nameIn: 'v Berouně',            slug: 'beroun',               distanceKm: 34,  trainTime: '40 minut',     carTime: '35 minut po D5',          category: 'central' },
  { name: 'Rakovník',           nameFrom: 'z Rakovníka',          nameTo: 'do Rakovníka',          nameIn: 'v Rakovníku',          slug: 'rakovnik',             distanceKm: 64,  trainTime: '1 hodinu',     carTime: '50 minut',                category: 'central' },
  { name: 'Benešov',            nameFrom: 'z Benešova',           nameTo: 'do Benešova',           nameIn: 'v Benešově',           slug: 'benesov',              distanceKm: 48,  trainTime: '50 minut',     carTime: '45 minut po D1',          category: 'central' },
  { name: 'Nymburk',            nameFrom: 'z Nymburka',           nameTo: 'do Nymburka',           nameIn: 'v Nymburce',           slug: 'nymburk',              distanceKm: 53,  trainTime: '50 minut',     carTime: '45 minut',                category: 'central' },
  { name: 'Kutná Hora',         nameFrom: 'z Kutné Hory',         nameTo: 'do Kutné Hory',         nameIn: 'v Kutné Hoře',         slug: 'kutna-hora',           distanceKm: 67,  trainTime: '1 hodinu',     carTime: '55 minut po D1',          category: 'central' },
  { name: 'Dobříš',             nameFrom: 'z Dobříše',            nameTo: 'do Dobříše',            nameIn: 'v Dobříši',            slug: 'dobris',               distanceKm: 46,  trainTime: '55 minut',     carTime: '40 minut',                category: 'central' },
  { name: 'Říčany',             nameFrom: 'z Říčan',              nameTo: 'do Říčan',              nameIn: 'v Říčanech',           slug: 'ricany',               distanceKm: 22,  trainTime: '30 minut',     carTime: '25 minut',                category: 'central' },
  { name: 'Brandýs nad Labem',  nameFrom: 'z Brandýsa nad Labem', nameTo: 'do Brandýsa nad Labem', nameIn: 'v Brandýse nad Labem', slug: 'brandys-nad-labem',    distanceKm: 24,  trainTime: '35 minut',     carTime: '30 minut',                category: 'central' },
  { name: 'Neratovice',         nameFrom: 'z Neratovic',          nameTo: 'do Neratovic',          nameIn: 'v Neratovicích',       slug: 'neratovice',           distanceKm: 32,  trainTime: '35 minut',     carTime: '30 minut',                category: 'central' },
  { name: 'Kralupy nad Vltavou',nameFrom: 'z Kralup nad Vltavou', nameTo: 'do Kralup nad Vltavou', nameIn: 'v Kralupech nad Vltavou', slug: 'kralupy-nad-vltavou', distanceKm: 25, trainTime: '30 minut',    carTime: '25 minut',                category: 'central' },
  { name: 'Slaný',              nameFrom: 'ze Slaného',           nameTo: 'do Slaného',            nameIn: 've Slaném',            slug: 'slany',                distanceKm: 37,  trainTime: '45 minut',     carTime: '35 minut',                category: 'central' },
  { name: 'Čelákovice',         nameFrom: 'z Čelákovic',          nameTo: 'do Čelákovic',          nameIn: 'v Čelákovicích',       slug: 'celakovice',           distanceKm: 28,  trainTime: '35 minut',     carTime: '30 minut',                category: 'central' },
];

// ─── TEMPLATE ─────────────────────────────────────────────────────────────────
function generatePage(city) {
  const isNear = city.category === 'central';
  const titleSuffix = isNear ? 'Múza Hair Praha' : 'Múza Hair';
  const canonicalUrl = `https://muzahair.cz/prodlouzeni-vlasu-${city.slug}`;

  const faqQuestions = isNear ? [
    {
      q: `Kde se dělá prodloužení vlasů pro klientky ${city.nameFrom}?`,
      a: `Múza Hair má showroom na adrese Revoluční 8, Praha 1 — ${city.distanceKm} km ${city.nameFrom}, cesta autem trvá ${city.carTime}. Pracujeme výhradně na objednání, takže se domluvíme na čase, který vám přesně sedí.`,
    },
    {
      q: `Jak daleko je cesta z ${city.name === 'Říčany' ? 'Říčan' : city.name} do Prahy?`,
      a: `${city.nameFrom.charAt(0).toUpperCase() + city.nameFrom.slice(1)} je to do showroomu Múza Hair Praha 1 přibližně ${city.distanceKm} km. Vlakem ${city.trainTime}, autem ${city.carTime}. Pro klientky ${city.nameFrom} je to výlet na půl dne — aplikace trvá 1,5–3 hodiny.`,
    },
    {
      q: `Mohu si vlasy k prodloužení objednat online z ${city.name}?`,
      a: `Ano — vlasy Standard, Luxe i Platinum lze objednat přes náš e-shop s doručením do 48 hodin. Pokud si nejste jistá výběrem, napište nám na Instagram @muzahair.cz nebo zavolejte — poradíme na dálku.`,
    },
    {
      q: 'Kolik stojí prodloužení vlasů u Múza Hair?',
      a: 'Cena se skládá ze dvou částí: vlasy + aplikace u techničky. Vlasy Standard od 3 900 Kč, Luxe od 6 900 Kč, Platinum od 10 900 Kč. Aplikace keratinu stojí 4 000–5 500 Kč, nanotapes 55–65 Kč/spoj, weft 3 800 Kč/posun. Přesnou kalkulaci připravíme po konzultaci.',
    },
    {
      q: `Jak se objednám ${city.nameFrom} do showroomu?`,
      a: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom je otevřen Po–Ne 10–20, výhradně na objednání. Pro klientky zdaleka doporučujeme ranní termín a konzultaci + výběr vlasů spojit do jedné návštěvy.',
    },
    {
      q: 'Jaké metody prodloužení nabízíte?',
      a: 'Keratin (mikrokeratin), nanotapes (tape-in) a weft (tress). Každá metoda má jiné nároky na vlasy a životnost. Keratin a weft trvají 4–6 měsíců, nanotapes 6–10 týdnů do přelepení. Metodu vybereme společně na konzultaci podle vašich vlasů a životního stylu.',
    },
  ] : [
    {
      q: `Má smysl jet na prodloužení vlasů z ${city.name} do Prahy?`,
      a: `Mnoho klientek ${city.nameFrom} se vydá do showroomu Múza Hair kvůli výběru vlasů přímo z naší vlastní produkce — slovanské a panenské vlasy v délkách 35–95 cm, barvené v pražské barvírně na míru. Pokud hledáte konkrétní odstín nebo texturu, osobní konzultace v Praze je nesrovnatelná.`,
    },
    {
      q: `Jak daleko je cesta z ${city.name} do Prahy?`,
      a: `${city.nameFrom.charAt(0).toUpperCase() + city.nameFrom.slice(1)} do showroomu Múza Hair Praha 1 je to přibližně ${city.distanceKm} km. Vlakem ${city.trainTime}, autem ${city.carTime}. Showroom je přímo u metra B (Náměstí Republiky), výstup z vlaku na Masarykově nádraží.`,
    },
    {
      q: `Mohu si vlasy objednat online ${city.nameFrom}?`,
      a: `Ano — vlasy Standard, Luxe i Platinum posíláme do ${city.nameTo} do 48 hodin. Objednáte přes e-shop nebo přes Instagram @muzahair.cz. Pokud si nejste jistá výběrem délky nebo gramáže, napište nám — poradíme na dálku.`,
    },
    {
      q: 'Kolik stojí prodloužení vlasů a jaké jsou metody?',
      a: 'Nabízíme keratin (mikrokeratin), nanotapes (tape-in) a weft. Cena vlasů: Standard od 3 900 Kč, Luxe od 6 900 Kč, Platinum od 10 900 Kč. Aplikace se účtuje zvlášť u vaší techničky. Na konzultaci v Praze pomůžeme vybrat správnou metodu, délku a gramáž.',
    },
    {
      q: 'Jak se objednám do showroomu?',
      a: 'Volejte +420 728 722 880 nebo pište na Instagram @muzahair.cz. Jsme otevřeni Po–Ne 10–20, výhradně na objednání. Pro klientky zdaleka doporučujeme přijet na celodenní termín — konzultaci, výběr vlasů a případnou aplikaci lze spojit do jedné návštěvy.',
    },
    {
      q: 'Jak barvíte vlasy a proč je to výhoda?',
      a: 'Máme vlastní barvírnu přímo v pražském showroomu, kde pět specialistů zpracovává každý culík individuálně. To znamená, že dokážeme nabarvit vlasy na přesný odstín podle vzorníku — bez sériové výroby. Výsledek je přirozený a životnost barvy je výrazně vyšší než u hromadně barvených pásků.',
    },
  ];

  const faqJsonLd = faqQuestions.map(q => `      {
        '@type': 'Question',
        name: ${JSON.stringify(q.q)},
        acceptedAnswer: {
          '@type': 'Answer',
          text: ${JSON.stringify(q.a)},
        },
      }`).join(',\n');

  const faqHtml = faqQuestions.map((q, i) => `          <div key={${i}} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              ${q.q}
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              ${q.a}
            </p>
          </div>`).join('\n');

  return `import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prodloužení vlasů ${city.name} | Pravé vlasy, keratin, nanotapes | ${titleSuffix}',
  description: 'Prodloužení vlasů pro klientky ${city.nameFrom} — showroom Praha 1, Revoluční 8. Vlastní barvírna, slovanské vlasy Standard/Luxe/Platinum. Keratin od 4 000 Kč. Objednání online.',
  alternates: { canonical: '${canonicalUrl}' },
  keywords: [
    'prodloužení vlasů ${city.name}',
    'prodloužení vlasů ${city.nameFrom.replace(/^z |^ze /, '')} Praha',
    'kde prodlužovat vlasy ${city.name}',
    'vlasy k prodloužení ${city.name}',
    'prodloužení vlasů keratinem ${city.name}',
    'nanotapes ${city.name}',
    'weft prodloužení ${city.name}',
    'pravé vlasy ${city.name}',
  ],
  openGraph: {
    title: 'Prodloužení vlasů ${city.name} | Pravé vlasy | ${titleSuffix}',
    description: 'Showroom Praha 1, Revoluční 8. Cesta ${city.nameFrom} ${city.trainTime} vlakem. Keratin od 4 000 Kč, nanotapes 55 Kč/spoj, weft od 3 800 Kč.',
    url: '${canonicalUrl}',
    siteName: 'Múza Hair',
    locale: 'cs_CZ',
    type: 'website',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů ${city.name}', item: '${canonicalUrl}' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
${faqJsonLd}
    ],
  },
];

export default function ProdlouzeniVlasu${city.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Page() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div style={{ background: 'var(--ivory)' }} className="min-h-screen">

        {/* Hero */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-4xl">
            <nav className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
              <Link href="/" className="hover:opacity-70 transition">Domů</Link>
              <span>/</span>
              <span style={{ color: 'var(--burgundy)' }}>Prodloužení vlasů ${city.name}</span>
            </nav>

            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              SHOWROOM PRAHA 1
            </div>

            <h1 className="font-cormorant text-[clamp(32px,4.5vw,56px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů<br />pro klientky ${city.nameFrom}
            </h1>

            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mb-10">
              <p className="text-[15px] leading-[1.8] font-light max-w-2xl" style={{ color: 'var(--text-dark)' }}>
                Múza Hair — showroom s vlastní barvírnou přímo v Praze. Cesta ${city.nameFrom} trvá ${city.trainTime} vlakem nebo ${city.carTime} autem.
                Vlasy Standard, Luxe a Platinum posíláme také online do ${city.nameTo} do 48 hodin.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Objednat se
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px border"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                E-shop vlasy
              </Link>
            </div>
          </div>
        </section>

        {/* Info bar */}
        <section className="px-8 lg:px-20 py-6" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-4xl flex flex-wrap gap-8" style={{ color: 'var(--ivory)' }}>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1 opacity-70">Showroom</p>
              <p className="text-[14px] font-light">Revoluční 8, Praha 1</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1 opacity-70">Otevřeno</p>
              <p className="text-[14px] font-light">Po–Ne 10–20, na objednání</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1 opacity-70">Z ${city.name}</p>
              <p className="text-[14px] font-light">${city.trainTime} vlakem · ${city.carTime} autem</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1 opacity-70">Telefon</p>
              <p className="text-[14px] font-light">+420 728 722 880</p>
            </div>
          </div>
        </section>

        {/* Metody + ceny */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-4xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              METODY A CENY
            </div>
            <h2 className="font-cormorant text-[clamp(26px,3vw,40px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Tři metody prodloužení vlasů
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Keratin', price: 'od 4 000 Kč', desc: 'Mikrokeratin — nejpřirozenější výsledek, trvá 4–6 měsíců. Vhodný pro všechny typy vlasů.' },
                { name: 'Nanotapes', price: '55–65 Kč / spoj', desc: 'Tape-in sendvičová metoda bez tepla. Pásky lze opakovaně přelepovat, životnost 6–10 týdnů.' },
                { name: 'Weft', price: 'od 3 800 Kč / posun', desc: 'Tress přišitý ke kůži — maximální objem. Posun každé 4–6 měsíce.' },
              ].map((m) => (
                <div key={m.name} className="p-6 rounded-sm" style={{ background: 'var(--ivory)' }}>
                  <h3 className="font-cormorant text-[22px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>{m.name}</h3>
                  <p className="text-[13px] mb-3" style={{ color: 'var(--burgundy)' }}>{m.price}</p>
                  <p className="text-[13px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kolekce vlasů */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-4xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              KOLEKCE VLASŮ
            </div>
            <h2 className="font-cormorant text-[clamp(26px,3vw,40px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Tři úrovně kvality
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { name: 'Standard', origin: 'Indie, Kambodža', price: 'od 3 900 Kč', desc: 'Pevná struktura, skvělý poměr cena/výkon. Ideální pro hustší vlasy.' },
                { name: 'Luxe', origin: 'Ukrajina, Polsko', price: 'od 6 900 Kč', desc: 'Jemnější, nadýchaný objem, husté konce. Zlatá střední cesta.' },
                { name: 'Platinum', origin: 'ČR, SR — výkup', price: 'od 10 900 Kč', desc: 'Nejluxusnější panenské vlasy. Pro jemné vlasy s nejvyšší životností.' },
              ].map((k) => (
                <div key={k.name} className="p-6 rounded-sm border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <h3 className="font-cormorant text-[22px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>{k.name}</h3>
                  <p className="text-[11px] tracking-wider uppercase mb-2 font-light" style={{ color: 'var(--accent)' }}>{k.origin}</p>
                  <p className="text-[13px] mb-3" style={{ color: 'var(--burgundy)' }}>{k.price}</p>
                  <p className="text-[13px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{k.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/vlasy-k-prodlouzeni" className="text-[12px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--burgundy)' }}>
              Prohlédnout e-shop →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-4xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              ČASTÉ OTÁZKY
            </div>
            <h2 className="font-cormorant text-[clamp(26px,3vw,40px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Otázky klientek ${city.nameFrom}
            </h2>

            <div>
${faqHtml}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-2xl">
            <h2 className="font-cormorant text-[clamp(28px,3.5vw,44px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Zájem o prodloužení vlasů?
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8" style={{ color: 'var(--text-soft)' }}>
              Zavolejte nebo napište — domluvíme termín v pražském showroomu nebo poradíme s online objednávkou vlasů.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+420728722880"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px border"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                Instagram
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
`;
}

// ─── GENERATE ─────────────────────────────────────────────────────────────────
let created = 0;
let skipped = 0;

for (const city of cities) {
  const dir = join(APP_DIR, `prodlouzeni-vlasu-${city.slug}`);
  const file = join(dir, 'page.tsx');

  if (existsSync(file)) {
    console.log(`⏭  Přeskakuji (existuje): prodlouzeni-vlasu-${city.slug}`);
    skipped++;
    continue;
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(file, generatePage(city), 'utf-8');
  console.log(`✅ Vytvořeno: prodlouzeni-vlasu-${city.slug}`);
  created++;
}

console.log(`\nHotovo: ${created} vytvořeno, ${skipped} přeskočeno.`);
