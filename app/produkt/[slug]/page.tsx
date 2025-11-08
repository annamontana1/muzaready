import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-products';
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData';
import { HAIR_COLORS } from '@/types/product';
import { priceCalculator } from '@/lib/price-calculator';
import ProductConfigurator from '@/components/ProductConfigurator';
import { FINISHING_ADDONS } from '@/lib/finishing-addons';

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    len?: string;
    g?: string;
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

export default function ProductPage({ params, searchParams }: ProductPageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Parse query params for pre-filling configurator
  const initialLength = searchParams.len ? parseInt(searchParams.len, 10) : null;
  const initialWeight = searchParams.g ? parseInt(searchParams.g, 10) : null;

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
            {/* Left column: Image + B2B Banner */}
            <div>
              {/* Product Image */}
              <div className="aspect-square rounded-xl overflow-hidden relative mb-6">
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

              {/* B2B Banner */}
              <a
                href="/velkoobchod"
                className="block p-6 bg-gradient-to-br from-burgundy to-maroon text-white rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm md:text-base font-semibold mb-1">
                      Jste profesionál?
                    </div>
                    <div className="text-xs md:text-sm opacity-90">
                      Získejte velkoobchodní ceny
                    </div>
                  </div>
                  <div className="bg-white/20 group-hover:bg-white/30 transition px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ml-4">
                    Registrovat B2B →
                  </div>
                </div>
              </a>
            </div>

            {/* Product Info */}
            <div>
              {/* 1. Title */}
              <h1 className="text-4xl font-playfair text-burgundy mb-4">{product.name}</h1>

              {/* 2. Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* 3. Configurator - moved here after description */}
              <div className="mb-8 p-6 bg-ivory rounded-xl">
                <h3 className="text-lg font-semibold text-burgundy mb-4">
                  Vyberte variantu
                </h3>
                <ProductConfigurator
                  product={product}
                  finishing_addons={FINISHING_ADDONS}
                  initialLength={initialLength}
                  initialWeight={initialWeight}
                />
              </div>

              {/* 4. Features */}
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

              {/* 5. Specifications - Platinum ONLY (no softness_scale) */}
              {variant && product.tier === 'Platinum edition' && (
                <div className="mb-8 p-6 bg-ivory rounded-xl">
                  <h3 className="text-lg font-semibold text-burgundy mb-4">Specifikace culíku</h3>
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
