import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metody zakončení vlasů | Keratin, Tape-in, Vlasové tresy | Mùza Hair',
  description: 'Přehled metod zakončení a aplikace vlasů k prodloužení. Keratin, Mikrokeratin, Tape-in nano tapes a ručně šité vlasové tresy.',
};

export default function MetodyZakonceniPage() {
  const methods = [
    {
      title: 'Keratin / Mikrokeratin',
      description: 'Nejpopulárnější metoda prodlužování vlasů v ČR. Keratinové pramínky vydrží 3-6 měsíců.',
      href: '/metody-zakonceni/vlasy-na-keratin',
      icon: '💎',
      highlights: ['Trvanlivé 3-6 měsíců', 'Přirozený vzhled', 'Pro aktivní životní styl']
    },
    {
      title: 'Vlasové tresy',
      description: 'Tradiční metoda bez chemie a tepla. Ideální pro afro a kudrnaté vlasy.',
      href: '/metody-zakonceni/vlasove-tresy',
      icon: '🧵',
      highlights: ['100% přírodní metoda', 'Bez chemie a tepla', 'Pro afro vlasy']
    },
  ];

  return (
    <div className="py-12 bg-soft-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <span className="text-burgundy">Metody zakončení</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Metody zakončení vlasů
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Vyberte si metodu aplikace, která nejlépe vyhovuje vašim vlasům a životnímu stylu.
            Každá metoda má své specifické výhody a je vhodná pro různé typy vlasů.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {methods.map((method) => (
            <Link
              key={method.href}
              href={method.href}
              className="bg-white rounded-xl p-8 shadow-medium hover:shadow-heavy transition-all duration-300 group"
            >
              <div className="text-5xl mb-4">{method.icon}</div>
              <h2 className="text-2xl font-playfair text-burgundy mb-3 group-hover:text-maroon transition">
                {method.title}
              </h2>
              <p className="text-gray-700 mb-4 text-sm">
                {method.description}
              </p>
              <ul className="space-y-2 mb-6">
                {method.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-burgundy mt-0.5">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="text-burgundy font-semibold text-sm group-hover:underline">
                Zjistit více →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
