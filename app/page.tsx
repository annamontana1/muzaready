'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-burgundy to-maroon text-white">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-playfair mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Pravé vlasy k prodloužení Praha
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-4 text-ivory font-playfair"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Objevte svou přirozenou krásu s prémiovou kvalitou
          </motion.p>
          <motion.p
            className="text-base md:text-lg mb-8 text-warm-beige max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Český výrobce panenských a pravých vlasů od roku 2016. Vlastní barvírna v Praze,
            ruční výroba, nejkvalitnější vlasy na trhu. Standard • LUXE • Platinum edition
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/vlasy-k-prodlouzeni" className="btn-primary text-lg px-8 py-3">
              Prozkoumat kolekci
            </Link>
            <Link href="/cenik" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition">
              Zobrazit ceník
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-white border-b border-warm-beige">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <div className="text-4xl mb-3 text-burgundy">8+</div>
              <h3 className="font-semibold text-burgundy mb-2">Let zkušeností</h3>
              <p className="text-sm text-gray-600">Dlouholeté know-how v oboru</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <div className="text-4xl mb-3 text-burgundy">100%</div>
              <h3 className="font-semibold text-burgundy mb-2">Pravé vlasy</h3>
              <p className="text-sm text-gray-600">Žádné syntetické materiály</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <div className="text-4xl mb-3 text-burgundy">🇨🇿</div>
              <h3 className="font-semibold text-burgundy mb-2">Český výrobce</h3>
              <p className="text-sm text-gray-600">Výroba a barvení v Praze</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <div className="text-4xl mb-3 text-burgundy">⚡</div>
              <h3 className="font-semibold text-burgundy mb-2">Vlastní barvírna</h3>
              <p className="text-sm text-gray-600">Profesionální odbarvování</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Naše kolekce vlasů k prodloužení
          </motion.h2>
          <motion.p
            className="text-center text-gray-700 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Nabízíme kompletní sortiment pravých vlasů - od nebarvených panenských po profesionálně
            odbarvené blond vlasy. Vše ve třech úrovních kvality.
          </motion.p>
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Nebarvené panenské */}
            <motion.div variants={scaleIn}>
              <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="group relative h-96 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300"
            >
              <div className="absolute inset-0 bg-ivory" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <span className="text-sm text-burgundy mb-3 uppercase tracking-wider font-bold">Nejprodávanější</span>
                <h3 className="text-3xl md:text-4xl font-playfair mb-4 text-burgundy font-bold">Nebarvené panenské vlasy</h3>
                <p className="text-gray-800 mb-6 text-lg font-medium">100% přírodní vlasy bez chemického ošetření</p>
                <p className="text-sm text-gray-700 mb-6">
                  Ideální pro přirozený vzhled. Možnost vlastního barvení nebo použití přirozeně.
                </p>
                <div className="flex gap-2 text-xs flex-wrap justify-center">
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">Standard od 6 900 Kč</span>
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">LUXE od 8 900 Kč</span>
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">Platinum od 10 900 Kč</span>
                </div>
              </div>
              </Link>
            </motion.div>

            {/* Barvené blond */}
            <motion.div variants={scaleIn}>
              <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy"
              className="group relative h-96 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300"
            >
              <div className="absolute inset-0 bg-warm-beige" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <span className="text-sm text-terracotta mb-3 uppercase tracking-wider font-bold">Prémiové</span>
                <h3 className="text-3xl md:text-4xl font-playfair mb-4 text-terracotta font-bold">Barvené blond vlasy</h3>
                <p className="text-gray-800 mb-6 text-lg font-medium">Profesionálně odbarvené odstíny 5-10</p>
                <p className="text-sm text-gray-700 mb-6">
                  Odbarveno ve vlastní barvírně. Krásné blond odstíny bez žlutých tónů.
                </p>
                <div className="flex gap-2 text-xs flex-wrap justify-center">
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">Standard od 6 900 Kč</span>
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">LUXE od 8 900 Kč</span>
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">Platinum od 10 900 Kč</span>
                </div>
              </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Additional categories grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/vlasy-k-prodlouzeni/vlasy-na-keratin" className="p-6 bg-white rounded-lg shadow hover:shadow-medium transition">
              <h4 className="text-xl font-semibold text-burgundy mb-2">Vlasy na keratin</h4>
              <p className="text-sm text-gray-600">Keratinové prodloužení pro dlouhotrvající efekt</p>
            </Link>
            <Link href="/vlasy-k-prodlouzeni/pasky-nano-tapes" className="p-6 bg-white rounded-lg shadow hover:shadow-medium transition">
              <h4 className="text-xl font-semibold text-burgundy mb-2">Pásky (nano tapes)</h4>
              <p className="text-sm text-gray-600">Moderní a šetrné prodlužování vlasů</p>
            </Link>
            <Link href="/vlasy-k-prodlouzeni/vlasove-tresy" className="p-6 bg-white rounded-lg shadow hover:shadow-medium transition">
              <h4 className="text-xl font-semibold text-burgundy mb-2">Vlasové tresy</h4>
              <p className="text-sm text-gray-600">Ručně šité tresy nejvyšší kvality</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Příčesky a paruky Section */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-4">
            Příčesky, paruky a doplňky
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Kompletní řešení pro každou potřebu - od ofin přes toupee až po pravé paruky z lidských vlasů.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <Link href="/pricesky-a-paruky/ofiny-z-pravych-vlasu" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">👱‍♀️</div>
              <h4 className="font-semibold text-burgundy text-sm">Ofiny</h4>
            </Link>
            <Link href="/pricesky-a-paruky/toupee" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">💇‍♂️</div>
              <h4 className="font-semibold text-burgundy text-sm">Toupee/tupé</h4>
            </Link>
            <Link href="/pricesky-a-paruky/vlasove-tresy" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">🧵</div>
              <h4 className="font-semibold text-burgundy text-sm">Vlasové tresy</h4>
            </Link>
            <Link href="/pricesky-a-paruky/prave-paruky" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-semibold text-burgundy text-sm">Pravé paruky</h4>
            </Link>
            <Link href="/pricesky-a-paruky/clip-in-vlasy" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">💁‍♀️</div>
              <h4 className="font-semibold text-burgundy text-sm">Clip in vlasy</h4>
            </Link>
            <Link href="/pricesky-a-paruky/clip-in-culik" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">🎀</div>
              <h4 className="font-semibold text-burgundy text-sm">Clip in culík</h4>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-12">
            Proč si vybrat Mùza Hair Shop?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">🏆 8 let zkušeností na trhu</h3>
              <p className="text-gray-700">
                Od roku 2016 vyrábíme prémiové vlasové doplňky. Naše know-how zaručuje nejvyšší kvalitu.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">🇨🇿 Vlastní barvírna v Praze</h3>
              <p className="text-gray-700">
                Profesionální odbarvování a barvení přímo v Praze. Kontrola kvality v každém kroku výroby.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">✋ Ruční výroba</h3>
              <p className="text-gray-700">
                Každý kus je ručně zpracován a kontrolován. Žádná hromadná výroba, jen kvalita.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">💎 Tři úrovně kvality</h3>
              <p className="text-gray-700">
                Standard, LUXE a Platinum edition - vyberte si podle vašich potřeb a rozpočtu.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">🎨 10 odstínů</h3>
              <p className="text-gray-700">
                Od tmavě hnědé po ultra blond. Najdete přesně ten odstín, který k vám pasuje.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">📏 Délky 45-90 cm</h3>
              <p className="text-gray-700">
                Široký výběr délek pro různé účesy a styly. Od klasických po extra dlouhé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Co říkají naše zákaznice
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Přečtěte si zkušenosti žen, které si vybraly vlasy Mùza Hair
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {/* Review 1 */}
            <div className="bg-ivory rounded-xl p-6 shadow-medium">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-burgundy/20 flex items-center justify-center text-burgundy text-xl font-bold">
                  K
                </div>
                <div>
                  <div className="font-semibold text-burgundy">Karolína P.</div>
                  <div className="text-xs text-gray-600">Praha</div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold text-lg">⭐</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-3">
                &ldquo;LUXE kvalita je naprosto skvělá! Vlasy jsou krásně lesklé, hebké a vypadají úplně přirozeně.
                Nosím je už 8 měsíců a stále vypadají jako nové. Určitě si objednám znovu!&rdquo;
              </p>
              <div className="text-xs text-gray-500">
                Produkt: <span className="text-burgundy font-medium">LUXE Nebarvené 60cm</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-ivory rounded-xl p-6 shadow-medium">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-burgundy/20 flex items-center justify-center text-burgundy text-xl font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold text-burgundy">Michaela Š.</div>
                  <div className="text-xs text-gray-600">Brno</div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold text-lg">⭐</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-3">
                &ldquo;Byla jsem nadšená z Platinum edice! Koupila jsem si je na svatbu a bylo to nejlepší rozhodnutí.
                Krásný lesk, žádné zamotávání. Profesionální kadeřnice byla úplně nadšená z kvality.&rdquo;
              </p>
              <div className="text-xs text-gray-500">
                Produkt: <span className="text-burgundy font-medium">Platinum Blond #9, 65cm</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-ivory rounded-xl p-6 shadow-medium">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-burgundy/20 flex items-center justify-center text-burgundy text-xl font-bold">
                  L
                </div>
                <div>
                  <div className="font-semibold text-burgundy">Lucie V.</div>
                  <div className="text-xs text-gray-600">Ostrava</div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold text-lg">⭐</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-3">
                &ldquo;Vybrala jsem si Standard kvalitu na zkoušku a jsem mile překvapená! Za tu cenu je to úžasná kvalita.
                Vlasy jsou hustě, dají se perfektně stylovat. Příště určitě zkusím LUXE!&rdquo;
              </p>
              <div className="text-xs text-gray-500">
                Produkt: <span className="text-burgundy font-medium">Standard Nebarvené 55cm</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Průměrné hodnocení</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">500+</div>
              <div className="text-sm text-gray-600">Spokojených zákaznic</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">98%</div>
              <div className="text-sm text-gray-600">Doporučuje přátelům</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">8+</div>
              <div className="text-sm text-gray-600">Let na trhu</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-12">
            Často kladené otázky
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                Jaký je rozdíl mezi nebarvené panenské a barvené blond vlasy?
              </h3>
              <p className="text-gray-700">
                Nebarvené panenské vlasy jsou 100% přírodní bez jakéhokoliv chemického ošetření. Barvené blond
                vlasy jsou profesionálně odbarveny v naší vlastní barvírně na odstíny 5-10. Obě kategorie nabízíme
                ve třech úrovních kvality: Standard, LUXE a Platinum edition.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                Jak dlouho vydrží prodloužené vlasy?
              </h3>
              <p className="text-gray-700">
                Při správné péči vydrží naše pravé vlasy 6-12 měsíců. LUXE a Platinum edition dokonce i déle.
                Záleží na typu aplikace (keratin, pásky, tresy) a péči.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                Vyrábíte vlasy v Česku?
              </h3>
              <p className="text-gray-700">
                Ano! Jsme český výrobce s vlastní barvírnou v Praze. Veškeré odbarvování, barvení a ruční
                zpracování probíhá v České republice. To nám umožňuje garantovat vysokou kvalitu.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                Mohu vlasy barvit nebo žehlit?
              </h3>
              <p className="text-gray-700">
                Ano, naše pravé vlasy můžete barvit, žehlit, natáčet a foukat stejně jako své vlastní vlasy.
                Doporučujeme použít tepelnou ochranu a kvalitní vlasovou kosmetiku.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/informace/faq" className="text-burgundy font-semibold hover:text-maroon transition">
              Zobrazit všechny otázky →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-burgundy to-maroon text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-playfair mb-6">
            Připraveni na transformaci?
          </h2>
          <p className="text-xl text-ivory mb-8">
            Prohlédněte si naši kompletní nabídku pravých vlasů k prodloužení nebo nás kontaktujte
            pro individuální poradenství.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vlasy-k-prodlouzeni" className="bg-white text-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-ivory transition">
              Zobrazit všechny produkty
            </Link>
            <Link href="/kontakt" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition border border-white/30">
              Kontaktujte nás
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-soft-cream border-t border-warm-beige">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h4 className="font-semibold text-burgundy mb-1">Rychlé doručení</h4>
              <p className="text-sm text-gray-600">Po celé ČR</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💳</div>
              <h4 className="font-semibold text-burgundy mb-1">Bezpečná platba</h4>
              <p className="text-sm text-gray-600">Platba kartou i převodem</p>
            </div>
            <div>
              <div className="text-3xl mb-2">↩️</div>
              <h4 className="font-semibold text-burgundy mb-1">Vrácení zboží</h4>
              <p className="text-sm text-gray-600">14 dní na vrácení</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
