import Link from 'next/link';
import { RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

/**
 * The delivery and returns terms shown on every product page. All values come
 * from config, so they always agree with the shipping policy, the checkout
 * total and the Merchant Center feed.
 */
export function DeliveryInfo() {
  const { shipping, returns } = siteConfig;
  const window = deliveryWindow();

  const deliveryLine =
    shipping.freeThreshold !== null
      ? `${formatPrice(shipping.standardCost)} standard UK delivery, free on orders over ${formatPrice(shipping.freeThreshold)}.`
      : `${formatPrice(shipping.standardCost)} standard UK delivery.`;

  const items = [
    {
      icon: Truck,
      title: 'UK delivery',
      body: `${deliveryLine} Estimated ${window.min}–${window.max} business days, including ${shipping.handlingDaysMin}–${shipping.handlingDaysMax} days to pack and dispatch.`,
    },
    {
      icon: RefreshCcw,
      title: `${returns.days}-day returns`,
      body: `Change your mind within ${returns.days} days and send it back for a refund. This is on top of your 14-day legal right to cancel.`,
    },
    {
      icon: ShieldCheck,
      title: 'Secure payment',
      body: 'Card payments are processed by Stripe. We never see or store your card details.',
    },
  ];

  return (
    <div className="divide-y divide-border rounded-2xl border border-border">
      {items.map((item) => (
        <div key={item.title} className="flex gap-3 p-4">
          <item.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" />
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        </div>
      ))}
      <p className="p-4 text-xs text-muted-foreground">
        Full details in our{' '}
        <Link href="/shipping-policy" className="text-brand hover:underline">
          shipping policy
        </Link>{' '}
        and{' '}
        <Link href="/returns-policy" className="text-brand hover:underline">
          returns policy
        </Link>
        .
      </p>
    </div>
  );
}
