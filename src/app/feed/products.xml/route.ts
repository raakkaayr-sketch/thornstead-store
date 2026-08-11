import { generateProductFeedXml } from '@/lib/product-feed';

/**
 * Google Merchant Center primary feed.
 * Point Merchant Center → Data sources → Scheduled fetch at:
 *   https://your-domain/feed/products.xml
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response(generateProductFeedXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
