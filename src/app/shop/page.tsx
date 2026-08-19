import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ShopBrowser } from '@/components/shop/shop-browser';
import { getAllCategories, getAllProducts, getPriceRange } from '@/lib/products';
import { jsonLdScript, breadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Shop — alle Produkte für Garten und Zuhause',
  description:
    'Das gesamte Thornstead-Sortiment: Pflanzkübel, Außenaufbewahrung, Gartenwerkzeug, Küchenhelfer und Vogelpflege. Versand innerhalb Deutschlands.',
  alternates: { canonical: '/shop' },
};

const crumbs = [
  { name: 'Startseite', path: '/' },
  { name: 'Shop', path: '/shop' },
];

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
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(crumbs))}
      />
      <PageHeader
        title="Das gesamte Sortiment"
        description="Alles von Thornstead an einem Ort. Filtern Sie nach Kategorie oder Preis, um schneller zu finden, was Sie suchen."
        crumbs={crumbs}
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
