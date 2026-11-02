import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

// Společná stránka „Prodloužení vlasů {město}“ ve schváleném stylu.
// Aplikace probíhá v našem partnerském salonu, přesná cena až na osobní konzultaci.

export interface CityData {
  slug: string;        // prodlouzeni-vlasu-kladno
  city: string;        // Kladno
  from: string;        // z Kladna
  km: number;          // vzdálenost do Prahy
  travel: string;      // 35 minut vlakem · 30 minut po D7 autem
  keywords: string[];
  local?: boolean;     // stránka pro samotnou Prahu (bez cesty a vzdálenosti)
}

const WA_LINK =
  'https://wa.me/420728722880?text=Dobr%C3%BD%20den%2C%20cht%C4%9Bla%20bych%20se%20objednat%20na%20aplikaci%20vlas%C5%AF.';

const METHODS = [
  { name: 'Keratin', desc: 'Keratinové a mikrokeratinové spoje, nejpřirozenější výsledek. Korekce po 3–4 měsících.' },
  { name: 'Nanotapes', desc: 'Tenké pásky bez tepla, šetrné k vlasům. Přelepují se po 6–10 týdnech.' },
  { name: 'Weft', desc: 'Přišitý tres pro maximální objem. Posun po 4–6 měsících.' },
];

const QUALITY = [
  { name: 'Standard', desc: 'Pevná struktura, skvělý poměr ceny a kvality.' },
  { name: 'Luxe', desc: 'Jemnější vlasy, nadýchaný objem a husté konce.' },
  { name: 'Platinum', desc: 'Panenské vlasy z výkupu v Česku a na Slovensku.' },
  { name: 'Baby Shades', desc: 'Nejjemnější světlé odstíny, prodávají se jako celý culík.' },
];

function faq(d: CityData) {
  const all = [
    {
      q: `Kde se dělá prodloužení vlasů pro klientky ${d.from}?`,
      a: `V našem partnerském salonu v Praze, ${d.km} km ${d.from}. Pracujeme jen na objednání, termín domluvíme tak, aby vám cesta vyšla.`,
    },
    {
      q: `Jak dlouho trvá cesta ${d.from} do Prahy?`,
      a: `Cesta ${d.from} do Prahy trvá ${d.travel.replace(' · ', ' nebo ')}. Samotná aplikace trvá 1,5–3 hodiny, počítejte tedy s výletem na půl dne.`,
    },
    {
      q: `Mohu si vlasy objednat online ${d.from}?`,
      a: 'Ano. Vlasy Standard, Luxe, Platinum i Baby Shades objednáte v e-shopu, doručíme do 48 hodin. Pokud si nejste jistá odstínem, napište nám na WhatsApp nebo Instagram a poradíme na dálku.',
    },
    {
      q: 'Kolik stojí prodloužení vlasů?',
      a: 'Cena se skládá z vlasů a aplikace. Přesnou cenu aplikace se dozvíte na osobní konzultaci, záleží na metodě, délce a množství vlasů.',
    },
    {
      q: 'Jaké metody prodloužení nabízíte?',
      a: 'Keratin (mikrokeratin), nanotapes a weft. Metodu vybereme společně na konzultaci podle vašich vlasů a životního stylu.',
    },
  ];
  if (!d.local) return all;
  return [
    { q: 'Kde se v Praze dělá prodloužení vlasů?', a: 'V našem partnerském salonu v Praze. Pracujeme jen na objednání, termín domluvíte přes WhatsApp nebo na +420 728 722 880.' },
    ...all.slice(2),
  ];
}

export function cityMetadata(d: CityData): Metadata {
  const url = `https://www.muzahair.cz/${d.slug}`;
  const description = `Prodloužení vlasů ${d.local ? d.city : `pro klientky ${d.from}`}: aplikace v našem partnerském salonu v Praze, pravé vlasy z vlastní barvírny. Přesná cena na osobní konzultaci.`;
  return {
    title: `Prodloužení vlasů ${d.city} | Pravé vlasy, keratin, nanotapes | Mùza Hair`,
    description,
    alternates: { canonical: url },
    keywords: d.keywords,
    openGraph: {
      title: `Prodloužení vlasů ${d.city} | Mùza Hair`,
      description,
      url,
      siteName: 'Mùza Hair',
      locale: 'cs_CZ',
      type: 'website',
    },
  };
}

