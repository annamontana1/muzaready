import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cena prodloužení vlasů Praha 2025 | Keratin, Tape-In, Weft | Múza Hair',
  description: 'Kolik stojí prodloužení vlasů v Praze? Keratin od 4 000 Kč, nanotapes 55–65 Kč/spoj, weft od 3 800 Kč. Ceny vlasů Standard od 6 900 Kč, LUXE od 8 900 Kč. Showroom Praha 1.',
  keywords: [
    'cena prodloužení vlasů Praha',
    'kolik stojí prodloužení vlasů',
    'cena keratin vlasů Praha',
    'cena nanotapes Praha',
    'cena tape in vlasy Praha',
    'cena weft vlasy Praha',
    'prodloužení vlasů cena Praha 2025',
    'ceník prodloužení vlasů',
    'ceny vlasů na prodloužení Praha',
  ],
  openGraph: {
    title: 'Cena prodloužení vlasů Praha 2025 — Keratin, Tape-In, Weft | Múza Hair',
    description: 'Kompletní ceník prodloužení vlasů Praha. Ceny vlasů + aplikace. Keratin, nanotapes, weft. Vlastní barvírna Praha 1.',
    url: 'https://muzahair.cz/cenik-prodlouzeni-vlasu-praha',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/cenik-prodlouzeni-vlasu-praha',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů Praha', item: 'https://muzahair.cz/prodlouzeni-vlasu-praha' },
      { '@type': 'ListItem', position: 3, name: 'Cena prodloužení vlasů Praha', item: 'https://muzahair.cz/cenik-prodlouzeni-vlasu-praha' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů v Praze celkem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Celková cena prodloužení vlasů v Praze se skládá z ceny aplikace a ceny vlasů. Příklad: keratin aplikace od 4 000 Kč + vlasy Standard 100 g od 6 900 Kč = celkem od 10 900 Kč. Delší vlasy (55 cm, Standard) vychází na přibližně 14 900 Kč vč. aplikace. Showroom Revoluční 8, Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí keratin prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keratin prodloužení vlasů Praha: aplikace standart keratin 4 000 Kč / 100 g (130 pramenů), mikrokeratin 5 000 Kč / 100 g (230 pramenů). Korekce po 2,5–3 měsících. Cena vlasů se účtuje zvlášť — od 6 900 Kč (Standard) do 10 900 Kč (Platinum Edition) za 100 g.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí nanotapes (tape-in) prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes (tape-in) prodloužení vlasů Praha: aplikace 55 Kč/spoj (šíře 2,8 cm) nebo 65 Kč/spoj (šíře 4 cm). Jedno balení = 10 spojů = 550 Kč aplikace. Korekce po 1,5–2 měsících. Cena vlasových pásků se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí weft prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Weft prodloužení vlasů Praha (hollywoodské prodloužení): posun / korekce tresů od 3 800 Kč. Nasazení na dotaz dle individuálního projektu. Korekce po 2–3 měsících. Cena vlasových tresů se účtuje zvlášť — tresy šijeme ručně na zakázku.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl v ceně vlasů Standard, LUXE a Platinum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair nabízí 3 úrovně kvality vlasů: Standard od 6 900 Kč/100 g (kvalitní barvené vlasy), LUXE od 8 900 Kč/100 g (prémiové středoevropské vlasy), Platinum Edition od 10 900 Kč/100 g (panenské nebarvené vlasy nejvyšší kvality). Baby Shades (světlé odstíny) od 7 900 Kč/100 g.',
        },
      },
    ],
  },
];

const APPLICATION_PRICES = [
  { method: 'Keratin 100 g', price: 'od 4 000 Kč', validity: '2,5–3 měs.', note: 'zvlášť' },
  { method: 'Mikrokeratin 100 g', price: 'od 5 000 Kč', validity: '2,5–3 měs.', note: 'zvlášť' },
  { method: 'Nanotapes / spoj', price: '55–65 Kč', validity: '1,5–2 měs.', note: 'zvlášť' },
  { method: 'Weft posun', price: 'od 3 800 Kč', validity: '2–3 měs.', note: 'zvlášť' },
];

const HAIR_PRICES = [
  { collection: 'Standard', price: 'od 6 900 Kč' },
  { collection: 'LUXE', price: 'od 8 900 Kč' },
  { collection: 'Platinum Edition', price: 'od 10 900 Kč' },
  { collection: 'Baby Shades', price: 'od 7 900 Kč' },
];

