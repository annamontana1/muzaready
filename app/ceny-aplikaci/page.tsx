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

      <div className="py-12 bg-soft-cream min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <div className="text-sm text-text-mid mb-6">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            {' / '}
            <span className="text-burgundy">Ceník aplikace</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Ceník prodlužování vlasů Praha
            </h1>
            <p className="text-lg text-text-mid max-w-2xl mx-auto">
              Keratin · Mikrokeratin · Nanotapes (Tape-In) · Weft (Hollywoodské prodloužení)
            </p>
            <p className="text-sm text-text-soft mt-2 max-w-xl mx-auto">
              Ceny jsou za <strong>aplikaci (práci)</strong>. Cena vlasů se vždy účtuje zvlášť —{' '}
              <Link href="/vlasy-k-prodlouzeni" className="text-burgundy underline hover:opacity-75">
                nakonfigurujte si je v e-shopu
              </Link>.
            </p>
          </div>

          {/* Upozornění */}
          <div className="bg-ivory border-l-4 border-burgundy p-5 rounded-xl mb-10 text-sm text-text-mid">
            <p className="font-semibold text-text-dark mb-1">Aplikace pouze v showroomu na objednání — Praha 1</p>
            <span className="font-medium">Revoluční 8, Praha 1</span> · Po–Ne 10:00–20:00 ·{' '}
            <a href="tel:+420728722880" className="text-burgundy hover:underline">+420 728 722 880</a>
          </div>

          {/* ── KERATIN ── */}
          <section className="bg-white rounded-xl shadow-medium overflow-hidden mb-8" id="keratin">
            <div className="bg-burgundy px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <div>
                <h2 className="text-xl font-playfair text-white">Keratin / Mikrokeratin — prodloužení vlasů Praha</h2>
                <p className="text-xs text-white/70 mt-0.5">Keratinové pramínky · Aplikace 3–4 hod · Korekce po 2,5–3 měsících</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-burgundy/20">
                      <th className="text-left pb-3 text-text-soft font-medium w-1/3"></th>
                      <th className="text-center pb-3 font-playfair text-burgundy text-base">Standart keratin</th>
                      <th className="text-center pb-3 font-playfair text-burgundy text-base">Mikrokeratin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 text-text-soft">Pramenů / 100 g vlasů</td>
                      <td className="py-3 text-center font-medium text-text-dark">130 pramenů</td>
                      <td className="py-3 text-center font-medium text-text-dark">230 pramenů</td>
                    </tr>
                    <tr className="bg-ivory/50">
                      <td className="py-3 text-text-mid font-semibold">Nasazení + napramínkování</td>
                      <td className="py-3 text-center">
                        <span className="text-lg font-bold text-burgundy">4 000 Kč</span>
                        <span className="block text-xs text-text-soft mt-0.5">31 Kč / pramen</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-lg font-bold text-burgundy">5 000 Kč</span>
                        <span className="block text-xs text-text-soft mt-0.5">22 Kč / pramen</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-text-mid font-semibold">Korekce / posun vlasů</td>
                      <td className="py-3 text-center">
                        <span className="text-lg font-bold text-burgundy">4 500 Kč</span>
                        <span className="block text-xs text-text-soft mt-0.5">35 Kč / pramen</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-lg font-bold text-burgundy">5 500 Kč</span>
                        <span className="block text-xs text-text-soft mt-0.5">24 Kč / pramen</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-text-soft mt-4 italic">Ceny jsou uvedeny za 100 g vlasů. Cena samotných vlasů se účtuje zvlášť dle gramáže a délky.</p>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-soft-cream rounded-lg p-4 text-sm">
                  <p className="font-semibold text-text-dark mb-1">Standart keratin</p>
                  <p className="text-text-mid">Větší kapsle, robustnější spoj. Vhodný pro silnější vlasy. Při sepnutých vlasech může být kapsle lehce viditelná.</p>
                </div>
                <div className="bg-soft-cream rounded-lg p-4 text-sm">
                  <p className="font-semibold text-text-dark mb-1">Mikrokeratin</p>
                  <p className="text-text-mid">Menší, diskrétnější kapsle — neviditelná i při sepnutých vlasech. Šetrnější k vlastním vlasům. Více pramenů = přirozenější výsledek.</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-text-mid">
                <div className="flex items-center gap-2">
                  <span className="text-burgundy">⏱</span>
                  <span><span className="font-medium">Délka aplikace:</span> 3–4 hodiny</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-burgundy">🔄</span>
                  <span><span className="font-medium">Korekce:</span> po 2,5–3 měsících</span>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/metody-zakonceni/vlasy-na-keratin" className="text-sm text-burgundy font-semibold hover:underline">
                  Více o keratinové metodě →
                </Link>
              </div>
            </div>
          </section>

          {/* ── TAPE-IN / NANOTAPES ── */}
          <section className="bg-white rounded-xl shadow-medium overflow-hidden mb-8" id="nanotapes">
            <div className="bg-burgundy px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🩹</span>
              <div>
                <h2 className="text-xl font-playfair text-white">Vlasové pásky / Nanotapes / Tape-In — prodloužení vlasů Praha</h2>
                <p className="text-xs text-white/70 mt-0.5">Vlasové pásy bez tepla a chemie · Sendvičový spoj · Korekce po 1,5–2 měsících</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Nanotapes alias note */}
              <p className="text-xs text-text-soft italic mb-5">
                <strong className="text-text-soft">Nanotapes</strong> a <strong className="text-text-soft">tape-in</strong> jsou označení pro stejnou metodu vlasových pásků.
                Liší se pouze šíří pásku — 2,8 cm (nanotapes) vs 4 cm (standardní tape-in).
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-4">Ceník</p>
                  <div className="space-y-0 divide-y divide-gray-100">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">2,8 cm pásky — nanotapes (1 spoj = 2 pásky)</span>
                      <span className="text-lg font-bold text-burgundy ml-4">55 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">4 cm pásky — tape-in (1 spoj = 2 pásky)</span>
                      <span className="text-lg font-bold text-burgundy ml-4">65 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">Balení 10 spojů (2,8 cm)</span>
                      <span className="text-lg font-bold text-burgundy ml-4">550 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">Posun / korekce</span>
                      <span className="text-sm font-semibold text-text-mid ml-4">Dle počtu spojů</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-soft mt-3 italic">Cena vlasových pásků se účtuje zvlášť.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-4">Parametry</p>
                  <div className="space-y-3 text-sm text-text-mid">
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">⏱</span>
                      <span><span className="font-medium">Délka posunu:</span> 1,5–2 hodiny</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">🔄</span>
                      <span><span className="font-medium">Frekvence korekce:</span> každých 1,5–2 měsíce</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">✓</span>
                      <span>Bez chemie, bez tepla při posunu</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">✓</span>
                      <span>Neviditelný sendvičový spoj</span>
                    </div>
                  </div>
                  <Link href="/metody-zakonceni/vlasove-pasky-tape-in" className="inline-block mt-5 text-sm text-burgundy font-semibold hover:underline">
                    Více o nanotapes / tape-in metodě →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── WEFT / HOLLYWOODSKÉ PRODLOUŽENÍ ── */}
          <section className="bg-white rounded-xl shadow-medium overflow-hidden mb-10" id="weft">
            <div className="bg-burgundy px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🧵</span>
              <div>
                <h2 className="text-xl font-playfair text-white">Vlasové tresy / Weft — Hollywoodské prodloužení vlasů Praha</h2>
                <p className="text-xs text-white/70 mt-0.5">Ručně šité vlasové tresy přišívané na copánky · Bez lepidla a tepla · Korekce po 2–3 měsících</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-4">Ceník</p>
                  <div className="space-y-0 divide-y divide-gray-100">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">Posun / korekce tresů</span>
                      <span className="text-lg font-bold text-burgundy ml-4">3 800 Kč</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-text-mid">Prvotní nasazení</span>
                      <span className="text-sm font-semibold text-text-mid ml-4">Na dotaz</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-soft mt-3 italic">Cena vlasových tresů se účtuje zvlášť. Tresy vyrábíme na zakázku — výroba 14 pracovních dní.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-4">Parametry</p>
                  <div className="space-y-3 text-sm text-text-mid">
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">⏱</span>
                      <span><span className="font-medium">Délka aplikace:</span> cca 2,5 hodiny</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">🔄</span>
                      <span><span className="font-medium">Frekvence korekce:</span> každé 2–3 měsíce</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">✓</span>
                      <span>Bez chemie, bez lepidla, bez tepla</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-burgundy mt-0.5">✓</span>
                      <span>Šetrné k vlastním vlasům</span>
                    </div>
                  </div>
                  <Link href="/metody-zakonceni/vlasove-tresy" className="inline-block mt-5 text-sm text-burgundy font-semibold hover:underline">
                    Více o hollywoodském prodloužení (weft) →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Celková cena — vlasy + aplikace */}
          <section className="bg-ivory border border-burgundy/15 rounded-xl p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-3">Kolik stojí prodloužení vlasů celkem?</h2>
            <p className="text-sm text-text-mid mb-5 leading-relaxed">
              Výsledná cena se skládá ze <strong>dvou složek</strong>: ceny vlasů (gramáž × délka × kvalita) a ceny aplikace (výše). Například:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-warm-beige">
                <p className="font-semibold text-text-dark mb-2">Příklad: Keratin standart</p>
                <p className="text-text-mid">100 g vlasů 50 cm ~ 5 800 Kč*</p>
                <p className="text-text-mid">+ Aplikace 4 000 Kč</p>
                <p className="font-bold text-burgundy mt-2">= ~ 9 800 Kč celkem</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-warm-beige">
                <p className="font-semibold text-text-dark mb-2">Příklad: Nanotapes (2,8 cm)</p>
                <p className="text-text-mid">1 balení 10 spojů ~ 1 600 Kč*</p>
                <p className="text-text-mid">+ Aplikace 550 Kč (10 spojů)</p>
                <p className="font-bold text-burgundy mt-2">= ~ 2 150 Kč celkem</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-warm-beige">
                <p className="font-semibold text-text-dark mb-2">Příklad: Weft (hollywoodské)</p>
                <p className="text-text-mid">Sada tresů na dotaz*</p>
                <p className="text-text-mid">+ Posun 3 800 Kč</p>
                <p className="font-bold text-burgundy mt-2">Nasazení na konzultaci</p>
              </div>
            </div>
            <p className="text-xs text-text-soft mt-4 italic">* Ceny vlasů jsou orientační a závisí na gramáži, délce a zvolené kvalitě. Přesnou cenu zjistíte v{' '}
              <Link href="/vlasy-k-prodlouzeni" className="text-burgundy hover:underline">konfigurátoru vlasů</Link>.
            </p>
          </section>

          {/* Rychlé srovnání */}
          <section className="bg-white rounded-xl shadow-medium p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Srovnání metod prodloužení vlasů — Praha</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20 text-left">
                    <th className="pb-3 text-text-soft font-medium">Metoda</th>
                    <th className="pb-3 text-text-soft font-medium text-center">Cena aplikace</th>
                    <th className="pb-3 text-text-soft font-medium text-center">Korekce</th>
                    <th className="pb-3 text-text-soft font-medium text-center">Délka</th>
                    <th className="pb-3 text-text-soft font-medium text-center">Šetrnost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-medium text-text-dark">Standart keratin</td>
                    <td className="py-3 text-center text-burgundy font-semibold">4 000 Kč / 100g</td>
                    <td className="py-3 text-center text-text-mid">po 2,5–3 měs.</td>
                    <td className="py-3 text-center text-text-mid">3–4 hod</td>
                    <td className="py-3 text-center text-text-soft">●●●○</td>
                  </tr>
                  <tr className="bg-ivory/40">
                    <td className="py-3 font-medium text-text-dark">Mikrokeratin</td>
                    <td className="py-3 text-center text-burgundy font-semibold">5 000 Kč / 100g</td>
                    <td className="py-3 text-center text-text-mid">po 2,5–3 měs.</td>
                    <td className="py-3 text-center text-text-mid">3–4 hod</td>
                    <td className="py-3 text-center text-text-soft">●●●●</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-text-dark">Nanotapes / Tape-In</td>
                    <td className="py-3 text-center text-burgundy font-semibold">55–65 Kč / spoj</td>
                    <td className="py-3 text-center text-text-mid">po 1,5–2 měs.</td>
                    <td className="py-3 text-center text-text-mid">1,5–2 hod</td>
                    <td className="py-3 text-center text-text-soft">●●●●</td>
                  </tr>
                  <tr className="bg-ivory/40">
                    <td className="py-3 font-medium text-text-dark">Weft (Hollywoodské)</td>
                    <td className="py-3 text-center text-burgundy font-semibold">posun 3 800 Kč</td>
                    <td className="py-3 text-center text-text-mid">po 2–3 měs.</td>
                    <td className="py-3 text-center text-text-mid">cca 2,5 hod</td>
                    <td className="py-3 text-center text-text-soft">●●●●</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Jak vybrat metodu */}
          <section className="bg-white rounded-xl shadow-medium p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-5">Jak vybrat metodu prodloužení vlasů?</h2>
            <div className="grid md:grid-cols-2 gap-5 text-sm">
              <div className="border-l-4 border-burgundy/30 pl-4">
                <p className="font-semibold text-text-dark mb-1">Chcete diskrétní pramínky?</p>
                <p className="text-text-mid">Mikrokeratin — 230 pramenů / 100 g, neviditelný i při sepnutých vlasech.</p>
              </div>
              <div className="border-l-4 border-burgundy/30 pl-4">
                <p className="font-semibold text-text-dark mb-1">Chcete nejrychlejší aplikaci?</p>
                <p className="text-text-mid">Nanotapes / Tape-In — nasazení 1,5–2 hod, ideální při pravidelném zkracování cyklu.</p>
              </div>
              <div className="border-l-4 border-burgundy/30 pl-4">
                <p className="font-semibold text-text-dark mb-1">Chcete maximální objem bez chemie?</p>
                <p className="text-text-mid">Weft (hollywoodské prodloužení) — tresy přišívané na copánky, bez lepidla ani tepla.</p>
              </div>
              <div className="border-l-4 border-burgundy/30 pl-4">
                <p className="font-semibold text-text-dark mb-1">Nevíte si rady?</p>
                <p className="text-text-mid">Domluvte si konzultaci — zdarma poradíme, která metoda je vhodná pro vaše vlasy.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Časté dotazy — prodloužení vlasů cena Praha</h2>
            <div className="space-y-4">
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
              Zavolejte nám nebo napište na Instagram — vybereme metodu a vlasy přímo pro vás.
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
