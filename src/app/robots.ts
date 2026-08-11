import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

const base = siteConfig.url.replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing here should be indexed, but Googlebot and AdsBot must still
        // be able to fetch the feed and product pages, so no broad blocks.
        disallow: ['/api/', '/checkout/', '/wishlist'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
