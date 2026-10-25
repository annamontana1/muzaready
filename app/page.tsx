'use client';

import Link from 'next/link';
import { blogArticles } from '@/lib/blog-articles';
import AtelierHero from '@/components/home/AtelierHero';
import ShadeLadder from '@/components/home/ShadeLadder';
import AtelierStrip from '@/components/home/AtelierStrip';

const StarIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--burgundy)' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kolik stojí prodloužení vlasů v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keratin od 4 000 Kč, mikrokeratin od 5 000 Kč (za 100 g vlasů). Nanotapes 55–65 Kč/spoj. Weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Kompletní ceník na stránce Ceny aplikace na muzahair.cz/ceny-aplikaci.',
        },
      },
      {
        '@type': 'Question',
        name: 'Musím přijet do Prahy, nebo si mohu vlasy objednat online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vlasy si objednáte online — Múza Hair doručí kamkoliv v ČR do 2 pracovních dní. Aplikaci pak provede vaše kadeřnice, nebo přijeďte do showroomu Revoluční 8, Praha 1.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi nanotapes a keratinem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes jsou vlasové pásky — sendvičový spoj bez tepla, korekce po 1,5–2 měsících. Keratin jsou pramínky přilepené keratinovou kapsulí, korekce po 2,5–3 měsících. Nanotapes jsou rychlejší na aplikaci, keratin drží déle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak dlouho vydrží prodloužené vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keratin vydrží 2,5–3 měsíce, nanotapes 1,5–2 měsíce, weft 2–3 měsíce do korekce. Životnost závisí na péči — vhodný šampon bez sulfátů, česání od konečků a ochrana před teplem výrazně prodlužují životnost.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jsou vlasy pravé?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — Múza Hair prodává 100 % pravé lidské vlasy. Vlastní barvírna v Praze, vlastní výroba od roku 2016. Nabízíme nebarvené panenské vlasy i profesionálně barvené blond odstíny.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi kolekcemi Standard, LUXE a Platinum Edition?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard jsou kvalitní pravé vlasy pro každodenní nošení. LUXE jsou prémiové slovanské vlasy s větší hustotou a delší životností. Platinum Edition jsou výjimečné panenské nebarvené vlasy nejvyšší kvality — ideální pro zákaznice vyžadující absolutně nejlepší výsledek.',
        },
      },
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: 'Múza Hair',
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
    priceRange: '4 000 Kč – 11 000 Kč',
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
    <div style={{ background: 'var(--white)' }}>

      {/* ─── HERO: ateliér na míru ─── */}
      <AtelierHero />

      {/* ─── ZÁKULISÍ: plynoucí pás fotek z ateliéru ─── */}
      <AtelierStrip />

      {/* ─── TRUST BAR ─── */}
      <div className="bg-white border-b py-7 px-6 md:px-12" style={{ borderColor: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-around items-center gap-6">
          {[
            { num: '8+', strong: 'Let zkušeností', sub: 'Dlouholeté know-how v oboru' },
            { num: '100%', strong: 'Pravé vlasy', sub: 'Žádné syntetické materiály' },
            { num: '500+', strong: 'Spokojených zákaznic', sub: '98 % doporučuje přátelům' },
            { num: '10', strong: 'Odstínů', sub: 'Od tmavě hnědé po ultra blond' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block w-px h-10" style={{ background: 'var(--beige-mid)' }} />}
              <span className="font-cormorant text-[32px] font-light leading-none" style={{ color: 'var(--burgundy)' }}>
                {item.num}
              </span>
              <div className="text-[12px] leading-[1.4] font-light" style={{ color: 'var(--text-soft)' }}>
                <strong className="block text-[13px] font-normal" style={{ color: 'var(--text-mid)' }}>{item.strong}</strong>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── VZORNÍK ODSTÍNŮ ─── */}
      <ShadeLadder />

      {/* ─── PRODUCTS ─── */}
      <section className="py-24 px-6 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-14">
            <div>
              <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--text-dark)' }}>
                Naše vlasy<br />k <em className="italic" style={{ color: 'var(--burgundy)' }}>prodloužení</em>
              </h2>
            </div>
            <Link href="/vlasy-k-prodlouzeni" className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-colors hover:text-burgundy hidden md:flex" style={{ color: 'var(--text-mid)' }}>
              Zobrazit vše →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--beige)' }}>
            {[
              {
                badge: 'Nejprodávanější',
                category: 'Panenské vlasy',
                name: 'Nebarvené panenské vlasy',
                desc: '100% přírodní bez chemického ošetření. Ideální pro přirozený vzhled.',
                prices: ['Standard od 6 900 Kč', 'LUXE od 8 900 Kč', 'Platinum od 10 900 Kč'],
                href: '/vlasy-k-prodlouzeni/nebarvene-panenske',
                gradient: 'linear-gradient(145deg, #D4C4B0, #BBA896)',
              },
              {
                badge: 'Prémiové',
                category: 'Barvené vlasy',
                name: 'Barvené blond vlasy',
                desc: 'Profesionálně odbarveno ve vlastní barvírně. Odstíny 5–10, bez žlutých tónů.',
                prices: ['Standard od 6 900 Kč', 'LUXE od 8 900 Kč', 'Platinum od 10 900 Kč'],
                href: '/vlasy-k-prodlouzeni/barvene-vlasy',
                gradient: 'linear-gradient(145deg, #E8D8B8, #CEB890)',
              },
              {
                badge: null,
                category: 'Vlasové pásky',
                name: 'Tape-In pásky',
                desc: 'Šetrná metoda sendvičového spoje. 6 kolekcí, kudrnaté pásky jako unikát.',
                prices: ['od 4 990 Kč'],
                href: '/metody-zakonceni/vlasove-pasky-tape-in',
                gradient: 'linear-gradient(145deg, #C8B8A0, #A89080)',
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="block bg-white group cursor-pointer overflow-hidden"
              >
                {/* Image area */}
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ background: card.gradient }}
                  />
                  {card.badge && (
                    <div
                      className="absolute top-5 left-5 text-[10px] tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-sm font-normal"
                      style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                    >
                      {card.badge}
                    </div>
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(74,21,32,0.08)' }}
                  >
                    <div
                      className="text-[11px] tracking-[0.12em] uppercase px-6 py-3 rounded-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                      style={{ background: 'var(--white)', color: 'var(--burgundy)' }}
                    >
                      Zobrazit kolekci
                    </div>
                  </div>
                </div>
                {/* Info area */}
                <div className="p-6 border-t" style={{ borderColor: 'var(--beige)' }}>
                  <div className="text-[10px] tracking-[0.16em] uppercase mb-1.5 font-normal" style={{ color: 'var(--text-soft)' }}>
                    {card.category}
                  </div>
                  <div className="font-cormorant text-[20px] font-normal mb-1.5 leading-[1.2]" style={{ color: 'var(--text-dark)' }}>
                    {card.name}
                  </div>
                  <div className="text-[13px] leading-[1.6] mb-4 font-light" style={{ color: 'var(--text-soft)' }}>
                    {card.desc}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {card.prices.map(p => (
                      <span
                        key={p}
                        className="text-[11px] px-2.5 py-1 rounded-full border transition-colors font-light"
                        style={{ borderColor: 'var(--beige-mid)', color: 'var(--text-mid)' }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUALITY TIERS ─── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual */}
          <div className="relative h-[400px] lg:h-[520px]">
            <div className="absolute top-0 left-0 w-3/4 h-4/5 rounded-sm" style={{ background: 'var(--ivory-warm)' }} />
            <div className="absolute bottom-0 right-0 w-[52%] h-[48%] rounded-sm" style={{ background: 'var(--beige)' }} />
            <div
              className="absolute bottom-16 -left-4 z-10 px-6 py-4 rounded-sm"
              style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
            >
              <span className="font-cormorant text-[36px] font-light leading-none block">3</span>
              <span className="text-[11px] tracking-[0.12em] opacity-80 uppercase font-light">Úrovně kvality</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em] mb-4" style={{ color: 'var(--text-dark)' }}>
              Vyberte si svoji<br /><em className="italic" style={{ color: 'var(--burgundy)' }}>edici</em>
            </h2>
            <p className="text-[15px] leading-[1.8] max-w-[480px] mb-10 font-light" style={{ color: 'var(--text-soft)' }}>
              Každá edice je přizpůsobena jiným potřebám a rozpočtu. Všechny jsou 100% pravé vlasy z vlastní výroby.
            </p>

            <div className="flex flex-col">
              {[
                { name: 'Standard', desc: 'Skvělá každodenní volba · Délky 30–95 cm', price: 'od 6 900 Kč', href: '/vlasy-k-prodlouzeni' },
                { name: 'LUXE', desc: 'Prémiová hustota a lesk · Délky 30–95 cm', price: 'od 8 900 Kč', href: '/vlasy-k-prodlouzeni' },
                { name: 'Platinum', desc: 'Nejvyšší dostupná kvalita · Ručně tříděno', price: 'od 10 900 Kč', href: '/vlasy-k-prodlouzeni' },
              ].map((tier) => (
                <Link
                  key={tier.name}
                  href={tier.href}
                  className="group flex justify-between items-center py-6 border-b transition-all hover:pl-2"
                  style={{ borderColor: 'var(--beige)' }}
                >
                  <div>
                    <div className="font-cormorant text-[20px] font-normal" style={{ color: 'var(--text-dark)' }}>{tier.name}</div>
                    <div className="text-[13px] font-light mt-0.5" style={{ color: 'var(--text-soft)' }}>{tier.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-normal whitespace-nowrap" style={{ color: 'var(--text-mid)' }}>{tier.price}</span>
                    <svg aria-hidden="true" className="w-4 h-4 transition-[color,transform] group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--burgundy)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIFFERENTIATORS (dark) ─── */}
      <section className="py-24 px-6 md:px-12" style={{ background: 'var(--burgundy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--ivory)' }}>
              Proč Mùza Hair
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {[
              { num: '01', name: 'Vlastní barvírna', desc: 'Profesionální odbarvování a barvení přímo v Praze. Kontrola kvality v každém kroku.' },
              { num: '02', name: 'Ruční výroba', desc: 'Každý kus je ručně zpracován a kontrolován. Žádná hromadná výroba, jen kvalita.' },
              { num: '03', name: 'Český výrobce', desc: 'Výroba a barvení v Praze od roku 2016. Transparentní proces, žádné překvapení.' },
              { num: '04', name: '10 odstínů', desc: 'Od tmavě hnědé po ultra blond. Najdete přesně ten odstín, který k vám pasuje.' },
            ].map((item) => (
              <div
                key={item.num}
                className="p-10 transition-colors"
                style={{ background: 'var(--burgundy)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--burgundy-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--burgundy)')}
              >
                <div className="font-cormorant text-[20px] font-normal mb-2.5" style={{ color: 'var(--ivory)' }}>
                  {item.name}
                </div>
                <div className="text-[13px] leading-[1.7] font-light" style={{ color: 'rgba(248,244,239,0.82)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METODY PRODLOUŽENÍ ─── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--text-dark)' }}>
              Keratin · Nanotapes · <em className="italic" style={{ color: 'var(--burgundy)' }}>Weft</em>
            </h2>
            <p className="text-[14px] mt-3 font-light" style={{ color: 'var(--text-soft)' }}>
              Aplikace v showroomu Praha 1 · Vlasy dodáme poštou kamkoliv v ČR
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--beige)' }}>
            {[
              {
                name: 'Keratin / Mikrokeratin',
                desc: 'Keratinové pramínky přilepené k vlastním vlasům. Standard i mikrokeratin — diskrétní, přirozený výsledek.',
                price: 'Nasazení od 4 000 Kč',
                detail: '130–230 pramenů / 100 g · Korekce po 2,5–3 měs.',
                href: '/metody-zakonceni/vlasy-na-keratin',
                cenikHref: '/ceny-aplikaci#keratin',
              },
              {
                name: 'Nanotapes / Tape-In',
                desc: 'Vlasové pásky 2,8 cm nebo 4 cm — sendvičový spoj bez tepla a chemie. Rychlá korekce.',
                price: '55–65 Kč / spoj',
                detail: 'Korekce po 1,5–2 měs. · Aplikace 1,5–2 hod',
                href: '/metody-zakonceni/vlasove-pasky-tape-in',
                cenikHref: '/ceny-aplikaci#nanotapes',
              },
              {
                name: 'Weft — Hollywoodské',
                desc: 'Ručně šité vlasové tresy přišívané na copánky. Bez lepidla, bez tepla. Maximální objem.',
                price: 'Posun 3 800 Kč',
                detail: 'Korekce po 2–3 měs. · Tresy na zakázku 14 dní',
                href: '/metody-zakonceni/vlasove-tresy',
                cenikHref: '/ceny-aplikaci#weft',
              },
            ].map((m) => (
              <div key={m.name} className="bg-white p-10 flex flex-col">
                <h3 className="font-cormorant text-[22px] font-normal mb-2" style={{ color: 'var(--text-dark)' }}>{m.name}</h3>
                <p className="text-[13px] leading-[1.7] font-light mb-4 flex-1" style={{ color: 'var(--text-soft)' }}>{m.desc}</p>
                <div className="text-[13px] font-normal mb-1" style={{ color: 'var(--burgundy)' }}>{m.price}</div>
                <div className="text-[11px] font-light mb-6" style={{ color: 'var(--text-soft)' }}>{m.detail}</div>
                <div className="flex gap-3 flex-wrap">
                  <Link href={m.href} className="text-[11px] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all hover:-translate-y-px" style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}>
                    Více o metodě
                  </Link>
                  <Link href={m.cenikHref} className="text-[11px] tracking-[0.1em] uppercase px-4 py-2 rounded-sm transition-all hover:-translate-y-px" style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}>
                    Ceník aplikace
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/prodlouzeni-vlasu-praha" className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-colors hover:text-burgundy justify-center" style={{ color: 'var(--text-mid)' }}>
              Prodloužení vlasů Praha — showroom, ceny, metody →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── JAK TO FUNGUJE ─── */}
      <section className="py-20 px-6 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-cormorant text-[clamp(28px,3vw,42px)] font-light" style={{ color: 'var(--text-dark)' }}>
              Vlasy online, aplikace u vás nebo v <em className="italic" style={{ color: 'var(--burgundy)' }}>Praze</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Nakonfigurujte vlasy', desc: 'Vyberte metodu, délku, gramáž a odstín v online konfigurátoru. Rádi poradíme na +420 728 722 880.' },
              { step: '2', title: 'Doručíme kamkoliv v ČR', desc: 'Keratinové pramínky a pásky expedujeme ihned. Vlasové tresy vyrábíme na zakázku (14 dní).' },
              { step: '3', title: 'Aplikace u vás nebo v Praze', desc: 'Vlasy aplikuje vaše kadeřnice, nebo přijeďte do showroomu Revoluční 8, Praha 1.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-5">
                <span className="font-cormorant text-[48px] font-light leading-none flex-shrink-0" style={{ color: 'var(--accent)' }}>{s.step}</span>
                <div className="pt-2">
                  <p className="font-normal text-[15px] mb-1.5" style={{ color: 'var(--text-dark)' }}>{s.title}</p>
                  <p className="text-[13px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACCESSORIES ─── */}
      <section className="py-24 px-6 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--text-dark)' }}>
              Příčesky, paruky<br />& <em className="italic" style={{ color: 'var(--burgundy)' }}>doplňky</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Clip-in vlasy', href: '/pricesky-a-paruky/clip-in-vlasy' },
              { name: 'Ofiny clip-in', href: '/pricesky-a-paruky/ofiny-z-pravych-vlasu' },
              { name: 'Toupee / tupé', href: '/pricesky-a-paruky/toupee' },
              { name: 'Vlasové tresy', href: '/pricesky-a-paruky/vlasove-tresy' },
              { name: 'Pravé paruky', href: '/pricesky-a-paruky/prave-paruky' },
              { name: 'Clip-in culík', href: '/pricesky-a-paruky/clip-in-culik' },
            ].map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-3 min-h-[56px] px-5 py-4 border bg-white transition-colors hover:border-burgundy"
                style={{ borderColor: 'var(--beige-mid)' }}
              >
                <span className="font-cormorant text-[20px] leading-tight" style={{ color: 'var(--text-dark)' }}>
                  {name}
                </span>
                <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" style={{ color: 'var(--burgundy)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <h2 className="font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--text-dark)' }}>
              Co říkají naše<br /><em className="italic" style={{ color: 'var(--burgundy)' }}>zákaznice</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--beige)' }}>
            {[
              { text: '"LUXE kvalita je naprosto skvělá! Vlasy jsou krásně lesklé, hebké a vypadají úplně přirozeně. Nosím je už 8 měsíců a stále vypadají jako nové."', author: 'Karolína P.', detail: 'Praha · LUXE Nebarvené 60 cm' },
              { text: '"Platinum edice na svatbu — nejlepší rozhodnutí! Krásný lesk, žádné zamotávání. Profesionální kadeřnice byla nadšená z kvality."', author: 'Michaela Š.', detail: 'Brno · Platinum Blond #9, 65 cm' },
              { text: '"Standard kvalita na zkoušku — jsem mile překvapená! Za tu cenu je to úžasná kvalita. Vlasy jsou husté, dají se perfektně stylovat."', author: 'Lucie V.', detail: 'Ostrava · Standard Nebarvené 55 cm' },
            ].map((review, i) => (
              <div key={i} className="bg-white p-10">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>
                <p className="font-cormorant text-[18px] font-light leading-[1.7] italic mb-6" style={{ color: 'var(--text-dark)' }}>
                  {review.text}
                </p>
                <div className="flex items-center gap-2.5 text-[12px] font-light" style={{ color: 'var(--text-soft)' }}>
                  <span className="block w-5 h-px" style={{ background: 'var(--beige-mid)' }} />
                  <span>
                    <strong className="font-normal" style={{ color: 'var(--text-mid)' }}>{review.author}</strong>
                    {' '}{review.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─── */}
      {(() => {
        const latest = blogArticles.slice(-3).reverse();
        return (
          <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-14">
                <div>
                  <h2 className="font-cormorant text-[clamp(28px,3vw,42px)] font-light leading-[1.2] tracking-[-0.01em]" style={{ color: 'var(--text-dark)' }}>
                    Průvodce prodloužením <em className="italic" style={{ color: 'var(--burgundy)' }}>vlasů</em>
                  </h2>
                </div>
                <Link href="/blog" className="text-[12px] tracking-[0.1em] uppercase font-light hidden md:flex items-center gap-2 hover:text-burgundy transition" style={{ color: 'var(--text-mid)' }}>
                  Všechny články →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--beige)' }}>
                {latest.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`} className="bg-white p-8 group block hover:bg-ivory transition-colors">
                    <div className="text-[10px] tracking-[0.16em] uppercase mb-2 font-normal" style={{ color: 'var(--accent)' }}>{article.category}</div>
                    <h3 className="font-cormorant text-[19px] font-normal leading-[1.35] mb-3 group-hover:text-burgundy transition-colors" style={{ color: 'var(--text-dark)' }}>
                      {article.title}
                    </h3>
                    <p className="text-[13px] leading-[1.65] font-light mb-5" style={{ color: 'var(--text-soft)' }}>
                      {article.excerpt.slice(0, 100)}…
                    </p>
                    <span className="text-[11px] tracking-[0.1em] uppercase font-normal" style={{ color: 'var(--burgundy)' }}>
                      Číst článek →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── FAQ ─── */}
      <section className="py-20 px-6 md:px-12" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cormorant text-[clamp(28px,3vw,42px)] font-light" style={{ color: 'var(--text-dark)' }}>
              Časté <em className="italic" style={{ color: 'var(--burgundy)' }}>dotazy</em>
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Kolik stojí prodloužení vlasů v Praze?', a: 'Keratin od 4 000 Kč, mikrokeratin od 5 000 Kč (za 100 g vlasů). Nanotapes 55–65 Kč/spoj. Weft posun 3 800 Kč. Cena vlasů se účtuje zvlášť. Kompletní ceník na stránce Ceny aplikace.' },
              { q: 'Musím přijet do Prahy, nebo si mohu vlasy objednat online?', a: 'Vlasy si objednáte online — doručíme kamkoliv v ČR do 2 pracovních dní. Aplikaci pak provede vaše kadeřnice, nebo přijeďte do showroomu Revoluční 8, Praha 1.' },
              { q: 'Jaký je rozdíl mezi nanotapes a keratinem?', a: 'Nanotapes jsou vlasové pásky — sendvičový spoj bez tepla, korekce po 1,5–2 měsících. Keratin jsou pramínky přilepené keratinovou kapsulí, korekce po 2,5–3 měsících. Nanotapes jsou rychlejší na aplikaci, keratin drží déle.' },
              { q: 'Jak dlouho vydrží prodloužené vlasy?', a: 'Keratin 2,5–3 měsíce, nanotapes 1,5–2 měsíce, weft 2–3 měsíce do korekce. Životnost závisí na péči — vhodný šampon, česání od konečků, ochrana před teplem.' },
              { q: 'Jsou vlasy pravé?', a: 'Ano — 100 % pravé vlasy. Vlastní barvírna v Praze, vlastní výroba od roku 2016. Nabízíme nebarvené panenské vlasy i profesionálně barvené blond odstíny.' },
            ].map((item, i) => (
              <details key={i} className="bg-white border rounded-sm group" style={{ borderColor: 'var(--beige)' }}>
                <summary className="px-6 py-4 cursor-pointer text-[14px] font-normal list-none flex justify-between items-center" style={{ color: 'var(--text-dark)' }}>
                  {item.q}
                  <span className="text-[18px] font-light ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-200" style={{ color: 'var(--burgundy)' }}>+</span>
                </summary>
                <div className="px-6 pb-5 text-[13px] leading-[1.75] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.a}{' '}
                  {i === 0 && <Link href="/ceny-aplikaci" className="underline" style={{ color: 'var(--burgundy)' }}>Zobrazit ceník →</Link>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        className="py-24 px-6 md:px-12 text-center relative overflow-hidden"
        style={{ background: 'var(--ivory-warm)' }}
      >
        {/* Large M watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-cormorant font-light"
          style={{ fontSize: 'clamp(200px, 40vw, 600px)', color: 'rgba(74,21,32,0.04)', lineHeight: 1 }}
          aria-hidden="true"
        >
          M
        </div>
        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="font-cormorant text-[clamp(36px,4vw,56px)] font-light leading-[1.2] tracking-[-0.01em] mb-5" style={{ color: 'var(--text-dark)' }}>
            Najděte vlasy<br />pro <em className="italic" style={{ color: 'var(--burgundy)' }}>váš styl</em>
          </h2>
          <p className="text-[15px] leading-[1.8] mb-10 font-light" style={{ color: 'var(--text-soft)' }}>
            Navštivte náš showroom v Praze nebo si objednejte online s doručením do 48 hodin.
          </p>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
              style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--burgundy-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--burgundy)')}
            >
              Prozkoumat kolekci
            </Link>
            <Link
              href="/showroom"
              className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 transition-colors hover:text-burgundy"
              style={{ color: 'var(--text-mid)' }}
            >
              Navštívit showroom →
            </Link>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
