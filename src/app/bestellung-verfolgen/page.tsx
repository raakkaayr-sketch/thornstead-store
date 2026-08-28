import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { OrderLookup } from '@/components/orders/order-lookup';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Bestellung verfolgen',
  description:
    'Status Ihrer Hainholt-Bestellung anhand der Bestellreferenz und der E-Mail-Adresse aus der Bestätigungsmail prüfen.',
  alternates: { canonical: '/bestellung-verfolgen' },
};

export default function BestellungVerfolgenPage() {
  const { shipping } = siteConfig;

  return (
    <>
      <PageHeader
        title="Bestellung verfolgen"
        description={`Geben Sie die Bestellreferenz und die E-Mail-Adresse aus der Bestätigungsmail ein. Die Sendungsnummer von ${shipping.serviceName} folgt per E-Mail, sobald das Paket unterwegs ist.`}
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Bestellung verfolgen', path: '/bestellung-verfolgen' },
        ]}
      />
      <div className="container-page px-6 py-12">
        <OrderLookup mode="track" />
      </div>
    </>
  );
}
