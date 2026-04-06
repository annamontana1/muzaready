import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kontakt | Múza Hair Praha',
  description: 'Showroom Múza Hair Praha — Revoluční 8, Praha. Otevřeno Po–Ne 10:00–20:00 pouze na objednání. Zavolejte nám nebo napište na Instagram.',
  alternates: { canonical: 'https://muzahair.cz/kontakt' },
};

export default function KontaktPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
          Kontakt
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Showroom v Praze — navštivte nás osobně nebo nás kontaktujte předem.
        </p>

        {/* Důležité upozornění */}
        <div className="bg-ivory border-l-4 border-burgundy p-6 rounded-xl mb-10">
          <p className="font-semibold text-gray-900 mb-1">Showroom pouze na objednání</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Každé setkání věnujeme plnou pozornost. Prosím, zavolejte nebo napište předem — domluvíme konkrétní čas jen pro vás.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">

          {/* Kontaktní údaje */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-playfair text-burgundy mb-5">Kontaktní údaje</h2>
              <div className="space-y-4 text-sm">

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-burgundy">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Showroom Praha</p>
                    <p className="text-gray-500">Revoluční 8, Praha</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-burgundy">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Otevírací doba</p>
                    <p className="text-gray-500">Po–Ne: 10:00–20:00</p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">Pouze na objednání</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-burgundy">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <a href="tel:+420728722880" className="text-burgundy hover:underline">
                      +420 728 722 880
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-burgundy">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:muzahaircz@gmail.com" className="text-burgundy hover:underline">
                      muzahaircz@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-burgundy">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Instagram</p>
                    <a
                      href="https://www.instagram.com/muzahair.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burgundy hover:underline"
                    >
                      @muzahair.cz
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA tlačítka */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+420728722880"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Zavolat
              </a>
              <a
                href="https://www.instagram.com/muzahair.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-ivory transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-xl overflow-hidden border border-gray-200 h-full min-h-[350px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.8!2d14.4285!3d50.0908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94f7a8c17c5d%3A0x0!2sRevolu%C4%8Dn%C3%AD+8%2C+110+00+Praha+1!5e0!3m2!1scs!2scz!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Múza Hair Praha — showroom Revoluční 8"
            />
          </div>

        </div>

        {/* FAQ */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-playfair text-burgundy mb-6">Časté otázky o návštěvě</h2>
          <div className="space-y-4">
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
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dolní CTA */}
        <div className="mt-10 bg-ivory border border-burgundy/10 rounded-xl p-8 text-center">
          <p className="font-playfair text-2xl text-burgundy mb-2">Těšíme se na vás</p>
          <p className="text-gray-500 text-sm mb-6">Zavolejte nám nebo napište na Instagram — domluvíme čas, který vám bude vyhovovat.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+420728722880"
              className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-xl hover:opacity-90 transition"
            >
              +420 728 722 880
            </a>
            <a
              href="https://www.instagram.com/muzahair.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-burgundy text-burgundy text-sm font-medium rounded-xl hover:bg-white transition"
            >
              @muzahair.cz na Instagramu
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
