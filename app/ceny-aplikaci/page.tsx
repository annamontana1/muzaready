import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ceník prodlužování vlasů Praha 2025 | Keratin, Nanotapes, Weft | Múza Hair',
  description: 'Ceny aplikace prodloužení vlasů Praha: keratin od 4 000 Kč, mikrokeratin od 5 000 Kč, nanotapes 55 Kč/spoj, weft (hollywoodské prodloužení) posun 3 800 Kč. Showroom Revoluční 8, Praha 1.',
  alternates: { canonical: 'https://muzahair.cz/ceny-aplikaci' },
  keywords: [
    'prodloužení vlasů Praha cena',
    'kolik stojí weft prodloužení',
    'vlasové tresy cena',
    'vlasové pásky cena',
    'vlasové pásy cena Praha',
    'prodloužení vlasů nanotapes cena',
    'nanotapes vlasy cena Praha',
    'prodloužení vlasů weft cena',
    'hollywoodské prodloužení vlasů cena',
    'keratin prodloužení vlasů cena Praha',
    'mikrokeratin prodloužení vlasů',
    'tape-in prodloužení vlasů cena',
    'ceník prodloužení vlasů Praha',
    'kolik stojí prodloužení vlasů',
    'weft prodloužení cena Praha',
    'vlasové tresy Praha cena',
  ],
  openGraph: {
    title: 'Ceník prodlužování vlasů Praha 2025 | Keratin, Nanotapes, Weft | Múza Hair',
    description: 'Keratin od 4 000 Kč · Nanotapes (tape-in) 55 Kč/spoj · Weft (hollywoodské prodloužení) posun 3 800 Kč. Showroom Praha 1, Revoluční 8.',
    url: 'https://muzahair.cz/ceny-aplikaci',
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
      { '@type': 'ListItem', position: 2, name: 'Ceník aplikace', item: 'https://muzahair.cz/ceny-aplikaci' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      // ── Keratin ──
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů keratinem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prodloužení vlasů keratinem — nasazení standart keratin 4 000 Kč (130 pramenů / 100 g, 31 Kč/pramen), korekce 4 500 Kč. Aplikace trvá 3–4 hodiny, korekce po 2,5–3 měsících. Cena vlasů se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů keratinem Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prodloužení vlasů keratinem Praha — nasazení standart keratin 4 000 Kč (130 pramenů / 100 g, 31 Kč/pramen), korekce 4 500 Kč. Aplikace trvá 3–4 hodiny, korekce po 2,5–3 měsících. Cena vlasů se účtuje zvlášť. Showroom Revoluční 8, Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí mikrokeratin prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mikrokeratin prodloužení vlasů — nasazení 5 000 Kč (230 pramenů / 100 g, 22 Kč/pramen), korekce 5 500 Kč. Mikrokeratin má menší, diskrétnější kapsli než standart — neviditelný i při sepnutých vlasech. Aplikace 3–4 hod, korekce po 2,5–3 měsících.',
        },
      },
      // ── Tape-in / Nanotapes ──
      {
        '@type': 'Question',
        name: 'Kolik stojí vlasové pásky?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vlasové pásky (nanotapes, tapes, tape-in) stojí 55 Kč za 1 spoj při šíři 2,8 cm a 65 Kč za spoj při šíři 4 cm. 1 spoj = 2 pásky. Balení 10 spojů = 550 Kč aplikace. Cena samotných vlasových pásků se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí nanotapes prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes prodloužení vlasů — 55 Kč za 1 spoj (2 pásky, šíře 2,8 cm). Jedno balení = 10 spojů. Na korekci se chodí po 1,5–2 měsících, posun trvá 1,5–2 hodiny. Cena vlasových pásků se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí nanotapes prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes prodloužení vlasů Praha — 55 Kč za 1 spoj (2 pásky, šíře 2,8 cm). Jedno balení = 10 spojů. Na korekci se chodí po 1,5–2 měsících, posun trvá 1,5–2 hodiny. Cena vlasových pásků se účtuje zvlášť. Showroom Revoluční 8, Praha 1.',
        },
      },
      // ── Weft / Tresy ──
      {
        '@type': 'Question',
        name: 'Kolik stojí vlasové tresy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vlasové tresy — posun / korekce weft tresů stojí 3 800 Kč. Prvotní nasazení se stanovuje individuálně na konzultaci. Tresy vyrábíme na zakázku z pravých vlasů — výroba trvá 14 pracovních dní. Cena samotných tresů se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí weft prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Weft prodloužení vlasů — posun tresů 3 800 Kč. Nasazení se stanovuje individuálně po konzultaci. Aplikace trvá přibližně 2,5 hodiny, korekce po 2–3 měsících. Cena tresů se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí weft prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Weft prodloužení vlasů Praha — posun tresů 3 800 Kč, showroom Revoluční 8, Praha 1. Nasazení se stanovuje individuálně po konzultaci. Aplikace trvá přibližně 2,5 hodiny, korekce po 2–3 měsících. Cena tresů se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí hollywoodské prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hollywoodské prodloužení vlasů (weft, vlasové tresy) — posun / korekce 3 800 Kč. Ručně šité tresy přišívané na copánky bez lepidla a tepla. Nasazení individuálně, aplikace cca 2,5 hod, korekce po 2–3 měsících. Tresy na zakázku za 14 pracovních dní.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí hollywoodské prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hollywoodské prodloužení vlasů Praha (weft, vlasové tresy) — posun / korekce 3 800 Kč. Ručně šité tresy přišívané na copánky bez lepidla a tepla. Nasazení individuálně, aplikace cca 2,5 hod, korekce po 2–3 měsících. Showroom Revoluční 8, Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů celkem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Celková cena prodloužení vlasů = cena vlasů + cena aplikace. Tyto dvě složky se vždy účtují zvlášť. Příklad: keratin standart — vlasy 50 cm / 100 g ~ 5 800 Kč + aplikace 4 000 Kč = ~ 9 800 Kč. Nanotapes — 10 spojů ~ 1 600 Kč + aplikace 550 Kč = ~ 2 150 Kč.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi nanotapes a tape-in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes a tape-in jsou označení pro stejnou metodu vlasových pásků. Liší se šíří: nanotapes 2,8 cm (jemnější, cena 55 Kč/spoj), tape-in 4 cm (standardní, 65 Kč/spoj). Obě metody jsou sendvičový spoj bez chemie a tepla.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi keratinovým a mikrokeratinovým prodloužením vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standart keratin — větší kapsle, 130 pramenů / 100 g, nasazení 4 000 Kč. Mikrokeratin — menší diskrétní kapsle, 230 pramenů / 100 g, nasazení 5 000 Kč. Mikrokeratin je neviditelný při sepnutých vlasech a šetrnější k vlastním vlasům.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaká metoda prodloužení vlasů je nejšetrnější?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nejšetrnější jsou weft (vlasové tresy přišívané na copánky bez lepidla) a nanotapes / tape-in (sendvičový spoj bez tepla ani chemie). Mikrokeratin je šetrnější než standart keratin díky menší kapsli. Vhodnou metodu doporučíme na konzultaci.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde v Praze si mohu nechat prodloužit vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prodloužení vlasů keratinem, mikrokeratiinem, nanotapes, tape-in i weft (hollywoodské prodloužení) provádíme v showroomu Múza Hair, Revoluční 8, Praha 1. Po–Ne 10:00–20:00, pouze na objednání. Tel: +420 728 722 880.',
        },
      },
      {
        '@type': 'Question',
        name: 'Zahrnuje cena aplikace i vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ne — cena aplikace a cena vlasů se vždy účtují zvlášť. Vlasy si nakonfigurujete v e-shopu dle gramáže, délky a kvality. Vlasové tresy vyrábíme na zakázku do 14 pracovních dní.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Múza Hair',
    '@id': 'https://muzahair.cz',
    url: 'https://muzahair.cz',
    telephone: '+420728722880',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha 1',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prodloužení vlasů Praha — ceník aplikace',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Standart keratin — nasazení prodloužení vlasů',
            description: 'Keratinové prodloužení vlasů Praha. Nasazení standart keratin — 130 pramenů / 100 g, aplikace 3–4 hodiny.',
          },
          price: '4000',
          priceCurrency: 'CZK',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '4000', priceCurrency: 'CZK', unitText: '100g' },
          areaServed: { '@type': 'City', name: 'Praha' },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mikrokeratin — nasazení prodloužení vlasů',
            description: 'Mikrokeratinové prodloužení vlasů Praha. 230 pramenů / 100 g — diskrétní, šetrné, neviditelné.',
          },
          price: '5000',
          priceCurrency: 'CZK',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '5000', priceCurrency: 'CZK', unitText: '100g' },
          areaServed: { '@type': 'City', name: 'Praha' },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tape-in / Nanotapes — prodloužení vlasů Praha',
            description: 'Prodloužení vlasů nanotapes (tape-in) Praha. Sendvičový spoj bez tepla a chemie. 55 Kč/spoj (2,8 cm), 65 Kč/spoj (4 cm).',
          },
          price: '55',
          priceCurrency: 'CZK',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '55', priceCurrency: 'CZK', unitText: 'spoj' },
          areaServed: { '@type': 'City', name: 'Praha' },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Weft — Hollywoodské prodloužení vlasů Praha',
            description: 'Hollywoodské prodloužení vlasů (weft) Praha. Ručně šité tresy přišívané na copánky. Posun / korekce 3 800 Kč.',
          },
          price: '3800',
          priceCurrency: 'CZK',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '3800', priceCurrency: 'CZK', unitText: 'posun' },
          areaServed: { '@type': 'City', name: 'Praha' },
        },
      ],
    },
  },
];

