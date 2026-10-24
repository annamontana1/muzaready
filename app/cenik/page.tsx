import type { Metadata } from 'next';
import { FAQSchema, BreadcrumbSchema, SpeakableSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Ceník vlasů k prodloužení 2025 | Mùza Hair Praha',
  description: 'Aktuální ceny vlasů k prodloužení Mùza Hair. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč. Ceny výroby: keratin 1 000 Kč, nanotapes 3 990 Kč, tresy 5 990 Kč.',
  keywords: [
    'cena vlasů k prodloužení',
    'ceník prodloužení vlasů Praha',
    'cena keratin vlasy',
    'cena nano tapes vlasy',
    'cena vlasových tresů',
    'panenské vlasy cena',
    'prodloužení vlasů cena Praha',
  ],
  openGraph: {
    title: 'Ceník – Vlasy k prodloužení | Mùza Hair',
    description: 'Transparentní ceník vlasů k prodloužení. Standard od 6 900 Kč, LUXE od 8 900 Kč, Platinum od 10 900 Kč.',
    url: 'https://muzahair.cz/cenik',
  },
  alternates: {
    canonical: 'https://muzahair.cz/cenik',
  },
};

const cenikFAQ = [
  {
    question: 'Kolik stojí vlasy k prodloužení u Mùza Hair?',
    answer: 'Cena závisí na třídě kvality: Standard od 6 900 Kč/100g (3–6 měs.), LUXE od 8 900 Kč/100g (12–18 měs.), Platinum od 10 900 Kč/100g (18–24 měs.). K ceně vlasů se připočítává výroba zakončení: keratin 1 000 Kč/100g, nanotapes 3 990 Kč/100g, hand weft tresy 5 990 Kč/100g.',
  },
  {
    question: 'Co je zahrnuto v ceně vlasů?',
    answer: 'V základní ceně vlasů (6 900–10 900 Kč/100g) je zahrnut samotný culík vlasů v požadované délce a odstínu. Výroba zakončení (keratin, pásky, tresy) se účtuje zvlášť. Dobrovolný doplněk: zatmavení kořínků za 690 Kč/100g.',
  },
  {
    question: 'Jsou ceny s DPH?',
    answer: 'Ano, všechny ceny jsou konečné a zahrnují DPH.',
  },
  {
    question: 'Jak zaplatit za vlasy k prodloužení?',
    answer: 'Platba probíhá vždy předem bankovním převodem. Zakázková výroba začíná po přijetí platby. Hotové výrobky z katalogu lze zaplatit kartou online při objednávce.',
  },
];

export default function CenikPage() {
  return (
    <>
      <FAQSchema items={cenikFAQ} />
      <BreadcrumbSchema items={[
        { name: 'Domů', url: 'https://muzahair.cz' },
        { name: 'Ceník', url: 'https://muzahair.cz/cenik' },
      ]} />
      <SpeakableSchema
        url="/cenik"
        cssSelector={['h1', '.price-description', '.faq-answer']}
      />

      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Ceník vlasů k prodloužení
          </h1>
          <p className="price-description text-lg text-gray-600 mb-12 max-w-2xl">
            Transparentní ceny – žádné skryté poplatky. Všechny ceny jsou konečné s DPH.
          </p>

          {/* Vlasy – základní ceny */}
          <section className="mb-16">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Vlasy k prodloužení</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-beige rounded-2xl p-6">
                <div className="text-sm uppercase tracking-widest text-taupe mb-2">Standard</div>
                <div className="text-3xl font-playfair text-burgundy mb-1">od 6 900 Kč</div>
                <div className="text-gray-500 text-sm mb-4">za 100 g / 45–90 cm</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ 100% panenské vlasy</li>
                  <li>✓ Délka nošení 3–6 měsíců</li>
                  <li>✓ 10 odstínů</li>
                  <li>✓ Nebarvené i blond</li>
                </ul>
              </div>

              <div className="border-2 border-burgundy rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-burgundy text-white text-xs px-4 py-1 rounded-full">
                  Nejoblíbenější
                </div>
                <div className="text-sm uppercase tracking-widest text-taupe mb-2">LUXE</div>
                <div className="text-3xl font-playfair text-burgundy mb-1">od 8 900 Kč</div>
                <div className="text-gray-500 text-sm mb-4">za 100 g / 45–90 cm</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ 100% panenské vlasy</li>
                  <li>✓ Délka nošení 12–18 měsíců</li>
                  <li>✓ 10 odstínů</li>
                  <li>✓ Prémiová hustota vlákna</li>
                </ul>
              </div>

              <div className="border border-beige rounded-2xl p-6 bg-cream">
                <div className="text-sm uppercase tracking-widest text-taupe mb-2">Platinum 🏆</div>
                <div className="text-3xl font-playfair text-burgundy mb-1">od 10 900 Kč</div>
                <div className="text-gray-500 text-sm mb-4">za 100 g / 45–90 cm</div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Původ UA / PL / RO</li>
                  <li>✓ Délka nošení 18–24 měsíců</li>
                  <li>✓ Certifikát původu</li>
                  <li>✓ Nejvyšší hustota kutikuly</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Výroba zakončení */}
          <section className="mb-16">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Výroba zakončení</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Metoda</th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Cena / 100 g</th>
                    <th className="text-left py-3 font-semibold text-gray-900">Doba výroby</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="font-medium">Keratin Standard / Micro / Pásky</div>
                      <div className="text-gray-500 text-xs mt-0.5">Klasická aplikace keratinovými spoji</div>
                    </td>
                    <td className="py-4 pr-4 font-semibold">1 000 Kč</td>
                    <td className="py-4 text-gray-600">1–3 dny</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="font-medium">Nanotapes 2,8 cm nebo 4 cm</div>
                      <div className="text-gray-500 text-xs mt-0.5">Páskové prodloužení pro přirozený výsledek</div>
                    </td>
                    <td className="py-4 pr-4 font-semibold">3 990 Kč</td>
                    <td className="py-4 text-gray-600">10–14 dní</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="font-medium">Hand Weft – ručně šité tresy</div>
                      <div className="text-gray-500 text-xs mt-0.5">Ruční tkaní pro maximální přirozenost</div>
                    </td>
                    <td className="py-4 pr-4 font-semibold">5 990 Kč</td>
                    <td className="py-4 text-gray-600">10–14 dní</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Volitelný doplněk: zatmavení kořínků +690 Kč / 100 g. Možná odchylka hmotnosti ~5 %.
            </p>
          </section>

          {/* FAQ sekce */}
          <section className="mb-12">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Časté dotazy k cenám</h2>
            <div className="space-y-4">
              {cenikFAQ.map((item) => (
                <div key={item.question} className="bg-ivory rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="faq-answer text-gray-700 text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center p-8 bg-burgundy text-white rounded-2xl">
            <h2 className="text-2xl font-playfair mb-3">Připraveny objednat?</h2>
            <p className="mb-6 opacity-90">Konfigurátor vám pomůže sestavit přesnou objednávku s cenou.</p>
            <a
              href="/vlasy-k-prodlouzeni"
              className="inline-block bg-white text-burgundy font-semibold px-8 py-3 rounded-full hover:bg-cream transition-colors"
            >
              Vybrat vlasy
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
