// Úvod: hned pod hlavičkou plyne souvislý pás černobílých fotek z ateliéru a nadpis;
// pod ním odstíny, výběr druhu vlasů (HairKinds) a culíky k odeslání

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
      <div className="px-5 pt-9 pb-2 lg:px-16 lg:pt-16 lg:pb-4 max-w-7xl mx-auto">
        <h1 className="font-cormorant font-light text-muza-ink text-[44px] leading-[1.02] lg:text-[64px] tracking-[-0.01em]">
          Každý pramen prošel <em className="italic">našima rukama.</em>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-mid max-w-[420px]">
          Pravé vlasy z vlastní barvírny v Praze. Vyberte odstín a druh vlasů.
        </p>
      </div>
    </section>
  );
}
