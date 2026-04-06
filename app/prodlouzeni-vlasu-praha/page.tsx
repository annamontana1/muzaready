import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prodloužení vlasů Praha | Keratin, Nanotapes, Weft — Múza Hair showroom',
  description: 'Prodloužení vlasů Praha — keratin od 4 000 Kč, nanotapes 55 Kč/spoj, weft 3 800 Kč posun. Showroom Praha 1, Revoluční 8. Vlastní barvírna, pravé vlasy, od roku 2016.',
  alternates: { canonical: 'https://muzahair.cz/prodlouzeni-vlasu-praha' },
  keywords: [
    'prodloužení vlasů Praha',
    'prodloužení vlasů Praha cena',
    'kde prodlužovat vlasy Praha',
    'salon prodloužení vlasů Praha',
    'prodloužení vlasů keratinem Praha',
    'prodloužení vlasů nanotapes Praha',
    'prodloužení vlasů weft Praha',
    'hollywoodské prodloužení vlasů Praha',
    'nejlepší prodloužení vlasů Praha',
    'prodloužení vlasů Praha recenze',
    'prodloužení vlasů Praha 1',
  ],
  openGraph: {
    title: 'Prodloužení vlasů Praha | Keratin, Nanotapes, Weft | Múza Hair',
    description: 'Showroom Praha 1, Revoluční 8. Keratin od 4 000 Kč · Nanotapes 55 Kč/spoj · Weft posun 3 800 Kč. Vlastní barvírna, pravé vlasy.',
    url: 'https://muzahair.cz/prodlouzeni-vlasu-praha',
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
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů Praha', item: 'https://muzahair.cz/prodlouzeni-vlasu-praha' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Múza Hair — Prodloužení vlasů Praha',
    '@id': 'https://muzahair.cz',
    url: 'https://muzahair.cz',
    telephone: '+420728722880',
    image: 'https://muzahair.cz/og-image.jpg',
    priceRange: '4 000 Kč – 5 500 Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha 1',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0916,
      longitude: 14.4282,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
    sameAs: [
      'https://www.instagram.com/muzahair.cz',
      'https://www.facebook.com/muzahair',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kde se prodlužují vlasy v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair — showroom na Revoluční 8, Praha 1. Prodloužení vlasů keratinem, mikrokeratiinem, nanotapes (tape-in) i weft (hollywoodské prodloužení). Vlastní barvírna, pravé středoevropské vlasy. Objednání na +420 728 722 880 nebo Instagram @muzahair.cz.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prodloužení vlasů Praha — keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč, nanotapes (tape-in) 55–65 Kč/spoj, weft (hollywoodské prodloužení) posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Showroom Revoluční 8, Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde v Praze prodlužují vlasy nejlépe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair Praha 1 — vlastní výroba vlasů, vlastní barvírna, 3 úrovně kvality (Standard, Luxe, Platinum). Prodloužení vlasů keratinem, nanotapes a weft. Showroom Revoluční 8, Praha 1, pouze na objednání.',
        },
      },
      {
        '@type': 'Question',
        name: 'Prodloužení vlasů Praha 1 — kde je showroom?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Showroom Múza Hair: Revoluční 8, Praha 1 (metro B — Náměstí Republiky, 3 minuty pěšky). Otevřeno Po–Ne 10:00–20:00, pouze na objednání. Tel: +420 728 722 880.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mohu přijet na prodloužení vlasů z jiného města?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — zákaznice jezdí z celé ČR. Praha je dostupná vlakem: Brno 2,5 hod, Plzeň 1,5 hod, Pardubice 1 hod, Ústí nad Labem 1 hod. Showroom Revoluční 8, Praha 1, metro B Náměstí Republiky.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak dlouho trvá prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Délka aplikace závisí na metodě: keratin a mikrokeratin 3–4 hodiny, nanotapes (tape-in) 1,5–2 hodiny, weft (hollywoodské prodloužení) 2,5 hodiny. Domluvte konzultaci na +420 728 722 880.',
        },
      },
    ],
  },
];

