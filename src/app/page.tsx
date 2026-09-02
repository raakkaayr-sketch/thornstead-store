import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChefHat, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { buttonVariants } from '@/components/ui/button-variants';
import { PriceNote } from '@/components/price-note';
import { siteConfig, deliveryWindow } from '@/lib/config';
import {
  getCategoryShowcase,
  getFeaturedProducts,
  getAllProducts,
} from '@/lib/products';
import { formatPrice } from '@/lib/utils';

const BRANDS = [
  'De’Longhi',
  'Philips',
  'Sage',
  'JURA',
  'KitchenAid',
  'Ninja',
  'Le Creuset',
  'Wüsthof',
  'Weber',
  'Ooni',
];

export default function HomePage() {
  const featured = getFeaturedProducts(6);
  const categories = getCategoryShowcase();
  const productCount = getAllProducts().length;
  const deliveryEstimate = deliveryWindow();
  const { shipping, returns, payment } = siteConfig;

  const promises = [
    {
      icon: ChefHat,
      title: 'Ausgewählte Marken',
      body: 'Kein Endloskatalog: Vollautomaten, Küchenmaschinen, Kochgeschirr, Messer und Grills von Marken, die in ihrer Kategorie Maßstäbe setzen.',
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
              Küche, Kaffee und Grill
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Küchengeräte, die man nicht nach einer Saison ersetzt.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Hainholt führt ausgewählte Vollautomaten, Küchenmaschinen,
              Kochgeschirr, Messer und Pizzaöfen bekannter Marken — direkt nach
              Deutschland, mit Herstellerangaben auf jeder Produktseite.
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
                href="/kategorien"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Nach Kategorie
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {productCount} Produkte in {categories.length} Kategorien · Lieferung
              innerhalb Deutschlands
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

      <section className="border-b border-border">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-muted-foreground">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/shop?q=${encodeURIComponent(brand)}`}
              className="transition-colors hover:text-foreground"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Empfohlene Produkte
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ein Gerät aus jeder Kategorie — der übliche Einstieg ins Sortiment.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-brand hover:underline sm:flex"
          >
            Alle {productCount} ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        <PriceNote className="mt-8" />
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="container-page px-6 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Nach Kategorie stöbern
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sechs Bereiche, keine Überraschungen dazwischen.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategorien/${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-brand"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  {category.cover && (
                    <Image
                      src={category.cover.src}
                      alt={category.cover.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-sans text-base font-medium">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand">
                    {category.count} {category.count === 1 ? 'Produkt' : 'Produkte'}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
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
