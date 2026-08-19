'use client';

import { useState } from 'react';
import type { CartItem } from '@/lib/types';

/**
 * Startet eine Stripe-Checkout-Session. Preise werden nie aus dem Browser
 * gesendet — die API-Route sucht jede Artikelnummer serverseitig im Katalog, der
 * belastete Betrag entspricht damit immer dem Preis auf der Produktseite und im
 * Merchant-Center-Feed.
 *
 * Aufgerufen wird dies ausschließlich von der Bestellübersicht unter /kasse,
 * damit die Pflichtangaben nach § 312j Abs. 2 BGB unmittelbar vor der
 * Bestellschaltfläche stehen.
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
        throw new Error(
          data.error || 'Die Zahlung konnte nicht gestartet werden.'
        );
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.'
      );
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}
