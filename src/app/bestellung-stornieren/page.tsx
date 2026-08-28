import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { OrderLookup } from '@/components/orders/order-lookup';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Bestellung stornieren',
  description:
    'Eine noch nicht versendete Hainholt-Bestellung stornieren und den Kaufpreis erstatten lassen.',
  alternates: { canonical: '/bestellung-stornieren' },
};

export default function BestellungStornierenPage() {
  const { shipping, returns } = siteConfig;

  return (
    <>
      <PageHeader
        title="Bestellung stornieren"
        description={`Solange die Bestellung noch nicht übergeben wurde (in der Regel ${shipping.handlingDaysMin}–${shipping.handlingDaysMax} Werktage), können Sie sie hier stornieren. Danach gilt das Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen.`}
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Bestellung stornieren', path: '/bestellung-stornieren' },
        ]}
      />
      <div className="container-page px-6 py-12">
        <OrderLookup mode="cancel" />
      </div>
    </>
  );
}
