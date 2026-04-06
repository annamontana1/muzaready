import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Showroom Praha | Mùza Hair',
  description: 'Navštivte náš showroom v Praze. Osobní konzultace, ukázky vlasů a profesionální poradenství.',
};

export default function ShowroomPage() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Hero section */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-light mb-10"
          style={{ color: 'var(--text-soft)' }}
        >
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          {' — '}
          <span style={{ color: 'var(--text-mid)' }}>Showroom</span>
        </div>

        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          SHOWROOM PRAHA
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Showroom Praha
        </h1>

        <p
          className="text-[15px] leading-[1.8] font-light max-w-[520px] mb-12"
          style={{ color: 'var(--text-soft)' }}
        >
          Navštivte náš showroom v centru Prahy. Osobní konzultace, ukázky vlasů
          a profesionální poradenství od našich specialistů.
        </p>

        {/* Address & phone large display */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="w-12 h-px" style={{ background: 'var(--accent)' }} />
          <p
            className="font-cormorant text-[clamp(22px,2.5vw,32px)] font-light"
            style={{ color: 'var(--text-dark)' }}
          >
            Revoluční 8, Praha 1
          </p>
          <a
            href="tel:+420728722880"
            className="font-cormorant text-[clamp(20px,2vw,28px)] font-light transition-opacity hover:opacity-70"
            style={{ color: 'var(--burgundy)' }}
          >
            +420 728 722 880
          </a>
        </div>

        <div className="flex gap-6 flex-wrap">
          <a
            href="tel:+420728722880"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Zavolejte nám
          </a>
          <a
            href="https://wa.me/420728722880"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2"
            style={{ color: 'var(--text-mid)' }}
          >
            WhatsApp →
          </a>
        </div>
      </section>

      {/* Hours & appointment info */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          OTEVÍRACÍ DOBA
        </div>

        <h2
          className="font-cormorant text-[clamp(26px,3vw,38px)] font-light mb-8"
          style={{ color: 'var(--text-dark)' }}
        >
          Pouze na objednání
        </h2>

        <div className="max-w-md">
          <div
            className="flex justify-between py-4 border-b text-[15px] font-light"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-soft)' }}
          >
            <span>Pondělí — Neděle</span>
            <span style={{ color: 'var(--text-dark)' }}>10:00 — 20:00</span>
          </div>
          <div
            className="py-6 text-[15px] leading-[1.8] font-light"
            style={{ color: 'var(--text-soft)' }}
          >
            Showroom je otevřen výhradně po předchozí domluvě.
            Pro rezervaci termínu nás kontaktujte telefonicky nebo emailem.
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory-warm)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          KONTAKT
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {[
            { label: 'Adresa', value: 'Revoluční 8, 110 00 Praha 1', href: undefined },
            { label: 'Telefon', value: '+420 728 722 880', href: 'tel:+420728722880' },
            { label: 'Email', value: 'muzahaircz@gmail.com', href: 'mailto:muzahaircz@gmail.com' },
            { label: 'WhatsApp', value: '+420 728 722 880', href: 'https://wa.me/420728722880' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="py-8 pr-8 border-b md:border-b-0 md:border-r last:border-r-0"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div
                className="text-[11px] tracking-[0.15em] uppercase font-light mb-3"
                style={{ color: 'var(--text-soft)' }}
              >
                {item.label}
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-[15px] font-light transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {item.value}
                </a>
              ) : (
                <span
                  className="text-[15px] font-light"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
