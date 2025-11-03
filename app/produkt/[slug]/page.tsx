import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-products';
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData';
import { HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Produkt nenalezen | Mùza Hair',
    };
  }

  const variant = product.variants[0];
  const color = variant ? HAIR_COLORS[variant.shade] : null;
  const title = `${product.name} | Mùza Hair`;
  const description = `${product.description} Kvalita ${product.tier}. ${variant ? `Odstín ${variant.shade} (${color?.name}), ${variant.length_cm} cm, ${variant.structure}.` : ''} Cena od ${priceCalculator.formatPrice(product.base_price_per_100g_45cm)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://muza-hair-shop.vercel.app/produkt/${params.slug}`,
      images: [
        {
          url: product.images.main || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images.main || '/og-image.jpg'],
    },
  };
}

// Generate static params for all products (for static generation)
export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const variant = product.variants[0];
  const color = variant ? HAIR_COLORS[variant.shade] : null;

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Domů', url: 'https://muza-hair-shop.vercel.app' },
    {
      name: 'Vlasy k prodloužení',
      url: 'https://muza-hair-shop.vercel.app/vlasy-k-prodlouzeni',
    },
    {
      name: product.category === 'nebarvene_panenske' ? 'Nebarvené panenské' : 'Barvené blond',
      url: `https://muza-hair-shop.vercel.app/vlasy-k-prodlouzeni/${product.category === 'nebarvene_panenske' ? 'nebarvene-panenske' : 'barvene-blond'}`,
    },
    {
      name: product.name,
      url: `https://muza-hair-shop.vercel.app/produkt/${product.slug}`,
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.images.main || 'https://muza-hair-shop.vercel.app/placeholder.jpg'}
        sku={product.sku}
        price={product.base_price_per_100g_45cm}
        availability={product.in_stock}
        url={`https://muza-hair-shop.vercel.app/produkt/${product.slug}`}
        rating={
          product.review_count && product.review_count > 0
            ? {
                value: product.average_rating || 0,
                count: product.review_count,
              }
            : undefined
        }
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Page Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <a href="/" className="hover:text-burgundy transition">
                  Domů
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/vlasy-k-prodlouzeni" className="hover:text-burgundy transition">
                  Vlasy k prodloužení
                </a>
              </li>
              <li>/</li>
              <li>
                <a
                  href={`/vlasy-k-prodlouzeni/${product.category === 'nebarvene_panenske' ? 'nebarvene-panenske' : 'barvene-blond'}`}
                  className="hover:text-burgundy transition"
                >
                  {product.category === 'nebarvene_panenske' ? 'Nebarvené panenské' : 'Barvené blond'}
                </a>
              </li>
              <li>/</li>
              <li className="text-burgundy font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square rounded-xl overflow-hidden relative">
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{
                  background: color
                    ? `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}dd 50%, ${color.hex}bb 100%)`
                    : 'linear-gradient(135deg, #8B7355 0%, #8B7355dd 50%, #8B7355bb 100%)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                  }}
                />
                <div className="relative z-10 text-center text-white">
                  <div className="text-2xl font-playfair mb-4">{product.tier}</div>
                  <div className="text-lg mb-2">{variant?.structure}</div>
                  <div className="text-sm">{variant?.length_cm} cm</div>
                </div>
              </div>

              {/* Tier Badge */}
              <div className="absolute top-4 left-4">
                <span className="tier-badge">{product.tier}</span>
              </div>

              {/* Out of stock */}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Dočasně vyprodáno</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-playfair text-burgundy mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Cena za 100 g / 45 cm</p>
                <p className="text-3xl font-semibold text-burgundy">
                  {priceCalculator.formatPrice(product.base_price_per_100g_45cm)}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              {variant && (
                <div className="mb-8 p-6 bg-ivory rounded-xl">
                  <h3 className="text-lg font-semibold text-burgundy mb-4">Specifikace</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-600 mb-1">Odstín</dt>
                      <dd className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color?.hex }}
                        />
                        <span className="font-medium">
                          {variant.shade} - {color?.name}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 mb-1">Délka</dt>
                      <dd className="font-medium">{variant.length_cm} cm</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 mb-1">Struktura</dt>
                      <dd className="font-medium capitalize">{variant.structure}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 mb-1">Zakončení</dt>
                      <dd className="font-medium capitalize">
                        {variant.ending === 'keratin'
                          ? 'Keratin'
                          : variant.ending === 'nano_tapes'
                          ? 'Nano tapes'
                          : 'Sewing weft'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 mb-1">Gramáž</dt>
                      <dd className="font-medium">{variant.weight_g} g</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 mb-1">SKU</dt>
                      <dd className="font-medium text-xs">{variant.sku}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-burgundy mb-3">Vlastnosti</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-burgundy mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Do košíku
              </button>

              {/* Stock info */}
              <div className="mt-4 text-sm text-center">
                {product.in_stock ? (
                  <p className="text-green-600 font-medium">✓ Skladem ({product.stock_quantity} ks)</p>
                ) : (
                  <p className="text-orange-600 font-medium">
                    Na objednávku (dodání {product.lead_time_days || 14} dnů)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(product.care_instructions || product.how_to_use) && (
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              {product.care_instructions && (
                <div className="p-6 bg-ivory rounded-xl">
                  <h3 className="text-xl font-playfair text-burgundy mb-4">Péče o vlasy</h3>
                  <p className="text-sm text-gray-700">{product.care_instructions}</p>
                </div>
              )}
              {product.how_to_use && (
                <div className="p-6 bg-ivory rounded-xl">
                  <h3 className="text-xl font-playfair text-burgundy mb-4">Jak použít</h3>
                  <p className="text-sm text-gray-700">{product.how_to_use}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
