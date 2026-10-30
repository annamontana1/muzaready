import Link from 'next/link';

// Krátké představení ateliéru s týmovou fotkou; navazuje na pás fotek v úvodu
export default function AtelierBand() {
  return (
    <section aria-labelledby="h-atelier" className="bg-muza-ink text-muza-onink">
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/atelier/atelier-12.webp" alt="Tým ateliéru Múza Hair v Praze" loading="lazy" decoding="async"
          width={1600} height={1073} className="block w-full aspect-[3/2] lg:aspect-auto lg:h-full object-cover" />
        <div className="px-5 py-10 lg:px-16 lg:py-20 flex flex-col justify-center">
          <div className="text-[12px] font-medium tracking-[0.14em] uppercase opacity-70 mb-3">Ateliér Praha 1</div>
          <h2 id="h-atelier" className="font-cormorant font-light text-[36px] leading-[1.04] lg:text-[52px]">
            Šijeme, tresujeme a balíme <em className="italic">v Praze.</em>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#E8D9CF] max-w-[460px]">
            Od roku 2016 vyrábíme vlasy sami: vlastní barvírna, vlastní šicí dílna a lidé, kteří každý pramen drželi v ruce.
          </p>
          <Link href="/o-nas" className="mt-6 inline-flex self-start h-11 items-center px-5 rounded-full border border-muza-onink/50 text-sm hover:bg-muza-onink/10 transition-colors">
            Poznejte ateliér
          </Link>
        </div>
      </div>
    </section>
  );
}
