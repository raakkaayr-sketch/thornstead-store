'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import type { OrderSummary } from '@/lib/order-types';

type Mode = 'track' | 'cancel';

export function OrderLookup({ mode }: { mode: Mode }) {
  const [sessionId, setSessionId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (action: 'lookup' | 'cancel') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bestellung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, sessionId, email }),
      });
      const data = (await res.json()) as {
        order?: OrderSummary;
        error?: string;
        alreadyRefunded?: boolean;
      };
      if (data.order) setOrder(data.order);
      if (!res.ok) {
        throw new Error(
          data.error || 'Die Bestellung konnte nicht geladen werden.'
        );
      }
      if (action === 'cancel') setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Die Bestellung konnte nicht geladen werden.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <form
        className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void submit('lookup');
        }}
      >
        <div>
          <label htmlFor="sessionId" className="mb-1.5 block text-sm font-medium">
            Bestellreferenz
          </label>
          <Input
            id="sessionId"
            required
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="cs_live_…"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Steht in der Bestätigungsmail und auf der Seite nach dem Kauf.
          </p>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            E-Mail-Adresse der Bestellung
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        <Button type="submit" variant="brand" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Wird geladen…
            </>
          ) : (
            <>
              <PackageSearch className="h-4 w-4" /> Bestellung anzeigen
            </>
          )}
        </Button>
      </form>

      {order && (
        <div className="rounded-3xl border border-border p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            {order.statusLabel}
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold">
            Bestellung {order.id}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {order.statusDetail}
          </p>

          <dl className="mt-5 space-y-2 text-sm">
            {order.amountTotal != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Betrag</dt>
                <dd className="tabular-nums">
                  {formatPrice(order.amountTotal / 100, order.currency)}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Lieferzeit</dt>
              <dd>{order.estimatedDelivery}</dd>
            </div>
            {order.shippingTo && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Lieferung an</dt>
                <dd className="text-right">{order.shippingTo}</dd>
              </div>
            )}
          </dl>

          {order.items.length > 0 && (
            <ul className="mt-5 divide-y divide-border border-t border-border text-sm">
              {order.items.map((item) => (
                <li
                  key={`${item.name}-${item.quantity}`}
                  className="flex justify-between gap-4 py-3"
                >
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span className="tabular-nums">
                    {formatPrice(item.amount / 100, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-5 text-xs text-muted-foreground">
            Die DHL-Sendungsnummer erhalten Sie per E-Mail, sobald das Paket
            unser Lager verlässt. Eine Sendungsverfolgung bei DHL ist dann über
            die Nummer in dieser Mail möglich.
          </p>

          {mode === 'track' && (
            <p className="mt-4 text-sm">
              Bestellung stornieren?{' '}
              <Link href="/bestellung-stornieren" className="text-brand hover:underline">
                Zur Stornierung
              </Link>
            </p>
          )}

          {mode === 'cancel' && order.refunded && (
            <p className="mt-5 rounded-xl bg-brand/10 px-3 py-2 text-sm text-brand">
              {done
                ? 'Die Stornierung ist ausgeführt. Die Erstattung läuft über das ursprüngliche Zahlungsmittel.'
                : 'Diese Bestellung ist bereits storniert und erstattet.'}
            </p>
          )}

          {mode === 'cancel' && order.canCancel && !order.refunded && (
            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
                />
                <span>
                  Ich möchte diese Bestellung stornieren. Der Kaufpreis wird auf
                  das ursprüngliche Zahlungsmittel erstattet
                  {order.cancelUntil
                    ? ` (Selbstbedienung bis ${order.cancelUntil})`
                    : ''}
                  .
                </span>
              </label>
              <Button
                variant="brand"
                className="w-full"
                disabled={loading || !confirmed}
                onClick={() => void submit('cancel')}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Wird storniert…
                  </>
                ) : (
                  'Bestellung jetzt stornieren'
                )}
              </Button>
            </div>
          )}

          {mode === 'cancel' && !order.canCancel && !order.refunded && (
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <p>
                Diese Bestellung lässt sich hier nicht mehr automatisch
                stornieren. Schreiben Sie uns unter{' '}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-brand hover:underline"
                >
                  {siteConfig.contact.email}
                </a>{' '}
                oder nutzen Sie das{' '}
                <Link href="/widerruf" className="text-brand hover:underline">
                  Widerrufsrecht
                </Link>
                , falls die Ware schon unterwegs oder angekommen ist.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
