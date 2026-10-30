import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prodloužení vlasů Kladno | Pravé vlasy, keratin, nanotapes | Múza Hair Praha',
  description: 'Prodloužení vlasů pro klientky z Kladna — showroom Praha 1, Revoluční 8. Vlastní barvírna, slovanské vlasy Standard/Luxe/Platinum. Keratin od 4 000 Kč. Objednání online.',
  alternates: { canonical: 'https://muzahair.cz/prodlouzeni-vlasu-kladno' },
  keywords: [
    'prodloužení vlasů Kladno',
    'prodloužení vlasů Kladna Praha',
    'kde prodlužovat vlasy Kladno',
    'vlasy k prodloužení Kladno',
    'prodloužení vlasů keratinem Kladno',
    'nanotapes Kladno',
    'weft prodloužení Kladno',
    'pravé vlasy Kladno',
  ],
  openGraph: {
    title: 'Prodloužení vlasů Kladno | Pravé vlasy | Múza Hair Praha',
    description: 'Showroom Praha 1, Revoluční 8. Cesta z Kladna 35 minut vlakem. Keratin od 4 000 Kč, nanotapes 55 Kč/spoj, weft od 3 800 Kč.',
    url: 'https://muzahair.cz/prodlouzeni-vlasu-kladno',
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
      { '@type': 'ListItem', position: 2, name: 'Prodloužení vlasů Kladno', item: 'https://muzahair.cz/prodlouzeni-vlasu-kladno' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Kde se dělá prodloužení vlasů pro klientky z Kladna?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Múza Hair má showroom na adrese Revoluční 8, Praha 1 — 27 km z Kladna, cesta autem trvá 30 minut po D7. Pracujeme výhradně na objednání, takže se domluvíme na čase, který vám přesně sedí.",
        },
      },
      {
        '@type': 'Question',
        name: "Jak daleko je cesta z Kladno do Prahy?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Z Kladna je to do showroomu Múza Hair Praha 1 přibližně 27 km. Vlakem 35 minut, autem 30 minut po D7. Pro klientky z Kladna je to výlet na půl dne — aplikace trvá 1,5–3 hodiny.",
        },
      },
      {
        '@type': 'Question',
        name: "Mohu si vlasy k prodloužení objednat online z Kladno?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Ano — vlasy Standard, Luxe i Platinum lze objednat přes náš e-shop s doručením do 48 hodin. Pokud si nejste jistá výběrem, napište nám na Instagram @muzahair.cz nebo zavolejte — poradíme na dálku.",
        },
      },
      {
        '@type': 'Question',
        name: "Kolik stojí prodloužení vlasů u Múza Hair?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Cena se skládá ze dvou částí: vlasy + aplikace u techničky. Vlasy Standard od 3 900 Kč, Luxe od 6 900 Kč, Platinum od 10 900 Kč. Aplikace keratinu stojí 4 000–5 500 Kč, nanotapes 55–65 Kč/spoj, weft 3 800 Kč/posun. Přesnou kalkulaci připravíme po konzultaci.",
        },
      },
      {
        '@type': 'Question',
        name: "Jak se objednám z Kladna do showroomu?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom je otevřen Po–Ne 10–20, výhradně na objednání. Pro klientky zdaleka doporučujeme ranní termín a konzultaci + výběr vlasů spojit do jedné návštěvy.",
        },
      },
      {
        '@type': 'Question',
        name: "Jaké metody prodloužení nabízíte?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Keratin (mikrokeratin), nanotapes (tape-in) a weft (tress). Každá metoda má jiné nároky na vlasy a životnost. Keratin a weft trvají 4–6 měsíců, nanotapes 6–10 týdnů do přelepení. Metodu vybereme společně na konzultaci podle vašich vlasů a životního stylu.",
        },
      }
    ],
  },
];

