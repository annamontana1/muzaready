import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Příčesky a paruky - Mùza Hair Praha',
  description: 'Clip-in příčesky, ofiny, culíky a paruky na míru. Prémiová kvalita z pravých vlasů.',
};

export default function PriceskyAParukyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Příčesky a paruky
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          Objevte naši kolekci příčesků a paruk. Clip-in ofiny, culíky, příčešky na temeno i paruky na míru.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { href: '/pricesky-a-paruky/clip-in-ofiny', title: 'Clip-in ofiny', icon: '💇‍♀️', desc: 'Rychlé a jednoduché prodloužení vlasů' },
            { href: '/pricesky-a-paruky/clip-in-culiky', title: 'Clip-in culíky', icon: '🎀', desc: 'Nejkrásnější culíky široko daleko' },
            { href: '/pricesky-a-paruky/pricesek-na-temeno', title: 'Příčešek na temeno', icon: '👑', desc: 'Toupee pro zakrytí řídkých vlasů' },
            { href: '/pricesky-a-paruky/paruky-na-miru', title: 'Paruky na míru', icon: '✨', desc: 'Prémiové paruky šité na míru' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-8 bg-ivory rounded-xl shadow-light hover:shadow-card-hover transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-playfair text-burgundy mb-3">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.desc}</p>
              <span className="text-burgundy font-medium group-hover:underline">
                Zobrazit produkty →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
