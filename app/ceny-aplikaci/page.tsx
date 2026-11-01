import Link from 'next/link';
import { Metadata } from 'next';
import PriceTabs, { type PriceMethod } from './PriceTabs';

export const metadata: Metadata = {
  title: 'Ceník prodloužení vlasů Praha 2025 | Múza Hair',
  description: 'Keratin od 4 000 Kč, mikrokeratin od 5 000 Kč, nanotapes 55 Kč/spoj, weft 3 800 Kč. Aplikace prodloužení vlasů Praha 1, showroom Revoluční 8.',
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
    title: 'Ceník prodloužení vlasů Praha 2025 | Múza Hair',
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

// Ceník podle návrhu C: krátká odpověď nahoře, jedna tabulka v záložkách, rychlé odpovědi.
// Méně textu na stránce, ceny i dotazy zůstávají v HTML a v datech pro Google (JSON-LD výše).
const WA_LINK = `https://wa.me/420728722880?text=${encodeURIComponent('Dobrý den, chtěla bych se objednat na aplikaci vlasů.')}`;

const METHODS: PriceMethod[] = [
  { id: 'keratin', name: 'Keratin', sub: '130 pramenů / 100 g · aplikace 3–4 hodiny',
    rows: [['Nasazení (100 g)', '4 000 Kč'], ['Korekce / posun', '4 500 Kč'], ['Cena za pramen', '31 Kč'], ['Korekce za', '2,5–3 měsíce']],
    more: { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Více o keratinu' } },
  { id: 'mikrokeratin', name: 'Mikrokeratin', sub: '230 pramenů / 100 g · nejdiskrétnější spoj',
    rows: [['Nasazení (100 g)', '5 000 Kč'], ['Korekce / posun', '5 500 Kč'], ['Cena za pramen', '22 Kč'], ['Korekce za', '2,5–3 měsíce']],
    more: { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Více o mikrokeratinu' } },
  { id: 'pasky', name: 'Pásky (tape-in)', sub: 'Nanotapes 2,8 cm a tape-in 4 cm · bez tepla a chemie',
    rows: [['Spoj 2,8 cm (nanotapes)', '55 Kč'], ['Spoj 4 cm (tape-in)', '65 Kč'], ['Balení 10 spojů', '550 Kč'], ['Korekce za', '1,5–2 měsíce']],
    more: { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Více o páskách' } },
  { id: 'weft', name: 'Weft (tresy)', sub: 'Hollywoodské prodloužení · bez lepidla a tepla',
    rows: [['Posun / korekce', '3 800 Kč'], ['Prvotní nasazení', 'na konzultaci'], ['Výroba tresů', '14 dní'], ['Korekce za', '2–3 měsíce']],
    more: { href: '/metody-zakonceni/vlasove-tresy', label: 'Více o weftu' } },
];

const QUICK = [
  { q: 'Kolik stojí prodloužení vlasů v Praze?', a: 'Orientační ceny aplikací najdete v ceníku výše. Přesnou cenu vám řekneme na osobní konzultaci, vlasy se platí zvlášť.' },
  { q: 'Zahrnuje cena i vlasy?', a: 'Ne. Vlasy si vyberete v e-shopu podle odstínu, délky a gramáže.' },
  { q: 'Jak často na korekci?', a: 'Pásky po 1,5–2 měsících, keratin po 2,5–3 měsících, weft po 2–3 měsících.' },
  { q: 'Kde se aplikuje?', a: 'V našem partnerském salonu. Termín domluvíme přes WhatsApp.' },
];

const FAQ = [
  { q: 'Kolik stojí prodloužení vlasů keratinem Praha?', a: 'Nasazení standart keratin 4 000 Kč (130 pramenů / 100 g, 31 Kč/pramen), korekce 4 500 Kč. Aplikace trvá 3–4 hodiny, korekce po 2,5–3 měsících. Cena vlasů se účtuje zvlášť.' },
  { q: 'Kolik stojí mikrokeratin prodloužení vlasů?', a: 'Mikrokeratin nasazení 5 000 Kč (230 pramenů / 100 g, 22 Kč/pramen), korekce 5 500 Kč. Menší diskrétní kapsle, neviditelná i při sepnutých vlasech. Šetrnější k vlastním vlasům než standart keratin.' },
  { q: 'Kolik stojí vlasové pásky?', a: 'Vlasové pásky (nanotapes, tapes, tape-in) 55 Kč/spoj (2,8 cm) nebo 65 Kč/spoj (4 cm). Balení 10 spojů = 550 Kč aplikace. Cena vlasových pásků se účtuje zvlášť. Korekce po 1,5–2 měsících.' },
  { q: 'Kolik stojí nanotapes prodloužení vlasů Praha?', a: 'Nanotapes Praha 55 Kč za 1 spoj (2 pásky, šíře 2,8 cm). 1 balení = 10 spojů. Posun 1,5–2 hod, korekce po 1,5–2 měsících. Cena vlasových pásků se účtuje zvlášť. Showroom Revoluční 8, Praha 1.' },
  { q: 'Kolik stojí vlasové tresy?', a: 'Posun vlasových tresů 3 800 Kč. Prvotní nasazení individuálně na konzultaci. Tresy vyrábíme na zakázku, výroba 14 pracovních dní. Cena samotných tresů se účtuje zvlášť.' },
  { q: 'Kolik stojí weft prodloužení vlasů Praha?', a: 'Weft prodloužení vlasů Praha: posun tresů 3 800 Kč, showroom Revoluční 8, Praha 1. Aplikace cca 2,5 hod, korekce po 2–3 měsících. Nasazení individuálně po konzultaci. Cena tresů zvlášť.' },
  { q: 'Kolik stojí hollywoodské prodloužení vlasů Praha?', a: 'Hollywoodské prodloužení (weft, vlasové tresy): posun 3 800 Kč, Praha 1. Ručně šité tresy přišívané na copánky bez lepidla a tepla. Nasazení na konzultaci, aplikace 2,5 hod, korekce po 2–3 měsících.' },
  { q: 'Jaký je rozdíl mezi nanotapes a tape-in?', a: 'Nanotapes a tape-in jsou stejná metoda, liší se šíří pásku: nanotapes 2,8 cm (55 Kč/spoj), tape-in 4 cm (65 Kč/spoj). Obě jsou sendvičový spoj bez chemie a tepla.' },
  { q: 'Jaký je rozdíl mezi keratinovým a mikrokeratinovým prodloužením vlasů?', a: 'Standart keratin: větší kapsle, 130 pramenů / 100 g, nasazení 4 000 Kč. Mikrokeratin: menší kapsle, 230 pramenů / 100 g, nasazení 5 000 Kč. Mikrokeratin je diskrétnější a šetrnější k vlastním vlasům.' },
  { q: 'Zahrnuje cena aplikace i vlasy?', a: 'Ne, cena aplikace a cena vlasů se vždy účtují zvlášť. Vlasy si vyberete v e-shopu podle odstínu, délky a gramáže.' },
  { q: 'Mohu si koupit vlasy bez aplikace?', a: 'Ano, keratinové pramínky, nanotapes / tape-in pásky i vlasové tresy prodáváme samostatně přes e-shop. Aplikaci si zajistíte u nás nebo u své kadeřnice.' },
  { q: 'Jak si objednat prodloužení vlasů v Praze?', a: 'Zavolejte na +420 728 722 880 nebo napište na WhatsApp či Instagram @muzahair.cz. Showroom: Revoluční 8, Praha 1, Po–Ne 10:00–20:00, pouze na objednání.' },
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

      <div className="bg-muza-ivory text-text-dark pb-6">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-6 lg:pt-12">
          <nav aria-label="Drobečková navigace" className="text-[13px] text-[#45302F] flex gap-2">
            <Link href="/" className="underline underline-offset-2">Domů</Link><span aria-hidden="true">/</span><span>Ceník aplikace</span>
          </nav>
          <h1 className="mt-4 font-cormorant text-[40px] lg:text-[56px] leading-[1.02] text-muza-ink">Ceník aplikace vlasů Praha</h1>

          {/* Úvod: přesná cena na konzultaci, aplikace v partnerském salonu */}
          <p className="mt-4 border-l-[3px] border-muza-ink bg-[#F7F3EE] rounded-r-xl px-4 py-3 text-[17px] leading-relaxed">
            <b className="font-semibold">Přesnou cenu aplikace se dozvíte na osobní konzultaci.</b> Prodloužit vlasy můžete v našem
            partnerském salonu, ceny aplikací najdete pod tímto textem.
          </p>

          <div className="mt-6"><PriceTabs methods={METHODS} /></div>

          <a href={WA_LINK} target="_blank" rel="noopener"
            className="mt-4 h-[52px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium flex items-center justify-center hover:opacity-90">
            Objednat se na WhatsAppu
          </a>

          {/* Rychlé odpovědi */}
          <section aria-labelledby="h-rychle" className="mt-10">
            <h2 id="h-rychle" className="font-cormorant text-[30px] leading-tight text-muza-ink">Rychlé odpovědi</h2>
            <dl className="mt-3 border-b border-muza-line">
              {QUICK.map((r) => (
                <div key={r.q} className="py-3.5 border-t border-muza-line">
                  <dt className="text-[16px] font-medium">{r.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#45302F]">{r.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Další dotazy schované, ale v HTML */}
          <section aria-labelledby="h-dalsi" className="mt-8">
            <h2 id="h-dalsi" className="font-cormorant text-[26px] leading-tight text-muza-ink">Další dotazy k cenám</h2>
            <div className="mt-2 border-b border-muza-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-t border-muza-line">
                  <summary className="flex items-center justify-between gap-3 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="font-jost text-[15px] font-medium">{f.q}</h3>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#330D0D" strokeWidth="1.5" className="flex-none transition-transform duration-200 group-open:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
                  </summary>
                  <p className="pb-3.5 text-[15px] leading-relaxed text-[#45302F]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Objednání */}
          <section className="mt-10 rounded-3xl bg-muza-ink text-muza-onink px-6 py-8 text-center">
            <h2 className="font-cormorant text-[32px] leading-[1.05]">Konzultace zdarma</h2>
            <p className="mt-2 text-[15px] text-[#EADCC8]">Showroom Revoluční 8, Praha 1 · Po–Ne 10:00–20:00, na objednání</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener"
                className="h-[52px] px-7 rounded-full bg-[#F7F3EE] text-muza-ink text-sm font-medium flex items-center justify-center hover:bg-white">Objednat se na WhatsAppu</a>
              <a href="tel:+420728722880"
                className="h-[52px] px-7 rounded-full border border-[#EADCC8] text-muza-onink text-sm font-medium flex items-center justify-center">+420 728 722 880</a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
