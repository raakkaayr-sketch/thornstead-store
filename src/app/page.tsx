import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { buttonVariants } from '@/components/ui/button-variants';
import { PriceNote } from '@/components/price-note';
import { siteConfig, deliveryWindow } from '@/lib/config';
import {
  getAllCategories,
  getFeaturedProducts,
  getAllProducts,
} from '@/lib/products';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const featured = getFeaturedProducts(4);
  const categories = getAllCategories();
  const productCount = getAllProducts().length;
  const deliveryEstimate = deliveryWindow();
  const { shipping, returns, payment } = siteConfig;

  const promises = [
    {
      icon: Camera,
      title: 'Geprüfte Gebrauchtware',
      body: 'Jede Kamera wird vor dem Verkauf beschrieben und geprüft — mit ehrlichen Angaben zu Zustand, Auslösungen und Lieferumfang.',
    },
    {
      icon: Truck,
      title: 'Versand in Deutschland',
      body:
        shipping.freeThreshold !== null
          ? `${formatPrice(shipping.standardCost)} Versand, versandkostenfrei ab ${formatPrice(shipping.freeThreshold)}. In der Regel ${deliveryEstimate.min} bis ${deliveryEstimate.max} Werktage.`
          : `${formatPrice(shipping.standardCost)} Versand, in der Regel ${deliveryEstimate.min} bis ${deliveryEstimate.max} Werktage.`,
    },
    {
      icon: PackageCheck,
      title: `${returns.days} Tage Rückgabe`,
      body: `Sie können alles innerhalb von ${returns.days} Tagen zurücksenden — zusätzlich zu Ihrem gesetzlichen Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen.`,
    },
    {
      icon: ShieldCheck,
      title: 'Sichere Kasse',
      body: `Kartenzahlungen werden über ${payment.processor} abgewickelt. Wir sehen und speichern Ihre Kartendaten nie.`,
    },
  ];

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page grid gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Kameras &amp; Optik, geprüft verkauft
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Gebrauchte Digitalkameras, ehrlich beschrieben.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Hainholt verkauft geprüfte Kameras von Canon, Sony und Nikon —
              Kompakt-, System- und Spiegelreflexmodelle mit klaren Angaben zu
              Zustand, Zubehör und Preis in Euro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={buttonVariants({ variant: 'brand', size: 'lg' })}
              >
                Sortiment ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ueber-uns"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Warum Hainholt
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {productCount} Produkte · Lieferung innerhalb Deutschlands
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((product, index) => (
              <Link
                key={product.id}
                href={`/produkte/${product.slug}`}
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
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Empfohlene Produkte
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ein paar Stücke, die üblicherweise zuerst aus dem Regal
              verschwinden.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-brand hover:underline sm:flex"
          >
            Alle ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>

        <PriceNote className="mt-8" />
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="container-page px-6 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Nach Kategorie stöbern
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategorien/${category.slug}`}
                className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-brand"
              >
                <h3 className="font-sans text-base font-medium">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand">
                  Ansehen
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
