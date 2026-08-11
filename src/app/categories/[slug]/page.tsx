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
  if (!category) return { title: 'Category not found' };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Categories', path: '/categories' },
            { name: category.name, path: `/categories/${category.slug}` },
          ])
        )}
      />
      <PageHeader
        title={category.name}
        description={category.description}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: category.name, path: `/categories/${category.slug}` },
        ]}
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
