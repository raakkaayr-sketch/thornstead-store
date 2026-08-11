import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Returns & refunds policy',
  description:
    'Your 14-day legal right to cancel, our 30-day returns window, and exactly how to send a Thornstead order back for a refund.',
  alternates: { canonical: '/returns-policy' },
};

const { returns, contact, business } = siteConfig;

const sections: LegalSection[] = [
  {
    heading: 'Your legal right to cancel',
    body: [
      `Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 you have the right to cancel an online order within ${returns.statutoryCancellationDays} days of receiving it, without giving any reason. The cancellation period ends ${returns.statutoryCancellationDays} days after the day you, or someone you nominate, takes physical possession of the goods.`,
      `To exercise this right, tell us clearly that you wish to cancel — an email to ${contact.email} with your order number is enough. Once you have cancelled you have a further 14 days to send the goods back to us.`,
    ],
  },
  {
    heading: `Our ${returns.days}-day returns window`,
    body: [
      `On top of your statutory rights, we accept returns for any reason for ${returns.days} days from delivery. Items should be unused, in a resaleable condition and returned with their original packaging where possible.`,
      'This voluntary window is in addition to, and does not replace, your legal rights under the Consumer Contracts Regulations 2013 and the Consumer Rights Act 2015.',
    ],
  },
  {
    heading: 'How to return something',
    list: [
      `Email ${contact.email} with your order number and which items you are returning.`,
      'We will reply within one business day with a returns reference and the return address.',
      'Pack the items securely, include the returns reference, and send them back using a tracked service.',
      'Keep your proof of postage until your refund has been processed.',
    ],
  },
  {
    heading: 'Who pays for return postage',
    body: [
      returns.returnShippingPaidBy === 'merchant'
        ? 'We cover the cost of return postage on all returns.'
        : 'Unless the item is faulty, incorrect or damaged on arrival, you are responsible for the cost of returning it to us. If the item is faulty, incorrect or damaged, we pay the return postage and will refund any reasonable cost you incur.',
    ],
  },
  {
    heading: 'Refunds',
    body: [
      'We refund to the original payment method within 14 days of receiving the returned goods, or within 14 days of you providing evidence that you have sent them back, whichever is earlier. Refunds are processed through Stripe and typically appear on your statement within 3–5 business days after we issue them.',
      'Where you cancel under your statutory right, we refund the price of the goods plus the standard delivery charge you originally paid. If you chose a more expensive delivery option than our standard service, we refund the standard cost only.',
      returns.restockingFee
        ? 'A restocking fee may apply to non-faulty returns.'
        : 'We do not charge restocking fees.',
    ],
  },
  {
    heading: 'Faulty or misdescribed goods',
    body: [
      'Under the Consumer Rights Act 2015 goods must be of satisfactory quality, fit for purpose and as described. If something develops a fault, contact us with your order number and a description or photograph of the problem. Depending on when the fault appears you may be entitled to a repair, a replacement or a refund, and we will explain your options clearly rather than making you argue for them.',
    ],
  },
  {
    heading: 'Items we cannot accept back',
    body: [
      'For hygiene and safety reasons we cannot accept returns of goods that have been used with soil, compost or plant matter and cannot reasonably be cleaned, unless they are faulty. This does not affect your rights in respect of faulty goods.',
    ],
  },
  {
    heading: 'Returns address and contact',
    body: [
      `Please do not send items back before contacting us, as returns without a reference can take longer to process. Our registered address is ${formattedAddress()}. ${business.legalName} can be reached at ${contact.email} or ${contact.phone}, ${contact.hours}.`,
    ],
  },
];

export default function ReturnsPolicyPage() {
  return (
    <>
      <PageHeader
        title="Returns & refunds"
        description={`Your 14-day legal right to cancel, plus a voluntary ${returns.days}-day returns window on top.`}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Returns & refunds', path: '/returns-policy' },
        ]}
      />
      <LegalContent sections={sections} updated="11 August 2026" />
    </>
  );
}
