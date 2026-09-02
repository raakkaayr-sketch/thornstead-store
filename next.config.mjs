/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
      { source: '/track-order', destination: '/bestellung-verfolgen', permanent: true },
      { source: '/cancel-order', destination: '/bestellung-stornieren', permanent: true },
      { source: '/kategorien/gartenwerkzeug', destination: '/shop', permanent: true },
      { source: '/kategorien/pflanzgefaesse-anbau', destination: '/shop', permanent: true },
      { source: '/kategorien/aussenaufbewahrung', destination: '/shop', permanent: true },
      { source: '/kategorien/kueche-kompost', destination: '/shop', permanent: true },
      { source: '/kategorien/voegel-wildtiere', destination: '/shop', permanent: true },
      { source: '/produkte/garten-kniebank-werkzeugsitz', destination: '/shop', permanent: true },
      { source: '/produkte/pflanzkuebel-stahl-3er-set', destination: '/shop', permanent: true },
      { source: '/produkte/gartenbox-wetterfest-120-l', destination: '/shop', permanent: true },
      { source: '/produkte/hochbeet-bambus', destination: '/shop', permanent: true },
      { source: '/produkte/kniepolster-garten', destination: '/shop', permanent: true },
      { source: '/produkte/giesskanne-edelstahl-5-l', destination: '/shop', permanent: true },
      { source: '/produkte/komposteimer-kueche', destination: '/shop', permanent: true },
      { source: '/produkte/schutzhuellen-set-gartenmoebel', destination: '/shop', permanent: true },
      { source: '/produkte/vogelfutterstation-holz', destination: '/shop', permanent: true },
    ];
  },
};

export default nextConfig;

