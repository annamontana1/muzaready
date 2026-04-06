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
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          <nav className="text-sm text-text-soft mb-6 flex gap-2">
            <Link href="/" className="hover:text-burgundy transition">Domů</Link>
            <span>/</span>
            <Link href="/metody-zakonceni" className="hover:text-burgundy transition">Metody zakončení</Link>
            <span>/</span>
            <span className="text-text-mid">Vlasové tresy</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Vlasové tresy (Weft)
          </h1>

          <WeftInfoBanner />

          <div className="bg-ivory border-l-4 border-burgundy p-6 rounded-xl mb-10">
            <p className="text-text-dark leading-relaxed">
              Vyrábíme výhradně ručně šité vlasové tresy z vámi vybraných panenských, středoevropských nebo dětských vlasů nejvyšší kvality. Tresy přišíváme na copánky metodou Hollywoodského prodloužení — bez chemie, bez tepla. Délky 45–80 cm, výrobní doba 14 pracovních dní, platba 100 % předem.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-text-mid">

            <h2 className="text-3xl font-playfair text-burgundy mb-4">Co je vlasový tres?</h2>
            <p>
              Vlasový tres (anglicky <em>weft</em>) je pás pravých lidských vlasů ručně sešitých do jedné linie. U nás vyrábíme výhradně <strong>ručně šité tresy (hand-tied weft)</strong> z vámi vybraných panenských slovanských vlasů, středoevropských vlasů nebo vzácných dětských vlasů. Každý tres je tenký, měkký a téměř neviditelný.
            </p>
            <p>
              Tresy se přišívají speciální jehlou přímo na copánky uplétené z vlastních vlasů — bez chemie, bez tepla. Výsledkem je přirozené prodloužení nebo zhuštění, které nelze na první pohled odlišit od vlastních vlasů.
            </p>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Z jakých vlasů tresy vyrábíme?</h2>

            <div className="not-prose grid md:grid-cols-3 gap-4 mb-8">
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
                <div key={t.name} className="bg-white border border-warm-beige rounded-xl p-5">
                  <span className="text-xs font-medium bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full mb-3 inline-block">{t.badge}</span>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm">{t.name}</h3>
                  <p className="text-xs text-text-mid leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Pro jaký výrobek tresy šijeme?</h2>
            <p className="mb-4">Hustotu a tloušťku tresu vždy volíme podle účelu — proto se vždy ptáme:</p>

            <div className="not-prose grid md:grid-cols-3 gap-4 mb-8">
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
                <div key={i.use} className="bg-ivory border border-burgundy/10 rounded-xl p-4">
                  <p className="font-semibold text-burgundy text-sm mb-2">{i.use}</p>
                  <p className="text-xs text-text-mid leading-relaxed">{i.note}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Hollywoodské prodloužení</h2>
            <p>
              Hollywoodské prodloužení je metoda aplikace vlasových tresů přišíváním na copánky (cornrows). Kadeřnice uplete vaše vlasy do horizontálních copánků, na které se speciální jehlou a nití přišívají panenské nebo středoevropské tresy z naší výroby.
            </p>

            <div className="not-prose space-y-3 my-6">
              {[
                'Kadeřnice uplete vaše vlasy do horizontálních copánků (cornrows).',
                'Ručně šité tresy z panenských nebo středoevropských vlasů se přišívají jehlou na copánky.',
                'Postup se opakuje po celé hlavě dle požadovaného objemu.',
                'Aplikace trvá 3–6 hodin podle množství tresů.',
                'Výsledek drží 2–3 měsíce — poté choďte na korekci.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-ivory border border-burgundy/20 text-burgundy rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-text-mid leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="not-prose mb-8">
              <Link
                href="/ceny-aplikaci"
                className="inline-flex items-center gap-2 px-5 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
              >
                Ceny aplikací všech metod →
              </Link>
            </div>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Gramáže a délky</h2>

            <div className="not-prose overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-burgundy text-white">
                    <th className="px-4 py-3 text-left">Délka</th>
                    <th className="px-4 py-3 text-left">Gramáž</th>
                    <th className="px-4 py-3 text-left">Využití</th>
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
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory'}>
                      <td className="px-4 py-3 font-medium text-text-dark">{len}</td>
                      <td className="px-4 py-3 text-text-mid">{weight}</td>
                      <td className="px-4 py-3 text-text-soft">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Péče o vlasové tresy</h2>

            <div className="not-prose bg-white border border-warm-beige rounded-xl p-6 mb-10">
              <p className="text-sm text-text-mid mb-4 leading-relaxed">
                Panenské a středoevropské vlasy se chovají stejně jako vaše vlastní — potřebují mytí, ošetřování a úpravu. Je to znak jejich kvality.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Myjte vlasy šetrně, nedrhnete oblast copánků',
                  'Používejte šampony a kondicionéry pro prodloužené vlasy',
                  'Nanášejte oleje na pokožku hlavy',
                  'Spěte v hedvábné čepici nebo na hedvábném povlaku',
                  'Upravujte tresy (foukat, žehlit) jednou za 2–3 týdny',
                  'Choďte na korekci po 2–3 měsících',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-text-mid">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Časté otázky</h2>

            <div className="not-prose space-y-4 mb-10">
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
                <div key={i} className="bg-white border border-warm-beige rounded-xl p-5">
                  <p className="font-semibold text-text-dark mb-2">{item.q}</p>
                  <p className="text-sm text-text-mid leading-relaxed">{item.a}</p>
                  {item.link && (
                    <Link href={item.link.href} className="text-sm text-burgundy underline mt-2 inline-block hover:opacity-75">
                      {item.link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

          </div>

          <div className="bg-ivory border border-burgundy/10 rounded-xl p-8 text-center">
            <p className="font-playfair text-2xl text-burgundy mb-2">Máte zájem o vlasové tresy?</p>
            <p className="text-text-soft text-sm mb-6">Prohlédněte si nabídku nebo nás kontaktujte pro konzultaci.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/vlasy-k-prodlouzeni" className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition">
                Vybrat vlasy k prodloužení
              </Link>
              <Link href="/ceny-aplikaci" className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition">
                Ceny aplikací
              </Link>
              <Link href="/kontakt" className="px-6 py-3 border border-warm-beige text-text-mid text-sm font-medium rounded-xl hover:border-burgundy hover:text-burgundy transition">
                Kontakt
              </Link>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-warm-beige">
            <p className="text-sm text-text-soft mb-4">Další metody zakončení</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Vlasové pásky Tape-In' },
                { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Keratin prameny' },
                { href: '/metody-zakonceni', label: 'Všechny metody' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="px-4 py-2 border border-warm-beige text-text-mid text-sm rounded-lg hover:border-burgundy hover:text-burgundy transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
