import Link from 'next/link';
import { StripeLoadError } from '@/components/admin/stripe-load-error';
import { formatAdminDateTime, formatCents, groupCustomers, loadAdminOrders } from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Kunden' };

export default async function AdminCustomersPage() {
  if (!isStripeConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Kunden</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Stripe ist nicht eingerichtet.
        </p>
      </div>
    );
  }

  const { orders, error } = await loadAdminOrders();
  if (error) {
    return (
      <div>
        <h1 className="font-display text-3xl">Kunden</h1>
        <div className="mt-6">
          <StripeLoadError message={error} />
        </div>
      </div>
    );
  }

  const customers = groupCustomers(orders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Kunden</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aus Stripe-Checkouts gruppiert — Name, E-Mail, Telefon, Adresse und
          Bestellhistorie. Ohne Webhook.
        </p>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          Noch keine Kundendaten in Stripe.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Kunde</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Bestellungen</th>
                <th className="px-4 py-3 font-medium">Umsatz</th>
                <th className="px-4 py-3 font-medium">Zuletzt</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.key}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {customer.name || customer.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{customer.phone || '—'}</div>
                    <div className="max-w-xs truncate text-xs">
                      {customer.address || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {customer.paidCount}
                    {customer.orderCount !== customer.paidCount
                      ? ` / ${customer.orderCount}`
                      : ''}
                  </td>
                  <td className="px-4 py-3">
                    {formatCents(customer.totalSpent)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatAdminDateTime(customer.lastOrderAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/kunden/${customer.key}`}
                      className="text-sm text-brand hover:underline"
                    >
                      Öffnen
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
