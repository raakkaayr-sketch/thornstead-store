import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrdersTable } from '@/components/admin/orders-table';
import {
  emailFromCustomerKey,
  formatAdminDateTime,
  formatCents,
  groupCustomers,
  loadAdminOrders,
} from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Kunde' };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!isStripeConfigured()) notFound();

  const email = emailFromCustomerKey(key);
  if (!email) notFound();

  const { orders: loaded, error } = await loadAdminOrders();
  if (error) notFound();

  const customer = groupCustomers(loaded).find(
    (entry) => entry.email === email
  );
  if (!customer) notFound();

  const orders = [...customer.orders].sort((a, b) => b.created - a.created);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/kunden"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Alle Kunden
        </Link>
        <h1 className="mt-3 font-display text-3xl">
          {customer.name || customer.email}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
      </div>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Telefon
          </p>
          <p className="mt-1 text-sm">{customer.phone || '—'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Adresse
          </p>
          <p className="mt-1 text-sm">{customer.address || '—'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Bezahlte Bestellungen
          </p>
          <p className="mt-1 text-sm">{customer.paidCount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Umsatz
          </p>
          <p className="mt-1 text-sm">{formatCents(customer.totalSpent)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Zuletzt aktiv
          </p>
          <p className="mt-1 text-sm">
            {formatAdminDateTime(customer.lastOrderAt)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Stripe-Kunde
          </p>
          <p className="mt-1 font-mono text-xs">
            {customer.stripeCustomerId || 'Kein Kundenobjekt'}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Bestellungen</h2>
        <OrdersTable orders={orders} />
      </section>
    </div>
  );
}
