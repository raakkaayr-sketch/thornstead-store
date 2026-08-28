'use client';

import { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { getStripePublishableKey } from '@/lib/stripe-public';

export function EmbeddedPayment({ clientSecret }: { clientSecret: string }) {
  const stripePromise = useMemo(() => {
    const key = getStripePublishableKey();
    return key ? loadStripe(key) : null;
  }, []);

  if (!stripePromise) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Die Zahlung auf dieser Seite ist nicht eingerichtet. Bitte
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel setzen.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
