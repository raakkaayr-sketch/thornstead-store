'use client';

import { useState } from 'react';
import { AlertCircle, Heart, Loader2, Lock, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlist } from '@/components/providers/wishlist-provider';
import { useCheckout } from '@/components/cart/use-checkout';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function BuyBox({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const { checkout, loading, error } = useCheckout();
  const saved = hydrated && has(product.id);
  const inStock = product.availability === 'in_stock';

  const buyNow = () =>
    checkout([
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        sku: product.sku,
        price: product.price,
        image: product.images[0]?.src ?? '',
        quantity,
      },
    ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            aria-label="Reduce quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!inStock || loading}
          onClick={() => addItem(product, quantity)}
        >
          <ShoppingBag className="h-4 w-4" />
          {inStock
            ? `Add to basket · ${formatPrice(product.price * quantity)}`
            : 'Out of stock'}
        </Button>

        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          onClick={() => toggle(product.id)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <Heart className={cn('h-[18px] w-[18px]', saved && 'fill-brand text-brand')} />
        </button>
      </div>

      <Button
        variant="brand"
        size="lg"
        className="w-full"
        disabled={!inStock || loading}
        onClick={buyNow}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Taking you to checkout…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Buy now · {formatPrice(product.price * quantity)}
          </>
        )}
      </Button>

      {error && (
        <p className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
