import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { getAllCategories, getProductsByCategory } from '@/lib/products';
import { jsonLdScript, breadcrumbJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Kategorien',
  description:
    'Hainholt nach Kategorie: Kaffee, Küchenmaschinen, Heißluftfritteusen, Töpfe und Pfannen, Messer sowie Grills und Pizzaöfen.',
  alternates: { canonical: '/kategorien' },
};

const crumbs = [
  { name: 'Startseite', path: '/' },
  { name: 'Kategorien', path: '/kategorien' },
];

export default function KategorienPage() {
  const categories = getAllCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(crumbs))}
      />
      <PageHeader
        title="Kategorien"
        description={`${categories.length} Bereiche für Kaffee, Kochen, Messer und Grill.`}
        crumbs={crumbs}
      />

      <div className="container-page grid gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const products = getProductsByCategory(category.slug);
          const cover = products[0]?.images[0];

          return (
            <Link
              key={category.slug}
              href={`/kategorien/${category.slug}`}
              className="group overflow-hidden rounded-3xl border border-border transition-colors hover:border-brand"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {cover && (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="p-5">
                <h2 className="font-sans text-base font-medium">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand">
                  {products.length}{' '}
                  {products.length === 1 ? 'Produkt' : 'Produkte'}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
