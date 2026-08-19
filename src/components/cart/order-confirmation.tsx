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
  const deliveryEstimate = deliveryWindow();

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
        <h1 className="text-2xl font-semibold">
          Vielen Dank — Ihre Bestellung ist eingegangen
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Die Zahlungsbestätigung wurde per E-Mail
          {summary?.email ? ` an ${summary.email}` : ''} versendet. Sobald Ihr
          Paket abgeholt wurde, erhalten Sie eine zweite E-Mail mit der
          Sendungsnummer, in der Regel innerhalb von{' '}
          {siteConfig.shipping.handlingDaysMin} bis{' '}
          {siteConfig.shipping.handlingDaysMax} Werktagen. Mit der Lieferung
          rechnen Sie am besten in {deliveryEstimate.min} bis{' '}
          {deliveryEstimate.max} Werktagen.
        </p>
      </div>

      {summary?.amountTotal != null && (
        <dl className="w-full rounded-2xl border border-border p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Gezahlter Gesamtbetrag</dt>
            <dd className="font-medium tabular-nums">
              {formatPrice(
                summary.amountTotal / 100,
                summary.currency.toUpperCase()
              )}
            </dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="text-muted-foreground">Bestellreferenz</dt>
            <dd className="truncate font-mono text-xs">{summary.id}</dd>
          </div>
        </dl>
      )}

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Link
          href="/shop"
          className={`${buttonVariants({ variant: 'outline' })} flex-1`}
        >
          Weiter einkaufen
        </Link>
        <Link
          href="/kontakt"
          className={`${buttonVariants({ variant: 'brand' })} flex-1`}
        >
          Frage zu dieser Bestellung
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Bitte bewahren Sie die Bestellreferenz auf. Mit ihr lassen sich Fragen zu
        Lieferung, Widerruf oder Rückgabe deutlich schneller klären.
      </p>
    </div>
  );
}
