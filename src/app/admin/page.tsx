import Link from 'next/link';
import { OrdersTable } from '@/components/admin/orders-table';
import { StripeLoadError } from '@/components/admin/stripe-load-error';
import {
  dashboardStats,
  formatCents,
  loadAdminOrders,
} from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function StripeMissing() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-sm text-muted-foreground">
      Stripe ist nicht eingerichtet. Bitte{' '}
      <code className="font-mono">STRIPE_SECRET_KEY</code> setzen. Die Verwaltung
      liest Bestellungen live von Stripe — ohne Webhook.
    </div>
  );
}

export default async function AdminHomePage() {
  if (!isStripeConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Übersicht</h1>
        <div className="mt-6">
          <StripeMissing />
        </div>
      </div>
    );
  }

  const { orders, error } = await loadAdminOrders();
  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl">Übersicht</h1>
        <div className="mt-6">
          <StripeLoadError message={error} />
        </div>
      </div>
    );
  }

  const stats = dashboardStats(orders);
  const packing = orders.filter((order) => order.status === 'in_bearbeitung');
  const recent = [...orders].sort((a, b) => b.created - a.created).slice(0, 8);

  const cards = [
    { label: 'Umsatz im Monat', value: formatCents(stats.monthRevenue) },
    { label: 'Bestellungen im Monat', value: String(stats.monthCount) },
    { label: 'Kunden mit Zahlung', value: String(stats.customers) },
    { label: 'Zu versenden', value: String(stats.packingCount) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Übersicht</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Bestellungen kommen direkt aus Stripe, sobald die Zahlung
          abgeschlossen ist — ohne Webhook. Diese Seite neu laden, um den
          aktuellen Stand zu sehen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card px-5 py-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 font-display text-2xl">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">Zu versenden</h2>
          <Link
            href="/admin/bestellungen?status=in_bearbeitung"
            className="text-sm text-brand hover:underline"
          >
            Alle anzeigen
          </Link>
        </div>
        <OrdersTable orders={packing.slice(0, 8)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl">Letzte Bestellungen</h2>
          <Link
            href="/admin/bestellungen"
            className="text-sm text-brand hover:underline"
          >
            Alle Bestellungen
          </Link>
        </div>
        <OrdersTable orders={recent} />
      </section>
    </div>
  );
}
