'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button-variants';
import { useWishlist } from '@/components/providers/wishlist-provider';
import type { Product } from '@/lib/types';

export function WishlistGrid({ products }: { products: Product[] }) {
  const { ids, hydrated } = useWishlist();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const saved = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Heart className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Noch nichts gemerkt</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tippen Sie bei einem Produkt auf das Herz, um es hier für später
            aufzubewahren.
          </p>
        </div>
        <Link href="/shop" className={buttonVariants({ variant: 'brand' })}>
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {saved.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
