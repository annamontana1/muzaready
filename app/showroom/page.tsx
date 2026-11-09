import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Showroom Praha 1 | Výběr vlasů na objednání | Mùza Hair',
  description: 'Showroom Mùza Hair — Revoluční 8, Praha 1 (metro Náměstí Republiky). Keratin, nanotapes, weft. Osobní konzultace a ukázky vlasů. Po–Pá 10–16, jiné hodiny a víkend po domluvě.',
  alternates: { canonical: 'https://www.muzahair.cz/showroom' },
};

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

const CONTACTS: { label: string; value: string; href?: string }[] = [
  { label: 'Adresa', value: 'Revoluční 8, 110 00 Praha 1' },
  { label: 'Telefon', value: '+420 728 722 880', href: 'tel:+420728722880' },
  { label: 'E-mail', value: 'muzahaircz@gmail.com', href: 'mailto:muzahaircz@gmail.com' },
  { label: 'WhatsApp', value: '+420 728 722 880', href: 'https://wa.me/420728722880' },
];

export default function ShowroomPage() {
  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      {/* Úvod */}
      <section className="mx-auto max-w-5xl px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Showroom</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <h1 className="font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">Showroom Praha</h1>
            <p className="mt-5 text-base leading-relaxed max-w-xl text-[#45302F]">
              Navštivte náš showroom v centru Prahy. Osobní konzultace, ukázky vlasů
              a profesionální poradenství od našich specialistů.
            </p>

            <dl className="mt-8 max-w-xl">
              {CONTACTS.map((item, i) => {
                const external = item.href?.startsWith('http');
                return (
                  <div
                    key={item.label}
                    className={`flex justify-between gap-4 py-3 border-t border-muza-line ${i === CONTACTS.length - 1 ? 'border-b' : ''}`}
                  >
                    <dt className="text-sm text-[#45302F]">{item.label}</dt>
                    <dd className="text-sm font-medium text-right">
                      {item.href ? (
                        <a
                          href={item.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="text-muza-ink hover:underline underline-offset-4"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="tel:+420728722880" className={BTN_PRIMARY}>Zavolejte nám</a>
              <a href="https://wa.me/420728722880" target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
                Napsat na WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative aspect-[3/4] rounded-t-full rounded-b-[12px] overflow-hidden bg-muza-mocha">
              <Image
                src="/images/atelier/atelier-12.webp"
                alt="Tým Mùza"
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
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Otevírací doba</h2>
          <dl className="mt-6">
            <div className="flex justify-between gap-4 py-3 border-t border-b border-muza-line">
              <dt className="text-sm text-[#45302F]">Pondělí – pátek</dt>
              <dd className="text-sm font-medium text-right">10:00–16:00, jiné hodiny a víkend po domluvě</dd>
            </div>
          </dl>
          <p className="mt-5 text-base leading-relaxed text-[#45302F]">
            Otevřeno Po–Pá 10:00–16:00, jiné hodiny a víkend po domluvě. Návštěvu nám prosím předem napište.
            Jiný čas nebo víkend se dá také domluvit, kontaktujte nás telefonicky nebo e-mailem.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[#45302F]">
            V showroomu si vlasy vyberete a koupíte. Samotná aplikace probíhá v našem partnerském salonu v Praze.
          </p>
          <Link href="/kontakt" className="mt-5 inline-block text-sm text-muza-ink underline underline-offset-4">
            Mapa a další kontakty
          </Link>
        </div>
      </section>
    </div>
  );
}
