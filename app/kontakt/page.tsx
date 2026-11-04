import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Kontakt a showroom Praha 1 | Mùza Hair',
  description: 'Showroom Mùza Hair Praha — Revoluční 8, Praha. Otevřeno Po–Pá 10:00–16:00, jiné hodiny a víkend po domluvě. Zavolejte nám nebo napište na Instagram.',
  alternates: { canonical: 'https://www.muzahair.cz/kontakt' },
};

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Revolu%C4%8Dn%C3%AD+8%2C+110+00+Praha+1';

const FACTS = [
  { k: 'Adresa', v: 'Revoluční 8, Praha' },
  { k: 'Otevírací doba', v: 'Po–Pá 10:00–16:00, jiné hodiny a víkend po domluvě' },
];

const CONTACTS = [
  { label: 'Telefon', value: '+420 728 722 880', href: 'tel:+420728722880' },
  { label: 'WhatsApp', value: '+420 728 722 880', href: 'https://wa.me/420728722880' },
  { label: 'E-mail', value: 'muzahaircz@gmail.com', href: 'mailto:muzahaircz@gmail.com' },
  { label: 'Instagram', value: '@muzahair.cz', href: 'https://www.instagram.com/muzahair.cz' },
];

const FAQ = [
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
];

export default function KontaktPage() {
  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      {/* Úvod */}
      <section className="mx-auto max-w-5xl px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Kontakt</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <h1 className="font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">Kontakt</h1>
            <p className="mt-5 text-base leading-relaxed max-w-xl text-[#45302F]">
              Showroom v centru Prahy — navštivte nás osobně nebo se ozvěte předem.
              Každé setkání věnujeme plnou pozornost.
            </p>

            <dl className="mt-8 max-w-xl">
              {FACTS.map((f, i) => (
                <div
                  key={f.k}
                  className={`flex justify-between gap-4 py-3 border-t border-muza-line ${i === FACTS.length - 1 ? 'border-b' : ''}`}
                >
                  <dt className="text-sm text-[#45302F]">{f.k}</dt>
                  <dd className="text-sm font-medium text-right">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="tel:+420728722880" className={BTN_PRIMARY}>Zavolat</a>
              <a href="https://wa.me/420728722880" target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
                Napsat na WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative aspect-[3/4] rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
              <Image
                src="/images/atelier/atelier-15.webp"
                alt="Balení vlasů v dílně Mùza"
                fill
                sizes="300px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Otevírací doba */}
      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">
            Otevřeno Po–Pá 10–16
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#45302F]">
            Návštěvu nám prosím předem napište. Jiný čas nebo víkend se dá také domluvit.
          </p>
        </div>
      </section>

      {/* Jak nás zastihnout */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Jak nás zastihnout</h2>
        <dl className="mt-6">
          {CONTACTS.map((item, i) => {
            const external = item.href.startsWith('http');
            return (
              <div
                key={item.label}
                className={`flex justify-between gap-4 py-3 border-t border-muza-line ${i === CONTACTS.length - 1 ? 'border-b' : ''}`}
              >
                <dt className="text-sm text-[#45302F]">{item.label}</dt>
                <dd className="text-sm font-medium text-right">
                  <a
                    href={item.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-muza-ink hover:underline underline-offset-4"
                  >
                    {item.value}
                  </a>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* Mapa */}
      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Revoluční 8, Praha</h2>
          <div className="mt-6 relative w-full aspect-[4/3] md:aspect-[16/7] bg-muza-mocha rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Revolu%C4%8Dn%C3%AD+8,+110+00+Praha+1&hl=cs&z=16&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mùza Hair Praha — showroom Revoluční 8"
            />
          </div>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-muza-ink underline underline-offset-4"
          >
            Otevřít v Mapách Google
          </a>
        </div>
      </section>

      {/* Otázky o návštěvě */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Otázky o návštěvě</h2>
        <div className="mt-5">
          {FAQ.map((item, n) => (
            <details key={item.q} className={`group py-4 border-t border-muza-line ${n === FAQ.length - 1 ? 'border-b' : ''}`}>
              <summary className="flex justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-medium">
                {item.q}
                <span aria-hidden="true" className="text-muza-ink text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-[#45302F]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Závěrečná výzva */}
      <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Těšíme se na vás</h2>
        <p className="mt-3 text-base text-[#45302F]">
          Zavolejte nám nebo napište na Instagram — domluvíme čas, který vám bude vyhovovat.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="tel:+420728722880" className={BTN_PRIMARY}>+420 728 722 880</a>
          <a href="https://www.instagram.com/muzahair.cz" target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
            @muzahair.cz
          </a>
        </div>
      </section>
    </div>
  );
}
