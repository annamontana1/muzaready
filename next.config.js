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
      // Stará struktura /metody → nová struktura
      {
        source: '/metody',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/metody/keratin',
        destination: '/vlasy-k-prodlouzeni/keratin',
        permanent: true,
      },
      {
        source: '/metody/tape-in',
        destination: '/vlasy-k-prodlouzeni/nano-tapes',
        permanent: true,
      },
      {
        source: '/metody/vlasove-tresy',
        destination: '/vlasy-k-prodlouzeni/vlasove-tresy',
        permanent: true,
      },
      {
        source: '/metody/:path*',
        destination: '/vlasy-k-prodlouzeni/:path*',
        permanent: true,
      },
      // Stará struktura /metody-zakonceni → nová struktura
      {
        source: '/metody-zakonceni',
        destination: '/vlasy-k-prodlouzeni',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/keratin',
        destination: '/vlasy-k-prodlouzeni/keratin',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/tape-in',
        destination: '/vlasy-k-prodlouzeni/nano-tapes',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/sewing-weft',
        destination: '/vlasy-k-prodlouzeni/vlasove-tresy',
        permanent: true,
      },
      {
        source: '/metody-zakonceni/:path*',
        destination: '/vlasy-k-prodlouzeni/:path*',
        permanent: true,
      },
      // Stará pojmenování pod vlasy-k-prodlouzeni
      {
        source: '/vlasy-k-prodlouzeni/vlasy-na-keratin',
        destination: '/vlasy-k-prodlouzeni/keratin',
        permanent: true,
      },
      {
        source: '/vlasy-k-prodlouzeni/pasky-nano-tapes',
        destination: '/vlasy-k-prodlouzeni/nano-tapes',
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
