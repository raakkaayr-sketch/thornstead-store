import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { formatPrice } from '@/lib/utils';
import { jsonLdScript } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Answers about Thornstead delivery times, UK shipping costs, returns, payment security and how our own-brand products are made.',
  alternates: { canonical: '/faq' },
};

const { shipping, returns, contact } = siteConfig;
const window = deliveryWindow();

const faqs = [
  {
    q: 'Where do you deliver?',
    a: 'We deliver to addresses in the United Kingdom only. We are not able to ship internationally at the moment.',
  },
  {
    q: 'How much is delivery?',
    a:
      shipping.freeThreshold !== null
        ? `Standard UK delivery is ${formatPrice(shipping.standardCost)} per order, and free on orders of ${formatPrice(shipping.freeThreshold)} or more. The charge is shown in your basket before you pay.`
        : `Standard UK delivery is ${formatPrice(shipping.standardCost)} per order, shown in your basket before you pay.`,
  },
  {
    q: 'How long will my order take?',
    a: `Orders are packed within ${shipping.handlingDaysMin}–${shipping.handlingDaysMax} business days and delivery takes a further ${shipping.transitDaysMin}–${shipping.transitDaysMax} business days, so roughly ${window.min}–${window.max} business days in total.`,
  },
  {
    q: 'Can I return something if I change my mind?',
    a: `Yes. You have a legal right to cancel within ${returns.statutoryCancellationDays} days of delivery under the Consumer Contracts Regulations 2013, and we voluntarily extend that to ${returns.days} days. Full details are in our returns and refunds policy.`,
  },
  {
    q: 'How do I pay, and is it secure?',
    a: 'Checkout is handled by Stripe, which processes card payments for millions of businesses. Your card details are entered on Stripe\u2019s secure page and never reach our servers.',
  },
  {
    q: 'Are these your own products or are you a reseller?',
    a: 'Every product in this shop is designed, branded and sold by Thornstead. We are the brand of record. We do not resell other companies\u2019 branded goods and we are not an authorised dealer for any third-party brand.',
  },
  {
    q: 'Do your products come with a guarantee?',
    a: 'All products are covered by your statutory rights under the Consumer Rights Act 2015: goods must be of satisfactory quality, fit for purpose and as described. If something develops a fault, contact us and we will sort out a repair, replacement or refund.',
  },
  {
    q: 'Will my solar lights work in winter?',
    a: 'They will work, but for less time. Solar lights depend on how much daylight the panel receives, so a midwinter charge in the UK gives noticeably shorter run time than a summer one. That is true of every solar light, and we would rather say so than pretend otherwise.',
  },
  {
    q: 'Do you have a physical shop?',
    a: `We sell online only, which is part of how the prices stay where they are. You can reach us by email at ${contact.email} or by phone on ${contact.phone}, ${contact.hours}.`,
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqJsonLd)}
      />
      <PageHeader
        title="Frequently asked questions"
        description="Delivery, returns, payment and how the range is made."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />

      <div className="container-page px-6 py-12">
        <div className="max-w-3xl divide-y divide-border rounded-3xl border border-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Still stuck?{' '}
          <Link href="/contact" className="text-brand hover:underline">
            Contact us
          </Link>{' '}
          and we will answer within one business day.
        </p>
      </div>
    </>
  );
}
