import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ručně šité vlasové tresy (Sewing Wefts) | Metody | Mùza Hair',
  description: 'Tradiční metoda bez chemie a tepla. Ideální pro afro vlasy, kudrnaté vlasy a dready. 100% přírodní metoda.',
};

export default function VlasoveTresyPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <Link href="/metody" className="hover:text-burgundy">Metody</Link>
          {' / '}
          <span className="text-burgundy">Ručně šité vlasové tresy</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Ručně šité vlasové tresy (sewing wefts)
        </h1>

        {/* Main Content */}
        <div className="bg-white rounded-xl p-8 shadow-medium space-y-6">
          <div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Tradiční metoda používaná profesionály po celém světě.</strong>
            </p>
            <p className="text-gray-700">
              Vlasové tresy jsou ručně přišity ke copánkům upleteným z vlastních vlasů.
              Metoda známá také jako &quot;weaving&quot; nebo &quot;braiding&quot;.
            </p>
          </div>

          {/* Výhody */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Výhody</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Žádná chemie ani teplo</li>
              <li>Nejvíce šetrná metoda</li>
              <li>Ideální pro afro vlasy a dready</li>
              <li>Dlouhotrvající (2–3 měsíce)</li>
              <li>Přidání objemu po celé hlavě</li>
              <li>100% přírodní metoda</li>
            </ul>
          </div>

          {/* Pro koho */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Pro koho je vhodné</h2>
            <p className="text-gray-700">
              Afro salony, klientky s kudrnatými vlasy, tanečnice, umělkyně. Zákaznice,
              které chtějí 100% přírodní metodu bez chemie. Ideální pro prodloužení afro vlasů
              a vytvoření ochranných účesů.
            </p>
          </div>

          {/* Aplikace */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Jak probíhá aplikace</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Vlastní vlasy se upletou do horizontálních copánků (cornrows)</li>
              <li>Copánky slouží jako základ pro přišití tresů</li>
              <li>Vlasové tresy se ručně přišívají k copánkům speciální jehlou</li>
              <li>Proces se opakuje po celé hlavě podle požadovaného objemu</li>
              <li>Výsledek je pevný a trvanlivý</li>
            </ol>
            <p className="text-sm text-gray-600 mt-4 italic">
              Aplikace trvá 3–6 hodin v závislosti na složitosti a množství tresů.
            </p>
          </div>

          {/* Typy tresů */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Typy vlasových tresů</h2>
            <div className="space-y-3">
              <div className="p-4 bg-ivory rounded-lg">
                <h3 className="font-semibold text-burgundy mb-1">Machine weft (strojové)</h3>
                <p className="text-sm text-gray-700">
                  Tresy sešité strojem. Pevnější a vhodnější pro husté vlasy. Cenově dostupnější.
                </p>
              </div>
              <div className="p-4 bg-ivory rounded-lg">
                <h3 className="font-semibold text-burgundy mb-1">Hand-tied weft (ručně šité)</h3>
                <p className="text-sm text-gray-700">
                  Tresy ručně šité. Tenčí, jemnější a méně viditelné. Vhodné pro jemnější vlasy.
                </p>
              </div>
            </div>
          </div>

          {/* Cena */}
          <div className="bg-burgundy/5 p-6 rounded-lg border border-burgundy/20">
            <h2 className="text-2xl font-playfair text-burgundy mb-3">Orientační cena aplikace</h2>
            <p className="text-2xl font-bold text-burgundy mb-2">3 000 – 8 000 Kč</p>
            <p className="text-sm text-gray-600">
              Cena závisí na složitosti účesu, množství tresů a salonu. Cena neobsahuje vlasy.
            </p>
          </div>

          {/* Údržba */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Údržba</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Myjte vlasy šetrně, nedrhnete oblast copánků</li>
              <li>✓ Používejte hydratační šampony a kondicionéry</li>
              <li>✓ Nanášejte oleje na pokožku hlavy</li>
              <li>✓ Spěte v hedvábné čepici nebo na hedvábném povlaku</li>
              <li>✓ Repositioning po 2–3 měsících</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/vlasy-k-prodlouzeni/vlasove-tresy"
              className="btn-primary inline-block"
            >
              Prohlédnout vlasové tresy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
