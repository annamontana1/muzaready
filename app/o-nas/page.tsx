import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'O nás | Pravé vlasy k prodloužení z Prahy | Mùza Hair',
  description:
    'Mùza je český výrobce pravých vlasů k prodloužení s vlastní barvírnou a ruční výrobou v Praze. Příběh zakladatelky Anny a toho, jak naše vlasy vznikají.',
  alternates: { canonical: 'https://www.muzahair.cz/o-nas' },
  openGraph: {
    title: 'O nás | Mùza Hair',
    description:
      'Mùza je český výrobce pravých vlasů k prodloužení s vlastní barvírnou a ruční výrobou v Praze.',
    url: 'https://www.muzahair.cz/o-nas',
    siteName: 'Mùza Hair',
    locale: 'cs_CZ',
    type: 'website',
  },
};

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

const STEPS = [
  {
    title: 'Výkup od dárkyň',
    text: 'Vlasy vykupujeme přímo od dárkyň. Každý culík pochází od jednoho dárce — z Česka, Ukrajiny, Vietnamu, Řecka a Kazachstánu. Vlasy od různých dárkyň nikdy nemícháme.',
  },
  {
    title: 'Vlastní barvírna',
    text: 'V barvírně pracuje pět specialistů, každý zodpovídá za svou část procesu. Díky vlastní metodě odbarvování dokážeme pravé vlasy zesvětlit až na platinovou blond bez poškození vlákna.',
  },
  {
    title: 'Ruční výroba v Praze',
    text: 'Tape-in pásky a wefty vyrábíme za 14 dní, keratin prameny a micro ring za 3 dny. Skladové barvy expedujeme ihned.',
  },
  {
    title: 'Pravými vlasy se zabýváme od roku 2016',
    text: 'Nekupujeme hotové produkty od třetích stran. Každý výrobní krok probíhá pod naším dohledem.',
  },
];

const CATEGORIES = [
  { name: 'Východoevropské vlasy', desc: 'silnější, přirozeně tmavší odstíny, výjimečná hustota a dlouhá životnost' },
  { name: 'Středoevropské vlasy', desc: 'jemnější struktura, přirozené blond i hnědé tóny, ideální pro středoevropský typ' },
  { name: 'Dětské vlasy — nejvyšší kvalita', desc: 'nejjemnější textura, nedotčená struktura, mimořádná hebkost a přirozený lesk' },
];

const EDITIONS = [
  { name: 'Standard', desc: 'Spolehlivá kvalita pro každodenní nošení a salony' },
  { name: 'Luxe', desc: 'Prémiový výběr pro náročnější zákaznice a stylisty' },
  { name: 'Platinum', desc: 'Nejlepší culíky z naší nabídky' },
  { name: 'Baby Shades', desc: 'Exkluzivní světlé odstíny z nejjemnějších vlasů, bez přebarvování' },
];

export default function ONasPage() {
  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      {/* Úvod a příběh */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-14 md:pt-12 md:pb-20">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">O nás</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_340px] md:gap-16 md:items-center">
          <div className="max-w-[640px]">
            <h1 className="font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">
              Pravé vlasy z pražského ateliéru
            </h1>
            <p className="mt-5 text-base leading-relaxed">
              Mùza je český výrobce pravých vlasů k prodloužení s vlastní barvírnou a ruční výrobou v Praze.
              Zakladatelka Anna nabízí vlasy ve čtyřech liniích — Standard, Luxe, Platinum a Baby Shades —
              z východoevropských, středoevropských i dětských vlasů nejvyšší kvality.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#45302F]">
              Můj příběh začal na Ukrajině, setkáním v lékárně. Starší paní mi na oplátku za zaplacené léky
              darovala dlouhý copánek, který schovávala desetiletí. „Nech si ho na památku,“ řekla tiše.
              Hledání, co s ním, mě zavedlo k paní Olze do Dnipropetrovsku, která ručně vyráběla paruky
              a příčesky z pravých vlasů.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#45302F]">
              Pak přišly roky cestování po výkupnách a testování kvality. Jeden dodavatel mi místo panenských
              vlasů poslal spálené prameny, které po umytí ztvrdly jako plast. Tehdy jsem se rozhodla vzít celý
              proces do vlastních rukou. Tak vznikla Mùza.
            </p>
          </div>
          <div className="relative aspect-[3/4] w-full max-w-[340px] mx-auto rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
            <Image
              src="/images/atelier/atelier-08.webp"
              alt="Ateliér Mùza v Praze, kde vlasy ručně zpracováváme"
              fill
              sizes="(min-width: 768px) 340px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Jak vlasy vznikají */}
      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid gap-10 md:grid-cols-[340px_1fr] md:gap-16 md:items-center">
          <div className="hidden md:block relative aspect-[3/4] rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
            <Image
              src="/images/atelier/atelier-11.webp"
              alt="Ruční zpracování vlasů v dílně Mùza"
              fill
              sizes="340px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Jak vlasy vznikají</h2>
            <ol className="mt-6 border-b border-muza-line">
              {STEPS.map((s) => (
                <li key={s.title} className="py-3 border-t border-muza-line">
                  <p className="text-base font-medium">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#45302F]">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Linie vlasů */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Naše vlasy</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-base font-medium">Edice</h3>
            <dl className="mt-3 border-b border-muza-line">
              {EDITIONS.map((e) => (
                <div key={e.name} className="grid grid-cols-[120px_1fr] gap-4 py-3 border-t border-muza-line">
                  <dt className="text-sm font-medium text-muza-ink">{e.name}</dt>
                  <dd className="text-sm text-[#45302F]">{e.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-base font-medium">Kategorie vlasů</h3>
            <dl className="mt-3 border-b border-muza-line">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="py-3 border-t border-muza-line">
                  <dt className="text-sm font-medium text-muza-ink">{c.name}</dt>
                  <dd className="mt-0.5 text-sm text-[#45302F]">{c.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Závěrečná výzva */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-[12px] bg-muza-ivory px-6 py-12 md:px-12 text-center">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Přijďte se podívat</h2>
          <p className="mt-3 text-base leading-relaxed text-[#45302F] max-w-xl mx-auto">
            V pražském showroomu si vlasy prohlédnete, osaháte a vyberete odstín i délku. Konzultace je zdarma
            a nezávazná.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/katalog" className={BTN_PRIMARY}>Prohlédnout katalog</Link>
            <Link href="/kontakt" className={BTN_SECONDARY}>Kontaktovat nás</Link>
          </div>
          <p className="mt-8 text-sm text-[#45302F]">S láskou k řemeslu, Anna, zakladatelka Mùza</p>
        </div>
      </section>
    </div>
  );
}
