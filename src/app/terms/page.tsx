import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Terms & conditions',
  description:
    'The terms on which Thornstead sells its own-brand home and garden products to customers in the United Kingdom.',
  alternates: { canonical: '/terms' },
};

const { business, contact, shipping, returns } = siteConfig;

const sections: LegalSection[] = [
  {
    heading: 'About these terms',
    body: [
      `These terms apply to every order placed with ${business.legalName}, trading as ${business.tradingName}, through this website. Please read them before ordering. Our address is ${formattedAddress()}, and you can reach us at ${contact.email} or ${contact.phone}.`,
      business.companyNumber
        ? `${business.legalName} is registered in England and Wales under company number ${business.companyNumber}.`
        : `${business.legalName} trades from the address above.`,
    ],
  },
  {
    heading: 'The products we sell',
    body: [
      'Every product on this website is designed and branded by Thornstead and sold by us directly. We are the brand of record for our range. We do not sell other companies\u2019 branded products, and we make no claim to be an authorised dealer, distributor or reseller for any third-party brand.',
      'Product photographs and descriptions are as accurate as we can make them. Natural materials such as bamboo and pine vary in grain and tone, and dimensions are given to the nearest stated unit.',
    ],
  },
  {
    heading: 'How a contract is formed',
    body: [
      'Placing an order is an offer to buy. Your order is accepted, and a contract formed, when we send you a dispatch confirmation email. If we cannot fulfil an order — for example if an item is out of stock or a price was displayed incorrectly — we will tell you and refund any payment in full.',
    ],
  },
  {
    heading: 'Price and payment',
    body: [
      'All prices are shown in pounds sterling and include VAT where applicable. The price you see on the product page is the price charged at checkout.',
      shipping.freeThreshold !== null
        ? `Delivery is charged at ${formatPrice(shipping.standardCost)} per order, or free on orders of ${formatPrice(shipping.freeThreshold)} or more. The delivery charge is shown in the basket before you pay.`
        : `Delivery is charged at ${formatPrice(shipping.standardCost)} per order and is shown in the basket before you pay.`,
      'Payment is taken by card through Stripe at the point of checkout. We do not receive or store your full card details.',
    ],
  },
  {
    heading: 'Delivery',
    body: [
      'We deliver to addresses in the United Kingdom only. Delivery timescales, costs and what happens if an order is delayed are set out in our shipping and delivery policy, which forms part of these terms.',
      'Risk in the goods passes to you when they are delivered to the address you gave us.',
    ],
  },
  {
    heading: 'Cancellation, returns and refunds',
    body: [
      `You have a legal right to cancel within ${returns.statutoryCancellationDays} days of receiving your order under the Consumer Contracts Regulations 2013, and we voluntarily extend our returns window to ${returns.days} days. Full details, including how to return an item and who pays for postage, are in our returns and refunds policy, which forms part of these terms.`,
    ],
  },
  {
    heading: 'Faulty goods and your statutory rights',
    body: [
      'Nothing in these terms limits your rights under the Consumer Rights Act 2015, which requires goods to be of satisfactory quality, fit for purpose and as described. If goods are faulty you may be entitled to a repair, replacement or refund.',
    ],
  },
  {
    heading: 'Our liability',
    body: [
      'We do not exclude or limit our liability where it would be unlawful to do so, including liability for death or personal injury caused by negligence, or for fraud. Otherwise, we are not liable for losses that were not foreseeable at the time the contract was made, or for business losses, as our products are supplied for domestic and private use.',
    ],
  },
  {
    heading: 'Using this website',
    body: [
      'The content of this website, including product photography, descriptions, the Thornstead name and the Thornstead logo, belongs to us and may not be reproduced without permission. You may not use the site fraudulently or in a way that damages its availability.',
    ],
  },
  {
    heading: 'Complaints and governing law',
    body: [
      `If something has gone wrong, email ${contact.email} and we will respond within two business days. These terms are governed by the law of England and Wales, and disputes may be brought in the courts of England and Wales.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & conditions"
        description="The terms on which we sell to customers in the United Kingdom."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms & conditions', path: '/terms' },
        ]}
      />
      <LegalContent sections={sections} updated="11 August 2026" />
    </>
  );
}
