import Link from 'next/link';

// Pás fotek z ateliéru, který plyne zprava doleva.
// Pohyb jen přes transform (kompozitní vrstva), pás je zdvojený, aby se smyčka nikdy nepřetrhla.
const PHOTOS = [
  { src: '/images/atelier/atelier-08.webp', alt: 'Šití vlasové tresy na průmyslovém stroji' },
  { src: '/images/atelier/atelier-15.webp', alt: 'Balení objednávky: vlasy v hedvábném papíru v krabici' },
  { src: '/images/atelier/atelier-10.webp', alt: 'Háčkování vlasů do krajky při výrobě paruky' },
  { src: '/images/atelier/atelier-09.webp', alt: 'Ruční šití tresy zahnutou jehlou' },
  { src: '/images/atelier/atelier-12.webp', alt: 'Tým ateliéru Múza Hair' },
  { src: '/images/atelier/atelier-11.webp', alt: 'Tresování vlasů na kovovém rámu' },
  { src: '/images/atelier/atelier-17.webp', alt: 'Detail háčku a krajky při výrobě paruky' },
  { src: '/images/atelier/atelier-16.webp', alt: 'Detail rukou u šicího stroje s tresou' },
];

export default function AtelierStrip() {
  return (
    <section aria-labelledby="h-atelier" className="bg-muza-ink text-muza-onink py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase opacity-70 mb-3">Zákulisí</div>
          <h2 id="h-atelier" className="font-cormorant font-light text-[36px] leading-[1.04] lg:text-[52px]">
            Tady vlasy <em className="italic">vznikají.</em>
          </h2>
        </div>
        <Link href="/o-nas" className="hidden sm:inline-flex h-11 items-center px-5 rounded-full border border-muza-onink/40 text-sm hover:bg-muza-onink/10 transition-colors">
          Náš ateliér
        </Link>
      </div>

      {/* Zdvojený pás: druhá polovina je kopie první, posun o -50 % vrátí přesně na začátek */}
      <div className="mt-9 lg:mt-12 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <ul
          className="flex w-max gap-3 lg:gap-4 animate-marquee motion-reduce:animate-none will-change-transform"
          aria-label="Fotky z ateliéru"
        >
          {[...PHOTOS, ...PHOTOS].map((p, i) => (
            <li key={i} aria-hidden={i >= PHOTOS.length ? true : undefined} className="shrink-0 w-[72vw] sm:w-[380px] lg:w-[460px]">
              <div className="aspect-[3/2] overflow-hidden rounded-[18px] bg-muza-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={i >= PHOTOS.length ? '' : p.alt} loading="lazy" decoding="async" width={1200} height={800}
                  className="w-full h-full object-cover" draggable={false} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
