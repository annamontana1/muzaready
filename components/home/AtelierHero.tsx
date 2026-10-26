import Link from 'next/link';

// Úvod: hned pod hlavičkou plyne souvislý pás černobílých fotek z ateliéru, pod ním výběr druhu vlasů
// Středoevropské = barvené blond (odstíny 8–10), panenské = nebarvené (odstíny 1–7); filtr řeší katalog
const KINDS = [
  { name: 'Středoevropské vlasy', href: '/katalog?druh=stredoevropske' },
  { name: 'Panenské vlasy', href: '/katalog?druh=panenske' },
];

// Fotky jdou bez mezer těsně za sebou; pás je zdvojený, aby se smyčka (posun o −50 %) nikdy nepřetrhla
const PHOTOS = [
  { id: '10', alt: 'Výroba paruky: háčkování vlasů do krajky na hlavě figuríny' },
  { id: '07', alt: 'Ateliér Múza Hair v Praze: tým u pracovních stolů šije tresy a tresuje vlasy' },
  { id: '12', alt: 'Tým ateliéru Múza Hair' },
  { id: '08', alt: 'Šití vlasové tresy na průmyslovém stroji' },
  { id: '15', alt: 'Balení objednávky: vlasy v hedvábném papíru v krabici' },
  { id: '09', alt: 'Ruční šití tresy zahnutou jehlou' },
  { id: '11', alt: 'Tresování vlasů na kovovém rámu' },
  { id: '17', alt: 'Detail háčku a krajky při výrobě paruky' },
  { id: '16', alt: 'Detail rukou u šicího stroje s tresou' },
];

export default function AtelierHero() {
  return (
    <section className="bg-muza-ivory">
      {/* Pás fotek: pohyb jen přes transform, lineárně; při omezeném pohybu stojí a dá se posouvat prstem */}
      <div className="overflow-hidden bg-muza-ink motion-reduce:overflow-x-auto">
        <ul aria-label="Fotky z ateliéru" className="flex w-max animate-marquee motion-reduce:animate-none will-change-transform">
          {[...PHOTOS, ...PHOTOS].map((p, i) => (
            <li key={i} aria-hidden={i >= PHOTOS.length ? true : undefined} className="shrink-0 h-[58vw] max-h-[340px] lg:h-[520px] lg:max-h-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/atelier/atelier-${p.id}.webp`}
                alt={i >= PHOTOS.length ? '' : p.alt}
                width={1600} height={1073}
                loading={i < 3 ? undefined : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
                draggable={false}
                className="block h-full w-auto object-cover" />
            </li>
          ))}
        </ul>
      </div>

      {/* Ateliér */}
      <div className="px-5 pt-9 pb-14 lg:px-16 lg:py-16 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:items-start max-w-7xl mx-auto">
        <div>
          <h1 className="font-cormorant font-light text-muza-ink text-[44px] leading-[1.02] lg:text-[64px] tracking-[-0.01em]">
            Každý pramen prošel <em className="italic">našima rukama.</em>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-text-mid max-w-[420px]">
            Pravé vlasy z vlastní barvírny v Praze. Vyberte kolekci, délku a odstín si složíte na míru.
          </p>
        </div>

        <div className="mt-8 lg:mt-2 max-w-[480px]">
          <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-muza-ink mb-3">Vyberte vlasy</div>
          {/* Dva druhy vlasů; každý vede rovnou do katalogu s nastaveným filtrem */}
          <div className="grid grid-cols-2 gap-2">
            {KINDS.map((k, i) => (
              <Link key={k.name} href={k.href}
                className={`min-h-[56px] px-3 rounded-2xl text-[15px] leading-tight flex items-center justify-center text-center transition-colors duration-150 ${i === 0 ? 'bg-muza-ink text-muza-onink hover:opacity-90' : 'bg-muza-mocha text-text-dark hover:bg-[#D3C6B9]'}`}>
                {k.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
