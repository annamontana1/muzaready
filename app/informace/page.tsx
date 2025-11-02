import Link from 'next/link';

export default function InformacePage() {
  const items = [
    { href: '/informace/jak-nakupovat', title: 'Jak nakupovat' },
    { href: '/informace/odeslani-a-stav-objednavky', title: 'Odeslání a stav objednávky' },
    { href: '/informace/platba-a-vraceni', title: 'Platba a vrácení' },
    { href: '/informace/obchodni-podminky', title: 'Obchodní podmínky' },
    { href: '/informace/faq', title: 'FAQ' },
    { href: '/informace/nas-pribeh', title: 'Náš příběh' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair text-burgundy mb-8">Informace</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-6 bg-ivory rounded-xl hover:shadow-medium transition"
            >
              <h3 className="text-xl font-playfair text-burgundy">{item.title} →</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
