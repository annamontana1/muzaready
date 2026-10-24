import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prodloužení vlasů Ostrava | Pravé vlasy, keratin, weft | Múza Hair',
  description: 'Prodloužení vlasů pro klientky z Ostravy — keratin od 4 000 Kč, nanotapes 55 Kč/spoj. Navštivte showroom Praha 1 nebo objednejte vlasy online s doručením do Ostravy.',
  alternates: { canonical: 'https://muzahair.cz/prodlouzeni-vlasu-ostrava' },
  keywords: [
    'prodloužení vlasů Ostrava',
    'prodloužení vlasů Ostrava cena',
    'kde prodlužovat vlasy Ostrava',
    'salon prodloužení vlasů Ostrava',
    'prodloužení vlasů keratinem Ostrava',
    'prodloužení vlasů nanotapes Ostrava',
    'prodloužení vlasů weft Ostrava',
    'hollywoodské prodloužení vlasů Ostrava',
    'nejlepší prodloužení vlasů Ostrava',
    'pravé vlasy Ostrava',
    'prodloužení vlasů Moravskoslezský kraj',
  ],
  openGraph: {
    title: 'Prodloužení vlasů Ostrava | Pravé vlasy, keratin, weft | Múza Hair',
    description: 'Prodloužení vlasů pro klientky z Ostravy. Showroom Praha 1, Revoluční 8 — keratin od 4 000 Kč · nanotapes 55 Kč/spoj · vlastní barvírna, pravé vlasy.',
    url: 'https://muzahair.cz/prodlouzeni-vlasu-ostrava',
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
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů Ostrava', item: 'https://muzahair.cz/prodlouzeni-vlasu-ostrava' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Je možné přijet na prodloužení vlasů z Ostravy do Prahy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — zákaznice z Ostravy pravidelně jezdí do showroomu Múza Hair v Praze 1 (Revoluční 8). Ostrava–Praha vlakem trvá přibližně 3,5 hodiny. Celý servis v jednom dni je reálný: příjezd ráno, aplikace 2–4 hodiny, odjezd odpoledne.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mohu si objednat vlasy online z Ostravy bez cesty do Prahy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — vlasy k prodloužení lze nakonfigurovat a objednat přes e-shop Múza Hair s doručením do Ostravy. Aplikaci pak provedete u lokálního kadeřníka dle metody. Pro keratin a weft doporučujeme konzultaci v showroomu.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak daleko je showroom Múza Hair z Ostravy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Showroom je na Revoluční 8, Praha 1. Z Ostravy hlavního nádraží do Prahy hlavního nádraží je to přibližně 3,5 hodiny přímým vlakem. Od pražského nádraží na Revoluční 8 je to 15 minut metrem (linka C, přestup na B – Náměstí Republiky).',
        },
      },
      {
        '@type': 'Question',
        name: 'Proč jezdit pro prodloužení vlasů až do Prahy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair má vlastní barvírnu na míchání odstínů a sklady pravých vlasů tří kvalitních úrovní (Standard, Luxe, Platinum), které nejsou dostupné jinde. Pro klientky z Ostravy to znamená přístup k vlasům a řemeslu, které v regionu nenajdou.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů pro klientky z Ostravy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ceny jsou stejné pro všechny klientky: keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč, nanotapes (tape-in) 55–65 Kč/spoj, weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Vlasy lze objednat online i s doručením do Ostravy.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak si domluvit termín prodloužení vlasů z Ostravy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom je otevřen Po–Ne 10:00–20:00, pouze na objednání. Při plánování cesty z Ostravy doporučujeme rezervovat termín s předstihem.',
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

const VLASY_QUALITY = [
  { level: 'Standard', origin: 'Indie / Kambodža', desc: 'Barvené panenské vlasy. Skvělý poměr ceny a kvality.' },
  { level: 'Luxe', origin: 'Ukrajina / Polsko', desc: 'Středoevropské vlasy s přirozenou strukturou. Dlouhá životnost.' },
  { level: 'Platinum', origin: 'Česko / Slovensko', desc: 'Ty nejkvalitnější středoevropské vlasy — nebarvené, panenské.' },
];

export default function ProdlouzeniVlasuOstravaPage() {
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
              <span style={{ color: 'var(--text-dark)' }}>Prodloužení vlasů Ostrava</span>
            </div>

            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PRO KLIENTKY Z OSTRAVY
            </div>
            <h1 className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů<br />pro klientky z Ostravy
            </h1>
            <p className="text-[15px] leading-[1.8] font-light max-w-2xl mb-2" style={{ color: 'var(--text-soft)' }}>
              Showroom Praha 1 · Keratin · Nanotapes · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Vlastní barvírna · Pravé vlasy 3 úrovní · Vlasy s doručením do Ostravy
            </p>
          </div>
        </div>

        {/* Showroom info bar */}
        <div className="px-8 lg:px-20 py-12" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-5xl flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div>
              <p className="font-cormorant text-[22px] font-light mb-1" style={{ color: 'var(--ivory)' }}>Showroom Múza Hair — Praha 1</p>
              <p className="text-[14px] font-light" style={{ color: 'rgba(255,255,255,0.75)' }}>Revoluční 8, Praha 1 · metro B Náměstí Republiky (3 min pěšky)</p>
              <p className="text-[13px] font-light mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Po–Ne 10:00–20:00 · Pouze na objednání · Ostrava vlakem 3,5 hod</p>
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

        {/* Proč přijet z Ostravy */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PROČ ZA NÁMI
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Proč klientky z Ostravy cestují do Prahy?
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
              Múza Hair nabízí kombinaci vlastní barvírny, exkluzivního skladu pravých vlasů a zkušených aplikátorek —
              vše na jednom místě. Pro ty, kdo chtějí výsledek, který drží, stojí cesta za to.
            </p>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { title: 'Vlastní barvírna', desc: 'Barvíme vlasy sami — přesné míchání odstínů na zakázku. Žádné přebarvování nakoupených vlasů od jiných dodavatelů.' },
                { title: 'Pravé středoevropské vlasy', desc: 'Tři úrovně kvality: Standard (Indie/Kambodža), Luxe (Ukrajina/Polsko), Platinum (CZ/SK). Nebarvené panenské i barvené.' },
                { title: 'Vlasy na míru', desc: 'Vlasové tresy šijeme ručně — délka, gramáž a odstín přesně podle vás. Objednáte online s doručením domů.' },
                { title: 'Všechny metody', desc: 'Keratin, mikrokeratin, nanotapes (tape-in) i weft (hollywoodské) — vše v jednom showroomu. Nemusíte hledat více salonů.' },
                { title: 'Konzultace zdarma', desc: 'Pomůžeme vybrat správnou metodu i vlasy ještě před cestou. Zavolejte nebo napište na Instagram.' },
                { title: 'Od roku 2016', desc: 'Tisíce aplikací, zákaznice z celé ČR. Výsledky mluví za vše — přečtěte si recenze.' },
              ].map((item) => (
                <div key={item.title} className="border-b py-7 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
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
              Metody a ceny — prodloužení vlasů
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

        {/* Kvalita vlasů */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              KVALITA VLASŮ
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Tři úrovně pravých vlasů
            </h2>
            <p className="text-[14px] leading-[1.8] font-light mb-10 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
              Vlasy si nakonfigurujete online a objednáte s doručením do Ostravy — nebo je vyzkoušíte
              přímo v showroomu v Praze při konzultaci.
            </p>
            <div className="grid md:grid-cols-3 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {VLASY_QUALITY.map((v) => (
                <div key={v.level} className="border-b md:border-b-0 md:border-r py-8 md:pr-8 md:last:border-r-0 md:last:pr-0 md:pl-8 md:first:pl-0" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[11px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{v.origin}</p>
                  <h3 className="font-cormorant text-[20px] font-light mb-3" style={{ color: 'var(--text-dark)' }}>{v.level}</h3>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.12em] uppercase font-normal hover:underline"
                style={{ color: 'var(--burgundy)' }}
              >
                Nakonfigurovat vlasy online →
              </Link>
            </div>
          </div>
        </div>

        {/* Jak to funguje — cesta z Ostravy */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PLÁNOVÁNÍ NÁVŠTĚVY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Jak naplánovat cestu z Ostravy
            </h2>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { step: '01', title: 'Konzultace před cestou', desc: 'Zavolejte nebo napište na Instagram @muzahair.cz. Domluvíme metodu, vlasy a přibližnou cenu. Termín si rezervujte s předstihem.' },
                { step: '02', title: 'Vlak Ostrava → Praha', desc: 'Přímý vlak Ostrava hlavní nádraží → Praha hlavní nádraží trvá cca 3,5 hodiny. Od Prahy hl. n. metro C (Florenc), přestup na B, Náměstí Republiky — 15 min.' },
                { step: '03', title: 'Aplikace v showroomu', desc: 'Showroom Praha 1, Revoluční 8. Keratin 3–4 hod, nanotapes 1,5–2 hod, weft 2,5 hod. Celý den v Praze je reálný.' },
                { step: '04', title: 'Vlasy online s doručením', desc: 'Nechcete cestovat? Nakonfigurujte vlasy v e-shopu — doručíme do Ostravy. Aplikaci pak provedete u lokálního kadeřníka.' },
              ].map((item) => (
                <div key={item.step} className="border-b py-7 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[11px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{item.step}</p>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
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
              Prodloužení vlasů Ostrava — odpovědi
            </h2>
            <div>
              {[
                {
                  q: 'Je možné přijet na prodloužení vlasů z Ostravy do Prahy?',
                  a: 'Ano — zákaznice z Ostravy pravidelně jezdí do showroomu Múza Hair v Praze 1 (Revoluční 8). Ostrava–Praha vlakem trvá přibližně 3,5 hodiny. Celý servis v jednom dni je reálný: příjezd ráno, aplikace 2–4 hodiny, odjezd odpoledne.',
                },
                {
                  q: 'Mohu si objednat vlasy online z Ostravy bez cesty do Prahy?',
                  a: 'Ano — vlasy k prodloužení lze nakonfigurovat a objednat přes e-shop Múza Hair s doručením do Ostravy. Aplikaci pak provedete u lokálního kadeřníka. Pro keratin a weft doporučujeme konzultaci v showroomu.',
                },
                {
                  q: 'Proč jezdit pro prodloužení vlasů až do Prahy?',
                  a: 'Múza Hair má vlastní barvírnu na míchání odstínů a sklady pravých vlasů tří úrovní (Standard, Luxe, Platinum), které nejsou dostupné jinde. Pro klientky z Ostravy to znamená přístup k vlasům a řemeslu, které v regionu nenajdou.',
                },
                {
                  q: 'Kolik stojí prodloužení vlasů pro klientky z Ostravy?',
                  a: 'Ceny jsou stejné pro všechny klientky: keratin standart nasazení 4 000 Kč, mikrokeratin 5 000 Kč, nanotapes 55–65 Kč/spoj, weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Vlasy lze objednat online s doručením do Ostravy.',
                },
                {
                  q: 'Jak si domluvit termín prodloužení vlasů z Ostravy?',
                  a: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom je otevřen Po–Ne 10:00–20:00, pouze na objednání. Při plánování cesty z Ostravy doporučujeme rezervovat termín s předstihem.',
                },
                {
                  q: 'Jak daleko je showroom Múza Hair z Ostravy?',
                  a: 'Showroom je na Revoluční 8, Praha 1. Z Ostravy hlavního nádraží do Prahy hlavního nádraží je to přibližně 3,5 hodiny přímým vlakem. Od pražského nádraží na Revoluční 8 je to 15 minut metrem.',
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
              Poradíme vám ještě před cestou z Ostravy — metodu, vlasy i odhad ceny.
              Showroom Praha 1, Revoluční 8. Vlasy s doručením do Ostravy objednáte online.
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
                Objednat vlasy online
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
