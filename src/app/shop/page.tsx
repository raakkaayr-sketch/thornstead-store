import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ShopBrowser } from '@/components/shop/shop-browser';
import { getAllCategories, getAllProducts, getPriceRange } from '@/lib/products';
import { jsonLdScript, breadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Shop all home & garden products',
  description:
    'The full Thornstead range of own-brand planters, outdoor storage, garden tools, lighting and wildlife care. Delivered across the UK.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
          ])
        )}
      />
      <PageHeader
        title="The full range"
        description="Everything Thornstead makes, in one place. Filter by category or price to narrow it down."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ]}
      />
      <ShopBrowser
        products={getAllProducts()}
        categories={getAllCategories()}
        priceRange={getPriceRange()}
        initialQuery={q ?? ''}
      />
    </>
  );
}
