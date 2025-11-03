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
      {
        source: '/metody',
        destination: '/metody-zakonceni',
        permanent: true,
      },
      {
        source: '/metody/:path*',
        destination: '/metody-zakonceni/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
