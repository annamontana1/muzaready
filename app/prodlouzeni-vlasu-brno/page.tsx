import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prodloužení vlasů Brno | Pravé vlasy, keratin, nanotapes | Múza Hair',
  description: 'Prodloužení vlasů Brno — klientky z Brna jezdí do showroomu Praha 1 (vlakem 2,5 hod). Keratin od 4 000 Kč, nanotapes 55 Kč/spoj. Vlasy i online objednávka.',
  alternates: { canonical: 'https://muzahair.cz/prodlouzeni-vlasu-brno' },
  keywords: [
    'prodloužení vlasů Brno',
    'prodloužení vlasů Brno cena',
    'kde prodlužovat vlasy Brno',
    'salon prodloužení vlasů Brno',
    'prodloužení vlasů keratinem Brno',
    'prodloužení vlasů nanotapes Brno',
    'prodloužení vlasů weft Brno',
    'hollywoodské prodloužení vlasů Brno',
    'nejlepší prodloužení vlasů Brno',
    'pravé vlasy prodloužení Brno',
    'prodloužení vlasů Jihomoravský kraj',
  ],
  openGraph: {
    title: 'Prodloužení vlasů Brno | Keratin, Nanotapes, Weft | Múza Hair',
    description: 'Klientky z Brna jezdí do showroomu Praha 1. Keratin od 4 000 Kč · Nanotapes 55 Kč/spoj · Vlasy i online s doručením do Brna.',
    url: 'https://muzahair.cz/prodlouzeni-vlasu-brno',
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
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů Brno', item: 'https://muzahair.cz/prodlouzeni-vlasu-brno' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kde se prodlužují vlasy v Brně?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair má showroom v Praze 1 (Revoluční 8), kam klientky z Brna pravidelně jezdí — vlakem je to 2,5 hodiny. Nabízíme keratin, nanotapes (tape-in) a weft (hollywoodské prodloužení) s vlastní barvírnou a pravými vlasy. Vlasy lze také objednat online s doručením do Brna.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak daleko je z Brna do showroomu Múza Hair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Showroom Múza Hair je na Revoluční 8, Praha 1 — metro B Náměstí Republiky (3 minuty pěšky). Z Brna hlavního nádraží jsou přímé vlaky do Prahy, jízda trvá přibližně 2,5 hodiny. Celý výlet i s aplikací stihnete za jeden den.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů u Múza Hair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč (cena za 100 g vlasů). Nanotapes (tape-in) 55–65 Kč/spoj. Weft (hollywoodské prodloužení) posun 3 800 Kč. Cena vlasů se účtuje zvlášť — Standard, Luxe nebo Platinum dle vašeho výběru.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mohu si vlasy k prodloužení objednat online do Brna?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — vlasy k prodloužení objednáte v e-shopu muzahair.cz s doručením po celé ČR včetně Brna. Metodu aplikace pak provedete u místního kadeřníka nebo přijedete na aplikaci do showroomu Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak se objednat do showroomu Múza Hair z Brna?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom Revoluční 8, Praha 1 — Po–Ne 10:00–20:00, pouze na objednání. Doporučujeme rezervaci minimálně týden dopředu.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak dlouho trvá aplikace prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keratin a mikrokeratin 3–4 hodiny, nanotapes (tape-in) 1,5–2 hodiny, weft (hollywoodské prodloužení) 2,5 hodiny. Klientky z Brna většinou přijíždějí ráno a odpoledne se vracejí zpět — celý výlet pohodlně stihnete za jeden den.',
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

export default function ProdlouzeniVlasuBrnoPage() {
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
            <div className="text-[13px] font-light mb-8" style={{ color: 'var(--text-soft)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
              {' / '}
              <span style={{ color: 'var(--text-dark)' }}>Prodloužení vlasů Brno</span>
            </div>

            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PRO KLIENTKY Z BRNA
            </div>
            <h1 className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů pro klientky z Brna
            </h1>
            <p className="text-[15px] leading-[1.8] font-light max-w-2xl mb-2" style={{ color: 'var(--text-soft)' }}>
              Showroom Praha 1 · Keratin · Nanotapes · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Z Brna vlakem 2,5 hod · Vlastní barvírna · Pravé vlasy · Vlasy online s doručením
            </p>
          </div>
        </div>

        {/* Info bar */}
        <div className="px-8 lg:px-20 py-12" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-5xl flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div>
              <p className="font-cormorant text-[22px] font-light mb-1" style={{ color: 'var(--ivory)' }}>Showroom Múza Hair — Praha 1</p>
              <p className="text-[14px] font-light" style={{ color: 'rgba(255,255,255,0.75)' }}>Revoluční 8, Praha 1 · metro B Náměstí Republiky (3 min pěšky)</p>
              <p className="text-[14px] font-light mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Po–Ne 10:00–20:00 · Pouze na objednání · Z Brna vlakem 2,5 hod</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+420728722880"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--ivory)', color: 'var(--burgundy)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'var(--ivory)' }}
              >
                @muzahair.cz
              </a>
            </div>
          </div>
        </div>

        {/* Proč přijet z Brna */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PROČ PŘIJET DO PRAHY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Proč klientky z Brna jezdí do Múza Hair Praha?
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
              Praha je vlakem 2,5 hodiny z Brna. Celý výlet i s aplikací pohodlně stihnete za jeden den —
              ráno přijedete, odpoledne se vrátíte s novými vlasy.
            </p>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { title: 'Vlastní barvírna v Praze', desc: 'Barvíme vlasy sami — žádné přebarvování nakoupených vlasů. Vlastní technologie, přesné odstíny na míru vašim vlastním vlasům.' },
                { title: 'Pravé středoevropské vlasy', desc: 'Nebarvené panenské, barvené a dětské vlasy. 3 úrovně kvality: Standard (Indie/Kambodža), Luxe (Ukrajina/Polsko), Platinum (ČR/SK).' },
                { title: 'Výroba na zakázku', desc: 'Vlasové tresy šijeme ručně na míru — délka, gramáž a odstín přesně podle vás. Žádná kompromisní sériová výroba.' },
                { title: 'Všechny metody na jednom místě', desc: 'Keratin, mikrokeratin, nanotapes (tape-in) i weft (hollywoodské prodloužení) — vše v showroomu Praha 1.' },
                { title: 'Online objednávka s doručením', desc: 'Vlasy si objednáte online na muzahair.cz a necháte doručit domů do Brna. Aplikaci pak provedete u místního kadeřníka.' },
                { title: 'Od roku 2016', desc: 'Zkušenosti z tisíců aplikací. Zákaznice se k nám vrací z celé ČR — přečtěte si recenze.' },
              ].map((item) => (
                <div key={item.title} className="border-b py-7 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-6 text-[13px] tracking-[0.1em] uppercase font-normal">
              <Link href="/o-nas" className="hover:underline" style={{ color: 'var(--burgundy)' }}>Náš příběh →</Link>
              <Link href="/recenze" className="hover:underline" style={{ color: 'var(--burgundy)' }}>Recenze zákaznic →</Link>
            </div>
          </div>
        </div>

        {/* Metody + ceny */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              CENÍK APLIKACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Metody a ceny prodloužení vlasů
            </h2>

            <div className="grid md:grid-cols-3 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {METHODS.map((m) => (
                <div key={m.name} className="border-b md:border-b-0 md:border-r py-8 md:pr-8 md:last:border-r-0 md:last:pr-0 md:pl-8 md:first:pl-0" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[12px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{m.subtitle}</p>
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
                    className="text-[13px] tracking-[0.12em] uppercase font-normal hover:underline"
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
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Kompletní ceník aplikace →
              </Link>
            </div>
          </div>
        </div>

        {/* Jak se dostat z Brna */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PLÁNOVÁNÍ CESTY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Z Brna do Prahy — plán na jeden den
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
              Nejpohodlnější způsob je přímý vlak z Brna hlavního nádraží do Praha hlavní nádraží.
              Odtud je to 15 minut metrem B na Náměstí Republiky — a showroom je 3 minuty pěšky.
            </p>
            <div className="grid sm:grid-cols-3 gap-0 border-t border-l" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { cas: 'Ráno', desc: 'Odjezd z Brna hl. n. — přímé vlaky každou hodinu, jízda ~2,5 hod' },
                { cas: 'Dopoledne', desc: 'Příjezd do Prahy, metro B na Náměstí Republiky, showroom Revoluční 8' },
                { cas: 'Odpoledne', desc: 'Aplikace hotová, odjezd zpět do Brna — doma v podvečer' },
              ].map((item) => (
                <div key={item.cas} className="border-b border-r px-6 py-7" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[12px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{item.cas}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[14px] font-light mt-6" style={{ color: 'var(--text-soft)' }}>
              Preferujete doručení domů? Vlasy si objednáte online —{' '}
              <Link href="/vlasy-k-prodlouzeni" className="hover:underline" style={{ color: 'var(--burgundy)' }}>nakonfigurujte je v e-shopu</Link>.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              ČASTÉ DOTAZY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů Brno — odpovědi
            </h2>
            <div>
              {[
                {
                  q: 'Kde se prodlužují vlasy v Brně?',
                  a: 'Múza Hair má showroom v Praze 1 (Revoluční 8), kam klientky z Brna pravidelně jezdí. Vlakem je to 2,5 hodiny — celý výlet i s aplikací stihnete za jeden den. Vlasy lze také objednat online s doručením do Brna.',
                },
                {
                  q: 'Jak daleko je z Brna do showroomu Múza Hair?',
                  a: 'Showroom je na Revoluční 8, Praha 1 — metro B Náměstí Republiky (3 minuty pěšky). Z Brna hlavního nádraží jsou přímé vlaky do Prahy, jízda trvá přibližně 2,5 hodiny.',
                },
                {
                  q: 'Kolik stojí prodloužení vlasů u Múza Hair?',
                  a: 'Keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč (cena za 100 g vlasů). Nanotapes (tape-in) 55–65 Kč/spoj. Weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Kompletní ceník na stránce ceny-aplikaci.',
                },
                {
                  q: 'Mohu si vlasy k prodloužení objednat online do Brna?',
                  a: 'Ano — vlasy k prodloužení objednáte v e-shopu muzahair.cz s doručením po celé ČR. Aplikaci pak provedete u místního kadeřníka nebo přijedete do showroomu Praha 1.',
                },
                {
                  q: 'Jak se objednat do showroomu Múza Hair z Brna?',
                  a: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom Revoluční 8, Praha 1 — Po–Ne 10:00–20:00, pouze na objednání. Doporučujeme rezervaci minimálně týden dopředu.',
                },
                {
                  q: 'Jak dlouho trvá aplikace prodloužení vlasů?',
                  a: 'Keratin a mikrokeratin 3–4 hodiny, nanotapes (tape-in) 1,5–2 hodiny, weft (hollywoodské prodloužení) 2,5 hodiny. Klientky z Brna přijíždějí ráno a odpoledne se vracejí — celý výlet pohodlně stihnete za jeden den.',
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
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              REZERVACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Domluvte si konzultaci
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-xl" style={{ color: 'var(--text-soft)' }}>
              Vybereme metodu i vlasy přímo pro vás. Přijeďte do showroomu Praha 1, nebo si vlasy objednejte online s doručením do Brna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+420728722880"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                @muzahair.cz na Instagramu
              </a>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--text-soft)', color: 'var(--text-soft)' }}
              >
                Nakonfigurovat vlasy online
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
