import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontakt | Múza Hair Praha',
  description: 'Showroom Múza Hair Praha — Revoluční 8, Praha. Otevřeno Po–Ne 10:00–20:00 pouze na objednání. Zavolejte nám nebo napište na Instagram.',
  alternates: { canonical: 'https://muzahair.cz/kontakt' },
};

export default function KontaktPage() {
  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Hero */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Showroom Praha
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6"
          style={{ color: 'var(--text-dark)' }}
        >
          Kontakt
        </h1>

        <p className="text-[15px] leading-[1.8] font-light max-w-md mb-12" style={{ color: 'var(--text-soft)' }}>
          Showroom v centru Prahy — navštivte nás osobně nebo se ozvěte předem.
          Každé setkání věnujeme plnou pozornost.
        </p>

        <div className="w-16 h-px mb-10" style={{ background: 'var(--accent)' }} />

        {/* Address prominent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <div
              className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal"
              style={{ color: 'var(--accent)' }}
            >
              Adresa
            </div>
            <p
              className="font-cormorant text-[22px] font-light leading-[1.4]"
              style={{ color: 'var(--text-dark)' }}
            >
              Revoluční 8<br />Praha
            </p>
          </div>

          <div>
            <div
              className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal"
              style={{ color: 'var(--accent)' }}
            >
              Otevírací doba
            </div>
            <p
              className="font-cormorant text-[22px] font-light leading-[1.4]"
              style={{ color: 'var(--text-dark)' }}
            >
              Po–Ne 10:00–20:00
            </p>
            <p className="text-[13px] font-light mt-2 tracking-[0.05em]" style={{ color: 'var(--text-soft)' }}>
              Pouze na objednání
            </p>
          </div>

          <div>
            <div
              className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal"
              style={{ color: 'var(--accent)' }}
            >
              Spojení
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+420728722880"
                className="font-cormorant text-[22px] font-light transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-dark)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="mailto:muzahaircz@gmail.com"
                className="text-[15px] font-light transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-soft)' }}
              >
                muzahaircz@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
        <div className="max-w-2xl">
          <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />
          <p
            className="font-cormorant text-[clamp(22px,2.5vw,30px)] font-light leading-[1.4] mb-6"
            style={{ color: 'var(--text-dark)' }}
          >
            Showroom funguje pouze na objednání
          </p>
          <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
            Každé setkání věnujeme individuální pozornost. Prosím, zavolejte nebo napište
            předem — domluvíme konkrétní čas jen pro vás.
          </p>
        </div>
      </section>

      {/* Contact actions */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory-warm)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Kontaktujte nás
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Jak nás zastihnout
        </h2>

        <div className="flex flex-col gap-0 max-w-xl mb-12">
          {[
            {
              label: 'Telefon',
              value: '+420 728 722 880',
              href: 'tel:+420728722880',
            },
            {
              label: 'WhatsApp',
              value: '+420 728 722 880',
              href: 'https://wa.me/420728722880',
            },
            {
              label: 'Email',
              value: 'muzahaircz@gmail.com',
              href: 'mailto:muzahaircz@gmail.com',
            },
            {
              label: 'Instagram',
              value: '@muzahair.cz',
              href: 'https://www.instagram.com/muzahair.cz',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-8 py-5 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-light w-24 flex-shrink-0"
                style={{ color: 'var(--text-soft)' }}
              >
                {item.label}
              </span>
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[15px] font-light transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-dark)' }}
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="tel:+420728722880"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Zavolat
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

      {/* Map */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Kde nás najdete
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-10"
          style={{ color: 'var(--text-dark)' }}
        >
          Revoluční 8, Praha
        </h2>

        <div className="w-full" style={{ height: '400px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.8!2d14.4285!3d50.0908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94f7a8c17c5d%3A0x0!2sRevolu%C4%8Dn%C3%AD+8%2C+110+00+Praha+1!5e0!3m2!1scs!2scz!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Múza Hair Praha — showroom Revoluční 8"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Časté otázky
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Otázky o návštěvě
        </h2>

        <div className="max-w-2xl flex flex-col gap-0">
          {[
            {
              q: 'Musím se objednat předem?',
              a: 'Ano — showroom funguje pouze na objednání. Každé setkání věnujeme individuální pozornost, proto prosím zavolejte nebo napište na Instagram a domluvíme čas.',
            },
            {
              q: 'Co se děje na osobní konzultaci?',
              a: 'Ukážeme vám fyzické vzorky vlasů, porovnáme odstíny s vašimi vlastními vlasy, poradíme s gramáží a metodou zakončení. Konzultace je zdarma a bez závazku.',
            },
            {
              q: 'Mohu si vlasy přímo v showroomu koupit?',
              a: 'Ano — pokud máme zboží skladem, lze zaplatit hotově nebo kartou přímo na místě. U zakázkové výroby se vlasy objednají a vyzvednou při druhé návštěvě.',
            },
            {
              q: 'Jak dlouho trvá konzultace?',
              a: 'Standardní konzultace trvá 30–60 minut. Vyhraďte si prosím dostatek času, ať není třeba spěchat.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 border-b"
              style={{ borderColor: 'var(--ivory-warm)' }}
            >
              <span
                className="block w-4 h-px mt-[13px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <p className="text-[15px] font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                  {item.q}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Těšíme se na vás
        </h2>

        <p className="text-[15px] leading-[1.8] font-light max-w-md mb-10" style={{ color: 'var(--text-soft)' }}>
          Zavolejte nám nebo napište na Instagram — domluvíme čas, který vám bude vyhovovat.
        </p>

        <div className="flex gap-4 flex-wrap items-center">
          <a
            href="tel:+420728722880"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            +420 728 722 880
          </a>
          <a
            href="https://www.instagram.com/muzahair.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2"
            style={{ color: 'var(--text-mid)' }}
          >
            @muzahair.cz →
          </a>
        </div>
      </section>

    </div>
  );
}
