/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://gate.gopay.cz https://*.googletagmanager.com https://*.google-analytics.com https://*.smartsupp.com https://www.smartsuppchat.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://gate.gopay.cz https://*.google-analytics.com https://*.analytics.google.com https://*.smartsupp.com wss://*.smartsupp.com; frame-src https://gate.gopay.cz https://*.smartsupp.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Stará struktura /metody → metody-zakonceni
      {
        source: '/metody',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/metody/keratin',
        destination: '/metody-zakonceni/keratin',
        permanent: true,
      },
      {
        source: '/metody/tape-in',
        destination: '/metody-zakonceni/tape-in',
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
        destination: '/metody-zakonceni/keratin',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/pasky-nano-tapes',
        destination: '/metody-zakonceni/tape-in',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/keratin',
        destination: '/metody-zakonceni/keratin',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nano-tapes',
        destination: '/metody-zakonceni/tape-in',
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
    ];
  },
};

export default nextConfig;