export default function CenyAplikaciPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:opacity-70 transition">Domů</Link>
            <span>/</span>
            <span style={{ color: 'var(--burgundy)' }}>Ceník aplikace</span>
          </div>

          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Praha · Showroom</span>
          </div>

          <h1 className="font-cormorant text-[clamp(28px,4vw,52px)] font-light leading-tight mb-4" style={{ color: 'var(--text-dark)' }}>
            Ceník prodlužování vlasů Praha
          </h1>
          <p className="text-lg mb-3" style={{ color: 'var(--text-soft)' }}>
            Keratin · Mikrokeratin · Nanotapes (Tape-In) · Weft (Hollywoodské prodloužení)
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-soft)' }}>
            Ceny jsou za <strong style={{ color: 'var(--text-dark)' }}>aplikaci (práci)</strong>. Cena vlasů se vždy účtuje zvlášť —{' '}
            <Link href="/vlasy-k-prodlouzeni" className="underline hover:opacity-75" style={{ color: 'var(--burgundy)' }}>
              nakonfigurujte si je v e-shopu
            </Link>.
          </p>

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }}>
            <p className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--text-dark)' }}>Aplikace pouze v showroomu na objednání — Praha 1</p>
            <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
              <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Revoluční 8, Praha 1</span> · Po–Ne 10:00–20:00 ·{' '}
              <a href="tel:+420728722880" className="hover:underline" style={{ color: 'var(--burgundy)' }}>+420 728 722 880</a>
            </p>
          </div>
        </div>
      </section>

      {/* Keratin */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16" id="keratin">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Keratinové pramínky · 3–4 hod · Korekce po 2,5–3 měsících</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Keratin / Mikrokeratin — prodloužení vlasů Praha
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--text-dark)' }}>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase w-1/3" style={{ color: 'var(--text-soft)' }}></th>
                  <th className="text-center py-3 font-normal" style={{ color: 'var(--text-soft)' }}>
                    <span className="font-cormorant text-lg font-light" style={{ color: 'var(--burgundy)' }}>Standart keratin</span>
                  </th>
                  <th className="text-center py-3 font-normal" style={{ color: 'var(--text-soft)' }}>
                    <span className="font-cormorant text-lg font-light" style={{ color: 'var(--burgundy)' }}>Mikrokeratin</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                  <td className="py-4 text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>Pramenů / 100 g vlasů</td>
                  <td className="py-4 text-center" style={{ color: 'var(--text-dark)' }}>130 pramenů</td>
                  <td className="py-4 text-center" style={{ color: 'var(--text-dark)' }}>230 pramenů</td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                  <td className="py-4 text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>Nasazení + napramínkování</td>
                  <td className="py-4 text-center">
                    <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--burgundy)' }}>4 000 Kč</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>31 Kč / pramen</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--burgundy)' }}>5 000 Kč</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>22 Kč / pramen</span>
                  </td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                  <td className="py-4 text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>Korekce / posun vlasů</td>
                  <td className="py-4 text-center">
                    <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--burgundy)' }}>4 500 Kč</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>35 Kč / pramen</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--burgundy)' }}>5 500 Kč</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>24 Kč / pramen</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs italic mb-6" style={{ color: 'var(--text-soft)' }}>Ceny jsou uvedeny za 100 g vlasů. Cena samotných vlasů se účtuje zvlášť dle gramáže a délky.</p>

          <div className="border-t mb-6" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              { title: 'Standart keratin', desc: 'Větší kapsle, robustnější spoj. Vhodný pro silnější vlasy. Při sepnutých vlasech může být kapsle lehce viditelná.' },
              { title: 'Mikrokeratin', desc: 'Menší, diskrétnější kapsle — neviditelná i při sepnutých vlasech. Šetrnější k vlastním vlasům. Více pramenů = přirozenější výsledek.' },
            ].map((item) => (
              <div key={item.title} className="py-5 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <div className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 text-sm mb-4" style={{ color: 'var(--text-soft)' }}>
            <div>
              <span className="text-[11px] tracking-[0.15em] uppercase block mb-1" style={{ color: 'var(--text-soft)' }}>Délka aplikace</span>
              <span style={{ color: 'var(--text-dark)' }}>3–4 hodiny</span>
            </div>
            <div>
              <span className="text-[11px] tracking-[0.15em] uppercase block mb-1" style={{ color: 'var(--text-soft)' }}>Korekce</span>
              <span style={{ color: 'var(--text-dark)' }}>po 2,5–3 měsících</span>
            </div>
          </div>

          <Link href="/metody-zakonceni/vlasy-na-keratin" className="text-sm hover:opacity-75 transition" style={{ color: 'var(--accent)' }}>
            Více o keratinové metodě →
          </Link>
        </div>
      </section>

      {/* Tape-in / Nanotapes */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16" id="nanotapes">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Bez tepla a chemie · Sendvičový spoj · Korekce po 1,5–2 měsících</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Vlasové pásky / Nanotapes / Tape-In — prodloužení vlasů Praha
          </h2>

          <p className="text-xs italic mb-8" style={{ color: 'var(--text-soft)' }}>
            <strong style={{ color: 'var(--text-dark)' }}>Nanotapes</strong> a <strong style={{ color: 'var(--text-dark)' }}>tape-in</strong> jsou označení pro stejnou metodu vlasových pásků.
            Liší se pouze šíří pásku — 2,8 cm (nanotapes) vs 4 cm (standardní tape-in).
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-4" style={{ color: 'var(--accent)' }}>Ceník</p>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {[
                  { label: '2,8 cm pásky — nanotapes (1 spoj = 2 pásky)', price: '55 Kč' },
                  { label: '4 cm pásky — tape-in (1 spoj = 2 pásky)', price: '65 Kč' },
                  { label: 'Balení 10 spojů (2,8 cm)', price: '550 Kč' },
                  { label: 'Posun / korekce', price: 'Dle počtu spojů' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-4 border-b" style={{ borderColor: 'var(--beige)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-soft)' }}>{row.label}</span>
                    <span className="font-cormorant text-xl font-light ml-4 flex-shrink-0" style={{ color: 'var(--burgundy)' }}>{row.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs italic mt-3" style={{ color: 'var(--text-soft)' }}>Cena vlasových pásků se účtuje zvlášť.</p>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-4" style={{ color: 'var(--accent)' }}>Parametry</p>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {[
                  { label: 'Délka posunu', value: '1,5–2 hodiny' },
                  { label: 'Frekvence korekce', value: 'každých 1,5–2 měsíce' },
                  { label: 'Chemie / teplo', value: 'Bez chemie, bez tepla' },
                  { label: 'Spoj', value: 'Neviditelný sendvičový spoj' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-start py-4 border-b" style={{ borderColor: 'var(--beige)' }}>
                    <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>{row.label}</span>
                    <span className="text-sm text-right ml-4" style={{ color: 'var(--text-dark)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <Link href="/metody-zakonceni/vlasove-pasky-tape-in" className="inline-block mt-5 text-sm hover:opacity-75 transition" style={{ color: 'var(--accent)' }}>
                Více o nanotapes / tape-in metodě →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Weft */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16" id="weft">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Ručně šité tresy na copánky · Bez lepidla a tepla · Korekce po 2–3 měsících</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Vlasové tresy / Weft — Hollywoodské prodloužení vlasů Praha
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-4" style={{ color: 'var(--accent)' }}>Ceník</p>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {[
                  { label: 'Posun / korekce tresů', price: '3 800 Kč' },
                  { label: 'Prvotní nasazení', price: 'Na dotaz' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-4 border-b" style={{ borderColor: 'var(--ivory)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-soft)' }}>{row.label}</span>
                    <span className="font-cormorant text-xl font-light ml-4 flex-shrink-0" style={{ color: 'var(--burgundy)' }}>{row.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs italic mt-3" style={{ color: 'var(--text-soft)' }}>Cena vlasových tresů se účtuje zvlášť. Tresy vyrábíme na zakázku — výroba 14 pracovních dní.</p>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-4" style={{ color: 'var(--accent)' }}>Parametry</p>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {[
                  { label: 'Délka aplikace', value: 'cca 2,5 hodiny' },
                  { label: 'Frekvence korekce', value: 'každé 2–3 měsíce' },
                  { label: 'Chemie / lepidlo / teplo', value: 'Bez chemie, bez lepidla, bez tepla' },
                  { label: 'Šetrnost', value: 'Šetrné k vlastním vlasům' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-start py-4 border-b" style={{ borderColor: 'var(--ivory)' }}>
                    <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--text-soft)' }}>{row.label}</span>
                    <span className="text-sm text-right ml-4" style={{ color: 'var(--text-dark)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <Link href="/metody-zakonceni/vlasove-tresy" className="inline-block mt-5 text-sm hover:opacity-75 transition" style={{ color: 'var(--accent)' }}>
                Více o hollywoodském prodloužení (weft) →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Celková cena */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Kalkulace</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Kolik stojí prodloužení vlasů celkem?
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Výsledná cena se skládá ze <strong style={{ color: 'var(--text-dark)' }}>dvou složek</strong>: ceny vlasů (gramáž × délka × kvalita) a ceny aplikace (výše). Například:
          </p>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                title: 'Příklad: Keratin standart',
                lines: ['100 g vlasů 50 cm ~ 5 800 Kč*', '+ Aplikace 4 000 Kč'],
                total: '~ 9 800 Kč celkem',
              },
              {
                title: 'Příklad: Nanotapes (2,8 cm)',
                lines: ['1 balení 10 spojů ~ 1 600 Kč*', '+ Aplikace 550 Kč (10 spojů)'],
                total: '~ 2 150 Kč celkem',
              },
              {
                title: 'Příklad: Weft (hollywoodské)',
                lines: ['Sada tresů na dotaz*', '+ Posun 3 800 Kč'],
                total: 'Nasazení na konzultaci',
              },
            ].map((item) => (
              <div key={item.title} className="py-6 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="font-cormorant text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>{item.title}</div>
                {item.lines.map((l, i) => (
                  <div key={i} className="text-sm" style={{ color: 'var(--text-soft)' }}>{l}</div>
                ))}
                <div className="font-cormorant text-lg font-light mt-2" style={{ color: 'var(--burgundy)' }}>{item.total}</div>
              </div>
            ))}
          </div>
          <p className="text-xs italic mt-4" style={{ color: 'var(--text-soft)' }}>* Ceny vlasů jsou orientační a závisí na gramáži, délce a zvolené kvalitě. Přesnou cenu zjistíte v{' '}
            <Link href="/vlasy-k-prodlouzeni" className="underline hover:opacity-75" style={{ color: 'var(--burgundy)' }}>konfigurátoru vlasů</Link>.
          </p>
        </div>
      </section>

      {/* Srovnání metod */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Srovnání</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Srovnání metod prodloužení vlasů — Praha
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--text-dark)' }}>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Metoda</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Cena aplikace</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Korekce</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Délka</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Šetrnost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Standart keratin', price: '4 000 Kč / 100g', correction: 'po 2,5–3 měs.', duration: '3–4 hod', gentle: '●●●○' },
                  { name: 'Mikrokeratin', price: '5 000 Kč / 100g', correction: 'po 2,5–3 měs.', duration: '3–4 hod', gentle: '●●●●' },
                  { name: 'Nanotapes / Tape-In', price: '55–65 Kč / spoj', correction: 'po 1,5–2 měs.', duration: '1,5–2 hod', gentle: '●●●●' },
                  { name: 'Weft (Hollywoodské)', price: 'posun 3 800 Kč', correction: 'po 2–3 měs.', duration: 'cca 2,5 hod', gentle: '●●●●' },
                ].map((row) => (
                  <tr key={row.name} className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                    <td className="py-4" style={{ color: 'var(--text-dark)' }}>{row.name}</td>
                    <td className="py-4 text-center font-cormorant text-lg font-light" style={{ color: 'var(--burgundy)' }}>{row.price}</td>
                    <td className="py-4 text-center" style={{ color: 'var(--text-soft)' }}>{row.correction}</td>
                    <td className="py-4 text-center" style={{ color: 'var(--text-soft)' }}>{row.duration}</td>
                    <td className="py-4 text-center" style={{ color: 'var(--text-soft)' }}>{row.gentle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Jak vybrat metodu */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Výběr metody</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Jak vybrat metodu prodloužení vlasů?
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              { q: 'Chcete diskrétní pramínky?', a: 'Mikrokeratin — 230 pramenů / 100 g, neviditelný i při sepnutých vlasech.' },
              { q: 'Chcete nejrychlejší aplikaci?', a: 'Nanotapes / Tape-In — nasazení 1,5–2 hod, ideální při pravidelném zkracování cyklu.' },
              { q: 'Chcete maximální objem bez chemie?', a: 'Weft (hollywoodské prodloužení) — tresy přišívané na copánky, bez lepidla ani tepla.' },
              { q: 'Nevíte si rady?', a: 'Domluvte si konzultaci — zdarma poradíme, která metoda je vhodná pro vaše vlasy.' },
            ].map((item) => (
              <div key={item.q} className="py-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--text-dark)' }}>{item.q}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Časté dotazy</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Prodloužení vlasů cena Praha — co se nejčastěji ptáte
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                q: 'Kolik stojí prodloužení vlasů keratinem Praha?',
                a: 'Nasazení standart keratin 4 000 Kč (130 pramenů / 100 g, 31 Kč/pramen), korekce 4 500 Kč. Aplikace trvá 3–4 hodiny, korekce po 2,5–3 měsících. Cena vlasů se účtuje zvlášť.',
              },
              {
                q: 'Kolik stojí mikrokeratin prodloužení vlasů?',
                a: 'Mikrokeratin nasazení 5 000 Kč (230 pramenů / 100 g, 22 Kč/pramen), korekce 5 500 Kč. Menší diskrétní kapsle — neviditelná i při sepnutých vlasech. Šetrnější k vlastním vlasům než standart keratin.',
              },
              {
                q: 'Kolik stojí vlasové pásky?',
                a: 'Vlasové pásky (nanotapes, tapes, tape-in) — 55 Kč/spoj (2,8 cm) nebo 65 Kč/spoj (4 cm). Balení 10 spojů = 550 Kč aplikace. Cena vlasových pásků se účtuje zvlášť. Korekce po 1,5–2 měsících.',
              },
              {
                q: 'Kolik stojí nanotapes prodloužení vlasů Praha?',
                a: 'Nanotapes Praha — 55 Kč za 1 spoj (2 pásky, šíře 2,8 cm). 1 balení = 10 spojů. Posun 1,5–2 hod, korekce po 1,5–2 měsících. Cena vlasových pásků se účtuje zvlášť. Showroom Revoluční 8, Praha 1.',
              },
              {
                q: 'Kolik stojí vlasové tresy?',
                a: 'Posun vlasových tresů 3 800 Kč. Prvotní nasazení individuálně na konzultaci. Tresy vyrábíme na zakázku — výroba 14 pracovních dní. Cena samotných tresů se účtuje zvlášť.',
              },
              {
                q: 'Kolik stojí weft prodloužení vlasů Praha?',
                a: 'Weft prodloužení vlasů Praha — posun tresů 3 800 Kč, showroom Revoluční 8, Praha 1. Aplikace cca 2,5 hod, korekce po 2–3 měsících. Nasazení individuálně po konzultaci. Cena tresů zvlášť.',
              },
              {
                q: 'Kolik stojí hollywoodské prodloužení vlasů Praha?',
                a: 'Hollywoodské prodloužení (weft, vlasové tresy) — posun 3 800 Kč, Praha 1. Ručně šité tresy přišívané na copánky bez lepidla a tepla. Nasazení na konzultaci, aplikace 2,5 hod, korekce po 2–3 měsících.',
              },
              {
                q: 'Jaký je rozdíl mezi nanotapes a tape-in?',
                a: 'Nanotapes a tape-in jsou stejná metoda, liší se šíří pásku: nanotapes 2,8 cm (55 Kč/spoj), tape-in 4 cm (65 Kč/spoj). Obě jsou sendvičový spoj bez chemie a tepla.',
              },
              {
                q: 'Jaký je rozdíl mezi keratinovým a mikrokeratinovým prodloužením vlasů?',
                a: 'Standart keratin — větší kapsle, 130 pramenů / 100 g, nasazení 4 000 Kč. Mikrokeratin — menší kapsle, 230 pramenů / 100 g, nasazení 5 000 Kč. Mikrokeratin je diskrétnější a šetrnější k vlastním vlasům.',
              },
              {
                q: 'Zahrnuje cena aplikace i vlasy?',
                a: 'Ne — cena aplikace a cena vlasů se vždy účtují zvlášť. Vlasy si nakonfigurujete v e-shopu dle gramáže, délky a kvality.',
              },
              {
                q: 'Mohu si koupit vlasy bez aplikace?',
                a: 'Ano — keratinové pramínky, nanotapes / tape-in pásky i vlasové tresy prodáváme samostatně přes e-shop. Aplikaci si zajistíte u nás nebo u své kadeřnice.',
              },
              {
                q: 'Jak si objednat prodloužení vlasů v Praze?',
                a: 'Zavolejte na +420 728 722 880 nebo napište na Instagram @muzahair.cz. Showroom: Revoluční 8, Praha 1 — Po–Ne 10:00–20:00, pouze na objednání.',
              },
            ].map((item, i) => (
              <div key={i} className="py-6 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <h3 className="font-cormorant text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>{item.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--burgundy)' }} className="px-8 lg:px-20 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Konzultace zdarma</span>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
          </div>
          <h2 className="font-cormorant text-[clamp(24px,3vw,40px)] font-light mb-4" style={{ color: 'var(--ivory)' }}>
            Domluvte si konzultaci
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Zavolejte nám nebo napište na Instagram — vybereme metodu a vlasy přímo pro vás.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+420728722880"
              className="px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ background: 'var(--ivory)', color: 'var(--burgundy)' }}
            >
              +420 728 722 880
            </a>
            <a
              href="https://www.instagram.com/muzahair.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="border px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'var(--ivory)' }}
            >
              @muzahair.cz na Instagramu
            </a>
            <Link
              href="/vlasy-k-prodlouzeni"
              className="border px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'var(--ivory)' }}
            >
              Nakonfigurovat vlasy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
