import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recenze zákazníků - Mùza Hair Praha',
  description: 'Přečtěte si recenze našich spokojených zákazníků. Reálné zkušenosti s prodlouženými vlasy od Mùza Hair.',
};

export default function RecenzePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Recenze zákazníků
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          Přečtěte si recenze našich spokojených zákazníků. Jejich reálné zkušenosti
          s našimi produkty a službami.
        </p>

        {/* Placeholder pro budoucí recenze */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recenze 1 */}
          <div className="bg-ivory p-6 rounded-xl shadow-light">
            <div className="flex items-center gap-1 mb-3 text-burgundy">
              {'★'.repeat(5)}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;LUXE kvalita je naprosto skvělá! Vlasy vypadají úžasně přirozeně
              a jsou neuvěřitelně hebké. Určitě budu objednávat znovu.&rdquo;
            </p>
            <p className="text-sm font-semibold text-burgundy">
              Karolína P., Praha
            </p>
          </div>

          {/* Recenze 2 */}
          <div className="bg-ivory p-6 rounded-xl shadow-light">
            <div className="flex items-center gap-1 mb-3 text-burgundy">
              {'★'.repeat(5)}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;Objednala jsem si Platinum edition a jsem nadšená! Kvalita je
              perfektní, vlasy vydrží dlouho a stále vypadají skvěle.&rdquo;
            </p>
            <p className="text-sm font-semibold text-burgundy">
              Michaela Š., Brno
            </p>
          </div>

          {/* Recenze 3 */}
          <div className="bg-ivory p-6 rounded-xl shadow-light">
            <div className="flex items-center gap-1 mb-3 text-burgundy">
              {'★'.repeat(5)}
            </div>
            <p className="text-gray-700 mb-4 italic">
              &ldquo;Skvělý poměr ceny a kvality! Standard kvalita je úplně dostačující
              a vlasy vypadají krásně. Rychlé doručení, profesionální přístup.&rdquo;
            </p>
            <p className="text-sm font-semibold text-burgundy">
              Petra M., Ostrava
            </p>
          </div>
        </div>

        {/* Trust stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-playfair text-burgundy mb-2">4.9</div>
            <div className="text-sm text-gray-600">Průměrné hodnocení</div>
          </div>
          <div>
            <div className="text-4xl font-playfair text-burgundy mb-2">500+</div>
            <div className="text-sm text-gray-600">Spokojených zákaznic</div>
          </div>
          <div>
            <div className="text-4xl font-playfair text-burgundy mb-2">98%</div>
            <div className="text-sm text-gray-600">Míra spokojenosti</div>
          </div>
          <div>
            <div className="text-4xl font-playfair text-burgundy mb-2">8+</div>
            <div className="text-sm text-gray-600">Let na trhu</div>
          </div>
        </div>
      </div>
    </div>
  );
}
