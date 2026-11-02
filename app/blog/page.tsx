import { Metadata } from 'next';
import Link from 'next/link';
import { blogArticles } from '@/lib/blog-articles';

export const metadata: Metadata = {
  title: 'Blog o prodloužení vlasů | Tipy a průvodce | Mùza Hair',
  description: 'Průvodce, tipy a rady o prodlužování vlasů, péči a výběru správné kvality od Mùza Hair.',
  alternates: { canonical: 'https://www.muzahair.cz/blog' },
  openGraph: {
    title: 'Blog o prodloužení vlasů | Mùza Hair',
    description: 'Průvodce, tipy a rady o prodlužování vlasů, péči a výběru správné kvality.',
    type: 'website',
    url: 'https://www.muzahair.cz/blog',
  },
};

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPage() {
  // Nejnovější články nahoře
  const articles = [...blogArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-10 md:pt-12 md:pb-14">
        <nav className="text-sm text-[#45302F] flex gap-2" aria-label="Drobečková navigace">
          <Link href="/" className="hover:text-muza-ink">Domů</Link>
          <span aria-hidden="true">/</span>
          <span className="text-muza-ink">Blog</span>
        </nav>
        <h1 className="mt-8 font-cormorant text-[40px] md:text-[56px] leading-[1.08] text-muza-ink">
          Blog o prodloužení vlasů
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[#45302F] max-w-2xl">
          Průvodce, tipy a rady o prodlužování vlasů, péči a výběru správné kvality.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}`}
                className="flex h-full flex-col rounded-[12px] bg-muza-ivory p-6 hover:opacity-90 transition-opacity"
              >
                <time dateTime={article.publishedAt} className="text-sm text-[#45302F]">
                  {formatDate(article.publishedAt)}
                </time>
                <h2 className="mt-3 font-cormorant text-[26px] leading-[1.15] text-muza-ink">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#45302F] line-clamp-1">{article.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muza-ivory">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">
            Máte otázku o prodlužování vlasů?
          </h2>
          <p className="mt-3 text-base text-[#45302F]">
            Rádi poradíme s výběrem délky, kvality i péče.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/kontakt" className={BTN_PRIMARY}>Napsat nám</Link>
            <Link href="/katalog" className={BTN_SECONDARY}>Prohlédnout katalog</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
