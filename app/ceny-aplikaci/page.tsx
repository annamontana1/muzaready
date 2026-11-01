import Link from 'next/link';
import { Metadata } from 'next';

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

// Vzhled podle schváleného e-shopu (návrh B3): krémová stránka, tenké vínové linky,
// tabulky údajů, velké tučné ceny a tlačítka do oblouku
const WA_LINK = `https://wa.me/420728722880?text=${encodeURIComponent('Dobrý den, chtěla bych se objednat na aplikaci vlasů.')}`;

const h2Class = 'font-cormorant text-[32px] lg:text-[40px] leading-[1.05] text-muza-ink';
const rowClass = 'flex items-start justify-between gap-4 py-3 border-t border-muza-line';
const dtClass = 'text-sm text-[#45302F]';
const ddClass = 'text-[15px] text-text-dark text-right';
const priceClass = 'font-jost font-semibold text-muza-ink tabular-nums';

function Rows({ rows }: { rows: { k: string; v: React.ReactNode }[] }) {
  return (
    <dl className="border-b border-muza-line">
      {rows.map((r) => (
        <div key={r.k} className={rowClass}>
          <dt className={dtClass}>{r.k}</dt>
          <dd className={ddClass}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function PriceCard({ name, price, note, rows }: { name: string; price: string; note?: string; rows: { k: string; v: React.ReactNode }[] }) {
  return (
    <div className="rounded-2xl border border-muza-ink bg-[#F7F3EE] p-4 lg:p-5">
      <div className="font-cormorant text-[24px] leading-tight text-muza-ink">{name}</div>
      <div className="mt-2 text-[13px] text-[#45302F]">Nasazení</div>
      <div className={`${priceClass} text-[30px] leading-none mt-1`}>{price}</div>
      {note && <div className="mt-1 text-[13px] text-[#45302F]">{note}</div>}
      <dl className="mt-3">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-3 py-2.5 border-t border-muza-line">
            <dt className="text-[13px] text-[#45302F]">{r.k}</dt>
            <dd className="text-[15px] text-text-dark text-right">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-5 inline-flex items-center gap-1.5 text-[15px] text-muza-ink underline underline-offset-[3px]">
      {children}
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6" /></svg>
    </Link>
  );
}

const METHODS = [
  { id: 'keratin', label: 'Keratin' },
  { id: 'nanotapes', label: 'Pásky / Tape-in' },
  { id: 'weft', label: 'Weft / Tresy' },
  { id: 'kalkulace', label: 'Celková cena' },
  { id: 'srovnani', label: 'Srovnání' },
  { id: 'dotazy', label: 'Časté dotazy' },
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

      <div className="bg-muza-ivory text-text-dark">
        {/* Úvod */}
        <section className="px-4 lg:px-8 pt-6 lg:pt-12">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Drobečková navigace" className="text-[13px] text-[#45302F] flex gap-2">
              <Link href="/" className="underline underline-offset-2">Domů</Link><span aria-hidden="true">/</span><span>Ceník aplikace</span>
            </nav>
            <h1 className="mt-4 font-cormorant text-[40px] lg:text-[56px] leading-[1.02] text-muza-ink">Ceník prodlužování vlasů Praha</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#45302F]">
              Keratin, mikrokeratin, nanotapes (tape-in) a weft (hollywoodské prodloužení). Ceny jsou za <b className="font-semibold text-text-dark">aplikaci (práci)</b>,
              vlasy se účtují zvlášť a vyberete si je v <Link href="/katalog" className="text-muza-ink underline underline-offset-2">e-shopu</Link>.
            </p>

            {/* Showroom a objednání */}
            <div className="mt-6 rounded-2xl border border-muza-ink bg-[#F7F3EE] p-4 lg:p-5">
              <div className="font-cormorant text-[24px] leading-tight text-muza-ink">Aplikace jen v showroomu, na objednání</div>
              <Rows rows={[
                { k: 'Adresa', v: <b className="font-semibold">Revoluční 8, Praha 1</b> },
                { k: 'Otevřeno', v: 'Po–Ne 10:00–20:00' },
                { k: 'Telefon', v: <a href="tel:+420728722880" className="text-muza-ink underline underline-offset-2">+420 728 722 880</a> },
              ]} />
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <a href={WA_LINK} target="_blank" rel="noopener"
                  className="h-[50px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium flex items-center justify-center hover:opacity-90">Objednat se</a>
                <a href="tel:+420728722880"
                  className="h-[50px] rounded-full border border-muza-ink text-muza-ink text-sm font-medium flex items-center justify-center">Zavolat</a>
              </div>
            </div>

            {/* Rychlé skoky na metody */}
            <nav aria-label="Metody" className="mt-6 -mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {METHODS.map((m) => (
                <a key={m.id} href={`#${m.id}`} className="flex-none h-11 px-4 rounded-full bg-muza-mocha text-text-dark text-sm flex items-center hover:bg-[#D3C6B9]">{m.label}</a>
              ))}
            </nav>
          </div>
        </section>

        {/* Keratin */}
        <section id="keratin" className="px-4 lg:px-8 pt-12 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Keratin a mikrokeratin</h2>
            <p className="mt-2 text-[15px] text-[#45302F]">Keratinové pramínky · aplikace 3–4 hodiny · korekce po 2,5–3 měsících</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <PriceCard name="Standart keratin" price="4 000 Kč" note="31 Kč / pramen"
                rows={[{ k: 'Korekce / posun', v: <><b className="font-semibold">4 500 Kč</b> · 35 Kč / pramen</> }, { k: 'Pramenů / 100 g', v: '130' }]} />
              <PriceCard name="Mikrokeratin" price="5 000 Kč" note="22 Kč / pramen"
                rows={[{ k: 'Korekce / posun', v: <><b className="font-semibold">5 500 Kč</b> · 24 Kč / pramen</> }, { k: 'Pramenů / 100 g', v: '230' }]} />
            </div>
            <p className="mt-3 text-[14px] text-[#45302F]">Ceny jsou za 100 g vlasů. Cena samotných vlasů se účtuje zvlášť podle gramáže a délky.</p>
            <dl className="mt-5 border-b border-muza-line">
              {[
                { k: 'Standart keratin', v: 'Větší kapsle, robustnější spoj. Vhodný pro silnější vlasy. Při sepnutých vlasech může být kapsle lehce viditelná.' },
                { k: 'Mikrokeratin', v: 'Menší, diskrétnější kapsle, neviditelná i při sepnutých vlasech. Šetrnější k vlastním vlasům. Více pramenů = přirozenější výsledek.' },
              ].map((r) => (
                <div key={r.k} className="py-3 border-t border-muza-line">
                  <dt className="text-[15px] font-medium text-text-dark">{r.k}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#45302F]">{r.v}</dd>
                </div>
              ))}
            </dl>
            <MoreLink href="/metody-zakonceni/vlasy-na-keratin">Více o keratinové metodě</MoreLink>
          </div>
        </section>

        {/* Pásky */}
        <section id="nanotapes" className="px-4 lg:px-8 pt-14 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Vlasové pásky · Nanotapes · Tape-in</h2>
            <p className="mt-2 text-[15px] text-[#45302F]">Bez tepla a chemie · sendvičový spoj · korekce po 1,5–2 měsících</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#45302F]">
              <b className="font-semibold text-text-dark">Nanotapes</b> a <b className="font-semibold text-text-dark">tape-in</b> jsou stejná metoda, liší se jen šíří pásku: 2,8 cm (nanotapes) a 4 cm (tape-in).
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-muza-ink bg-[#F7F3EE] p-4 lg:p-5">
                <div className="font-cormorant text-[24px] leading-tight text-muza-ink">Ceník</div>
                <Rows rows={[
                  { k: 'Nanotapes 2,8 cm, 1 spoj (2 pásky)', v: <span className={`${priceClass} text-[18px]`}>55 Kč</span> },
                  { k: 'Tape-in 4 cm, 1 spoj (2 pásky)', v: <span className={`${priceClass} text-[18px]`}>65 Kč</span> },
                  { k: 'Balení 10 spojů (2,8 cm)', v: <span className={`${priceClass} text-[18px]`}>550 Kč</span> },
                  { k: 'Posun / korekce', v: 'podle počtu spojů' },
                ]} />
                <p className="mt-3 text-[14px] text-[#45302F]">Cena vlasových pásků se účtuje zvlášť.</p>
              </div>
              <div className="rounded-2xl border border-muza-line bg-[#F7F3EE] p-4 lg:p-5">
                <div className="font-cormorant text-[24px] leading-tight text-muza-ink">Parametry</div>
                <Rows rows={[
                  { k: 'Délka posunu', v: '1,5–2 hodiny' },
                  { k: 'Korekce', v: 'každých 1,5–2 měsíce' },
                  { k: 'Chemie / teplo', v: 'bez chemie, bez tepla' },
                  { k: 'Spoj', v: 'neviditelný sendvičový' },
                ]} />
              </div>
            </div>
            <MoreLink href="/metody-zakonceni/vlasove-pasky-tape-in">Více o páskách (nanotapes / tape-in)</MoreLink>
          </div>
        </section>

        {/* Weft */}
        <section id="weft" className="px-4 lg:px-8 pt-14 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Vlasové tresy · Weft · hollywoodské prodloužení</h2>
            <p className="mt-2 text-[15px] text-[#45302F]">Ručně šité tresy na copánky · bez lepidla a tepla · korekce po 2–3 měsících</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-muza-ink bg-[#F7F3EE] p-4 lg:p-5">
                <div className="font-cormorant text-[24px] leading-tight text-muza-ink">Ceník</div>
                <div className="mt-2 text-[13px] text-[#45302F]">Posun / korekce tresů</div>
                <div className={`${priceClass} text-[30px] leading-none mt-1`}>3 800 Kč</div>
                <Rows rows={[{ k: 'Prvotní nasazení', v: 'na konzultaci' }]} />
                <p className="mt-3 text-[14px] text-[#45302F]">Cena tresů se účtuje zvlášť. Tresy vyrábíme na zakázku, výroba 14 pracovních dní.</p>
              </div>
              <div className="rounded-2xl border border-muza-line bg-[#F7F3EE] p-4 lg:p-5">
                <div className="font-cormorant text-[24px] leading-tight text-muza-ink">Parametry</div>
                <Rows rows={[
                  { k: 'Délka aplikace', v: 'cca 2,5 hodiny' },
                  { k: 'Korekce', v: 'každé 2–3 měsíce' },
                  { k: 'Chemie / lepidlo / teplo', v: 'bez chemie, lepidla i tepla' },
                  { k: 'Šetrnost', v: 'šetrné k vlastním vlasům' },
                ]} />
              </div>
            </div>
            <MoreLink href="/metody-zakonceni/vlasove-tresy">Více o hollywoodském prodloužení (weft)</MoreLink>
          </div>
        </section>

        {/* Celková cena */}
        <section id="kalkulace" className="px-4 lg:px-8 pt-14 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Kolik stojí prodloužení celkem?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#45302F]">
              Cena se skládá ze <b className="font-semibold text-text-dark">dvou částí</b>: vlasy (gramáž × délka × kvalita) a aplikace. Například:
            </p>
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {[
                { title: 'Keratin standart', lines: [['100 g vlasů, 50 cm', '~ 5 800 Kč*'], ['Aplikace', '4 000 Kč']], total: '~ 9 800 Kč' },
                { title: 'Nanotapes 2,8 cm', lines: [['1 balení, 10 spojů', '~ 1 600 Kč*'], ['Aplikace (10 spojů)', '550 Kč']], total: '~ 2 150 Kč' },
                { title: 'Weft (hollywoodské)', lines: [['Sada tresů', 'na dotaz*'], ['Posun', '3 800 Kč']], total: 'nasazení na konzultaci' },
              ].map((ex) => (
                <div key={ex.title} className="rounded-2xl border border-muza-line bg-[#F7F3EE] p-4">
                  <div className="font-cormorant text-[22px] leading-tight text-muza-ink">{ex.title}</div>
                  <dl className="mt-2">
                    {ex.lines.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 py-2 border-t border-muza-line text-[14px]">
                        <dt className="text-[#45302F]">{k}</dt><dd className="text-text-dark">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-2 pt-2.5 border-t border-muza-ink flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-[#45302F]">Celkem</span>
                    <span className={`${priceClass} text-[20px] text-right`}>{ex.total}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[14px] text-[#45302F]">
              * Ceny vlasů jsou orientační a závisí na gramáži, délce a kvalitě. Přesnou cenu uvidíte u každého culíku v <Link href="/katalog" className="text-muza-ink underline underline-offset-2">e-shopu</Link>.
            </p>
          </div>
        </section>

        {/* Srovnání metod */}
        <section id="srovnani" className="px-4 lg:px-8 pt-14 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Srovnání metod</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Standart keratin', price: '4 000 Kč / 100 g', correction: 'po 2,5–3 měsících', duration: '3–4 hodiny', gentle: 3 },
                { name: 'Mikrokeratin', price: '5 000 Kč / 100 g', correction: 'po 2,5–3 měsících', duration: '3–4 hodiny', gentle: 4 },
                { name: 'Nanotapes / Tape-in', price: '55–65 Kč / spoj', correction: 'po 1,5–2 měsících', duration: '1,5–2 hodiny', gentle: 4 },
                { name: 'Weft (hollywoodské)', price: 'posun 3 800 Kč', correction: 'po 2–3 měsících', duration: 'cca 2,5 hodiny', gentle: 4 },
              ].map((m) => (
                <div key={m.name} className="rounded-2xl border border-muza-line bg-[#F7F3EE] p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-cormorant text-[22px] leading-tight text-muza-ink">{m.name}</span>
                    <span className={`${priceClass} text-[16px] text-right`}>{m.price}</span>
                  </div>
                  <Rows rows={[
                    { k: 'Korekce', v: m.correction },
                    { k: 'Délka aplikace', v: m.duration },
                    { k: 'Šetrnost', v: <span aria-label={`${m.gentle} ze 4`} className="tracking-[0.15em] text-muza-ink">{'●'.repeat(m.gentle)}<span className="text-muza-mocha">{'●'.repeat(4 - m.gentle)}</span></span> },
                  ]} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jak vybrat */}
        <section className="px-4 lg:px-8 pt-14">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Jak vybrat metodu?</h2>
            <dl className="mt-4 border-b border-muza-line">
              {[
                { q: 'Chcete diskrétní pramínky?', a: 'Mikrokeratin: 230 pramenů / 100 g, neviditelný i při sepnutých vlasech.' },
                { q: 'Chcete nejrychlejší aplikaci?', a: 'Nanotapes / tape-in: nasazení 1,5–2 hodiny, ideální při kratším cyklu korekcí.' },
                { q: 'Chcete maximální objem bez chemie?', a: 'Weft (hollywoodské prodloužení): tresy přišívané na copánky, bez lepidla a tepla.' },
                { q: 'Nevíte si rady?', a: 'Domluvte si konzultaci, zdarma poradíme, která metoda sedí vašim vlasům.' },
              ].map((r) => (
                <div key={r.q} className="py-3.5 border-t border-muza-line">
                  <dt className="text-[16px] font-medium text-text-dark">{r.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#45302F]">{r.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Časté dotazy */}
        <section id="dotazy" className="px-4 lg:px-8 pt-14 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className={h2Class}>Časté dotazy k cenám</h2>
            <div className="mt-4 border-b border-muza-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-t border-muza-line">
                  <summary className="flex items-center justify-between gap-3 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[16px] font-medium text-text-dark">{f.q}</h3>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#330D0D" strokeWidth="1.5" className="flex-none transition-transform duration-200 group-open:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
                  </summary>
                  <p className="pb-4 text-[15px] leading-relaxed text-[#45302F]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Objednání */}
        <section className="px-4 lg:px-8 py-14">
          <div className="max-w-4xl mx-auto rounded-3xl bg-muza-ink text-muza-onink px-6 py-8 lg:px-12 lg:py-10 text-center">
            <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.05]">Domluvte si konzultaci zdarma</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#EADCC8] max-w-xl mx-auto">
              Napište nám nebo zavolejte. Společně vybereme metodu i vlasy přímo pro vás.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener"
                className="h-[52px] px-7 rounded-full bg-[#F7F3EE] text-muza-ink text-sm font-medium flex items-center justify-center hover:bg-white">Napsat na WhatsApp</a>
              <a href="tel:+420728722880"
                className="h-[52px] px-7 rounded-full border border-[#EADCC8] text-muza-onink text-sm font-medium flex items-center justify-center">+420 728 722 880</a>
              <Link href="/katalog"
                className="h-[52px] px-7 rounded-full border border-[#EADCC8] text-muza-onink text-sm font-medium flex items-center justify-center">Vybrat vlasy</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
