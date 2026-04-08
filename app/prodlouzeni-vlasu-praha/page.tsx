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
    name: 'Keratin / Mikrokeratin',
    subtitle: 'Keratinové pramínky',
    items: ['Standart keratin — nasazení 4 000 Kč / 100g', 'Mikrokeratin — nasazení 5 000 Kč / 100g', 'Korekce po 2,5–3 měsících', 'Aplikace 3–4 hodiny'],
    href: '/metody-zakonceni/vlasy-na-keratin',
  },
  {
    name: 'Nanotapes / Tape-In',
    subtitle: 'Vlasové pásky',
    items: ['2,8 cm pásky — 55 Kč / spoj', '4 cm pásky — 65 Kč / spoj', 'Korekce po 1,5–2 měsících', 'Bez tepla a chemie'],
    href: '/metody-zakonceni/vlasove-pasky-tape-in',
  },
  {
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

      <div style={{ background: 'var(--ivory)' }} className="min-h-screen">

        {/* Hero */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            {/* Breadcrumb */}
            <div className="text-[12px] font-light mb-8" style={{ color: 'var(--text-soft)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
              {' / '}
              <span style={{ color: 'var(--text-dark)' }}>Prodloužení vlasů Praha</span>
            </div>

            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              SHOWROOM PRAHA 1
            </div>
            <h1 className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů Praha
            </h1>
            <p className="text-[15px] leading-[1.8] font-light max-w-2xl mb-2" style={{ color: 'var(--text-soft)' }}>
              Showroom Praha 1 · Keratin · Nanotapes · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Vlastní barvírna · Pravé vlasy · 3 úrovně kvality · Od roku 2016
            </p>
          </div>
        </div>

        {/* Showroom info bar */}
        <div className="px-8 lg:px-20 py-12" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-5xl flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div>
              <p className="font-cormorant text-[22px] font-light mb-1" style={{ color: 'var(--ivory)' }}>Showroom Múza Hair</p>
              <p className="text-[14px] font-light" style={{ color: 'rgba(255,255,255,0.75)' }}>Revoluční 8, Praha 1 · metro B Náměstí Republiky (3 min pěšky)</p>
              <p className="text-[13px] font-light mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Po–Ne 10:00–20:00 · Pouze na objednání</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+420728722880"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--ivory)', color: 'var(--burgundy)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'var(--ivory)' }}
              >
                @muzahair.cz
              </a>
            </div>
          </div>
        </div>

        {/* Metody + ceny */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              CENÍK APLIKACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Metody prodloužení vlasů Praha
            </h2>

            <div className="grid md:grid-cols-3 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {METHODS.map((m) => (
                <div key={m.name} className="border-b md:border-b-0 md:border-r py-8 md:pr-8 md:last:border-r-0 md:last:pr-0 md:pl-8 md:first:pl-0" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[11px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{m.subtitle}</p>
                  <h3 className="font-cormorant text-[20px] font-light mb-5" style={{ color: 'var(--text-dark)' }}>{m.name}</h3>
                  <ul className="space-y-2 mb-6">
                    {m.items.map((item) => (
                      <li key={item} className="text-[14px] leading-[1.7] font-light flex gap-2" style={{ color: 'var(--text-soft)' }}>
                        <span style={{ color: 'var(--accent)' }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={m.href}
                    className="text-[12px] tracking-[0.12em] uppercase font-normal hover:underline"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    Více o metodě →
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <Link
                href="/ceny-aplikaci"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Kompletní ceník aplikace →
              </Link>
            </div>
          </div>
        </div>

        {/* Proč Múza Hair */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PROČ MY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Proč prodloužení vlasů u Múza Hair Praha?
            </h2>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { title: 'Vlastní barvírna v Praze', desc: 'Barvíme vlasy sami — žádné přebarvování nakoupených vlasů. Vlastní technologie, přesné odstíny.' },
                { title: 'Pravé středoevropské vlasy', desc: 'Nebarvené panenské, barvené a dětské vlasy. 3 úrovně kvality: Standard, Luxe, Platinum.' },
                { title: 'Výroba na zakázku', desc: 'Vlasové tresy šijeme ručně na míru — délka, gramáž a odstín přesně podle vás.' },
                { title: 'Všechny metody na jednom místě', desc: 'Keratin, mikrokeratin, nanotapes (tape-in) i weft (hollywoodské prodloužení) — vše v showroomu Praha 1.' },
                { title: 'Konzultace zdarma', desc: 'Pomůžeme vybrat správnou metodu i vlasy. Zavolejte nebo napište na Instagram.' },
                { title: 'Od roku 2016', desc: 'Zkušenosti z tisíců aplikací. Zákaznice se k nám vrací — přečtěte si recenze.' },
              ].map((item) => (
                <div key={item.title} className="border-b py-7 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-6 text-[12px] tracking-[0.1em] uppercase font-normal">
              <Link href="/o-nas" className="hover:underline" style={{ color: 'var(--burgundy)' }}>Náš příběh →</Link>
              <Link href="/recenze" className="hover:underline" style={{ color: 'var(--burgundy)' }}>Recenze zákaznic →</Link>
            </div>
          </div>
        </div>

        {/* Přijeďte z celé ČR */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              DOSTUPNOST
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Přijeďte z celé České republiky
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
              Zákaznice přijíždějí za kvalitou z celé ČR. Showroom je u metra B — Náměstí Republiky,
              Praha je vlakové centrum celé republiky.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-0 border-t border-l" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {CITIES_NEAR.map((c) => (
                <div key={c.name} className="border-b border-r px-4 py-5" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>{c.name}</p>
                  <p className="text-[12px] font-light mt-0.5" style={{ color: 'var(--text-soft)' }}>vlakem {c.time}</p>
                </div>
              ))}
            </div>
            <p className="text-[13px] font-light mt-6" style={{ color: 'var(--text-soft)' }}>
              Vlasy si můžete také objednat online s doručením domů —{' '}
              <Link href="/vlasy-k-prodlouzeni" className="hover:underline" style={{ color: 'var(--burgundy)' }}>nakonfigurujte je v e-shopu</Link>.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              ČASTÉ DOTAZY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů Praha — odpovědi
            </h2>
            <div>
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
                <div key={i} className="border-b py-7" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[16px] font-normal mb-2" style={{ color: 'var(--text-dark)' }}>{item.q}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              REZERVACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Domluvte si konzultaci
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-xl" style={{ color: 'var(--text-soft)' }}>
              Vybereme metodu i vlasy přímo pro vás. Showroom Praha 1, Revoluční 8.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                @muzahair.cz na Instagramu
              </a>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--text-soft)', color: 'var(--text-soft)' }}
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
