import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { ShopBrowser } from '@/components/shop/shop-browser';
import {
  getAllCategories,
  getCategoryBySlug,
  getAllProducts,
  getPriceRange,
} from '@/lib/products';
import { jsonLdScript, breadcrumbJsonLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Kategorie nicht gefunden' };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/kategorien/${category.slug}` },
  };
}

export default async function KategorieSeite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const crumbs = [
    { name: 'Startseite', path: '/' },
    { name: 'Kategorien', path: '/kategorien' },
    { name: category.name, path: `/kategorien/${category.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(crumbs))}
      />
      <PageHeader
        title={category.name}
        description={category.description}
        crumbs={crumbs}
      />
      <ShopBrowser
        products={getAllProducts()}
        categories={getAllCategories()}
        priceRange={getPriceRange()}
        initialCategory={category.slug}
      />
    </>
  );
}
