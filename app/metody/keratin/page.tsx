import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keratin a Mikrokeratin | Metody prodlužování vlasů | Mùza Hair',
  description: 'Nejpopulárnější metoda prodlužování vlasů v ČR. Keratinové pramínky vydrží 3-6 měsíců. Profesionální aplikace s trvanlivým výsledkem.',
};

export default function KeratinPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <Link href="/metody" className="hover:text-burgundy">Metody</Link>
          {' / '}
          <span className="text-burgundy">Keratin / Mikrokeratin</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Keratin / Mikrokeratin
        </h1>

        {/* Main Content */}
        <div className="bg-white rounded-xl p-8 shadow-medium space-y-6">
          <div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Nejpopulárnější metoda prodlužování vlasů v ČR.</strong>
            </p>
            <p className="text-gray-700">
              Vlasy jsou připevněny pomocí keratinových pramínků (bonding), které se tepelně
              přitaví k vlastním vlasům. Mikrokeratin používá menší bondingy pro jemnější výsledek.
            </p>
          </div>

          {/* Výhody */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Výhody</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Velmi trvanlivé (3–6 měsíců)</li>
              <li>Přirozený vzhled</li>
              <li>Vhodné pro aktivní životní styl</li>
              <li>Možnost stylingu (žehlení, kulma)</li>
              <li>Bondingy jsou téměř neviditelné</li>
              <li>Vlasy lze barvit a tónovat</li>
            </ul>
          </div>

          {/* Pro koho */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Pro koho je vhodné</h2>
            <p className="text-gray-700">
              Zákaznice s hustějšími vlasy, které chtějí dlouhodobé řešení. Salony s profesionální
              keratin pistolí. Klientky, které preferují metodu s minimální údržbou.
            </p>
          </div>

          {/* Aplikace */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Jak probíhá aplikace</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Vlastní vlasy se rozdělí na jednotlivé pramínky</li>
              <li>Keratinový pramínek se přiloží k vlastnímu vlasu</li>
              <li>Keratin se zahřeje speciální pistolí (cca 180°C)</li>
              <li>Roztavený keratin se utváří do plochého bondingu</li>
              <li>Po vychladnutí je spojení pevné a trvanlivé</li>
            </ol>
            <p className="text-sm text-gray-600 mt-4 italic">
              Aplikace trvá 2–4 hodiny v závislosti na množství vlasů.
            </p>
          </div>

          {/* Cena */}
          <div className="bg-burgundy/5 p-6 rounded-lg border border-burgundy/20">
            <h2 className="text-2xl font-playfair text-burgundy mb-3">Orientační cena aplikace</h2>
            <p className="text-2xl font-bold text-burgundy mb-2">2 500 – 6 000 Kč</p>
            <p className="text-sm text-gray-600">
              Cena závisí na délce vlasů, množství pramínků a salonu. Cena neobsahuje vlasy.
            </p>
          </div>

          {/* Údržba */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Údržba</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Myjte vlasy šampony bez sulfátů</li>
              <li>✓ Kondicionér nanášejte pouze na délky, ne ke kořínkům</li>
              <li>✓ Pravidelně rozčesávejte speciálním hřebenem</li>
              <li>✓ Při spánku spletěte cop nebo culík</li>
              <li>✓ Repositioning po 3–6 měsících</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="btn-primary inline-block"
            >
              Prohlédnout vlasy vhodné pro keratin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
