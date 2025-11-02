export default function ONasPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-8">O nás</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            Jsme <strong>nově otevřený obchod s vlasy v Praze</strong>, ale na trhu působíme už <strong>8 let</strong>.
          </p>

          <p className="text-2xl font-playfair text-burgundy my-8">
            Nejkrásnější culíky široko daleko ❤️
          </p>

          <div className="bg-ivory p-8 rounded-xl my-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-4">Naše hodnoty</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-success">✓</span>
                <span><strong>Kvalita:</strong> 100% přírodní vlasy nejvyšší kvality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success">✓</span>
                <span><strong>Vlastní barvírna:</strong> Profesionální odbarvování blond odstínů</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success">✓</span>
                <span><strong>Ruční výroba:</strong> Každý kus je pečlivě vyráběn v Praze</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success">✓</span>
                <span><strong>8 let zkušeností:</strong> Víme, co naši zákazníci potřebují</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-playfair text-burgundy mb-4">Fyzická prodejna v Praze</h2>
          <p className="text-gray-700 mb-4">
            Navštivte nás v naší pražské prodejně, kde si můžete prohlédnout všechny produkty naživo
            a nechat se poradit našimi odborníky.
          </p>
        </div>
      </div>
    </div>
  );
}
