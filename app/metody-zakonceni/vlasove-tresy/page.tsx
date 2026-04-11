import Link from 'next/link';
import { Metadata } from 'next';
import WeftInfoBanner from '@/components/WeftInfoBanner';

export const metadata: Metadata = {
  title: 'Vlasové tresy (Weft) | Ručně šité | Múza Hair Praha',
  description: 'Ručně šité vlasové tresy z panenských, středoevropských a dětských vlasů. Hollywoodské prodloužení přišíváním na copánky. Výroba 14 dní, platba 100 %. Praha.',
  alternates: { canonical: 'https://muzahair.cz/metody-zakonceni/vlasove-tresy' },
  openGraph: {
    title: 'Vlasové tresy (Weft) | Múza Hair Praha',
    description: 'Ručně šité vlasové tresy z panenských, středoevropských a dětských vlasů. Hollywoodské prodloužení. Výroba 14 dní.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Co jsou vlasové tresy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vlasový tres (weft) je pás pravých lidských vlasů ručně sešitých do jedné linie. Vyrábíme je výhradně z panenských, středoevropských a dětských vlasů nejvyšší kvality. Přišívají se speciální jehlou na copánky uplétané z vlastních vlasů — bez chemie, bez tepla.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mohu objednat pouze vlasový tres bez aplikace?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano — vlasový tres objednáte přímo v e-shopu nebo přes Instagram a aplikaci zajistí váš kadeřník. Nabízíme také Hollywoodské prodloužení — kompletní aplikaci přišíváním tresů na copánky přímo u nás. Ceny aplikací najdete na stránce ceny aplikací.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik tresů potřebuji?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Závisí na délce vašich vlasů, jejich hustotě a požadovaném efektu. Standardně 100 g na prodloužení s přirozeným efektem, 150–200 g na plné zhuštění. V případě nejistoty nás kontaktujte — poradíme.',
      },
    },
    {
      '@type': 'Question',
      name: 'Lze tres stříhat nebo zkracovat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano — ručně šitý tres lze bez problémů stříhat na požadovanou délku. Je to jedna z výhod tresové metody.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak dlouho trvá výroba tresů na zakázku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Výroba vlasových tresů trvá 14 pracovních dní od potvrzení objednávky. Cena se hradí 100 % předem.',
      },
    },
    {
      '@type': 'Question',
      name: 'Je třeba tresy upravovat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano — panenské a středoevropské vlasy se chovají jako vaše vlastní. Tresy je potřeba mýt, ošetřovat a upravovat (foukat, žehlit). Na korekci choďte po 2–3 měsících.',
      },
    },
  ],
};

