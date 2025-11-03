import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tape-in (Nano Tapes) | Metody prodlužování vlasů | Mùza Hair',
  description: 'Nejšetrnější a nejrychlejší metoda aplikace. Tape-in pásky jsou opakovaně použitelné a ideální pro jemné vlasy.',
};

export default function TapeInPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <Link href="/metody-zakonceni" className="hover:text-burgundy">Metody zakončení</Link>
          {' / '}
          <span className="text-burgundy">Tape-in (nano tapes)</span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Tape-in (nano tapes)
        </h1>

        {/* Main Content */}
        <div className="bg-white rounded-xl p-8 shadow-medium space-y-6">
          <div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Nejšetrnější a nejrychlejší metoda aplikace.</strong>
            </p>
            <p className="text-gray-700">
              Vlasy jsou připevněny pomocí tenkých oboustranných pásek mezi vlastní vlasy.
              Nano tapes jsou extra tenké pro maximální diskrétnost.
            </p>
          </div>

          {/* Výhody */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Výhody</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Rychlá aplikace (30–60 minut)</li>
              <li>Velmi šetrná k vlasům</li>
              <li>Snadná údržba a repositioning</li>
              <li>Ideální pro jemné vlasy</li>
              <li>Opakovaně použitelné (3–5× repositioning)</li>
              <li>Žádné teplo ani chemie</li>
            </ul>
          </div>

          {/* Pro koho */}
          <div className="bg-ivory p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Pro koho je vhodné</h2>
            <p className="text-gray-700">
              Zákaznice s jemnými vlasy, které potřebují šetrnou metodu. Klientky, které chtějí
              pravidelně měnit look (repositioning každé 6–8 týdnů). Ideální pro začátečnice
              s prodlužováním vlasů.
            </p>
          </div>

          {/* Aplikace */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Jak probíhá aplikace</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Vlastní vlasy se rozdělí na horizontální proužky</li>
              <li>Spodní tape se přiloží zespodu vlasů</li>
              <li>Horní tape se přiloží nahoře</li>
              <li>Obě pásky se přitisknou k sobě a k vlasům</li>
              <li>Spojení je okamžitě pevné, bez čekání</li>
            </ol>
            <p className="text-sm text-gray-600 mt-4 italic">
              Aplikace trvá 30–60 minut v závislosti na množství tapes.
            </p>
          </div>

          {/* Repositioning */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Repositioning</h2>
            <p className="text-gray-700 mb-3">
              Po 6–8 týdnech se tapes sejme speciálním roztokem, vlasy se očistí a aplikují
              znovu s novými páskami. Původní vlasy lze použít 3–5×.
            </p>
            <p className="text-sm text-gray-600 italic">
              Cena repositioningu: 1 500 – 3 000 Kč (včetně nových pásek)
            </p>
          </div>

          {/* Cena */}
          <div className="bg-burgundy/5 p-6 rounded-lg border border-burgundy/20">
            <h2 className="text-2xl font-playfair text-burgundy mb-3">Orientační cena aplikace</h2>
            <p className="text-2xl font-bold text-burgundy mb-2">2 000 – 4 500 Kč</p>
            <p className="text-sm text-gray-600">
              Cena závisí na délce vlasů, množství tapes a salonu. Cena neobsahuje vlasy.
            </p>
          </div>

          {/* Údržba */}
          <div>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Údržba</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Myjte vlasy šampony bez sulfátů a olejů</li>
              <li>✓ Vyhněte se kondicionérům v oblasti pásek</li>
              <li>✓ Nenanášejte oleje na kořínky</li>
              <li>✓ Rozčesávejte jemně od konců</li>
              <li>✓ Repositioning každých 6–8 týdnů</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-gray-200">
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="btn-primary inline-block"
            >
              Prohlédnout vlasy připravené na tape-in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
