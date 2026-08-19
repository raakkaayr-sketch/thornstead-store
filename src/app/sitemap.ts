import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { getAllCategories, getAllProducts } from '@/lib/products';

const base = siteConfig.url.replace(/\/$/, '');

/**
 * Nur indexierbare Seiten. /kasse, /kasse/bestaetigung und /merkliste sind
 * warenkorbabhängig und bewusst nicht enthalten.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { path: '/', priority: 1 },
    { path: '/shop', priority: 0.9 },
    { path: '/kategorien', priority: 0.8 },
    { path: '/ueber-uns', priority: 0.6 },
    { path: '/kontakt', priority: 0.6 },
    { path: '/faq', priority: 0.5 },
    { path: '/versand', priority: 0.5 },
    { path: '/widerruf', priority: 0.5 },
    { path: '/impressum', priority: 0.4 },
    { path: '/agb', priority: 0.4 },
    { path: '/datenschutz', priority: 0.4 },
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...getAllCategories().map((category) => ({
      url: `${base}/kategorien/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...getAllProducts().map((product) => ({
      url: `${base}/produkte/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