export default function ProdlouzeniVlasuKladnoPage() {
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
              <span style={{ color: 'var(--burgundy)' }}>Prodloužení vlasů Kladno</span>
            </nav>

            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              SHOWROOM PRAHA 1
            </div>

            <h1 className="font-cormorant text-[clamp(32px,4.5vw,56px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Prodloužení vlasů<br />pro klientky z Kladna
            </h1>

            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mb-10">
              <p className="text-[15px] leading-[1.8] font-light max-w-2xl" style={{ color: 'var(--text-dark)' }}>
                Múza Hair — showroom s vlastní barvírnou přímo v Praze. Cesta z Kladna trvá 35 minut vlakem nebo 30 minut po D7 autem.
                Vlasy Standard, Luxe a Platinum posíláme také online do do Kladna do 48 hodin.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Objednat se
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px border"
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
              <p className="text-[12px] tracking-[0.18em] uppercase mb-1 opacity-70">Showroom</p>
              <p className="text-[14px] font-light">Revoluční 8, Praha 1</p>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase mb-1 opacity-70">Otevřeno</p>
              <p className="text-[14px] font-light">Po–Ne 10–20, na objednání</p>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase mb-1 opacity-70">Z Kladno</p>
              <p className="text-[14px] font-light">35 minut vlakem · 30 minut po D7 autem</p>
            </div>
            <div>
              <p className="text-[12px] tracking-[0.18em] uppercase mb-1 opacity-70">Telefon</p>
              <p className="text-[14px] font-light">+420 728 722 880</p>
            </div>
          </div>
        </section>

        {/* Metody + ceny */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-4xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
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
                  <p className="text-[14px] mb-3" style={{ color: 'var(--burgundy)' }}>{m.price}</p>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kolekce vlasů */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-4xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
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
                  <p className="text-[12px] tracking-wider uppercase mb-2 font-light" style={{ color: 'var(--accent)' }}>{k.origin}</p>
                  <p className="text-[14px] mb-3" style={{ color: 'var(--burgundy)' }}>{k.price}</p>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{k.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/vlasy-k-prodlouzeni" className="text-[13px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--burgundy)' }}>
              Prohlédnout e-shop →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-4xl">
            <div className="text-[12px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              ČASTÉ OTÁZKY
            </div>
            <h2 className="font-cormorant text-[clamp(26px,3vw,40px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Otázky klientek z Kladna
            </h2>

            <div>
          <div key={0} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Kde se dělá prodloužení vlasů pro klientky z Kladna?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Múza Hair má showroom na adrese Revoluční 8, Praha 1 — 27 km z Kladna, cesta autem trvá 30 minut po D7. Pracujeme výhradně na objednání, takže se domluvíme na čase, který vám přesně sedí.
            </p>
          </div>
          <div key={1} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Jak daleko je cesta z Kladno do Prahy?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Z Kladna je to do showroomu Múza Hair Praha 1 přibližně 27 km. Vlakem 35 minut, autem 30 minut po D7. Pro klientky z Kladna je to výlet na půl dne — aplikace trvá 1,5–3 hodiny.
            </p>
          </div>
          <div key={2} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Mohu si vlasy k prodloužení objednat online z Kladno?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Ano — vlasy Standard, Luxe i Platinum lze objednat přes náš e-shop s doručením do 48 hodin. Pokud si nejste jistá výběrem, napište nám na Instagram @muzahair.cz nebo zavolejte — poradíme na dálku.
            </p>
          </div>
          <div key={3} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Kolik stojí prodloužení vlasů u Múza Hair?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Cena se skládá ze dvou částí: vlasy + aplikace u techničky. Vlasy Standard od 3 900 Kč, Luxe od 6 900 Kč, Platinum od 10 900 Kč. Aplikace keratinu stojí 4 000–5 500 Kč, nanotapes 55–65 Kč/spoj, weft 3 800 Kč/posun. Přesnou kalkulaci připravíme po konzultaci.
            </p>
          </div>
          <div key={4} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Jak se objednám z Kladna do showroomu?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom je otevřen Po–Ne 10–20, výhradně na objednání. Pro klientky zdaleka doporučujeme ranní termín a konzultaci + výběr vlasů spojit do jedné návštěvy.
            </p>
          </div>
          <div key={5} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="text-[16px] leading-snug mb-2 font-light" style={{ color: 'var(--text-dark)' }}>
              Jaké metody prodloužení nabízíte?
            </h3>
            <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
              Keratin (mikrokeratin), nanotapes (tape-in) a weft (tress). Každá metoda má jiné nároky na vlasy a životnost. Keratin a weft trvají 4–6 měsíců, nanotapes 6–10 týdnů do přelepení. Metodu vybereme společně na konzultaci podle vašich vlasů a životního stylu.
            </p>
          </div>
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
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px border"
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
