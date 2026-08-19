import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

const base = siteConfig.url.replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /**
         * Nur warenkorbabhängige Seiten und API-Routen werden ausgeschlossen.
         * Googlebot und AdsBot müssen den Feed und die Produktseiten weiterhin
         * abrufen können, daher keine pauschalen Sperren.
         */
        disallow: ['/api/', '/kasse', '/merkliste'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
