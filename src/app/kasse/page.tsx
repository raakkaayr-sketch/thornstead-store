import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { CheckoutReview } from '@/components/cart/checkout-review';

export const metadata: Metadata = {
  title: 'Bestellübersicht',
  description:
    'Prüfen Sie Ihre Bestellung, den Gesamtpreis inklusive Mehrwertsteuer und Versandkosten, bevor Sie zahlungspflichtig bestellen.',
  /**
   * Warenkorbabhängige Seite ohne eigenständigen Inhalt. Sie gehört nicht in den
   * Index und ist in robots.ts zusätzlich ausgeschlossen.
   */
  robots: { index: false, follow: false },
};

export default function KassePage() {
  return (
    <>
      <PageHeader
        title="Bestellübersicht"
        description="Letzter Schritt: Bitte prüfen Sie Ihre Bestellung, bevor Sie zahlungspflichtig bestellen."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Bestellübersicht', path: '/kasse' },
        ]}
      />
      <div className="container-page px-6 py-12">
        <Suspense fallback={null}>
          <CheckoutReview />
        </Suspense>
      </div>
    </>
  );
}
