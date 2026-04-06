import Link from 'next/link';

export default function WeftInfoBanner() {
  return (
    <div className="bg-ivory border border-burgundy/20 rounded-xl p-6 my-8">
      <p className="font-semibold text-burgundy mb-3">Důležité informace o vlasových tresech</p>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-start gap-2 text-text-mid">
          <span className="text-burgundy font-bold mt-0.5">—</span>
          <span>Tresy vyrábíme na zakázku z vámi vybraných <strong>panenských, středoevropských nebo dětských vlasů</strong> z naší zásoby. Hotové tresy na skladě nemáme.</span>
        </div>
        <div className="flex items-start gap-2 text-text-mid">
          <span className="text-burgundy font-bold mt-0.5">—</span>
          <span>Výrobní doba je <strong>14 pracovních dní</strong> od potvrzení objednávky.</span>
        </div>
        <div className="flex items-start gap-2 text-text-mid">
          <span className="text-burgundy font-bold mt-0.5">—</span>
          <span>Cena se počítá podle gramáže a délky v{' '}
            <Link href="/vlasy-k-prodlouzeni" className="text-burgundy underline hover:opacity-75">
              konfigurátoru v košíku
            </Link>.
          </span>
        </div>
      </div>
    </div>
  );
}
