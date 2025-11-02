export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-burgundy to-maroon text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-playfair mb-6">
            MÙZA HAIR SHOP
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-ivory">
            Objevte svou přirozenou krásu
          </p>
          <p className="text-lg mb-8 text-warm-beige max-w-2xl mx-auto">
            Prémiové vlasové doplňky pro ženy, které chtějí vyniknout.<br />
            8 let zkušeností | Vlastní barvírna | Ruční výroba v Praze
          </p>
          <a href="/vlasy-k-prodlouzeni" className="btn-primary text-lg">
            Prozkoumat kolekci
          </a>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair text-burgundy text-center mb-12">
            Naše kolekce
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Nebarvené panenské */}
            <a href="/vlasy-k-prodlouzeni/nebarvene-panenske" className="group relative h-80 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy/80 to-maroon/80 group-hover:from-burgundy/70 group-hover:to-maroon/70 transition-all duration-300" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white text-center">
                <h3 className="text-3xl font-playfair mb-4">Nebarvené panenské vlasy</h3>
                <p className="text-ivory mb-6">100% přírodní vlasy bez chemie</p>
                <span className="text-sm text-warm-beige">Standard, LUXE, Platinum edition</span>
              </div>
            </a>

            {/* Barvené blond */}
            <a href="/vlasy-k-prodlouzeni/barvene-blond" className="group relative h-80 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/80 to-dusty-rose/80 group-hover:from-terracotta/70 group-hover:to-dusty-rose/70 transition-all duration-300" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white text-center">
                <h3 className="text-3xl font-playfair mb-4">Barvené blond vlasy</h3>
                <p className="text-ivory mb-6">Profesionálně odbarvené odstíny 5-10</p>
                <span className="text-sm text-warm-beige">Standard, LUXE, Platinum edition</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-playfair text-burgundy mb-6">
            O nás
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Jsme nově otevřený obchod s vlasy v Praze, ale na trhu působíme už 8 let.
          </p>
          <p className="text-xl font-playfair text-burgundy">
            Nejkrásnější culíky široko daleko ❤️
          </p>
        </div>
      </section>
    </div>
  );
}
