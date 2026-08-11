'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlist } from '@/components/providers/wishlist-provider';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const saved = hydrated && has(product.id);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        <button
          type="button"
          aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggle(product.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-brand text-brand')} />
        </button>

        <button
          type="button"
          onClick={() => addItem(product)}
          aria-label={`Add ${product.title} to basket`}
          className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand text-brand-foreground opacity-0 shadow-lg transition-all duration-300 hover:bg-brand/90 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-sans text-[15px] font-medium leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
        <p className="mt-2.5 text-[15px] font-medium tabular-nums">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
