import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Showroom Praha | Mùza Hair',
  description: 'Navštivte náš showroom v Praze. Osobní konzultace, ukázky vlasů a profesionální poradenství.',
};

export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-burgundy hover:text-maroon transition">
                Domů
              </Link>
            </li>
            <li className="text-text-soft">/</li>
            <li className="text-text-mid">Showroom</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Showroom Praha
          </h1>
          <p className="text-lg text-text-mid max-w-2xl mx-auto">
            Navštivte náš showroom v centru Prahy. Osobní konzultace, ukázky vlasů
            a profesionální poradenství od našich specialistů.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Address & Contact */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Kontaktní údaje</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark">Adresa</h3>
                  <p className="text-text-mid">Revoluční 8</p>
                  <p className="text-text-mid">110 00 Praha 1</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark">Telefon</h3>
                  <a href="tel:+420728722880" className="text-burgundy hover:text-maroon">
                    +420 728 722 880
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-dark">Email</h3>
                  <a href="mailto:info@muzahair.cz" className="text-burgundy hover:text-maroon">
                    info@muzahair.cz
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Otevírací doba</h2>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-warm-beige">
                <span className="text-text-mid">Pondělí - Pátek</span>
                <span className="font-medium text-text-dark">10:00 - 18:00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-beige">
                <span className="text-text-mid">Sobota</span>
                <span className="font-medium text-text-dark">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-mid">Neděle</span>
                <span className="font-medium text-text-soft">Zavřeno</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-burgundy/5 rounded-lg">
              <p className="text-sm text-text-mid">
                <strong>Tip:</strong> Pro osobní konzultaci doporučujeme předem
                rezervovat termín telefonicky nebo emailem.
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mt-12 bg-white rounded-xl shadow-soft p-8">
          <h2 className="text-2xl font-playfair text-burgundy mb-6 text-center">
            Co vás u nás čeká
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💇‍♀️</span>
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Osobní konzultace</h3>
              <p className="text-text-mid text-sm">
                Poradíme vám s výběrem správného typu vlasů a metody aplikace.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Ukázky vlasů</h3>
              <p className="text-text-mid text-sm">
                Prohlédněte si všechny naše kolekce a kvality vlasů osobně.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="font-semibold text-text-dark mb-2">Barvení na míru</h3>
              <p className="text-text-mid text-sm">
                Nabízíme profesionální barvení vlasů přímo v našem studiu.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="tel:+420728722880"
            className="inline-block bg-burgundy text-white px-8 py-3 rounded-lg font-medium hover:bg-maroon transition shadow-medium"
          >
            Zavolejte nám
          </a>
        </div>
      </div>
    </div>
  );
}
