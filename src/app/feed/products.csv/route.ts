import { generateProductFeedCsv } from '@/lib/product-feed';

/** Same catalogue as the XML feed, for tools that prefer a CSV upload. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(generateProductFeedCsv(), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
