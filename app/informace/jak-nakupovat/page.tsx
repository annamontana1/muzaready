'use client';

import Link from 'next/link';

export default function JakNakupovatPage() {
  const steps = [
    {
      number: '1',
      title: 'Vyberte si vlasy',
      description: 'Procházejte náš katalog a vyberte si typ vlasů, odstín a délku.',
      details: [
        'Vyberte kategorii: Standard, LUXE nebo Platinum Edition',
        'Zvolte odstín (1-10) podle vašich vlastních vlasů',
        'Určete délku (40-80 cm)',
        'Vyberte strukturu: rovné, vlnité nebo kudrnaté',
      ],
      icon: '🔍',
    },
    {
      number: '2',
      title: 'Určete gramáž',
      description: 'Zvolte množství vlasů podle hustoty a požadovaného efektu.',
      details: [
        '100g - lehké zhušťění, jemný efekt',
        '150g - střední hustota, přirozený look',
        '200g - plný objem, výrazné prodloužení',
        '250g+ - maximální hustota, dramatický efekt',
      ],
      icon: '⚖️',
    },
    {
      number: '3',
      title: 'Zvolte zakončení',
      description: 'Vyberte typ zakončení podle vaší preferované metody prodloužení.',
      details: [
        'Keratin - klasické keratinové bondy pro trvalé prodloužení',
        'Bez zakončení - pro clip-in nebo vlastní úpravu',
      ],
      icon: '✂️',
    },
    {
      number: '4',
      title: 'Přidejte do košíku',
      description: 'Zkontrolujte výběr a přidejte do košíku.',
      details: [
        'Můžete kombinovat více produktů',
        'Sledujte cenu za gram i celkovou cenu',
        'Doprava zdarma od 3 000 Kč',
      ],
      icon: '🛒',
    },
    {
      number: '5',
      title: 'Dokončete objednávku',
      description: 'Vyplňte doručovací údaje a zaplaťte.',
      details: [
        'Platba kartou přes GoPay',
        'Bankovní převod',
        'Zásilkovna, PPL nebo osobní odběr Praha',
      ],
      icon: '💳',
    },
  ];

  const tips = [
    {
      title: 'Nejste si jisti odstínem?',
      content: 'Navštivte náš showroom v Praze nebo nám pošlete fotku na WhatsApp - rádi poradíme.',
      link: '/kontakt',
      linkText: 'Kontaktujte nás',
    },
    {
      title: 'Kolik gramů potřebuji?',
      content: 'Pro běžné prodloužení doporučujeme 150-200g. Pro velmi husté vlasy nebo dramatický efekt 200-300g.',
      link: '/informace/faq',
      linkText: 'Více v FAQ',
    },
    {
      title: 'První nákup?',
      content: 'Přihlaste se k odběru newsletteru a získejte slevu 10% na první objednávku.',
      link: null,
      linkText: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jak nakupovat
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Průvodce nákupem vlasů k prodloužení v 5 jednoduchých krocích
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                      Krok {step.number}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-pink-500 mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Užitečné tipy
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{tip.content}</p>
                {tip.link && (
                  <Link
                    href={tip.link}
                    className="text-pink-600 text-sm font-medium hover:text-pink-700"
                  >
                    {tip.linkText} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Připraveni nakupovat?</h2>
          <p className="mb-6 text-pink-100">
            Prohlédněte si náš katalog a najděte své ideální vlasy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/katalog"
              className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition"
            >
              Procházet katalog
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition border border-pink-400"
            >
              Potřebuji poradit
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Může se vám také hodit:
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/informace/platba-a-vraceni"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Platba a vrácení
            </Link>
            <Link
              href="/informace/faq"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Časté dotazy
            </Link>
            <Link
              href="/informace/obchodni-podminky"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Obchodní podmínky
            </Link>
            <Link
              href="/sledovani-objednavky"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Sledování objednávky
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
