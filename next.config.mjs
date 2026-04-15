/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcrypt'],
  // GoPay env vars — must be set in Vercel dashboard
  env: {
    GOPAY_GOID: process.env.GOPAY_GOID || '',
    GOPAY_CLIENT_ID: process.env.GOPAY_CLIENT_ID || '',
    GOPAY_CLIENT_SECRET: process.env.GOPAY_CLIENT_SECRET || '',
    GOPAY_ENV: process.env.GOPAY_ENV || 'test',
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'bcbqrhkoosopmtrryrcy.supabase.co', 'www.dropbox.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://gate.gopay.cz https://gw.sandbox.gopay.com https://*.googletagmanager.com https://*.google-analytics.com https://*.smartsupp.com https://*.smartsuppchat.com https://widget.packeta.com https://backup.widget.packeta.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://gate.gopay.cz https://gw.sandbox.gopay.com https://*.google-analytics.com https://*.analytics.google.com https://*.smartsupp.com https://*.smartsuppchat.com wss://*.smartsupp.com wss://*.smartsuppchat.com https://widget.packeta.com https://backup.widget.packeta.com https://*.packeta.com; frame-src https://gate.gopay.cz https://gw.sandbox.gopay.com https://*.smartsupp.com https://widget.packeta.com https://backup.widget.packeta.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /katalog → /vlasy-k-prodlouzeni
      {
        source: '/katalog',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      // Stará struktura nebarvené/barvené → nová tier-first struktura
      {
        source: '/vlasy-k-prodlouzeni/nebarvene-panenske/standard',
        destination: '/vlasy-k-prodlouzeni/standard',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nebarvene-panenske/luxe',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition',
        destination: '/vlasy-k-prodlouzeni/platinum-edition',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/barvene-vlasy/standard',
        destination: '/vlasy-k-prodlouzeni/standard',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/barvene-vlasy/luxe',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition',
        destination: '/vlasy-k-prodlouzeni/platinum-edition',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/barvene-vlasy',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      // Stará struktura /metody → metody-zakonceni
      {
        source: '/metody',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/metody/keratin',
        destination: '/metody-zakonceni/vlasy-na-keratin',
        permanent: true,
      },
      {
        source: '/metody/tape-in',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/metody/vlasove-tresy',
        destination: '/metody-zakonceni/vlasove-tresy',
        permanent: true,
      },
      {
        source: '/metody/:path*',
        destination: '/metody-zakonceni/:path*',
        permanent: true,
      },
      // Stará pojmenování pod vlasy-k-prodlouzeni → metody-zakonceni
      {
        source: '/vlasy-k-prodlouzeni/vlasy-na-keratin',
        destination: '/metody-zakonceni/vlasy-na-keratin',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/pasky-nano-tapes',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/keratin',
        destination: '/metody-zakonceni/vlasy-na-keratin',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nano-tapes',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      // Aliasy pro kratší URL
      {
        source: '/metody-zakonceni/keratin',
        destination: '/metody-zakonceni/vlasy-na-keratin',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/tape-in',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/pasky-nano-tapes',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/vlasove-tresy',
        destination: '/metody-zakonceni/vlasove-tresy',
        permanent: true,
      },
      // Stará pojmenování příčesky
      {
        source: '/pricesky-a-paruky/tresy-sewing-weft',
        destination: '/pricesky-a-paruky/vlasove-tresy',
        permanent: true,
      },
      // Stará pojmenování metod-zakonceni/sewing-weft
      {
        source: '/metody-zakonceni/sewing-weft',
        destination: '/metody-zakonceni/vlasove-tresy',
        permanent: true,
      },
      // Smazané produkty → příslušná kategorie
      {
        source: '/produkt/barvene-luxe-svetla-blond',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },

      // === SEO keyword redirecty — thin URL → katalog ===
      // Panenské vlasy → Platinum Edition (nejkvalitnější = panenské)
      {
        source: '/panenske-vlasy-praha',
        destination: '/vlasy-k-prodlouzeni/platinum-edition',
        permanent: true,
      },
      {
        source: '/panenske-vlasy-na-prodlouzeni',
        destination: '/vlasy-k-prodlouzeni/platinum-edition',
        permanent: true,
      },
      // Slovanské vlasy → LUXE
      {
        source: '/slovanske-vlasy-na-prodlouzeni',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      {
        source: '/slovanske-vlasy-praha',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      // Luxusní vlasy → LUXE katalog
      {
        source: '/luxusni-vlasy-na-prodlouzeni',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      // Koupit vlasy Praha → hlavní katalog
      {
        source: '/koupit-vlasy-na-prodlouzeni-praha',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/koupit-vlasy-praha',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      // Evropské vlasy → LUXE
      {
        source: '/evropske-vlasy-na-prodlouzeni',
        destination: '/vlasy-k-prodlouzeni/luxe',
        permanent: true,
      },
      // Ceník prodloužení vlasů Praha — aliasy
      {
        source: '/cenik-prodlouzeni',
        destination: '/cenik-prodlouzeni-vlasu-praha',
        permanent: true,
      },
      {
        source: '/ceny-prodlouzeni-vlasu-praha',
        destination: '/cenik-prodlouzeni-vlasu-praha',
        permanent: true,
      },

      // B2B alternativní URL → hlavní B2B stránka
      {
        source: '/velkoobchod-vlasy-Praha',
        destination: '/dodavatel-vlasu-pro-salony',
        permanent: true,
      },
      {
        source: '/vlasy-velkoobchod-praha',
        destination: '/dodavatel-vlasu-pro-salony',
        permanent: true,
      },
      {
        source: '/b2b',
        destination: '/dodavatel-vlasu-pro-salony',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

