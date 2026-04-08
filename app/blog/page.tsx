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
    <div style={{ background: 'var(--ivory)' }} className="min-h-screen">
      {/* Header */}
      <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl">
          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            BLOG
          </div>
          <h1 className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
            Magazín & Tipy
          </h1>
          <p className="text-[15px] leading-[1.8] font-light max-w-2xl" style={{ color: 'var(--text-soft)' }}>
            Průvodce, tipy a expertní rady o prodlužování vlasů, péči a výběru správné kvality. Vše od profesionálů z Mùza Hair.
          </p>
        </div>
      </div>

      {/* Articles list */}
      <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
        <div className="max-w-4xl">
          {blogArticles.map((article, index) => (
            <article key={article.slug} className="border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <Link href={`/blog/${article.slug}`} className="block py-10 group">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                  <div className="flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[10px] tracking-[0.18em] uppercase font-normal" style={{ color: 'var(--accent)' }}>
                        {article.category}
                      </span>
                      <span className="text-[10px] tracking-[0.12em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>
                        <time dateTime={article.publishedAt}>
                          {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </span>
                      <span className="text-[10px] tracking-[0.12em] uppercase font-normal" style={{ color: 'var(--text-soft)' }}>
                        {article.readTime} min čtení
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-cormorant text-[clamp(22px,2.2vw,30px)] font-light leading-tight mb-3 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-dark)' }}>
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[15px] leading-[1.8] font-light mb-4 max-w-2xl" style={{ color: 'var(--text-soft)' }}>
                      {article.excerpt}
                    </p>

                    {/* Link */}
                    <span className="text-[12px] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--burgundy)' }}>
                      Číst →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl">
          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            PORADENSTVÍ
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Máte otázku o prodlužování vlasů?
          </h2>
          <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-xl" style={{ color: 'var(--text-soft)' }}>
            Náš tým expertů vám rád poradí s výběrem správné délky, kvality a péče.
          </p>
          <Link
            href="/kontakt"
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    </div>
  );
}
