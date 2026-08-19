'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Lock, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlist } from '@/components/providers/wishlist-provider';
import { PriceNote } from '@/components/price-note';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function BuyBox({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const router = useRouter();
  const saved = hydrated && has(product.id);
  const inStock = product.availability === 'in_stock';

  /**
   * "Jetzt kaufen" löst keine Zahlung aus, sondern legt den Artikel in den
   * Warenkorb und führt zur Bestellübersicht. Ein direkter Sprung zu Stripe
   * würde die Pflichtangaben nach § 312j Abs. 2 BGB überspringen.
   */
  const buyNow = () => {
    addItem(product, quantity, { open: false });
    router.push('/kasse');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            aria-label="Menge verringern"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            aria-label="Menge erhöhen"
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
          disabled={!inStock}
          onClick={() => addItem(product, quantity)}
        >
          <ShoppingBag className="h-4 w-4" />
          {inStock
            ? `In den Warenkorb · ${formatPrice(product.price * quantity)}`
            : 'Nicht verfügbar'}
        </Button>

        <button
          type="button"
          aria-label={saved ? 'Von der Merkliste entfernen' : 'Zur Merkliste hinzufügen'}
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
        disabled={!inStock}
        onClick={buyNow}
      >
        <Lock className="h-4 w-4" /> Jetzt kaufen ·{' '}
        {formatPrice(product.price * quantity)}
      </Button>

      <PriceNote />
    </div>
  );
}
