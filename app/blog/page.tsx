import { Metadata } from 'next';
import Link from 'next/link';
import { blogArticles } from '@/lib/blog-articles';

export const metadata: Metadata = {
  title: 'Blog a Magazín | Mùza Hair Praha - Tipy a průvodce vlasovými prodlouženími',
  description: 'Průvodce, tipy a rady o prodlužování vlasů, péči a výběru správné kvality. Experti z Mùza Hair sdílejí know-how.',
  openGraph: {
    title: 'Blog a Magazín | Mùza Hair Praha',
    description: 'Průvodce, tipy a rady o prodlužování vlasů, péči a výběru správné kvality.',
    type: 'website',
    url: 'https://www.muzahair.cz/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="py-12 bg-soft-cream min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Blog & Magazín
          </h1>
          <p className="text-text-mid max-w-2xl mx-auto">
            Tipy, průvodce a expertní rady o prodlužování vlasů, péči a výběru správné kvality.
            Vše od profesionálů z Mùza Hair.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white rounded-xl overflow-hidden shadow-medium hover:shadow-heavy transition-all duration-300 group"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-burgundy/20 to-maroon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-burgundy/10 group-hover:bg-burgundy/5 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">📰</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Read Time */}
                <div className="flex items-center gap-3 mb-3 text-xs text-text-mid">
                  <span className="px-2 py-1 bg-burgundy/10 text-burgundy rounded-full">
                    {article.category}
                  </span>
                  <span>📖 {article.readTime} min čtení</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-burgundy mb-3 line-clamp-2 group-hover:text-maroon transition">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-text-mid mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-text-soft pt-4 border-t border-warm-beige">
                  <span>{article.author}</span>
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-medium max-w-2xl mx-auto">
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Máte otázku o prodlužování vlasů?
            </h3>
            <p className="text-text-mid mb-6">
              Náš tým expertů vám rád poradí s výběrem správné délky, kvality a péče.
            </p>
            <Link href="/kontakt" className="btn-primary inline-block">
              Kontaktujte nás
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