export default function CityLanding({ data: d }: { data: CityData }) {
  const items = faq(d);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  const facts = [
    { k: 'Kde', v: 'Partnerský salon v Praze' },
    ...(d.local ? [] : [
      { k: `Cesta ${d.from}`, v: d.travel },
      { k: 'Vzdálenost', v: `přibližně ${d.km} km` },
    ]),
    { k: 'Objednání', v: 'WhatsApp nebo +420 728 722 880' },
    { k: 'Vlasy domů', v: 'doručení do 48 hodin' },
  ];

  return (
    <div className="bg-muza-cream text-text-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-5xl px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Prodloužení vlasů {d.city}</span>
        </nav>
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <h1 className="font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">
              {d.local ? `Prodloužení vlasů ${d.city}` : `Prodloužení vlasů pro klientky ${d.from}`}
            </h1>
            <p className="mt-5 text-base leading-relaxed max-w-xl">
              Vlasy vám prodloužíme v našem partnerském salonu v Praze.{d.local ? '' : ` Cesta ${d.from} trvá ${d.travel.split(' · ')[0]}.`}{' '}
              Vlasy z naší vlastní barvírny vám pošleme i domů, do 48 hodin.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={WA_LINK} target="_blank" rel="noopener"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity">
                Objednat se
              </a>
              <Link href="/katalog"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium">
                Vybrat vlasy
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[3/4] rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
              <Image src="/images/atelier/atelier-09.webp" alt="Prodloužení vlasů v partnerském salonu Mùza Hair" fill sizes="300px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <dl className="max-w-2xl">
          {facts.map((f, i) => (
            <div key={f.k} className={`flex justify-between gap-4 py-3 border-t border-muza-line ${i === facts.length - 1 ? 'border-b' : ''}`}>
              <dt className="text-sm text-[#45302F]">{f.k}</dt>
              <dd className="text-sm font-medium text-right">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-5xl px-4 py-14 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Metody prodloužení</h2>
            <ul className="mt-5">
              {METHODS.map((m) => (
                <li key={m.name} className="py-3 border-t border-muza-line">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-[#45302F] mt-0.5">{m.desc}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#45302F]">
              Přesnou cenu aplikace se dozvíte na osobní konzultaci.{' '}
              <Link href="/ceny-aplikaci" className="text-muza-ink underline underline-offset-4">Ceník aplikace</Link>
            </p>
          </div>
          <div>
            <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Čtyři edice vlasů</h2>
            <ul className="mt-5">
              {QUALITY.map((m) => (
                <li key={m.name} className="py-3 border-t border-muza-line">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-[#45302F] mt-0.5">{m.desc}</p>
                </li>
              ))}
            </ul>
            <Link href="/katalog" className="mt-4 inline-block text-sm text-muza-ink underline underline-offset-4">Prohlédnout katalog</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">{d.local ? 'Časté otázky' : `Otázky klientek ${d.from}`}</h2>
        <div className="mt-5">
          {items.map((i, n) => (
            <details key={n} className={`group py-4 border-t border-muza-line ${n === items.length - 1 ? 'border-b' : ''}`}>
              <summary className="flex justify-between gap-4 cursor-pointer list-none font-jost font-medium">
                {i.q}
                <span aria-hidden="true" className="text-muza-ink transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-[#45302F]">{i.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Zájem o prodloužení vlasů?</h2>
        <p className="mt-3 text-base text-[#45302F]">Napište nám, domluvíme konzultaci a termín v partnerském salonu.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={WA_LINK} target="_blank" rel="noopener"
            className="inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity">
            Napsat na WhatsApp
          </a>
          <a href="tel:+420728722880"
            className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium">
            +420 728 722 880
          </a>
        </div>
      </section>
    </div>
  );
}
