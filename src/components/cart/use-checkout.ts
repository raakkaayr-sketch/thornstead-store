'use client';

import { useState } from 'react';
import type { CartItem } from '@/lib/types';

/**
 * Startet eine eingebettete Stripe-Checkout-Session auf /kasse. Preise werden
 * nie aus dem Browser gesendet — die API-Route sucht jede Artikelnummer
 * serverseitig im Katalog.
 *
 * Die Kundin oder der Kunde bleibt auf dieser Website; es gibt keine
 * Weiterleitung auf checkout.stripe.com.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

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

      const data = (await res.json()) as {
        clientSecret?: string;
        error?: string;
      };
      if (!res.ok || !data.clientSecret) {
        throw new Error(
          data.error || 'Die Zahlung konnte nicht gestartet werden.'
        );
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setClientSecret('');
    setError('');
  };

  return { checkout, reset, loading, error, clientSecret };
}
