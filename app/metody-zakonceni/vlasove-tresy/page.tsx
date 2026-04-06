import Link from 'next/link';
import { Metadata } from 'next';
import WeftInfoBanner from '@/components/WeftInfoBanner';

export const metadata: Metadata = {
  title: 'Vlasové tresy (Weft) | Ručně šité i strojové | Múza Hair Praha',
  description: 'Vlasové tresy pro prodloužení, culíky, nakládky a paruky. Přišívají se na copánky. Ručně šité i strojové. Výroba z vlastního culíku i z naší zásoby. Praha.',
  alternates: { canonical: 'https://muzahair.cz/metody-zakonceni/vlasove-tresy' },
  openGraph: {
    title: 'Vlasové tresy (Weft) | Múza Hair Praha',
    description: 'Vlasové tresy přišívané na copánky. Ručně šité i strojové. Výroba na zakázku z vlastního culíku nebo z naší zásoby slovanských vlasů.',
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
        text: 'Vlasový tres (weft) je pás pravých lidských vlasů sešitých do jedné linie. Přišívá se speciální jehlou přímo na copánky (cornrows) upletené z vlastních vlasů. Výsledkem je přirozené prodloužení nebo zhuštění bez chemie.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaký je rozdíl mezi ručně šitým a strojovým tresem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ručně šitý tres (hand-tied weft) je tenký, měkký a téměř neviditelný — ideální pro prodloužení a nakládky. Strojový tres je hustší a pevnější — vhodný pro culíky a paruky. Typ vybíráme vždy podle účelu výrobku.',
      },
    },
    {
      '@type': 'Question',
      name: 'Lze vyrobit tresy z mých vlastních vlasů?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano. Stačí nám zaslat nebo přinést culík. Před výrobou ale potřebujeme vidět foto vlasů, jejich váhu a historii (péče, barvení, prodloužení). Vlasy musí být stejné barvy a struktury — nelze kombinovat rovné a vlnité.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik metrů tresů vznikne ze 100 gramů?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Z 1 culíku (100g) lze vytvořit tenký tres délky až 12 metrů. Přesné množství závisí na délce vlasů, jejich hustotě a požadované tloušťce tresu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Je třeba tresy upravovat (žehlit, foukat)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano — pravé vlasové tresy jsou z přírodních vlasů a chovají se stejně jako vaše vlastní vlasy. Je potřeba je mýt, ošetřovat a upravovat. U nakládek to stačí jednou za 2–3 týdny.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak dlouho trvá výroba tresů na zakázku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Výroba vlasových tresů trvá standardně 14 pracovních dní od potvrzení objednávky a přijetí zálohy.',
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

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex gap-2">
            <Link href="/" className="hover:text-burgundy transition">Domů</Link>
            <span>/</span>
            <Link href="/metody-zakonceni" className="hover:text-burgundy transition">Metody zakončení</Link>
            <span>/</span>
            <span className="text-gray-600">Vlasové tresy</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Vlasové tresy (Weft)
          </h1>

          <WeftInfoBanner />

          {/* TL;DR */}
          <div className="bg-ivory border-l-4 border-burgundy p-6 rounded-xl mb-10">
            <p className="text-gray-800 leading-relaxed">
              Vlasový tres je pás pravých lidských vlasů přišívaný na copánky. Vyrábíme ručně šité i strojové tresy ze slovanských vlasů — pro prodloužení, culíky, nakládky i paruky. Výroba z naší zásoby nebo z vašeho vlastního culíku. Délky 45–80 cm, výrobní doba 14 pracovních dní.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">

            {/* Co je tres */}
            <h2 className="text-3xl font-playfair text-burgundy mb-4">Co je vlasový tres?</h2>
            <p>
              Vlasový tres (anglicky <em>weft</em>) je pás pravých lidských vlasů sešitých do jedné linie. Přišívá se speciální jehlou přímo na copánky uplétené z vašich vlastních vlasů — bez chemie, bez tepla. Výsledkem je přirozené prodloužení nebo zhuštění, které nelze na první pohled odlišit od vlastních vlasů.
            </p>
            <p>
              Metoda je oblíbená u kadeřnic i zákaznic, protože tres lze zkrátit, tvarovat a přizpůsobit přesně potřebám každé klientky.
            </p>

            {/* Typy */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Typy vlasových tresů</h2>

            <div className="not-prose grid md:grid-cols-2 gap-4 mb-8">
              {[
                {
                  name: 'Ručně šitý tres (Hand-tied)',
                  desc: 'Tenký, měkký, téměř neviditelný. Vyroben ručně — každý vlas je individuálně připevněn k základní linii. Ideální pro prodloužení vlasů, nakládky a paruky, kde záleží na přirozeném vyznění.',
                  badge: 'Pro prodloužení a nakládky',
                },
                {
                  name: 'Strojový tres (Machine weft)',
                  desc: 'Pevnější a hustší základní linie sešitá strojem. Vhodný pro culíky, hustší výrobky a paruky s tresovou konstrukcí. Cenově dostupnější varianta.',
                  badge: 'Pro culíky a paruky',
                },
              ].map((t) => (
                <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-5">
                  <span className="text-xs font-medium bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full mb-3 inline-block">{t.badge}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Pro co */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Pro jaký výrobek tresy šijeme?</h2>
            <p className="mb-4">Typ tresu vždy volíme podle toho, k čemu bude sloužit. Proto se vždy ptáme — účel rozhoduje o hustotě, tloušťce i množství:</p>

            <div className="not-prose grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  use: 'Prodloužení vlasů',
                  weft: 'Tenký, měkký tres',
                  note: 'Přišívá se na copánky, splývá s vlastními vlasy',
                },
                {
                  use: 'Culíky a příčesky',
                  weft: 'Hustší, pevnější tres',
                  note: 'Potřeba větší objem a tvar, který drží',
                },
                {
                  use: 'Nakládky a paruky',
                  weft: 'Velmi tenký tres',
                  note: 'Minimální viditelnost základny, přirozený výsledek',
                },
              ].map((i) => (
                <div key={i.use} className="bg-ivory border border-burgundy/10 rounded-xl p-4">
                  <p className="font-semibold text-burgundy text-sm mb-1">{i.use}</p>
                  <p className="text-sm text-gray-700 font-medium mb-1">{i.weft}</p>
                  <p className="text-xs text-gray-500">{i.note}</p>
                </div>
              ))}
            </div>

            {/* Gramáže */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Gramáže a délky</h2>

            <div className="not-prose overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-burgundy text-white">
                    <th className="px-4 py-3 text-left">Délka</th>
                    <th className="px-4 py-3 text-left">Standardní gramáž</th>
                    <th className="px-4 py-3 text-left">Poznámka</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['45 cm', '100 g', 'Krátké prodloužení, zhušťování'],
                    ['50–55 cm', '100 g', 'Nejoblíbenější délka'],
                    ['60–65 cm', '100 g', 'Přirozené prodloužení'],
                    ['70–75 cm', '100 g', 'Výrazné prodloužení'],
                    ['80 cm', '100 g', 'Maximální délka v ceníku'],
                  ].map(([len, weight, note], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory'}>
                      <td className="px-4 py-3 font-medium text-gray-900">{len}</td>
                      <td className="px-4 py-3 text-gray-700">{weight}</td>
                      <td className="px-4 py-3 text-gray-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="not-prose text-sm text-gray-500 mb-8">Z 1 culíku (100 g) lze vytvořit tenký tres délky až 12 metrů. Přesné množství závisí na délce vlasů, hustotě a požadované tloušťce tresu.</p>

            {/* Výroba z culíku */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Výroba z vašeho vlastního culíku</h2>
            <p>
              Pokud máte vlastní culík, rádi z něj tresy vyrobíme. Před zakázkou ale vždy potřebujeme:
            </p>

            <div className="not-prose grid md:grid-cols-3 gap-4 my-6">
              {[
                { label: 'Foto vlasů', desc: 'Barva, struktura, stav — rovné a vlnité vlasy nelze kombinovat' },
                { label: 'Váha culíku', desc: 'Pro výrobek potřebujeme min. 200 g. Střední střih = 70–100 g — toho bývá málo' },
                { label: 'Historie vlasů', desc: 'Barvení, prodloužení, péče — vlasy po prodloužení bývají poškozené' },
              ].map((i) => (
                <div key={i.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{i.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>

            <div className="not-prose p-5 bg-amber-50 border border-amber-100 rounded-xl mb-10">
              <p className="font-semibold text-amber-800 mb-2">Na co si dát pozor</p>
              <ul className="space-y-1.5 text-sm text-amber-700">
                <li>— Blond vlasy ne vždy dosahují potřebné kvality — čestně posoudíme předem</li>
                <li>— Vlasy po prodloužení bývají mechanicky poškozené — nelze zaručit výsledek</li>
                <li>— Nelze kombinovat rovné a vlnité vlasy v jednom výrobku</li>
                <li>— Pokud vlasy pro výrobek nevhodné, raději odmítneme, než abychom nedosáhli výsledku</li>
              </ul>
            </div>

            {/* Aplikace */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Jak probíhá aplikace</h2>

            <div className="not-prose space-y-3 mb-8">
              {[
                'Kadeřnice uplete vaše vlasy do horizontálních copánků (cornrows), které tvoří základ.',
                'Vlasové tresy se přišívají speciální jehlou a nití přímo na copánky.',
                'Postup se opakuje po celé hlavě dle požadovaného objemu a hustoty.',
                'Aplikace trvá 3–6 hodin podle množství tresů a složitosti.',
                'Výsledek drží 2–3 měsíce, poté doporučujeme přepozicování.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-ivory border border-burgundy/20 text-burgundy rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Údržba */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-4">Péče o vlasové tresy</h2>

            <div className="not-prose bg-white border border-gray-200 rounded-xl p-6 mb-10">
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                Pravé vlasové tresy se chovají stejně jako vaše vlastní vlasy — potřebují pravidelnou péči, mytí a úpravu. Není to nevýhoda — je to znak kvality pravých vlasů.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Myjte vlasy šetrně, nedrhnete oblast copánků',
                  'Používejte hydratační šampony pro prodloužené vlasy',
                  'Nanášejte oleje na pokožku hlavy pro vlhkost',
                  'Spěte v hedvábné čepici nebo na hedvábném povlaku',
                  'Upravujte tresy (foukat, žehlit) jednou za 2–3 týdny',
                  'Přepozicování po 2–3 měsících u kadeřnice',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <h2 className="text-3xl font-playfair text-burgundy mt-10 mb-6">Časté otázky</h2>

            <div className="not-prose space-y-4 mb-10">
              {[
                {
                  q: 'Mohu tresy objednat i bez copánků?',
                  a: 'Tresy jako produkt (neaplikované) objednáte přímo v e-shopu nebo přes Instagram. Aplikaci (přišívání na copánky) zajišťuje kadeřnice — my vyrábíme tresy, aplikaci neprovádíme.',
                },
                {
                  q: 'Kolik tresů potřebuji?',
                  a: 'Závisí na délce vašich vlasů, jejich hustotě a požadovaném efektu. Standardně 100 g na prodloužení s přirozeným efektem. Na plné zhuštění 150–200 g. V případě nejistoty nás kontaktujte — poradíme.',
                },
                {
                  q: 'Lze tres stříhat nebo zkracovat?',
                  a: 'Ano — tres lze bez problémů stříhat na požadovanou délku. Je to jedna z výhod tresové metody.',
                },
                {
                  q: 'Jak dlouho vydrží vlasové tresy?',
                  a: 'Samotné tresy při správné péči vydrží 1–2 roky. Přišití na copánky se přepozicuje každé 2–3 měsíce.',
                },
                {
                  q: 'Jak dlouho trvá výroba na zakázku?',
                  a: '14 pracovních dní od potvrzení objednávky a přijetí zálohy 50 %.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

          </div>

          {/* CTA */}
          <div className="bg-ivory border border-burgundy/10 rounded-xl p-8 text-center">
            <p className="font-playfair text-2xl text-burgundy mb-2">Máte zájem o vlasové tresy?</p>
            <p className="text-gray-500 text-sm mb-6">Prohlédněte si naši nabídku nebo nás kontaktujte pro konzultaci.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
              >
                Prohlédnout vlasy k prodloužení
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
              >
                Kontaktovat nás
              </Link>
            </div>
          </div>

          {/* Související */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 mb-4">Další metody zakončení</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Vlasové pásky Tape-In' },
                { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Keratin prameny' },
                { href: '/metody-zakonceni', label: 'Všechny metody' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-burgundy hover:text-burgundy transition"
                >
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
