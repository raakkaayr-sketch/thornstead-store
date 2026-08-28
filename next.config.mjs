/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  /**
   * Alte englische Pfade auf die deutschen Gegenstücke umleiten, damit
   * bestehende Links, Caches und Merchant-Center-Einträge nicht ins Leere
   * laufen. Produktslugs haben sich inhaltlich geändert und lassen sich nicht
   * 1:1 umleiten.
   */
  async redirects() {
    return [
      { source: '/about', destination: '/ueber-uns', permanent: true },
      { source: '/contact', destination: '/kontakt', permanent: true },
      { source: '/wishlist', destination: '/merkliste', permanent: true },
      { source: '/privacy-policy', destination: '/datenschutz', permanent: true },
      { source: '/terms', destination: '/agb', permanent: true },
      { source: '/returns-policy', destination: '/widerruf', permanent: true },
      { source: '/shipping-policy', destination: '/versand', permanent: true },
      { source: '/categories', destination: '/kategorien', permanent: true },
      {
        source: '/categories/:slug',
        destination: '/kategorien/:slug',
        permanent: true,
      },
      { source: '/checkout/success', destination: '/kasse/bestaetigung', permanent: true },
    ];
  },
};

export default nextConfig;

