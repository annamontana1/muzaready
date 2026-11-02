import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metody zakončení vlasů | Keratin, Tape-in, Vlasové tresy | Mùza Hair',
  description:
    'Přehled metod zakončení vlasů k prodloužení: keratin, mikrokeratin, tape-in nano tapes a ručně šité vlasové tresy. Aplikace v našem partnerském salonu v Praze.',
  alternates: { canonical: 'https://www.muzahair.cz/metody-zakonceni' },
  openGraph: {
    title: 'Metody zakončení vlasů | Keratin, Tape-in, Weft | Mùza Hair',
    description: 'Přehled metod zakončení vlasů: keratin, mikrokeratin, nanotapes a vlasové tresy weft. Poradíme s výběrem.',
    url: 'https://www.muzahair.cz/metody-zakonceni',
    siteName: 'Mùza Hair',
    locale: 'cs_CZ',
    type: 'website',
  },
};

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

const METHODS = [
  {
    name: 'Keratin / Mikrokeratin',
    href: '/metody-zakonceni/vlasy-na-keratin',
    desc: 'Nejpopulárnější metoda prodlužování vlasů v ČR. Keratinové pramínky vydrží 3–6 měsíců a díky přirozenému vzhledu jsou ideální i pro aktivní životní styl.',
    points: ['Trvanlivé 3–6 měsíců', 'Přirozený vzhled', 'Pro aktivní životní styl'],
  },
  {
    name: 'Vlasové pásky Tape-In',
    href: '/metody-zakonceni/vlasove-pasky-tape-in',
    desc: 'Šetrná metoda sendvičového spoje. 6 kolekcí, kudrnaté pásky jako unikát na CZ trhu. Výroba ze zákazničina copu za 14 dní.',
    points: ['Sendvičový spoj, neviditelné', 'Kudrnaté pásky k dispozici', 'Výroba ze zákazničina copu'],
  },
  {
    name: 'Vlasové tresy (Weft)',
    href: '/metody-zakonceni/vlasove-tresy',
    desc: 'Přišívají se na copánky bez chemie a tepla. Vyrábíme na zakázku z jakýchkoliv vlasů za 14 pracovních dní. Cena dle gramáže v konfigurátoru.',
    points: ['Výroba z vašeho culíku', 'Bez chemie a tepla', 'Výroba 14 dní'],
  },
];

export default function MetodyZakonceniPage() {
  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Metody zakončení</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_300px] md:gap-16 md:items-center">
          <div className="max-w-[640px]">
            <h1 className="font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">
              Metody zakončení vlasů
            </h1>
            <p className="mt-5 text-base leading-relaxed">
              Vyberte si metodu aplikace, která nejlépe vyhovuje vašim vlasům a životnímu stylu.
              Každá metoda má své výhody a hodí se pro jiný typ vlasů.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#45302F]">
              Aplikaci provádíme v našem partnerském salonu v Praze. Vlasy si můžete vybrat osobně
              v showroomu nebo objednat online.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[3/4] rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
              <Image
                src="/images/atelier/atelier-10.webp"
                alt="Vlasy k prodloužení s různými typy zakončení v ateliéru Mùza"
                fill
                sizes="300px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Tři metody</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {METHODS.map((m) => (
              <li key={m.href} className="flex flex-col rounded-[12px] bg-muza-cream p-6">
                <h3 className="font-cormorant text-[28px] leading-tight text-muza-ink">{m.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#45302F]">{m.desc}</p>
                <ul className="mt-5 mb-6 border-b border-muza-line">
                  {m.points.map((p) => (
                    <li key={p} className="py-3 border-t border-muza-line text-sm">{p}</li>
                  ))}
                </ul>
                <Link href={m.href} className={`${BTN_SECONDARY} mt-auto self-start`}>
                  Zjistit více
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">
          Vyberte vlasy k prodloužení
        </h2>
        <p className="mt-3 text-base text-[#45302F]">
          Prohlédněte si naši kolekci panenských a barvených vlasů ve třech edicích kvality.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/vlasy-k-prodlouzeni" className={BTN_PRIMARY}>Prozkoumat kolekci</Link>
          <Link href="/kontakt" className={BTN_SECONDARY}>Poradit s výběrem</Link>
        </div>
      </section>
    </div>
  );
}