const METHODS = [
  {
    icon: '💎',
    name: 'Keratin / Mikrokeratin',
    subtitle: 'Keratinové pramínky',
    items: ['Standart keratin — nasazení 4 000 Kč / 100g', 'Mikrokeratin — nasazení 5 000 Kč / 100g', 'Korekce po 2,5–3 měsících', 'Aplikace 3–4 hodiny'],
    href: '/metody-zakonceni/vlasy-na-keratin',
  },
  {
    icon: '🩹',
    name: 'Nanotapes / Tape-In',
    subtitle: 'Vlasové pásky',
    items: ['2,8 cm pásky — 55 Kč / spoj', '4 cm pásky — 65 Kč / spoj', 'Korekce po 1,5–2 měsících', 'Bez tepla a chemie'],
    href: '/metody-zakonceni/vlasove-pasky-tape-in',
  },
  {
    icon: '🧵',
    name: 'Weft — Hollywoodské',
    subtitle: 'Vlasové tresy',
    items: ['Posun / korekce tresů 3 800 Kč', 'Nasazení na dotaz / konzultace', 'Korekce po 2–3 měsících', 'Bez lepidla, bez tepla'],
    href: '/metody-zakonceni/vlasove-tresy',
  },
];

const CITIES_NEAR = [
  { name: 'Plzeň', time: '1,5 hod' },
  { name: 'Ústí nad Labem', time: '1 hod' },
  { name: 'Pardubice', time: '1 hod' },
  { name: 'Hradec Králové', time: '1,5 hod' },
  { name: 'Liberec', time: '1,5 hod' },
  { name: 'Kladno', time: '30 min' },
  { name: 'Mladá Boleslav', time: '1 hod' },
  { name: 'Brno', time: '2,5 hod' },
  { name: 'Olomouc', time: '2 hod' },
  { name: 'Ostrava', time: '3,5 hod' },
];

export default function ProdlouzeniVlasuPrahaPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="py-12 bg-soft-cream min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <div className="text-sm text-text-mid mb-6">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            {' / '}
            <span className="text-burgundy">Prodloužení vlasů Praha</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Prodloužení vlasů Praha
            </h1>
            <p className="text-lg text-text-mid max-w-2xl mx-auto leading-relaxed">
              Showroom Praha 1 · Keratin · Nanotapes · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-sm text-text-soft mt-2">
              Vlastní barvírna · Pravé vlasy · 3 úrovně kvality · Od roku 2016
            </p>
          </div>

          {/* Showroom info */}
          <div className="bg-burgundy text-white rounded-xl p-6 mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1">
              <p className="font-playfair text-xl mb-1">Showroom Múza Hair</p>
              <p className="text-white/80 text-sm">Revoluční 8, Praha 1 · metro B Náměstí Republiky (3 min pěšky)</p>
              <p className="text-white/70 text-xs mt-1">Po–Ne 10:00–20:00 · Pouze na objednání</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+420728722880"
                className="px-5 py-2.5 bg-white text-burgundy text-sm font-semibold rounded-lg hover:opacity-90 transition text-center"
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-white/40 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition text-center"
              >
                @muzahair.cz
              </a>
            </div>
          </div>

          {/* Metody + ceny */}
          <h2 className="text-2xl font-playfair text-burgundy mb-6">
            Metody prodloužení vlasů Praha — ceník aplikace
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {METHODS.map((m) => (
              <div key={m.name} className="bg-white rounded-xl shadow-medium overflow-hidden flex flex-col">
                <div className="bg-burgundy px-5 py-4">
                  <span className="text-xl">{m.icon}</span>
                  <h3 className="font-playfair text-white text-lg mt-1">{m.name}</h3>
                  <p className="text-xs text-white/70 mt-0.5">{m.subtitle}</p>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <ul className="text-sm text-text-mid space-y-1.5 mb-4 flex-1">
                    {m.items.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                  <Link
                    href={m.href}
                    className="block text-center py-2.5 border border-burgundy text-burgundy text-sm font-medium rounded-lg hover:bg-burgundy/5 transition"
                  >
                    Více o metodě →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <Link
              href="/ceny-aplikaci"
              className="inline-block px-8 py-3 bg-burgundy text-white font-medium rounded-xl hover:opacity-90 transition"
            >
              Kompletní ceník aplikace →
            </Link>
          </div>

          {/* Proč Múza Hair */}
          <section className="bg-white rounded-xl shadow-medium p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Proč prodloužení vlasů u Múza Hair Praha?
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              {[
                { title: 'Vlastní barvírna v Praze', desc: 'Barvíme vlasy sami — žádné přebarvování nakoupených vlasů. Vlastní technologie, přesné odstíny.' },
                { title: 'Pravé středoevropské vlasy', desc: 'Nebarvené panenské, barvené a dětské vlasy. 3 úrovně kvality: Standard, Luxe, Platinum.' },
                { title: 'Výroba na zakázku', desc: 'Vlasové tresy šijeme ručně na míru — délka, gramáž a odstín přesně podle vás.' },
                { title: 'Všechny metody na jednom místě', desc: 'Keratin, mikrokeratin, nanotapes (tape-in) i weft (hollywoodské prodloužení) — vše v showroomu Praha 1.' },
                { title: 'Konzultace zdarma', desc: 'Pomůžeme vybrat správnou metodu i vlasy. Zavolejte nebo napište na Instagram.' },
                { title: 'Od roku 2016', desc: 'Zkušenosti z tisíců aplikací. Zákaznice se k nám vrací — přečtěte si recenze.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-burgundy mt-0.5 flex-shrink-0">✓</span>
                  <div>
                    <p className="font-semibold text-text-dark mb-0.5">{item.title}</p>
                    <p className="text-text-mid">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-warm-beige flex gap-4 text-sm">
              <Link href="/o-nas" className="text-burgundy font-semibold hover:underline">Náš příběh →</Link>
              <Link href="/recenze" className="text-burgundy font-semibold hover:underline">Recenze zákaznic →</Link>
            </div>
          </section>

          {/* Přijeďte z celé ČR */}
          <section className="bg-ivory border border-burgundy/15 rounded-xl p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-3">
              Přijeďte z celé České republiky
            </h2>
            <p className="text-sm text-text-mid mb-5">
              Zákaznice přijíždějí za kvalitou z celé ČR. Showroom je u metra B — Náměstí Republiky,
              Praha je vlakové centrum celé republiky.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {CITIES_NEAR.map((c) => (
                <div key={c.name} className="bg-white rounded-lg p-3 border border-warm-beige text-center">
                  <p className="font-medium text-text-dark">{c.name}</p>
                  <p className="text-xs text-text-soft mt-0.5">vlakem {c.time}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-soft mt-4">
              Vlasy si můžete také objednat online s doručením domů —{' '}
              <Link href="/vlasy-k-prodlouzeni" className="text-burgundy hover:underline">nakonfigurujte je v e-shopu</Link>.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Časté dotazy — prodloužení vlasů Praha
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Kde se prodlužují vlasy v Praze?',
                  a: 'Múza Hair — showroom Revoluční 8, Praha 1 (metro B Náměstí Republiky). Prodloužení vlasů keratinem, nanotapes i weft. Vlastní barvírna, pravé vlasy. Objednání na +420 728 722 880.',
                },
                {
                  q: 'Kolik stojí prodloužení vlasů Praha?',
                  a: 'Keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč (cena za 100 g vlasů). Nanotapes 55–65 Kč/spoj. Weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Kompletní ceník na stránce ceny-aplikaci.',
                },
                {
                  q: 'Jak dlouho trvá prodloužení vlasů Praha?',
                  a: 'Keratin a mikrokeratin 3–4 hodiny. Nanotapes (tape-in) 1,5–2 hodiny. Weft (hollywoodské prodloužení) 2,5 hodiny. Vyhraďte si dostatečně dlouhý blok — kvalita chce čas.',
                },
                {
                  q: 'Mohu přijet na prodloužení vlasů z jiného města?',
                  a: 'Ano — zákaznice přijíždějí z celé ČR. Showroom je u metra B, Praha je dostupná ze všech stran. Z Plzně 1,5 hod, z Pardubic 1 hod, z Brna 2,5 hod. Vlasy si také objednáte online s doručením domů.',
                },
                {
                  q: 'Jak si objednat prodloužení vlasů Praha?',
                  a: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom Revoluční 8, Praha 1 — Po–Ne 10:00–20:00, pouze na objednání.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-warm-beige rounded-xl p-5">
                  <p className="font-semibold text-text-dark mb-2">{item.q}</p>
                  <p className="text-sm text-text-mid leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-ivory border border-burgundy/10 rounded-xl p-8 text-center">
            <p className="font-playfair text-2xl text-burgundy mb-2">Domluvte si konzultaci</p>
            <p className="text-text-soft text-sm mb-6">
              Vybereme metodu i vlasy přímo pro vás. Showroom Praha 1, Revoluční 8.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+420728722880"
                className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
              >
                @muzahair.cz na Instagramu
              </a>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
              >
                Nakonfigurovat vlasy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
