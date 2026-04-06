import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metody zakončení vlasů | Keratin, Tape-in, Vlasové tresy | Múza Hair',
  description: 'Přehled metod zakončení a aplikace vlasů k prodloužení. Keratin, Mikrokeratin, Tape-in nano tapes a ručně šité vlasové tresy.',
};

export default function MetodyZakonceniPage() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Hero header */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-light mb-10"
          style={{ color: 'var(--text-soft)' }}
        >
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          {' / '}
          <span style={{ color: 'var(--text-dark)' }}>Metody zakončení</span>
        </div>

        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Aplikace vlasů
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6 max-w-3xl"
          style={{ color: 'var(--text-dark)' }}
        >
          Metody zakončení vlasů
        </h1>

        <p className="text-[15px] leading-[1.8] font-light max-w-xl" style={{ color: 'var(--text-soft)' }}>
          Vyberte si metodu aplikace, která nejlépe vyhovuje vašim vlasům a životnímu stylu.
          Každá metoda má své specifické výhody a je vhodná pro různé typy vlasů.
        </p>
      </section>

      {/* Method 01 — Keratin */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div className="max-w-5xl">
          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            01
          </div>

          <h2
            className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-6"
            style={{ color: 'var(--text-dark)' }}
          >
            Keratin / Mikrokeratin
          </h2>

          <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-xl" style={{ color: 'var(--text-soft)' }}>
            Nejpopulárnější metoda prodlužování vlasů v ČR. Keratinové pramínky vydrží 3–6 měsíců
            a díky přirozenému vzhledu jsou ideální i pro aktivní životní styl.
          </p>

          <div className="mb-10">
            <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />
            <div className="flex flex-col gap-0">
              {['Trvanlivé 3–6 měsíců', 'Přirozený vzhled', 'Pro aktivní životní styl'].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-5 border-b"
                  style={{ borderColor: 'var(--ivory-warm)' }}
                >
                  <span
                    className="block w-4 h-px mt-[11px] flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text-soft)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/metody-zakonceni/vlasy-na-keratin"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 w-fit"
            style={{ color: 'var(--text-mid)' }}
          >
            Zjistit více →
          </Link>
        </div>
      </section>

      {/* Method 02 — Tape-In */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory-warm)' }}>
        <div className="max-w-5xl">
          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            02
          </div>

          <h2
            className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-6"
            style={{ color: 'var(--text-dark)' }}
          >
            Vlasové pásky Tape-In
          </h2>

          <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-xl" style={{ color: 'var(--text-soft)' }}>
            Šetrná metoda sendvičového spoje. 6 kolekcí, kudrnaté pásky jako unikát na CZ trhu.
            Výroba ze zákazničina copu za 14 dní.
          </p>

          <div className="mb-10">
            <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />
            <div className="flex flex-col gap-0">
              {['Sendvičový spoj — neviditelné', 'Kudrnaté pásky k dispozici', 'Výroba ze zákazničina copu'].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-5 border-b"
                  style={{ borderColor: 'var(--beige)' }}
                >
                  <span
                    className="block w-4 h-px mt-[11px] flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text-soft)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/metody-zakonceni/vlasove-pasky-tape-in"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 w-fit"
            style={{ color: 'var(--text-mid)' }}
          >
            Zjistit více →
          </Link>
        </div>
      </section>

      {/* Method 03 — Weft */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-5xl">
          <div
            className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            03
          </div>

          <h2
            className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-6"
            style={{ color: 'var(--text-dark)' }}
          >
            Vlasové tresy (Weft)
          </h2>

          <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-xl" style={{ color: 'var(--text-soft)' }}>
            Přišívají se na copánky bez chemie a tepla. Vyrábíme na zakázku z jakýchkoliv vlasů
            za 14 pracovních dní. Cena dle gramáže v konfigurátoru.
          </p>

          <div className="mb-10">
            <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />
            <div className="flex flex-col gap-0">
              {['Výroba z vašeho culíku', 'Bez chemie a tepla', 'Výroba 14 dní'].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-5 border-b"
                  style={{ borderColor: 'var(--beige)' }}
                >
                  <span
                    className="block w-4 h-px mt-[11px] flex-shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="text-[15px] font-light leading-[1.8]" style={{ color: 'var(--text-soft)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/metody-zakonceni/vlasove-tresy"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2 w-fit"
            style={{ color: 'var(--text-mid)' }}
          >
            Zjistit více →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Kolekce vlasů
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-6 max-w-xl"
          style={{ color: 'var(--text-dark)' }}
        >
          Vyberte vlasy k prodloužení
        </h2>

        <p className="text-[15px] leading-[1.8] font-light mb-10 max-w-md" style={{ color: 'var(--text-soft)' }}>
          Prohlédněte si naši kolekci panenských a barvených vlasů ve třech edicích kvality.
        </p>

        <Link
          href="/vlasy-k-prodlouzeni"
          className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
          style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
        >
          Prozkoumat kolekci
        </Link>
      </section>

    </div>
  );
}
