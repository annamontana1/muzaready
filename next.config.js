/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  async redirects() {
    return [
      // Stará struktura /metody → produktové kategorie
      {
        source: '/metody',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/metody/:path*',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      // Stará struktura /metody-zakonceni → produktové kategorie
      {
        source: '/metody-zakonceni',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/:path*',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      // Stará pojmenování pod vlasy-k-prodlouzeni → produktové kategorie
      {
        source: '/vlasy-k-prodlouzeni/vlasy-na-keratin',
        destination: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/pasky-nano-tapes',
        destination: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/keratin',
        destination: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/nano-tapes',
        destination: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/vlasove-tresy',
        destination: '/vlasy-k-prodlouzeni/nebarvene-panenske',
        permanent: true,
      },
      // Stará pojmenování příčesky
      {
        source: '/pricesky-a-paruky/tresy-sewing-weft',
        destination: '/pricesky-a-paruky/vlasove-tresy',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
