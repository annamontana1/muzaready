/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['@/components'],
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

module.exports = nextConfig;
