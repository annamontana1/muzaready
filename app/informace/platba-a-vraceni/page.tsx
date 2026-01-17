'use client';

import Link from 'next/link';

export default function PlatbaAVraceniPage() {
  const paymentMethods = [
    {
      name: 'Platba kartou online',
      icon: '💳',
      description: 'Visa, Mastercard, Maestro přes zabezpečenou bránu GoPay',
      details: 'Okamžité zpracování, bezpečné šifrování',
      recommended: true,
    },
    {
      name: 'Bankovní převod',
      icon: '🏦',
      description: 'Převod na náš bankovní účet',
      details: 'Zpracování do 1-2 pracovních dnů po připsání platby',
      recommended: false,
    },
    {
      name: 'Dobírka',
      icon: '📦',
      description: 'Platba při převzetí zásilky',
      details: 'Příplatek 50 Kč za službu dobírky',
      recommended: false,
    },
  ];

  const shippingMethods = [
    {
      name: 'Zásilkovna',
      icon: '📍',
      price: '65 Kč',
      freeFrom: '3 000 Kč',
      time: '1-2 pracovní dny',
      description: 'Vyzvednutí na více než 7 000 výdejních místech',
    },
    {
      name: 'PPL kurýr',
      icon: '🚚',
      price: '150 Kč',
      freeFrom: '3 000 Kč',
      time: '1-2 pracovní dny',
      description: 'Doručení na adresu v pracovních dnech',
    },
    {
      name: 'Osobní odběr Praha',
      icon: '🏪',
      price: 'Zdarma',
      freeFrom: null,
      time: 'Po domluvě',
      description: 'V našem showroomu v centru Prahy',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platba a vrácení
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bezpečné platby, rychlé doručení a snadné vrácení
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Payment Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            💳 Způsoby platby
          </h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className={`bg-white rounded-xl p-6 border-2 ${
                  method.recommended ? 'border-green-200' : 'border-gray-100'
                } shadow-sm`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{method.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{method.name}</h3>
                      {method.recommended && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Doporučeno
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{method.description}</p>
                    <p className="text-sm text-gray-500 mt-1">{method.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🚚 Způsoby doručení
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {shippingMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="text-3xl mb-3">{method.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{method.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{method.description}</p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Cena:</span>
                      <span className="font-semibold">{method.price}</span>
                    </p>
                    {method.freeFrom && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Zdarma od:</span>
                        <span className="font-semibold text-green-600">{method.freeFrom}</span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="text-gray-500">Doba:</span>
                      <span className="font-semibold">{method.time}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              🎉 Doprava zdarma při objednávce nad 3 000 Kč
            </p>
          </div>
        </section>

        {/* Returns */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ↩️ Vrácení zboží
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  14 dní na vrácení
                </h3>
                <p className="text-gray-600 mb-4">
                  Máte právo odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání důvodu.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Zboží musí být nepoužité a v původním obalu
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Vraťte kompletní balení včetně příslušenství
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Peníze vrátíme do 14 dnů od obdržení vráceného zboží
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  Jak vrátit zboží
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <span>Kontaktujte nás na info@muzahair.cz</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <span>Vyplňte formulář pro odstoupení od smlouvy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <span>Zboží zašlete na naši adresu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <span>Peníze vrátíme na váš účet</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Complaints */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🔧 Reklamace
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  ⏰
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Záruční doba 24 měsíců</h3>
                  <p className="text-gray-600">
                    Na všechny produkty poskytujeme záruku 24 měsíců od data nákupu.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  📧
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Nahlášení reklamace</h3>
                  <p className="text-gray-600">
                    Kontaktujte nás na info@muzahair.cz s popisem závady a fotodokumentací.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Rychlé vyřízení</h3>
                  <p className="text-gray-600">
                    Reklamace vyřizujeme do 30 dnů. Obvykle však mnohem rychleji.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ❓ Časté dotazy
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Mohu změnit způsob platby po odeslání objednávky?</h3>
              <p className="text-gray-600">
                Ano, kontaktujte nás co nejdříve a pokusíme se změnu provést, pokud ještě nebyla objednávka zpracována.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Kdy dostanu peníze zpět při vrácení?</h3>
              <p className="text-gray-600">
                Peníze vracíme do 14 dnů od přijetí vráceného zboží, stejnou metodou jakou jste platili.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Kdo hradí poštovné při vrácení?</h3>
              <p className="text-gray-600">
                Při odstoupení od smlouvy do 14 dnů hradí poštovné zákazník. Při reklamaci hradíme poštovné my.
              </p>
            </div>
          </div>
        </section>

        {/* Links */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Související informace:
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/informace/obchodni-podminky"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Obchodní podmínky
            </Link>
            <Link
              href="/reklamace"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Reklamační řád
            </Link>
            <Link
              href="/sledovani-objednavky"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Sledování objednávky
            </Link>
            <Link
              href="/kontakt"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
