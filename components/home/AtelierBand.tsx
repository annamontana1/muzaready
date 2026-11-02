import Link from 'next/link';

// Krátké představení ateliéru s týmovou fotkou; navazuje na pás fotek v úvodu
export default function AtelierBand() {
  return (
    <section aria-labelledby="h-atelier" className="bg-muza-ink text-muza-onink">
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/atelier/atelier-12.webp" alt="Tým ateliéru Mùza Hair v Praze" loading="lazy" decoding="async"
          width={1600} height={1073} className="block w-full bg-muza-mocha aspect-[3/2] lg:aspect-auto lg:h-full object-cover" />
        <div className="px-5 py-10 lg:px-16 lg:py-20 flex flex-col justify-center">
          <h2 id="h-atelier" className="font-cormorant font-light text-[36px] leading-[1.04] lg:text-[52px]">
            Šijeme, tresujeme a balíme <em className="italic">v Praze.</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#E8D9CF] max-w-[460px]">
            Už 10 let, od roku 2016, vyrábíme vlasy sami: vlastní barvírna, vlastní šicí dílna a lidé, kteří každý pramen drželi v ruce. Vlasy si můžete vybrat i osobně v našem showroomu v Praze.
          </p>
          <Link href="/o-nas" className="mt-6 inline-flex self-start h-[52px] items-center justify-center px-7 rounded-full border border-muza-onink text-muza-onink text-sm font-medium hover:bg-muza-onink/10 transition-colors">
            Poznejte ateliér
          </Link>
        </div>
      </div>
    </section>
  );
}
