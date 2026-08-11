import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { buttonVariants } from '@/components/ui/button-variants';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { getAllCategories, getFeaturedProducts, getAllProducts } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const featured = getFeaturedProducts(4);
  const categories = getAllCategories();
  const productCount = getAllProducts().length;
  const window = deliveryWindow();
  const { shipping, returns } = siteConfig;

  const promises = [
    {
      icon: Leaf,
      title: 'Our own designs',
      body: 'Every product is designed, branded and sold by Thornstead. Nothing here is a rebadged catalogue item.',
    },
    {
      icon: Truck,
      title: 'UK delivery',
      body:
        shipping.freeThreshold !== null
          ? `${formatPrice(shipping.standardCost)} standard delivery, free over ${formatPrice(shipping.freeThreshold)}. Typically ${window.min}–${window.max} business days.`
          : `${formatPrice(shipping.standardCost)} standard delivery, typically ${window.min}–${window.max} business days.`,
    },
    {
      icon: PackageCheck,
      title: `${returns.days}-day returns`,
      body: `Send anything back within ${returns.days} days for a refund, on top of your 14-day legal right to cancel.`,
    },
    {
      icon: ShieldCheck,
      title: 'Secure checkout',
      body: 'Card payments are processed by Stripe. We never see or store your card details.',
    },
  ];

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page grid gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Home &amp; garden, made by us
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Things for the garden that last longer than a season.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Thornstead designs its own range of planters, storage, tools and
              wildlife care — then sells it direct, so you are paying for the
              product rather than three middlemen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={buttonVariants({ variant: 'brand', size: 'lg' })}>
                Shop the range
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Why we make our own
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {productCount} products · Delivered across the United Kingdom
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-background"
              >
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                  {formatPrice(product.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Featured products</h2>
            <p className="mt-2 text-muted-foreground">
              A few pieces that tend to leave the shelves first.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-brand hover:underline sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="container-page px-6 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Shop by category</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-brand"
              >
                <h3 className="font-sans text-base font-medium">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand">
                  Browse
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div key={promise.title}>
              <promise.icon className="h-5 w-5 text-brand" />
              <h2 className="mt-4 font-sans text-base font-medium">
                {promise.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
