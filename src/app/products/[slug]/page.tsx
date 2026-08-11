import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/page-header';
import { ProductGallery } from '@/components/product/product-gallery';
import { BuyBox } from '@/components/product/buy-box';
import { DeliveryInfo } from '@/components/product/delivery-info';
import { TrustPanel } from '@/components/product/trust-panel';
import { RecentlyViewed } from '@/components/product/recently-viewed';
import { ProductCard } from '@/components/product/product-card';
import { Badge } from '@/components/ui/badge';
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/products';
import {
  breadcrumbJsonLd,
  jsonLdScript,
  productJsonLd,
} from '@/lib/structured-data';
import { formatPrice, shippingFor } from '@/lib/utils';

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.title} | Thornstead`,
      description: product.shortDescription,
      images: [{ url: product.images[0].src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const shipping = shippingFor(product.price);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: product.category, path: `/categories/${product.categorySlug}` },
    { name: product.title, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productJsonLd(product))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(crumbs))}
      />

      <div className="container-page px-6 py-8">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} />
          </div>

          <div>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              {product.category}
            </Link>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-medium tabular-nums">
                {formatPrice(product.price)}
              </p>
              <Badge variant="brand">
                {product.availability === 'in_stock' ? 'In stock' : 'Out of stock'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {shipping === 0
                  ? 'Free UK delivery'
                  : `+ ${formatPrice(shipping)} UK delivery`}
              </span>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="mt-7">
              <BuyBox product={product} />
            </div>

            <div className="mt-7">
              <TrustPanel product={product} />
            </div>

            <div className="mt-6">
              <DeliveryInfo />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-14">
          <section>
            <h2 className="text-xl font-semibold">About this product</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {product.features.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[15px]">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold">Specifications</h2>
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border">
              {product.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-6 px-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-6 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="text-right font-medium">{product.sku}</dd>
              </div>
            </dl>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-semibold">You might also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        <RecentlyViewed products={getAllProducts()} currentId={product.id} />
      </div>
    </>
  );
}
