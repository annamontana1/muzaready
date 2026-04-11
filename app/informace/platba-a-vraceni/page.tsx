import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platba a vrácení | Múza Hair Praha',
  description: 'Způsoby platby, doprava a podmínky vrácení zboží. Zásilkovna 89 Kč, DPD 68 Kč, osobní odběr Praha zdarma.',
  alternates: { canonical: 'https://muzahair.cz/informace/platba-a-vraceni' },
};

export default function PlatbaAVraceniPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:opacity-70 transition">Domů</Link>
            <span>/</span>
            <Link href="/informace" className="hover:opacity-70 transition">Informace</Link>
            <span>/</span>
            <span style={{ color: 'var(--burgundy)' }}>Platba a vrácení</span>
          </nav>

          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Informace</span>
          </div>

          <h1 className="font-cormorant text-[clamp(28px,4vw,52px)] font-light leading-tight mb-8" style={{ color: 'var(--text-dark)' }}>
            Platba a vrácení
          </h1>

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }}>
            <p className="leading-relaxed" style={{ color: 'var(--text-dark)' }}>
              Přijímáme platbu kartou online a bankovním převodem. Dobírka není dostupná. Zásilky expedujeme přes Zásilkovnu (89 Kč) a DPD (68 Kč). Osobní odběr v showroomu Praha je zdarma. Nerozbalené vlasy lze vrátit do 14 dní.
            </p>
          </div>
        </div>
      </section>

      {/* Způsoby platby */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Platba</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Způsoby platby
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                name: 'Platba kartou online',
                desc: 'Visa, Mastercard, Maestro — přes zabezpečenou bránu GoPay. Platba je zpracována okamžitě.',
                badge: 'Doporučeno',
              },
              {
                name: 'Bankovní převod',
                desc: 'Převod na náš bankovní účet. Objednávka se expeduje po připsání platby — zpravidla 1–2 pracovní dny.',
                badge: null,
              },
              {
                name: 'Hotovost v showroomu',
                desc: 'Platba v hotovosti při osobním odběru v showroomu Praha. Bez příplatků.',
                badge: null,
              },
            ].map((m) => (
              <div key={m.name} className="flex items-start justify-between gap-6 py-5 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-cormorant text-lg font-light" style={{ color: 'var(--text-dark)' }}>{m.name}</span>
                    {m.badge && (
                      <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--accent)' }}>{m.badge}</span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 py-4 border-l-4 pl-5" style={{ borderColor: 'var(--burgundy)', background: 'transparent' }}>
            <p className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--burgundy)' }}>Dobírka není dostupná</p>
            <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Vlasy jsou prémiové zboží — z hygienických a bezpečnostních důvodů nezasíláme na dobírku.</p>
          </div>
        </div>
      </section>

      {/* Doprava */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Doprava</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Doprava a doručení
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                name: 'Zásilkovna',
                price: '89 Kč',
                time: '2–3 pracovní dny',
                desc: 'Vyzvednutí na výdejním místě dle výběru. Více než 7 000 poboček v ČR.',
                available: true,
              },
              {
                name: 'DPD',
                price: '68 Kč',
                time: '1–2 pracovní dny',
                desc: 'Doručení kurýrem přímo na adresu v pracovní dny.',
                available: true,
              },
              {
                name: 'Osobní odběr — showroom Praha',
                price: 'Zdarma',
                time: 'Po domluvě',
                desc: 'Revoluční 8, Praha. Po–So 10:00–18:00.',
                available: true,
              },
              {
                name: 'Balikovná',
                price: '—',
                time: '—',
                desc: 'Připravujeme. Brzy dostupné.',
                available: false,
              },
            ].map((m) => (
              <div
                key={m.name}
                className="py-5 border-b"
                style={{ borderColor: 'var(--beige)', opacity: m.available ? 1 : 0.45 }}
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-cormorant text-lg font-light" style={{ color: 'var(--text-dark)' }}>{m.name}</span>
                      {!m.available && (
                        <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Připravujeme</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{m.desc}</p>
                  </div>
                  {m.available && (
                    <div className="flex gap-8 text-sm flex-shrink-0">
                      <div>
                        <span className="block text-[11px] tracking-[0.15em] uppercase mb-0.5" style={{ color: 'var(--text-soft)' }}>Cena</span>
                        <span className="font-cormorant text-lg font-light" style={{ color: 'var(--burgundy)' }}>{m.price}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] tracking-[0.15em] uppercase mb-0.5" style={{ color: 'var(--text-soft)' }}>Doba doručení</span>
                        <span style={{ color: 'var(--text-dark)' }}>{m.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vrácení */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Vrácení</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-6" style={{ color: 'var(--text-dark)' }}>
            Vrácení zboží
          </h2>

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mb-8">
            <p className="font-cormorant text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>Specifika vlasových produktů</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              Vlasy lze vrátit pouze v <strong style={{ color: 'var(--text-dark)' }}>nerozbaléném originálním balení</strong>. Rozbalené, použité, aplikované nebo chemicky upravené vlasy nelze z hygienických důvodů vrátit ani vyměnit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[11px] tracking-[0.2em] uppercase font-normal mb-6" style={{ color: 'var(--accent)' }}>Podmínky vrácení</h3>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {[
                  { ok: true, text: 'Lhůta 14 dní od převzetí zboží' },
                  { ok: true, text: 'Nerozbalené v originálním obalu s etiketami' },
                  { ok: true, text: 'Poplatek za naskladnění 100 Kč / položka' },
                  { ok: true, text: 'Peníze vrátíme do 14 dní od přijetí zboží' },
                  { ok: false, text: 'Zakázková výroba (pásky, weft, keratin)' },
                  { ok: false, text: 'Rozbalené nebo použité zboží' },
                  { ok: false, text: 'Chemicky nebo mechanicky upravené vlasy' },
                ].map((i, idx) => (
                  <div key={idx} className="flex items-start gap-4 py-3 border-b text-sm" style={{ borderColor: 'var(--ivory)' }}>
                    <span style={{ color: i.ok ? 'var(--accent)' : 'var(--burgundy)', fontWeight: 600 }}>{i.ok ? '+' : '—'}</span>
                    <span style={{ color: i.ok ? 'var(--text-soft)' : 'var(--text-soft)', opacity: i.ok ? 1 : 0.65 }}>{i.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] tracking-[0.2em] uppercase font-normal mb-6" style={{ color: 'var(--accent)' }}>Jak vrátit zboží</h3>
              <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
                {([
                  'Napište na muzahaircz@gmail.com — uveďte číslo objednávky a důvod vrácení.',
                  null,
                  'Zboží zašlete doporučeně na adresu: Šrámkova 430/12, 638 00 Brno. Nezasílejte na dobírku.',
                  'Po obdržení zboží vrátíme peníze na bankovní účet do 14 dnů.',
                ] as (string | null)[]).map((s, i) => (
                  <div key={i} className="flex items-start gap-5 py-4 border-b text-sm" style={{ borderColor: 'var(--ivory)' }}>
                    <span className="flex-shrink-0 text-[11px] tracking-[0.15em] uppercase font-normal" style={{ color: 'var(--accent)', minWidth: '1.5rem' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--text-soft)' }}>
                      {i === 1 ? (
                        <>Stáhněte, vyplňte a vytiskněte{' '}
                          <Link href="/informace/odstoupeni-od-smlouvy" className="underline hover:opacity-75" style={{ color: 'var(--burgundy)' }}>
                            formulář pro odstoupení od smlouvy
                          </Link>
                          {' '}a přiložte ho do balíku.</>
                      ) : s}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href="mailto:muzahaircz@gmail.com?subject=Vrácení zboží"
                  className="inline-block px-5 py-2.5 text-sm font-medium rounded-sm transition hover:opacity-80"
                  style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                >
                  Napsat o vrácení →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reklamace */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Reklamace</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Reklamace
          </h2>

          <div className="border-t mb-8" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              { label: 'Záruční doba', value: '24 měsíců', note: 'na výrobní vady nepoužitého zboží' },
              { label: 'Vyřízení', value: 'do 30 dní', note: 'od uplatnění reklamace' },
              { label: 'Kontakt', value: 'muzahaircz@gmail.com', note: 'foto + číslo objednávky' },
            ].map((i) => (
              <div key={i.label} className="flex items-start gap-8 py-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="w-40 flex-shrink-0 text-[11px] tracking-[0.15em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>
                  {i.label}
                </div>
                <div>
                  <div className="font-cormorant text-lg font-light" style={{ color: 'var(--burgundy)' }}>{i.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>{i.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-4" style={{ color: 'var(--text-soft)' }}>Co není vadou zboží:</p>
            <div className="border-t" style={{ borderColor: 'var(--beige)' }}>
              {[
                'Přirozená odchylka v odstínu barvy oproti zobrazení na monitoru',
                'Mírná přirozená vlnitost slovanských vlasů',
                'Změna struktury vlivem nesprávné péče nebo chemické úpravy kupujícím',
                'Opotřebení způsobené obvyklým používáním',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b text-sm" style={{ borderColor: 'var(--beige)', color: 'var(--text-soft)' }}>
                  <span style={{ color: 'var(--accent)' }}>—</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Související */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase font-normal mb-6" style={{ color: 'var(--text-soft)' }}>Související stránky</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/informace/odstoupeni-od-smlouvy', label: 'Formulář odstoupení od smlouvy' },
              { href: '/obchodni-podminky', label: 'Obchodní podmínky' },
              { href: '/reklamace', label: 'Reklamační řád' },
              { href: '/sledovani-objednavky', label: 'Sledování objednávky' },
              { href: '/kontakt', label: 'Kontakt' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 border text-sm transition hover:opacity-70"
                style={{ borderColor: 'var(--text-soft)', color: 'var(--text-soft)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
