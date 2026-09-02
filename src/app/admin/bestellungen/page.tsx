import Link from 'next/link';
import { OrdersTable } from '@/components/admin/orders-table';
import { listAdminOrders } from '@/lib/admin-orders';
import type { OrderStatus } from '@/lib/order-types';
import { isStripeConfigured } from '@/lib/stripe';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Bestellungen' };

const filters: { id: string; label: string; status?: OrderStatus }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'in_bearbeitung', label: 'In Bearbeitung', status: 'in_bearbeitung' },
  { id: 'versendet', label: 'Versendet', status: 'versendet' },
  { id: 'storniert', label: 'Storniert', status: 'storniert' },
  { id: 'zahlung_offen', label: 'Zahlung offen', status: 'zahlung_offen' },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const query = (q ?? '').trim().toLowerCase();
  const active = filters.some((filter) => filter.id === status)
    ? status
    : 'alle';

  if (!isStripeConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Bestellungen</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Stripe ist nicht eingerichtet.
        </p>
      </div>
    );
  }

  let orders = await listAdminOrders();
  if (active !== 'alle') {
    orders = orders.filter((order) => order.status === active);
  }
  if (query) {
    orders = orders.filter((order) => {
      const haystack = [
        order.id,
        order.email,
        order.name,
        order.phone,
        order.itemSummary,
        order.shippingLine,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }
  orders = [...orders].sort((a, b) => b.created - a.created);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Bestellungen</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live aus Stripe. Neue Zahlungen erscheinen nach dem nächsten Laden
          dieser Seite.
        </p>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" action="/admin/bestellungen">
        {active !== 'alle' ? (
          <input type="hidden" name="status" value={active} />
        ) : null}
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Suche nach Name, E-Mail, Bestellung…"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Suchen
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const href =
            filter.id === 'alle'
              ? query
                ? `/admin/bestellungen?q=${encodeURIComponent(query)}`
                : '/admin/bestellungen'
              : `/admin/bestellungen?status=${filter.id}${
                  query ? `&q=${encodeURIComponent(query)}` : ''
                }`;
          const isActive = active === filter.id;
          return (
            <Link
              key={filter.id}
              href={href}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm',
                isActive
                  ? 'bg-brand text-brand-foreground'
                  : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground'
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
