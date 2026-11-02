import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogArticles, getArticleBySlug } from '@/lib/blog-articles';
import { BreadcrumbSchema } from '@/components/StructuredData';

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Článek nenalezen | Mùza Hair',
    };
  }

  return {
    title: `${article.title} | Mùza Hair`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `https://www.muzahair.cz/blog/${params.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

// ISR - revalidate every day (86400 seconds)
export const revalidate = 86400;

// Generate static params for all articles
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Article JSON-LD schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: `https://www.muzahair.cz${article.imageUrl}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mùza Hair',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.muzahair.cz/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.muzahair.cz/blog/${params.slug}`,
    },
    keywords: article.tags.join(', '),
  };

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Domů', url: 'https://www.muzahair.cz' },
    { name: 'Blog', url: 'https://www.muzahair.cz/blog' },
    { name: article.title, url: `https://www.muzahair.cz/blog/${params.slug}` },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <article className="bg-muza-cream text-text-dark font-jost">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-16 md:pt-12">
          <nav className="text-sm text-[#45302F]" aria-label="Drobečková navigace">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-muza-ink">Domů</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-muza-ink">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-muza-ink line-clamp-1">{article.title}</li>
            </ol>
          </nav>

          <header className="mt-8 pb-6 border-b border-muza-line">
            <h1 className="font-cormorant text-[36px] md:text-[48px] leading-[1.1] text-muza-ink">
              {article.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#45302F]">{article.excerpt}</p>
            <p className="mt-5 text-sm text-[#45302F]">
              {article.category} ·{' '}
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>{' '}
              · {article.readTime} min čtení
            </p>
          </header>

          <div className="mt-8 text-base leading-relaxed">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/\n/g, '<br />')
                  .replace(/### (.*?)(<br \/>|$)/g, '<h3 class="font-jost text-lg font-medium text-muza-ink mt-6 mb-2">$1</h3>')
                  .replace(/## (.*?)(<br \/>|$)/g, '<h2 class="font-cormorant text-[32px] leading-tight text-muza-ink mt-10 mb-3">$1</h2>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-muza-ink">$1</strong>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-muza-ink underline underline-offset-4">$1</a>')
                  .replace(/- (.*?)(<br \/>|$)/g, '<li class="list-none py-3 border-t border-muza-line">$1</li>')
                  .replace(/✅ (.*?)(<br \/>|$)/g, '<li class="list-none py-3 border-t border-muza-line">✅ $1</li>')
                  .replace(/❌ (.*?)(<br \/>|$)/g, '<li class="list-none py-3 border-t border-muza-line">❌ $1</li>')
                  .replace(/⚠️ (.*?)(<br \/>|$)/g, '<li class="list-none py-3 border-t border-muza-line">⚠️ $1</li>')
                  .replace(/---(<br \/>|$)/g, '<hr class="my-8 border-muza-line" />')
                  .replace(/# (.*?)(<br \/>|$)/g, '<h2 class="font-cormorant text-[32px] leading-tight text-muza-ink mt-10 mb-3">$1</h2>'),
              }}
            />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-muza-line flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#45302F]">Štítky:</span>
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-muza-line text-sm text-[#45302F]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-[12px] bg-muza-ivory px-6 py-10 text-center">
            <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">
              Vyberte si vlasy k prodloužení
            </h2>
            <p className="mt-3 text-base text-[#45302F]">
              Prohlédněte si celou nabídku pravých vlasů Mùza.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Prohlédnout katalog
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium"
              >
                Napsat nám
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-cormorant text-[32px] md:text-[40px] leading-tight text-muza-ink">Další články</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...blogArticles]
              .filter((a) => a.slug !== article.slug)
              .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
              .slice(0, 3)
              .map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="flex h-full flex-col rounded-[12px] bg-muza-ivory p-6 hover:opacity-90 transition-opacity"
                  >
                    <time dateTime={related.publishedAt} className="text-sm text-[#45302F]">
                      {new Date(related.publishedAt).toLocaleDateString('cs-CZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3 className="mt-3 font-cormorant text-[26px] leading-[1.15] text-muza-ink">{related.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#45302F] line-clamp-1">{related.excerpt}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </article>
    </>
  );
}
