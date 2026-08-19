import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderConfirmation } from '@/components/cart/order-confirmation';

export const metadata: Metadata = {
  title: 'Bestellung bestätigt',
  description: 'Ihre Bestellung bei Hainholt ist bei uns eingegangen.',
  robots: { index: false, follow: false },
};

export default function BestaetigungPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Bestellung wird bestätigt…
        </div>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}
