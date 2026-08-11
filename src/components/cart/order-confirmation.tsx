'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { useCart } from '@/components/providers/cart-provider';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

interface SessionSummary {
  id: string;
  amountTotal: number | null;
  currency: string;
  email: string | null;
}

export function OrderConfirmation() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart, closeCart } = useCart();
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const window_ = deliveryWindow();

  useEffect(() => {
    clearCart();
    closeCart();
  }, [clearCart, closeCart]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SessionSummary | null) => data && setSummary(data))
      .catch(() => undefined);
  }, [sessionId]);

  return (
    <div className="container-page flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <CheckCircle2 className="h-8 w-8 text-brand" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Thank you — your order is confirmed</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Stripe has emailed your receipt
          {summary?.email ? ` to ${summary.email}` : ''}. We will send a second
          email with tracking as soon as your parcel is collected, normally
          within {siteConfig.shipping.handlingDaysMin}–
          {siteConfig.shipping.handlingDaysMax} business days. Expect delivery in
          around {window_.min}–{window_.max} business days.
        </p>
      </div>

      {summary?.amountTotal != null && (
        <dl className="w-full rounded-2xl border border-border p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total paid</dt>
            <dd className="font-medium tabular-nums">
              {formatPrice(summary.amountTotal / 100, summary.currency)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="text-muted-foreground">Order reference</dt>
            <dd className="truncate font-mono text-xs">{summary.id}</dd>
          </div>
        </dl>
      )}

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link
          href="/shop"
          className={`${buttonVariants({ variant: 'outline' })} flex-1`}
        >
          Continue shopping
        </Link>
        <Link
          href="/contact"
          className={`${buttonVariants({ variant: 'brand' })} flex-1`}
        >
          Contact us about this order
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Keep your order reference — quoting it makes any question about
        delivery or returns much quicker to answer.
      </p>
    </div>
  );
}
