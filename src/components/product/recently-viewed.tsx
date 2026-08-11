'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecentlyViewed } from '@/components/providers/recently-viewed-provider';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

/** Records the current product, then shows the rest of the visitor's history. */
export function RecentlyViewed({
  products,
  currentId,
}: {
  products: Product[];
  currentId?: string;
}) {
  const { ids, add, hydrated } = useRecentlyViewed();

  useEffect(() => {
    if (currentId) add(currentId);
  }, [currentId, add]);

  if (!hydrated) return null;

  const items = ids
    .filter((id) => id !== currentId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-xl font-semibold">Recently viewed</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-3 text-sm font-medium leading-snug">{product.title}</p>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
