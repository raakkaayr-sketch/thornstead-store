import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { getAllCategories, getAllProducts } from '@/lib/products';

const base = siteConfig.url.replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { path: '/', priority: 1 },
    { path: '/shop', priority: 0.9 },
    { path: '/categories', priority: 0.8 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.6 },
    { path: '/faq', priority: 0.5 },
    { path: '/shipping-policy', priority: 0.5 },
    { path: '/returns-policy', priority: 0.5 },
    { path: '/privacy-policy', priority: 0.4 },
    { path: '/terms', priority: 0.4 },
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...getAllCategories().map((category) => ({
      url: `${base}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...getAllProducts().map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
