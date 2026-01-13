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
    title: `${article.title} | Mùza Hair Blog`,
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

      <article className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-burgundy transition">
                  Domů
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-burgundy transition">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-burgundy font-medium line-clamp-1">{article.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-burgundy/10 text-burgundy rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 mb-6">{article.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-burgundy">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                📅
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('cs-CZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                📖 {article.readTime} min čtení
              </div>
            </div>
          </header>

          {/* Featured Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-burgundy/20 to-maroon/20 rounded-xl mb-8 flex items-center justify-center">
            <span className="text-8xl">📰</span>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/\n/g, '<br />')
                  .replace(/## (.*?)(<br \/>|$)/g, '<h2 class="text-2xl font-semibold text-burgundy mt-8 mb-4">$1</h2>')
                  .replace(/### (.*?)(<br \/>|$)/g, '<h3 class="text-xl font-semibold text-burgundy mt-6 mb-3">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-burgundy">$1</strong>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-burgundy hover:text-maroon underline">$1</a>')
                  .replace(/- (.*?)(<br \/>|$)/g, '<li class="ml-6 mb-2">$1</li>')
                  .replace(/✅ (.*?)(<br \/>|$)/g, '<li class="ml-6 mb-2 text-green-600">✅ $1</li>')
                  .replace(/❌ (.*?)(<br \/>|$)/g, '<li class="ml-6 mb-2 text-red-600">❌ $1</li>')
                  .replace(/⚠️ (.*?)(<br \/>|$)/g, '<li class="ml-6 mb-2 text-orange-600">⚠️ $1</li>')
                  .replace(/---(<br \/>|$)/g, '<hr class="my-8 border-gray-200" />')
                  .replace(/# (.*?)(<br \/>|$)/g, '<h1 class="text-3xl font-playfair text-burgundy mt-8 mb-4">$1</h1>'),
              }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Štítky:</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-ivory text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-ivory rounded-xl p-8 text-center">
            <h3 className="text-2xl font-playfair text-burgundy mb-3">
              Připraveni vyzkoušet naše vlasy?
            </h3>
            <p className="text-gray-700 mb-6">
              Prohlédněte si naši kompletní nabídku prémiových vlasů k prodloužení
            </p>
            <Link href="/vlasy-k-prodlouzeni" className="btn-primary inline-block">
              Zobrazit produkty
            </Link>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-playfair text-burgundy mb-6">Další články</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogArticles
                .filter((a) => a.slug !== article.slug)
                .slice(0, 2)
                .map((relatedArticle) => (
                  <Link
                    key={relatedArticle.slug}
                    href={`/blog/${relatedArticle.slug}`}
                    className="bg-ivory rounded-lg p-6 hover:shadow-medium transition"
                  >
                    <span className="text-xs text-burgundy font-medium">
                      {relatedArticle.category}
                    </span>
                    <h4 className="text-lg font-semibold text-burgundy mt-2 mb-2">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
