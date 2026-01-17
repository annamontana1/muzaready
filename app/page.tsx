'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-burgundy to-maroon text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-ivory font-playfair">
            {t('home.hero.subtitle')}
          </p>
          <p className="text-base md:text-lg mb-8 text-warm-beige max-w-3xl mx-auto">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vlasy-k-prodlouzeni" className="btn-primary text-lg px-8 py-3">
              {t('home.hero.cta.explore')}
            </Link>
            <Link href="/cenik" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition">
              {t('home.hero.cta.pricing')}
            </Link>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-white border-b border-warm-beige">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3 text-burgundy">{t('home.usp.experience.number')}</div>
              <h3 className="font-semibold text-burgundy mb-2">{t('home.usp.experience.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.usp.experience.description')}</p>
            </div>
            <div>
              <div className="text-4xl mb-3 text-burgundy">{t('home.usp.realHair.number')}</div>
              <h3 className="font-semibold text-burgundy mb-2">{t('home.usp.realHair.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.usp.realHair.description')}</p>
            </div>
            <div>
              <div className="text-4xl mb-3 text-burgundy">🇨🇿</div>
              <h3 className="font-semibold text-burgundy mb-2">{t('home.usp.czechMade.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.usp.czechMade.description')}</p>
            </div>
            <div>
              <div className="text-4xl mb-3 text-burgundy">⚡</div>
              <h3 className="font-semibold text-burgundy mb-2">{t('home.usp.ownDyehouse.title')}</h3>
              <p className="text-sm text-gray-600">{t('home.usp.ownDyehouse.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-4">
            {t('home.collections.title')}
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            {t('home.collections.subtitle')}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Nebarvené panenské */}
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="group relative h-96 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300"
            >
              <div className="absolute inset-0 bg-ivory" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <span className="text-sm text-burgundy mb-3 uppercase tracking-wider font-bold">{t('home.collections.undyed.badge')}</span>
                <h3 className="text-3xl md:text-4xl font-playfair mb-4 text-burgundy font-bold">{t('home.collections.undyed.title')}</h3>
                <p className="text-gray-800 mb-6 text-lg font-medium">{t('home.collections.undyed.subtitle')}</p>
                <p className="text-sm text-gray-700 mb-6">
                  {t('home.collections.undyed.description')}
                </p>
                <div className="flex gap-2 text-xs flex-wrap justify-center">
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">{t('home.collections.undyed.prices.standard')}</span>
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">{t('home.collections.undyed.prices.luxe')}</span>
                  <span className="px-3 py-1 bg-burgundy text-white rounded-full font-semibold">{t('home.collections.undyed.prices.platinum')}</span>
                </div>
              </div>
            </Link>

            {/* Barvené blond */}
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy"
              className="group relative h-96 rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300"
            >
              <div className="absolute inset-0 bg-warm-beige" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <span className="text-sm text-terracotta mb-3 uppercase tracking-wider font-bold">{t('home.collections.dyed.badge')}</span>
                <h3 className="text-3xl md:text-4xl font-playfair mb-4 text-terracotta font-bold">{t('home.collections.dyed.title')}</h3>
                <p className="text-gray-800 mb-6 text-lg font-medium">{t('home.collections.dyed.subtitle')}</p>
                <p className="text-sm text-gray-700 mb-6">
                  {t('home.collections.dyed.description')}
                </p>
                <div className="flex gap-2 text-xs flex-wrap justify-center">
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">{t('home.collections.dyed.prices.standard')}</span>
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">{t('home.collections.dyed.prices.luxe')}</span>
                  <span className="px-3 py-1 bg-terracotta text-white rounded-full font-semibold">{t('home.collections.dyed.prices.platinum')}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional categories grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/metody-zakonceni/vlasy-na-keratin" className="p-6 bg-white rounded-lg shadow hover:shadow-medium transition">
              <h4 className="text-xl font-semibold text-burgundy mb-2">{t('home.collections.methods.keratin.title')}</h4>
              <p className="text-sm text-gray-600">{t('home.collections.methods.keratin.description')}</p>
            </Link>
            <Link href="/metody-zakonceni/vlasove-tresy" className="p-6 bg-white rounded-lg shadow hover:shadow-medium transition">
              <h4 className="text-xl font-semibold text-burgundy mb-2">{t('home.collections.methods.wefts.title')}</h4>
              <p className="text-sm text-gray-600">{t('home.collections.methods.wefts.description')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Příčesky a paruky Section */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-4">
            {t('home.wigs.title')}
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            {t('home.wigs.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <Link href="/pricesky-a-paruky/ofiny-z-pravych-vlasu" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">👱‍♀️</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.bangs')}</h4>
            </Link>
            <Link href="/pricesky-a-paruky/toupee" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">💇‍♂️</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.toupee')}</h4>
            </Link>
            <Link href="/pricesky-a-paruky/vlasove-tresy" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">🧵</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.wefts')}</h4>
            </Link>
            <Link href="/pricesky-a-paruky/prave-paruky" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">✨</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.realWigs')}</h4>
            </Link>
            <Link href="/pricesky-a-paruky/clip-in-vlasy" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">💁‍♀️</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.clipIn')}</h4>
            </Link>
            <Link href="/pricesky-a-paruky/clip-in-culik" className="p-4 bg-white rounded-lg shadow hover:shadow-medium transition text-center">
              <div className="text-3xl mb-2">🎀</div>
              <h4 className="font-semibold text-burgundy text-sm">{t('home.wigs.clipInPonytail')}</h4>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-12">
            {t('home.whyUs.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.experience.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.experience.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.dyehouse.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.dyehouse.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.handmade.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.handmade.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.quality.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.quality.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.shades.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.shades.description')}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-3">{t('home.whyUs.lengths.title')}</h3>
              <p className="text-gray-700">
                {t('home.whyUs.lengths.description')}
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
              {t('home.reviews.title')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t('home.reviews.subtitle')}
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
              <div className="text-3xl font-bold text-burgundy mb-2">{t('home.reviews.stats.rating.value')}</div>
              <div className="text-sm text-gray-600">{t('home.reviews.stats.rating.label')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">{t('home.reviews.stats.customers.value')}</div>
              <div className="text-sm text-gray-600">{t('home.reviews.stats.customers.label')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">{t('home.reviews.stats.recommend.value')}</div>
              <div className="text-sm text-gray-600">{t('home.reviews.stats.recommend.label')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-burgundy mb-2">{t('home.reviews.stats.years.value')}</div>
              <div className="text-sm text-gray-600">{t('home.reviews.stats.years.label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-playfair text-burgundy text-center mb-12">
            {t('home.faq.title')}
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                {t('home.faq.q1.question')}
              </h3>
              <p className="text-gray-700">
                {t('home.faq.q1.answer')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                {t('home.faq.q2.question')}
              </h3>
              <p className="text-gray-700">
                {t('home.faq.q2.answer')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                {t('home.faq.q3.question')}
              </h3>
              <p className="text-gray-700">
                {t('home.faq.q3.answer')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-burgundy mb-3">
                {t('home.faq.q4.question')}
              </h3>
              <p className="text-gray-700">
                {t('home.faq.q4.answer')}
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/informace/faq" className="text-burgundy font-semibold hover:text-maroon transition">
              {t('home.faq.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-burgundy to-maroon text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-playfair mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-ivory mb-8">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vlasy-k-prodlouzeni" className="bg-white text-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-ivory transition">
              {t('home.cta.viewProducts')}
            </Link>
            <Link href="/kontakt" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition border border-white/30">
              {t('home.cta.contact')}
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
              <h4 className="font-semibold text-burgundy mb-1">{t('home.trust.shipping.title')}</h4>
              <p className="text-sm text-gray-600">{t('home.trust.shipping.description')}</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💳</div>
              <h4 className="font-semibold text-burgundy mb-1">{t('home.trust.payment.title')}</h4>
              <p className="text-sm text-gray-600">{t('home.trust.payment.description')}</p>
            </div>
            <div>
              <div className="text-3xl mb-2">↩️</div>
              <h4 className="font-semibold text-burgundy mb-1">{t('home.trust.returns.title')}</h4>
              <p className="text-sm text-gray-600">{t('home.trust.returns.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
