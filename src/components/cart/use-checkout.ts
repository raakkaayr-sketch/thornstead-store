'use client';

import { useState } from 'react';
import type { CartItem } from '@/lib/types';

/**
 * Starts a Stripe Checkout Session. Prices are never sent from the browser —
 * the API route looks each SKU up in the catalogue server-side, so the amount
 * charged always equals the price shown on the product page and in the feed.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkout = async (items: CartItem[]) => {
    if (!items.length) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'We could not start checkout.');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not start checkout. Please try again.'
      );
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}