const FAQ = [
  {
    q: 'Kolik stojí prodloužení vlasů v Praze celkem?',
    a: 'Celková cena se skládá z aplikace a vlasů. Keratin aplikace od 4 000 Kč + vlasy Standard od 6 900 Kč = od 10 900 Kč. Delší vlasy (55 cm, Standard) vychází přibližně na 14 900 Kč vč. aplikace. Konzultaci zdarma domluvíte na +420 728 722 880.',
  },
  {
    q: 'Proč se cena vlasů a aplikace účtuje zvlášť?',
    a: 'Cena vlasů závisí na délce, gramáži a zvoleném odstínu — každá zákaznice má jiné potřeby. Oddělení cen umožňuje férovou kalkulaci: platíte přesně za to, co dostanete, bez paušálního navýšení.',
  },
  {
    q: 'Jak si předem spočítat celkovou cenu prodloužení vlasů?',
    a: 'Záleží na délce cílového výsledku a gramáži. Kratší výsledek (do 40 cm) = 100 g vlasů. Střední délka (55 cm) = 100–150 g. Dlouhé vlasy (65+ cm) = 150–200 g. Přesnou kalkulaci dostanete na konzultaci zdarma v showroomu Praha 1, Revoluční 8.',
  },
  {
    q: 'Je cena prodloužení vlasů v Praze u Múza Hair srovnatelná s jinými salóny?',
    a: 'Múza Hair má vlastní barvírnu a vyrábí vlasové tresy na zakázku — neplatíte marži za zprostředkovatele. Ceny aplikace i vlasů jsou transparentní. Showroom Praha 1, Revoluční 8.',
  },
  {
    q: 'Mohu si vlasy na prodloužení objednat online bez návštěvy Prahy?',
    a: 'Ano — vlasy Standard, LUXE, Platinum Edition a Baby Shades jsou dostupné v e-shopu s doručením po celé ČR. Aplikaci vlasů pak provedeme v showroomu Praha 1 nebo u vás ve spolupracujícím salónu.',
  },
];

