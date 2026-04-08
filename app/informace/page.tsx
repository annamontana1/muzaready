import Link from 'next/link';

// ISR - revalidate every day
export const revalidate = 86400;

const items = [
  {
    href: '/informace/jak-nakupovat',
    title: 'Jak nakupovat',
    description: 'Průvodce nákupem v e-shopu — výběr produktu, objednávka, způsoby platby.',
  },
  {
    href: '/informace/odeslani-a-stav-objednavky',
    title: 'Odeslání a stav objednávky',
    description: 'Informace o době zpracování, sledování zásilky a doručení.',
  },
  {
    href: '/informace/platba-a-vraceni',
    title: 'Platba a vrácení',
    description: 'Přijímané způsoby platby, podmínky vrácení zboží a reklamace.',
  },
  {
    href: '/informace/obchodni-podminky',
    title: 'Obchodní podmínky',
    description: 'Plné znění obchodních podmínek e-shopu Mùza Hair.',
  },
  {
    href: '/informace/faq',
    title: 'FAQ',
    description: 'Odpovědi na nejčastější otázky o produktech, dopravě a péči o vlasy.',
  },
  {
    href: '/informace/nas-pribeh',
    title: 'Náš příběh',
    description: 'Jak vznikla Mùza Hair, naše hodnoty a co nás odlišuje od ostatních.',
  },
];

export default function InformacePage() {
  return (
    <div style={{ background: 'var(--ivory)' }} className="min-h-screen">
      {/* Header */}
      <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            ZÁKAZNICKÝ SERVIS
          </div>
          <h1 className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12]" style={{ color: 'var(--text-dark)' }}>
            Informace
          </h1>
        </div>
      </div>

      {/* Link list */}
      <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
        <div className="max-w-3xl">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b py-8 group transition-opacity hover:opacity-70"
              style={{ borderColor: 'rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h2 className="font-cormorant text-[clamp(20px,2vw,26px)] font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                    {item.title}
                  </h2>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                    {item.description}
                  </p>
                </div>
                <span className="text-[18px] flex-shrink-0 mt-1 font-light transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-soft)' }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
