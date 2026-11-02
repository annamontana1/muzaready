'use client';

import Link from 'next/link';
import AtelierHero from '@/components/home/AtelierHero';
import ShadeLadder, { CustomShadeBand } from '@/components/home/ShadeLadder';
import HairKinds from '@/components/home/HairKinds';
import FeaturedPieces from '@/components/home/FeaturedPieces';
import AtelierBand from '@/components/home/AtelierBand';
import WholesaleBand from '@/components/WholesaleBand';

// Časté dotazy: stejný text jde do stránky i do strukturovaných dat (FAQPage)
const FAQ = [
  {
    q: 'Kolik stojí prodloužení vlasů?',
    a: 'Cenu aplikace vám řekneme při osobní konzultaci, záleží na metodě, množství vlasů a stavu vašich vlastních vlasů. Prodloužení provádíme v našem partnerském salonu. Ceny samotných vlasů najdete v katalogu.',
  },
  {
    q: 'Musím přijet do Prahy, nebo si mohu vlasy objednat online?',
    a: 'Vlasy si objednáte online a doručíme je kamkoliv v ČR do 2 pracovních dní. Aplikaci provede vaše kadeřnice, nebo ji zajistíme v našem partnerském salonu. Odstín si můžete vybrat i osobně v našem showroomu v Praze.',
  },
  {
    q: 'Jaký je rozdíl mezi edicemi Standard, LUXE a Platinum?',
    a: 'Standard jsou kvalitní pravé vlasy pro každodenní nošení. LUXE mají větší hustotu, lesk a delší životnost. Platinum jsou ručně tříděné vlasy nejvyšší kvality.',
  },
  {
    q: 'Jaký je rozdíl mezi nanotapes a keratinem?',
    a: 'Nanotapes jsou vlasové pásky se sendvičovým spojem bez tepla, korekce po 1,5–2 měsících. Keratin jsou pramínky s keratinovou kapslí, korekce po 2,5–3 měsících. Pásky se aplikují rychleji, keratin drží déle.',
  },
  {
    q: 'Jak dlouho vydrží prodloužené vlasy?',
    a: 'Keratin 2,5–3 měsíce, nanotapes 1,5–2 měsíce, weft 2–3 měsíce do korekce. Hodně záleží na péči: šampon bez sulfátů, česání od konečků a ochrana před teplem.',
  },
  {
    q: 'Jsou vlasy pravé?',
    a: 'Ano, 100 % pravé lidské vlasy. Vyrábíme je sami od roku 2016 a barvíme ve vlastní barvírně v Praze. Nabízíme nebarvené panenské vlasy i profesionálně barvené blond odstíny.',
  },
];

const ACCESSORIES = [
  { name: 'Clip-in vlasy', href: '/pricesky-a-paruky/clip-in-vlasy' },
  { name: 'Ofiny clip-in', href: '/pricesky-a-paruky/ofiny-z-pravych-vlasu' },
  { name: 'Toupee / tupé', href: '/pricesky-a-paruky/toupee' },
  { name: 'Vlasové tresy', href: '/pricesky-a-paruky/vlasove-tresy' },
  { name: 'Pravé paruky', href: '/pricesky-a-paruky/prave-paruky' },
  { name: 'Clip-in culík', href: '/pricesky-a-paruky/clip-in-culik' },
];

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Mùza Hair',
    description: 'Český výrobce pravých vlasů k prodloužení od roku 2016. Vlastní barvírna v Praze, showroom Praha 1.',
    url: 'https://muzahair.cz',
    telephone: '+420728722880',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha 1',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0892,
      longitude: 14.4252,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '10:00', closes: '20:00' },
    ],
    sameAs: [
      'https://www.instagram.com/muzahair.cz',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="bg-white font-jost text-text-dark">

        {/* ─── HERO: ateliér + hlavní akce ─── */}
        <AtelierHero />

        {/* ─── VZORNÍK ODSTÍNŮ ─── */}
        <ShadeLadder />

        {/* ─── STŘEDOEVROPSKÉ / PANENSKÉ ─── */}
        <HairKinds />

        {/* ─── CULÍKY K ODESLÁNÍ ─── */}
        <FeaturedPieces />

        {/* ─── ODSTÍN NA MÍRU ─── */}
        <CustomShadeBand />

        {/* ─── PŘÍČESKY, PARUKY A DOPLŇKY ─── */}
        <section aria-labelledby="h-doplnky" className="bg-muza-cream">
          <div className="max-w-7xl mx-auto px-5 lg:px-12 py-12 lg:py-16">
            <h2 id="h-doplnky" className="font-cormorant font-light text-muza-ink text-[32px] leading-[1.08] lg:text-[44px]">
              Příčesky, paruky <em className="italic">a doplňky</em>
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {ACCESSORIES.map(({ name, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center h-11 px-5 rounded-full border border-muza-line bg-white text-sm text-text-dark hover:border-muza-ink transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── VELKOOBCHOD PRO SALONY ─── */}
        <WholesaleBand className="py-10" />

        {/* ─── ATELIÉR (o nás) ─── */}
        <AtelierBand />

        {/* ─── FAQ ─── */}
        <section aria-labelledby="h-faq" className="bg-muza-ivory py-14 lg:py-20 px-5 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 id="h-faq" className="font-cormorant font-light text-muza-ink text-[32px] leading-[1.08] lg:text-[44px] text-center mb-8">
              Časté <em className="italic">dotazy</em>
            </h2>
            <div className="space-y-2">
              {FAQ.map((item, i) => (
                <details key={i} className="group bg-white border border-muza-line rounded-2xl">
                  <summary className="px-5 py-4 cursor-pointer list-none flex justify-between items-center gap-4 text-base font-medium text-text-dark">
                    {item.q}
                    <span aria-hidden="true" className="text-xl font-light text-muza-ink flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-base leading-relaxed text-[#45302F]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ZÁVĚREČNÁ VÝZVA ─── */}
        <section className="bg-muza-cream py-16 lg:py-24 px-5 lg:px-12 text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 className="font-cormorant font-light text-muza-ink text-[36px] leading-[1.08] lg:text-[52px]">
              Najděte vlasy <em className="italic">pro váš styl</em>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#45302F]">
              Objednejte online s doručením do 48 hodin, nebo si odstín vyberte osobně v našem showroomu v Praze.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Prohlédnout katalog
              </Link>
              <Link
                href="/showroom"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:bg-muza-ink hover:text-muza-onink transition-colors"
              >
                Navštívit showroom
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