export default function CenikProdlouzeniVlasuPrahaPage() {
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
              <Link href="/prodlouzeni-vlasu-praha" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Prodloužení vlasů Praha</Link>
              {' / '}
              <span style={{ color: 'var(--text-dark)' }}>Cena prodloužení vlasů Praha</span>
            </div>

            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              SHOWROOM PRAHA 1 · REVOLUČNÍ 8
            </div>
            <h1 className="font-cormorant text-[clamp(38px,5vw,58px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Cena prodloužení vlasů Praha 2025
            </h1>
            <p className="text-[15px] leading-[1.8] font-light max-w-2xl mb-2" style={{ color: 'var(--text-soft)' }}>
              Keratin · Nanotapes (Tape-In) · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Vlastní barvírna · Pravé vlasy · 3 úrovně kvality · Od roku 2016
            </p>
          </div>
        </div>

        {/* TL;DR blok — pro AI enginy a rychlé čtení */}
        <div className="px-8 lg:px-20 py-10" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-5xl">
            <p className="text-[11px] tracking-[0.2em] uppercase mb-4 font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>
              RYCHLÝ PŘEHLED CEN
            </p>
            <p className="text-[15px] leading-[1.9] font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Cena prodloužení vlasů v Praze: keratin od 4 000 Kč (aplikace) + vlasy od 6 900 Kč/100 g.
              Nanotapes 55–65 Kč/spoj + vlasy. Weft posun od 3 800 Kč + tresy na zakázku.
              Celková cena keratin prodloužení v Praze tedy <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>od 10 900 Kč</strong>.
              Múza Hair, Revoluční 8, Praha 1.
            </p>
          </div>
        </div>

        {/* Ceník aplikace */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              CENY APLIKACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
              Ceník aplikace prodloužení vlasů Praha
            </h2>

            {/* Tabulka aplikace */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <th className="text-left py-3 pr-6 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Metoda</th>
                    <th className="text-left py-3 pr-6 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Cena aplikace</th>
                    <th className="text-left py-3 pr-6 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Platnost</th>
                    <th className="text-left py-3 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Vlasy</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLICATION_PRICES.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                      <td className="py-4 pr-6 text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>{row.method}</td>
                      <td className="py-4 pr-6 text-[14px] font-light" style={{ color: 'var(--burgundy)', fontWeight: 500 }}>{row.price}</td>
                      <td className="py-4 pr-6 text-[14px] font-light" style={{ color: 'var(--text-soft)' }}>{row.validity}</td>
                      <td className="py-4 text-[13px] font-light" style={{ color: 'var(--text-soft)' }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[13px] font-light mt-5" style={{ color: 'var(--text-soft)' }}>
              Cena vlasů se účtuje zvlášť dle zvolené kolekce a délky.{' '}
              <Link href="/ceny-aplikaci" className="hover:underline" style={{ color: 'var(--burgundy)' }}>
                Kompletní ceník aplikace →
              </Link>
            </p>
          </div>
        </div>

        {/* Ceník vlasů */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              CENY VLASŮ
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
              Ceník vlasů na prodloužení
            </h2>

            {/* Tabulka vlasů */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <th className="text-left py-3 pr-6 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Kolekce</th>
                    <th className="text-left py-3 text-[11px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>Cena za 100 g</th>
                  </tr>
                </thead>
                <tbody>
                  {HAIR_PRICES.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                      <td className="py-4 pr-6 text-[14px] font-normal" style={{ color: 'var(--text-dark)' }}>{row.collection}</td>
                      <td className="py-4 text-[14px] font-light" style={{ color: 'var(--burgundy)', fontWeight: 500 }}>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[13px] font-light mt-5" style={{ color: 'var(--text-soft)' }}>
              Cena je za 100 g vlasů v základní délce. Delší vlasy a specifické odstíny na dotaz.{' '}
              <Link href="/vlasy-k-prodlouzeni" className="hover:underline" style={{ color: 'var(--burgundy)' }}>
                Nakonfigurovat vlasy v e-shopu →
              </Link>
            </p>
          </div>
        </div>

        {/* Příklad celkové ceny */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PŘÍKLAD KALKULACE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
              Příklad celkové ceny prodloužení vlasů v Praze
            </h2>

            <div className="grid md:grid-cols-3 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                {
                  label: 'Krátký výsledek',
                  desc: 'Keratin 40 cm · Standard · 100 g',
                  breakdown: ['Aplikace: 4 000 Kč', 'Vlasy 100 g: 6 900 Kč'],
                  total: 'od 10 900 Kč',
                },
                {
                  label: 'Střední délka',
                  desc: 'Keratin 55 cm · Standard · 100 g',
                  breakdown: ['Aplikace: 4 000 Kč', 'Vlasy 100 g + délka: 10 900 Kč'],
                  total: 'od 14 900 Kč',
                },
                {
                  label: 'Luxusní výsledek',
                  desc: 'Keratin 55 cm · LUXE · 100 g',
                  breakdown: ['Aplikace: 4 000 Kč', 'Vlasy LUXE 100 g + délka: ~12 900 Kč'],
                  total: 'od 16 900 Kč',
                },
              ].map((ex) => (
                <div key={ex.label} className="border-b md:border-b-0 md:border-r py-8 md:pr-8 md:last:border-r-0 md:last:pr-0 md:pl-8 md:first:pl-0" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[11px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'var(--accent)' }}>{ex.label}</p>
                  <p className="text-[14px] font-light mb-4" style={{ color: 'var(--text-soft)' }}>{ex.desc}</p>
                  <ul className="space-y-1 mb-5">
                    {ex.breakdown.map((b) => (
                      <li key={b} className="text-[13px] font-light flex gap-2" style={{ color: 'var(--text-soft)' }}>
                        <span style={{ color: 'var(--accent)' }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="font-cormorant text-[22px] font-light" style={{ color: 'var(--text-dark)' }}>{ex.total}</p>
                </div>
              ))}
            </div>

            <p className="text-[13px] font-light mt-8" style={{ color: 'var(--text-soft)' }}>
              Přesnou cenu vlasů určuje délka, gramáž a odstín. Konzultaci a kalkulaci zdarma domluvíte na{' '}
              <a href="tel:+420728722880" className="hover:underline" style={{ color: 'var(--burgundy)' }}>+420 728 722 880</a>.
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
              Cena prodloužení vlasů Praha — odpovědi
            </h2>
            <div>
              {FAQ.map((item, i) => (
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
              DALŠÍ KROKY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Zjistěte přesnou cenu pro vás
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-xl" style={{ color: 'var(--text-soft)' }}>
              Konzultace je zdarma — pomůžeme vybrat metodu, kolekci i délku vlasů.
              Showroom Praha 1, Revoluční 8.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
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
            </div>

            {/* Sekundární navigace */}
            <div className="border-t pt-8 flex flex-col sm:flex-row gap-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.12em] uppercase font-normal hover:underline"
                style={{ color: 'var(--text-soft)' }}
              >
                Nakonfigurovat vlasy v e-shopu →
              </Link>
              <Link
                href="/prodlouzeni-vlasu-praha"
                className="text-[12px] tracking-[0.12em] uppercase font-normal hover:underline"
                style={{ color: 'var(--text-soft)' }}
              >
                Prodloužení vlasů Praha — metody →
              </Link>
              <Link
                href="/ceny-aplikaci"
                className="text-[12px] tracking-[0.12em] uppercase font-normal hover:underline"
                style={{ color: 'var(--text-soft)' }}
              >
                Kompletní ceník aplikace →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