export default function VlasoveTresyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero sekce */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:opacity-70 transition">Domů</Link>
            <span>/</span>
            <Link href="/metody-zakonceni" className="hover:opacity-70 transition">Metody zakončení</Link>
            <span>/</span>
            <span style={{ color: 'var(--burgundy)' }}>Vlasové tresy</span>
          </nav>

          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Metody zakončení</span>
          </div>

          <h1 className="font-cormorant text-[clamp(28px,4vw,52px)] font-light leading-tight mb-6" style={{ color: 'var(--text-dark)' }}>
            Vlasové tresy (Weft)
          </h1>

          <WeftInfoBanner />

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mt-8">
            <p className="leading-relaxed" style={{ color: 'var(--text-dark)' }}>
              Vyrábíme výhradně ručně šité vlasové tresy z vámi vybraných panenských, středoevropských nebo dětských vlasů nejvyšší kvality. Tresy přišíváme na copánky metodou Hollywoodského prodloužení — bez chemie, bez tepla. Délky 45–80 cm, výrobní doba 14 pracovních dní, platba 100 % předem.
            </p>
          </div>
        </div>
      </section>

      {/* Co je vlasový tres */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Definice</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-6" style={{ color: 'var(--text-dark)' }}>
            Co je vlasový tres?
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Vlasový tres (anglicky <em>weft</em>) je pás pravých lidských vlasů ručně sešitých do jedné linie. U nás vyrábíme výhradně <strong style={{ color: 'var(--text-dark)' }}>ručně šité tresy (hand-tied weft)</strong> z vámi vybraných panenských slovanských vlasů, středoevropských vlasů nebo vzácných dětských vlasů. Každý tres je tenký, měkký a téměř neviditelný.
          </p>
          <p className="leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Tresy se přišívají speciální jehlou přímo na copánky uplétené z vlastních vlasů — bez chemie, bez tepla. Výsledkem je přirozené prodloužení nebo zhuštění, které nelze na první pohled odlišit od vlastních vlasů.
          </p>
        </div>
      </section>

      {/* Z jakých vlasů */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Materiál</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Z jakých vlasů tresy vyrábíme?
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                name: 'Panenské slovanské vlasy',
                desc: 'Chemicky nedotčené, přirozeně zdravé vlasy z východní Evropy. Nejlepší pro zesvětlování a tónování.',
                badge: 'Standard · Luxe · Platinum',
              },
              {
                name: 'Středoevropské vlasy',
                desc: 'Jemná struktura, přirozený lesk. Výborně splývají s vlasy středoevropského typu.',
                badge: 'Standard · Luxe',
              },
              {
                name: 'Dětské vlasy',
                desc: 'Výjimečně jemné a hedvábné vlasy. Nejlehčí dostupná struktura — unikát na českém trhu.',
                badge: 'Baby Shades',
              },
            ].map((t) => (
              <div key={t.name} className="py-6 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <h3 className="font-cormorant text-xl font-light" style={{ color: 'var(--text-dark)' }}>{t.name}</h3>
                  <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--accent)' }}>{t.badge}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro jaký výrobek */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Využití</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Pro jaký výrobek tresy šijeme?
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>Hustotu a tloušťku tresu vždy volíme podle účelu — proto se vždy ptáme:</p>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                use: 'Prodloužení vlasů',
                note: 'Tenký, měkký tres přišitý na copánky — splývá s vlastními vlasy',
              },
              {
                use: 'Culíky a příčesky',
                note: 'Hustší tres pro větší objem a tvar, který drží',
              },
              {
                use: 'Tupé a paruky',
                note: 'Velmi tenký tres — minimální viditelnost základny, přirozený výsledek',
              },
            ].map((i) => (
              <div key={i.use} className="py-5 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <div className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--burgundy)' }}>{i.use}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{i.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hollywoodské prodloužení */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Aplikace</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-6" style={{ color: 'var(--text-dark)' }}>
            Hollywoodské prodloužení
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Hollywoodské prodloužení je metoda aplikace vlasových tresů přišíváním na copánky (cornrows). Kadeřnice uplete vaše vlasy do horizontálních copánků, na které se speciální jehlou a nití přišívají panenské nebo středoevropské tresy z naší výroby.
          </p>

          <div className="border-t mb-8" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              'Kadeřnice uplete vaše vlasy do horizontálních copánků (cornrows).',
              'Ručně šité tresy z panenských nebo středoevropských vlasů se přišívají jehlou na copánky.',
              'Postup se opakuje po celé hlavě dle požadovaného objemu.',
              'Aplikace trvá 3–6 hodin podle množství tresů.',
              'Výsledek drží 2–3 měsíce — poté choďte na korekci.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-5 py-4 border-b" style={{ borderColor: 'var(--beige)' }}>
                <span className="flex-shrink-0 text-[11px] tracking-[0.15em] uppercase font-normal pt-0.5" style={{ color: 'var(--accent)', minWidth: '1.5rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{step}</p>
              </div>
            ))}
          </div>

          <Link
            href="/ceny-aplikaci"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-sm transition hover:opacity-80"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Ceny aplikací všech metod →
          </Link>
        </div>
      </section>

      {/* Gramáže a délky */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Specifikace</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Gramáže a délky
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--text-dark)' }}>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Délka</th>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Gramáž</th>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Využití</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['45 cm', '100 g', 'Zhušťování, krátké prodloužení'],
                  ['50–55 cm', '100 g', 'Nejoblíbenější délka'],
                  ['60–65 cm', '100 g', 'Přirozené prodloužení'],
                  ['70–75 cm', '100 g', 'Výrazné prodloužení'],
                  ['80 cm', '100 g', 'Maximální délka'],
                ].map(([len, weight, note], i) => (
                  <tr key={i} className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                    <td className="py-3" style={{ color: 'var(--text-dark)' }}>{len}</td>
                    <td className="py-3" style={{ color: 'var(--text-soft)' }}>{weight}</td>
                    <td className="py-3" style={{ color: 'var(--text-soft)' }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Péče */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Péče</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Péče o vlasové tresy
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Panenské a středoevropské vlasy se chovají stejně jako vaše vlastní — potřebují mytí, ošetřování a úpravu. Je to znak jejich kvality.
          </p>
          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              'Myjte vlasy šetrně, nedrhnete oblast copánků',
              'Používejte šampony a kondicionéry pro prodloužené vlasy',
              'Nanášejte oleje na pokožku hlavy',
              'Spěte v hedvábné čepici nebo na hedvábném povlaku',
              'Upravujte tresy (foukat, žehlit) jednou za 2–3 týdny',
              'Choďte na korekci po 2–3 měsících',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b text-sm" style={{ borderColor: 'var(--beige)', color: 'var(--text-soft)' }}>
                <span style={{ color: 'var(--accent)' }}>—</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Časté otázky</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Vlasové tresy — co se nejčastěji ptáte
          </h2>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                q: 'Mohu objednat pouze vlasový tres bez aplikace?',
                a: 'Ano — vlasový tres objednáte v e-shopu nebo přes Instagram a aplikaci zajistí váš kadeřník. Nabízíme ale také Hollywoodské prodloužení — kompletní aplikaci tresů přišíváním na copánky. Ceny aplikací najdete zde.',
                link: { href: '/ceny-aplikaci', label: 'Ceny aplikací →' },
              },
              {
                q: 'Kolik tresů potřebuji?',
                a: 'Závisí na délce vašich vlasů, hustotě a požadovaném efektu. Standardně 100 g na prodloužení s přirozeným efektem, 150–200 g na plné zhuštění. V případě nejistoty nás kontaktujte.',
                link: null,
              },
              {
                q: 'Lze tres stříhat nebo zkracovat?',
                a: 'Ano — ručně šitý tres lze bez problémů stříhat na požadovanou délku.',
                link: null,
              },
              {
                q: 'Jak dlouho trvá výroba?',
                a: '14 pracovních dní od potvrzení objednávky. Cena se hradí 100 % předem.',
                link: null,
              },
              {
                q: 'Jak dlouho tresy vydrží?',
                a: 'Samotné tresy z panenských vlasů při správné péči vydrží 1–2 roky. Na korekci přišití na copánky choďte každé 2–3 měsíce.',
                link: null,
              },
            ].map((item, i) => (
              <div key={i} className="py-6 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <h3 className="font-cormorant text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>{item.q}</h3>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-soft)' }}>{item.a}</p>
                {item.link && (
                  <Link href={item.link.href} className="text-sm hover:opacity-75 transition" style={{ color: 'var(--accent)' }}>
                    {item.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ceny aplikace */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mb-12">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-4 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              Ceny aplikace
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              Ceny Hollywoodského prodloužení přišíváním tresů na copánky závisí na množství tresů a délce vlasů. Kompletní přehled sazeb najdete na stránce cen aplikací.
            </p>
            <Link
              href="/ceny-aplikaci"
              className="text-sm font-medium hover:opacity-75 transition"
              style={{ color: 'var(--accent)' }}
            >
              Přehled cen aplikace →
            </Link>
          </div>

          {/* CTA blok */}
          <div className="border-t pt-10" style={{ borderColor: 'var(--text-dark)' }}>
            <p className="font-cormorant text-2xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>Máte zájem o vlasové tresy?</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-soft)' }}>Prohlédněte si nabídku nebo nás kontaktujte pro konzultaci.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-80"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Vybrat vlasy k prodloužení
              </Link>
              <Link
                href="/ceny-aplikaci"
                className="px-6 py-3 border text-sm font-medium rounded-sm transition hover:opacity-70"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                Ceny aplikací
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 border text-sm font-medium rounded-sm transition hover:opacity-70"
                style={{ borderColor: 'var(--text-soft)', color: 'var(--text-soft)' }}
              >
                Kontakt
              </Link>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t" style={{ borderColor: 'var(--beige)' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>Další metody zakončení</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Vlasové pásky Tape-In' },
                { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Keratin prameny' },
                { href: '/metody-zakonceni', label: 'Všechny metody' },
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
        </div>
      </section>
    </>
  );
}
