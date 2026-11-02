import Link from 'next/link';

// Výběr druhu vlasů pod odstíny; každý vede rovnou do katalogu s nastaveným filtrem
// Středoevropské = barvené blond (odstíny 8–10), panenské = nebarvené (odstíny 1–7); filtr řeší katalog
const KINDS = [
  { name: 'Středoevropské vlasy', href: '/katalog?druh=stredoevropske' },
  { name: 'Panenské vlasy', href: '/katalog?druh=panenske' },
];

export default function HairKinds() {
  return (
    <section aria-label="Druh vlasů" className="bg-muza-ivory">
      <div className="max-w-7xl mx-auto px-5 lg:px-16 pb-12 lg:pb-16">
        <div className="max-w-[480px]">
          <div className="grid grid-cols-2 gap-2">
            {KINDS.map((k, i) => (
              <Link key={k.name} href={k.href}
                className={`h-[52px] px-4 rounded-full text-sm font-medium leading-tight flex items-center justify-center text-center transition-colors duration-150 ${i === 0 ? 'bg-muza-ink text-muza-onink hover:opacity-90' : 'bg-muza-mocha text-text-dark hover:bg-[#D3C6B9]'}`}>
                {k.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
