import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FulfillmentForm } from '@/components/admin/fulfillment-form';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';
import { RefundButton } from '@/components/admin/refund-button';
import {
  customerKey,
  formatAdminDateTime,
  formatCents,
  getAdminOrder,
  stripeDashboardUrl,
} from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Bestellung' };

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: {
    name: string | null;
    line1: string | null;
    line2: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
  } | null;
}) {
  if (!address) {
    return (
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">Keine Angabe</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <address className="mt-2 not-italic text-sm text-muted-foreground">
        {address.name ? <div>{address.name}</div> : null}
        {address.line1 ? <div>{address.line1}</div> : null}
        {address.line2 ? <div>{address.line2}</div> : null}
        <div>
          {[address.postalCode, address.city].filter(Boolean).join(' ')}
        </div>
        {address.country ? <div>{address.country}</div> : null}
      </address>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isStripeConfigured()) notFound();

  const order = await getAdminOrder(id);
  if (!order) notFound();

  const dashboard = stripeDashboardUrl(order.paymentIntentId);
  const customerHref = order.email
    ? `/admin/kunden/${customerKey(order.email)}`
    : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/bestellungen"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Alle Bestellungen
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl">Bestellung</h1>
          <OrderStatusBadge status={order.status} label={order.statusLabel} />
        </div>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{order.id}</p>
        <p className="text-sm text-muted-foreground">
          {formatAdminDateTime(order.created)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg">Kunde</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{order.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">E-Mail</dt>
                <dd>
                  {customerHref ? (
                    <Link href={customerHref} className="text-brand hover:underline">
                      {order.email}
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Telefon</dt>
                <dd>{order.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Stripe-Kunde</dt>
                <dd className="font-mono text-xs">
                  {order.customerId || 'Kein Kundenobjekt'}
                </dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <AddressBlock title="Lieferadresse" address={order.shipping} />
              <AddressBlock title="Rechnungsadresse" address={order.billing} />
            </div>
          </section>

          <section className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Artikel</th>
                  <th className="px-5 py-3 font-medium">Menge</th>
                  <th className="px-5 py-3 text-right font-medium">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.name}-${index}`} className="border-b border-border">
                    <td className="px-5 py-3">
                      <div>{item.name}</div>
                      {item.sku ? (
                        <div className="text-xs text-muted-foreground">
                          Art.-Nr. {item.sku}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">{item.quantity}</td>
                    <td className="px-5 py-3 text-right">
                      {formatCents(item.amount, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                {order.amountShipping != null ? (
                  <tr>
                    <td className="px-5 pt-3" colSpan={2}>
                      Versand
                    </td>
                    <td className="px-5 pt-3 text-right">
                      {formatCents(order.amountShipping, order.currency)}
                    </td>
                  </tr>
                ) : null}
                <tr className="font-medium">
                  <td className="px-5 py-3" colSpan={2}>
                    Gesamt
                  </td>
                  <td className="px-5 py-3 text-right">
                    {formatCents(order.amountTotal, order.currency)}
                  </td>
                </tr>
                {order.amountRefunded > 0 ? (
                  <tr className="text-destructive">
                    <td className="px-5 pb-3" colSpan={2}>
                      Erstattet
                    </td>
                    <td className="px-5 pb-3 text-right">
                      −{formatCents(order.amountRefunded, order.currency)}
                    </td>
                  </tr>
                ) : null}
              </tfoot>
            </table>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg">Versand</h2>
            <div className="mt-4">
              <FulfillmentForm
                sessionId={order.id}
                status={order.status}
                tracking={order.tracking}
              />
            </div>
            {order.tracking ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Aktuell: {order.tracking}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg">Zahlung</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.paymentStatus === 'paid' ? 'Bezahlt' : 'Nicht bezahlt'}
              {order.refunded ? ' · erstattet' : ''}
            </p>
            <div className="mt-4">
              <RefundButton
                sessionId={order.id}
                disabled={
                  order.paymentStatus !== 'paid' || order.refunded
                }
              />
            </div>
            {dashboard ? (
              <a
                href={dashboard}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-brand hover:underline"
              >
                In Stripe öffnen
              </a>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
