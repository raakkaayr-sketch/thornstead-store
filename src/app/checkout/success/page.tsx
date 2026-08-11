import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderConfirmation } from '@/components/cart/order-confirmation';

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Your Thornstead order has been received.',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Confirming your order…
        </div>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}
