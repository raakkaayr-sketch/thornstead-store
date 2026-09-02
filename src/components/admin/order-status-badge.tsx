import type { OrderStatus } from '@/lib/order-types';
import { cn } from '@/lib/utils';

const styles: Record<OrderStatus, string> = {
  in_bearbeitung: 'bg-brand/10 text-brand',
  versendet:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  storniert: 'bg-destructive/10 text-destructive',
  zahlung_offen: 'bg-secondary text-muted-foreground',
};

export function OrderStatusBadge({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status]
      )}
    >
      {label}
    </span>
  );
}
