import Link from 'next/link';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';
import {
  formatAdminDateTime,
  formatCents,
  type AdminOrder,
} from '@/lib/admin-orders';

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (!orders.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        Keine Bestellungen in dieser Ansicht.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Datum</th>
            <th className="px-4 py-3 font-medium">Kunde</th>
            <th className="px-4 py-3 font-medium">Artikel</th>
            <th className="px-4 py-3 font-medium">Betrag</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {formatAdminDateTime(order.created)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">
                  {order.name || order.email || 'Gast'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.email || 'Keine E-Mail'}
                </div>
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                {order.itemSummary}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {formatCents(order.amountTotal, order.currency)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} label={order.statusLabel} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/bestellungen/${order.id}`}
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
  );
}
