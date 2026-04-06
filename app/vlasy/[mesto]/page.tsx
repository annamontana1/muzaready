import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MESTA, getMestoBySlug } from '@/lib/mesta';

interface Props {
  params: { mesto: string };
}

export async function generateStaticParams() {
  return MESTA.map((m) => ({ mesto: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mesto = getMestoBySlug(params.mesto);
  if (!mesto) return {};

  return {
    title: `Vlasy k prodloužení ${mesto.name} — keratinové pramínky, nanotapes, tresy | Múza Hair`,
    description: `Vlasy k prodloužení ${mesto.inCity} — objednávka online, doprava do ${mesto.name}. Keratinové pramínky, vlasové pásky nanotapes, vlasové tresy weft. Pravé vlasy, výroba Praha.`,
    alternates: { canonical: `https://muzahair.cz/vlasy/${mesto.slug}` },
    keywords: [
      `vlasy k prodloužení ${mesto.name}`,
      `vlasové pásky ${mesto.name}`,
      `nanotapes ${mesto.name}`,
      `keratinové pramínky ${mesto.name}`,
      `vlasové tresy ${mesto.name}`,
      `prodloužení vlasů ${mesto.name}`,
      `tape-in vlasy ${mesto.name}`,
      `weft vlasy ${mesto.name}`,
      `vlasy na prodloužení ${mesto.name} koupit`,
    ],
    openGraph: {
      title: `Vlasy k prodloužení ${mesto.name} | Múza Hair`,
      description: `Keratinové pramínky, nanotapes, vlasové tresy — objednávka online, doprava do ${mesto.name}. Pravé vlasy od českého výrobce.`,
      url: `https://muzahair.cz/vlasy/${mesto.slug}`,
      siteName: 'Múza Hair',
      locale: 'cs_CZ',
      type: 'website',
    },
  };
}

export default function MestoPage({ params }: Props) {
  const mesto = getMestoBySlug(params.mesto);
  if (!mesto) notFound();

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
        { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
        { '@type': 'ListItem', position: 3, name: mesto.name, item: `https://muzahair.cz/vlasy/${mesto.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Kde koupit vlasy k prodloužení ${mesto.inCity}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Vlasy k prodloužení ${mesto.inCity} objednáte online na muzahair.cz — keratinové pramínky, vlasové pásky nanotapes i vlasové tresy weft. Expedice do ${mesto.name} do 2 pracovních dnů. Aplikaci vlasů pak provede vaše kadeřnice nebo navštivte náš showroom v Praze.`,
          },
        },
        {
          '@type': 'Question',
          name: `Kolik stojí vlasové pásky ${mesto.inCity}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Vlasové pásky (nanotapes, tape-in) koupit online s doručením do ${mesto.name} — cena samotných pásků dle gramáže a délky, aplikace 55 Kč/spoj (2,8 cm) nebo 65 Kč/spoj (4 cm). Objednávka na muzahair.cz, doprava do ${mesto.name} poštou.`,
          },
        },
        {
          '@type': 'Question',
          name: `Kolik stojí vlasové tresy ${mesto.inCity}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Vlasové tresy (weft) na zakázku doručíme do ${mesto.name}. Výroba tresů 14 pracovních dní, cena dle gramáže a délky. Aplikaci provede vaše kadeřnice nebo navštivte showroom Múza Hair v Praze — Revoluční 8.`,
          },
        },
        {
          '@type': 'Question',
          name: `Kolik stojí prodloužení vlasů keratinem ${mesto.inCity}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Keratinové pramínky s doručením do ${mesto.name} — cena vlasů dle gramáže a délky. Aplikaci keratinu provede vaše kadeřnice. Pokud chcete aplikaci od nás: showroom Múza Hair Praha 1, Revoluční 8, z ${mesto.name} vlakem ${mesto.trainHours}.`,
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Vlasy k prodloužení — doručení do ${mesto.name}`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Keratinové pramínky',
          url: 'https://muzahair.cz/vlasy-k-prodlouzeni',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Vlasové pásky Nanotapes / Tape-In',
          url: 'https://muzahair.cz/metody-zakonceni/vlasove-pasky-tape-in',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Vlasové tresy Weft',
          url: 'https://muzahair.cz/metody-zakonceni/vlasove-tresy',
        },
      ],
    },
  ];

  const isNearPrague = mesto.distanceKm <= 120;

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
            <Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link>
            {' / '}
            <span className="text-burgundy">{mesto.name}</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-burgundy mb-2">{mesto.region}</p>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Vlasy k prodloužení {mesto.name}
            </h1>
            <p className="text-lg text-text-mid max-w-2xl leading-relaxed">
              Objednávka online — keratinové pramínky, vlasové pásky nanotapes a vlasové tresy weft
              s doručením přímo {mesto.inCity}. Pravé vlasy od českého výrobce z Prahy.
            </p>
          </div>

          {/* Doprava info */}
          <div className="bg-ivory border-l-4 border-burgundy p-5 rounded-xl mb-10 text-sm text-text-mid flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1">
              <p className="font-semibold text-text-dark mb-1">Doručení do {mesto.name}</p>
              Objednávka online · Doprava PPL / Zásilkovna · Expedice do 2 pracovních dní
            </div>
            {isNearPrague && (
              <div className="border-l border-burgundy/20 pl-4 text-xs text-text-soft">
                <span className="block font-medium text-text-mid">Osobní odběr Praha</span>
                Showroom Revoluční 8, Praha 1<br />
                Vlakem z {mesto.name}: <strong>{mesto.trainHours}</strong>
              </div>
            )}
          </div>

          {/* Produkty */}
          <h2 className="text-2xl font-playfair text-burgundy mb-6">
            Co si objednat z {mesto.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">

            {/* Keratin */}
            <div className="bg-white rounded-xl shadow-medium overflow-hidden flex flex-col">
              <div className="bg-burgundy px-5 py-4">
                <span className="text-xl">💎</span>
                <h3 className="font-playfair text-white text-lg mt-1">Keratinové pramínky</h3>
                <p className="text-xs text-white/70 mt-0.5">Standart · Mikrokeratin · Platinum</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="text-sm text-text-mid space-y-1.5 mb-4 flex-1">
                  <li>✓ 130–230 pramenů / 100 g</li>
                  <li>✓ Délky 40–70 cm</li>
                  <li>✓ Nebarvené i barvené odstíny</li>
                  <li>✓ Aplikuje kdekoliv vaše kadeřnice</li>
                </ul>
                <Link
                  href="/vlasy-k-prodlouzeni"
                  className="block text-center py-2.5 bg-burgundy text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Nakonfigurovat vlasy
                </Link>
              </div>
            </div>

            {/* Nanotapes */}
            <div className="bg-white rounded-xl shadow-medium overflow-hidden flex flex-col">
              <div className="bg-burgundy px-5 py-4">
                <span className="text-xl">🩹</span>
                <h3 className="font-playfair text-white text-lg mt-1">Vlasové pásky Nanotapes</h3>
                <p className="text-xs text-white/70 mt-0.5">Tape-In · 2,8 cm · 4 cm</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="text-sm text-text-mid space-y-1.5 mb-4 flex-1">
                  <li>✓ 10 spojů / balení</li>
                  <li>✓ Sendvičový spoj bez lepidla</li>
                  <li>✓ Korekce po 1,5–2 měsících</li>
                  <li>✓ Aplikace bez tepla a chemie</li>
                </ul>
                <Link
                  href="/metody-zakonceni/vlasove-pasky-tape-in"
                  className="block text-center py-2.5 bg-burgundy text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Zobrazit nanotapes
                </Link>
              </div>
            </div>

            {/* Tresy / Weft */}
            <div className="bg-white rounded-xl shadow-medium overflow-hidden flex flex-col">
              <div className="bg-burgundy px-5 py-4">
                <span className="text-xl">🧵</span>
                <h3 className="font-playfair text-white text-lg mt-1">Vlasové tresy Weft</h3>
                <p className="text-xs text-white/70 mt-0.5">Hollywoodské prodloužení</p>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <ul className="text-sm text-text-mid space-y-1.5 mb-4 flex-1">
                  <li>✓ Ručně šité na zakázku</li>
                  <li>✓ Bez lepidla, bez tepla</li>
                  <li>✓ Korekce po 2–3 měsících</li>
                  <li>✓ Výroba 14 pracovních dní</li>
                </ul>
                <Link
                  href="/metody-zakonceni/vlasove-tresy"
                  className="block text-center py-2.5 bg-burgundy text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Zobrazit tresy
                </Link>
              </div>
            </div>
          </div>

          {/* Jak to funguje */}
          <div className="bg-white rounded-xl shadow-medium p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Jak objednat vlasy s doručením {mesto.inCity}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="flex gap-3">
                <span className="text-2xl font-playfair text-burgundy/30 leading-none">1</span>
                <div>
                  <p className="font-semibold text-text-dark mb-1">Nakonfigurujte vlasy</p>
                  <p className="text-text-mid">Vyberte metodu, délku, gramáž a odstín v online konfigurátoru. Poradíme s výběrem.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl font-playfair text-burgundy/30 leading-none">2</span>
                <div>
                  <p className="font-semibold text-text-dark mb-1">Objednávka a výroba</p>
                  <p className="text-text-mid">Vlasové tresy vyrábíme na zakázku (14 dní). Pramínky a pásky expedujeme ihned ze skladu.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl font-playfair text-burgundy/30 leading-none">3</span>
                <div>
                  <p className="font-semibold text-text-dark mb-1">Doručení {mesto.inCity}</p>
                  <p className="text-text-mid">PPL nebo Zásilkovna přímo na vaši adresu. Aplikaci provede vaše kadeřnice.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ceny aplikace info */}
          <div className="bg-ivory border border-burgundy/15 rounded-xl p-6 mb-10 text-sm">
            <h2 className="font-playfair text-xl text-burgundy mb-3">Ceny aplikace vlasů</h2>
            <p className="text-text-mid mb-4">
              Aplikaci vlasů zajistí vaše kadeřnice {mesto.inCity}, nebo přijeďte do našeho showroomu v Praze
              {isNearPrague ? ` — z ${mesto.name} to je pouze ${mesto.trainHours} vlakem` : ''}.
              Orientační ceník aplikace:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-warm-beige">
                <p className="font-semibold text-text-dark text-xs uppercase tracking-wide mb-1">Keratin / Mikrokeratin</p>
                <p className="text-burgundy font-bold">od 4 000 Kč</p>
                <p className="text-text-soft text-xs">/ 100 g, Praha showroom</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-warm-beige">
                <p className="font-semibold text-text-dark text-xs uppercase tracking-wide mb-1">Nanotapes / Tape-In</p>
                <p className="text-burgundy font-bold">55 Kč / spoj</p>
                <p className="text-text-soft text-xs">Praha showroom</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-warm-beige">
                <p className="font-semibold text-text-dark text-xs uppercase tracking-wide mb-1">Weft (Hollywoodské)</p>
                <p className="text-burgundy font-bold">posun 3 800 Kč</p>
                <p className="text-text-soft text-xs">Praha showroom</p>
              </div>
            </div>
            <p className="mt-3">
              <Link href="/ceny-aplikaci" className="text-burgundy text-sm font-semibold hover:underline">
                Kompletní ceník aplikace →
              </Link>
            </p>
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-playfair text-burgundy mb-5">
              Časté dotazy — vlasy k prodloužení {mesto.name}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Kde koupit vlasy k prodloužení ${mesto.inCity}?`,
                  a: `Vlasy k prodloužení objednáte online na muzahair.cz a doručíme přímo ${mesto.inCity}. Na výběr: keratinové pramínky, vlasové pásky nanotapes a vlasové tresy weft. Pravé vlasy, vlastní barvírna, výroba Praha od roku 2016.`,
                },
                {
                  q: `Kolik stojí vlasové pásky ${mesto.inCity}?`,
                  a: `Vlasové pásky (nanotapes, tape-in) objednáte online — cena dle gramáže a délky. Aplikace: 55 Kč/spoj (2,8 cm) nebo 65 Kč/spoj (4 cm). Doručení ${mesto.inCity} do 2 pracovních dní.`,
                },
                {
                  q: `Kolik stojí vlasové tresy ${mesto.inCity}?`,
                  a: `Vlasové tresy (weft) vyrábíme na zakázku — výroba 14 pracovních dní, doručíme ${mesto.inCity}. Cena dle gramáže a délky. Aplikaci pak provede kadeřnice nebo přijeďte do Prahy.`,
                },
                {
                  q: `Musím přijet do Prahy na prodloužení vlasů?`,
                  a: `Ne — vlasy si objednáte online a doručíme ${mesto.inCity}. Aplikaci provede vaše kadeřnice. Pokud chcete aplikaci přímo od nás, showroom Múza Hair je na Revoluční 8, Praha 1${isNearPrague ? ` — z ${mesto.name} to je ${mesto.trainHours} vlakem` : ''}.`,
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-warm-beige rounded-xl p-5">
                  <p className="font-semibold text-text-dark mb-2">{item.q}</p>
                  <p className="text-sm text-text-mid leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ostatní města */}
          <section className="mb-10">
            <h2 className="text-lg font-playfair text-burgundy mb-4">Doručujeme po celé ČR</h2>
            <div className="flex flex-wrap gap-2">
              {MESTA.filter((m) => m.slug !== mesto.slug).map((m) => (
                <Link
                  key={m.slug}
                  href={`/vlasy/${m.slug}`}
                  className="px-3 py-1.5 bg-white border border-warm-beige rounded-lg text-sm text-text-mid hover:border-burgundy hover:text-burgundy transition"
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-ivory border border-burgundy/10 rounded-xl p-8 text-center">
            <p className="font-playfair text-2xl text-burgundy mb-2">
              Nakonfigurujte si vlasy online
            </p>
            <p className="text-text-soft text-sm mb-6">
              Vyberte délku, gramáž a odstín — doručíme {mesto.inCity} do 2 pracovních dní.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
              >
                Nakonfigurovat vlasy
              </Link>
              <a
                href="tel:+420728722880"
                className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
              >
                +420 728 722 880
              </a>
              <Link
                href="/ceny-aplikaci"
                className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
              >
                Ceník aplikace
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
