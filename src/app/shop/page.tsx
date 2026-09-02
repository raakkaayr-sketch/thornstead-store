import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ShopBrowser } from '@/components/shop/shop-browser';
import { getAllCategories, getAllProducts, getPriceRange } from '@/lib/products';
import { jsonLdScript, breadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Shop — Küchengeräte',
  description:
    'Das Hainholt-Sortiment: Kaffeevollautomaten, Küchenmaschinen, Heißluftfritteusen, Kochgeschirr, Messer und Grills. Versand innerhalb Deutschlands.',
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
        description="Kaffee, Küchenmaschinen, Kochgeschirr, Messer und Grills bekannter Marken. Filtern Sie nach Kategorie, Marke oder Preis."
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
