import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, deliveryWindow, formattedAddress } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Shipping & delivery policy',
  description:
    'How and when Thornstead delivers across the United Kingdom, what it costs, and what to do if an order does not arrive.',
  alternates: { canonical: '/shipping-policy' },
};

const { shipping, contact, business } = siteConfig;
const window = deliveryWindow();

const costLine =
  shipping.freeThreshold !== null
    ? `Standard UK delivery costs ${formatPrice(shipping.standardCost)} per order. Orders with a basket subtotal of ${formatPrice(shipping.freeThreshold)} or more are delivered free of charge.`
    : `Standard UK delivery costs ${formatPrice(shipping.standardCost)} per order.`;

const sections: LegalSection[] = [
  {
    heading: 'Where we deliver',
    body: [
      `${business.legalName} delivers to addresses in the United Kingdom only. We do not currently ship to the Channel Islands, the Isle of Man outside standard mainland services, or any address outside the UK. If you place an order for delivery outside the UK we will contact you and refund it in full.`,
    ],
  },
  {
    heading: 'Delivery cost',
    body: [
      costLine,
      'The delivery charge is shown in your basket before you pay and again on the Stripe checkout page. The price you see is the price you pay — there are no handling fees, surcharges or customs charges added afterwards.',
    ],
  },
  {
    heading: 'How long it takes',
    body: [
      `Orders are packed and dispatched within ${shipping.handlingDaysMin}–${shipping.handlingDaysMax} business days. Once dispatched, delivery normally takes a further ${shipping.transitDaysMin}–${shipping.transitDaysMax} business days.`,
      `In total, expect your order approximately ${window.min}–${window.max} business days after you place it. Business days are Monday to Friday, excluding UK public holidays. Orders placed at a weekend are processed from the next business day.`,
    ],
  },
  {
    heading: 'Tracking your order',
    body: [
      'You will receive an order confirmation by email as soon as your payment is taken, and a second email with tracking details once your parcel is collected by the carrier. If you have not received a dispatch email within three business days, please contact us.',
    ],
  },
  {
    heading: 'If your order is late or missing',
    body: [
      'Occasionally a parcel is delayed by the carrier. If your order has not arrived within three business days of the estimated delivery date, contact us with your order number and we will open an enquiry with the carrier.',
      'If a parcel is confirmed lost we will send a replacement or refund you in full, whichever you prefer. You do not need to wait for the carrier enquiry to conclude before we resolve it.',
    ],
  },
  {
    heading: 'Damaged or incorrect items',
    body: [
      'Please check your order on arrival. If anything arrives damaged or is not what you ordered, contact us within 14 days with a photograph and your order number and we will arrange a replacement or a refund at no cost to you. This does not affect your statutory rights.',
    ],
  },
  {
    heading: 'Contact us about a delivery',
    body: [
      `Email ${contact.email} or call ${contact.phone}, ${contact.hours}. Our postal address is ${formattedAddress()}.`,
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHeader
        title="Shipping & delivery"
        description="UK delivery only. Clear costs and timescales, and what happens if something goes wrong."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shipping & delivery', path: '/shipping-policy' },
        ]}
      />
      <LegalContent sections={sections} updated="11 August 2026" />
    </>
  );
}
