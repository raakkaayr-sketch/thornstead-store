import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy & cookie policy',
  description:
    'How Thornstead collects, uses and protects your personal data under UK GDPR, and which cookies this website sets.',
  alternates: { canonical: '/privacy-policy' },
};

const { business, contact } = siteConfig;

const sections: LegalSection[] = [
  {
    heading: 'Who we are',
    body: [
      `${business.legalName}, trading as ${business.tradingName}, is the data controller for personal data collected through this website. Our address is ${formattedAddress()} and you can contact us about privacy at ${contact.email}.`,
    ],
  },
  {
    heading: 'What we collect',
    list: [
      'Order information: your name, delivery address, email address and telephone number, collected when you place an order.',
      'Payment information: handled entirely by Stripe. We receive confirmation of payment and the last four digits of your card, never the full card number or security code.',
      'Correspondence: any messages you send us by email, telephone or the contact form.',
      'Technical data: IP address, browser type and pages visited, used to keep the site secure and working. Analytics data is only collected if you accept non-essential cookies.',
    ],
  },
  {
    heading: 'Why we use it and our lawful basis',
    list: [
      'To take payment, fulfil and deliver your order, and handle returns — performance of a contract.',
      'To answer questions and provide customer service — performance of a contract or our legitimate interests.',
      'To keep accounting and tax records — a legal obligation, normally for six years.',
      'To send marketing emails — only with your consent, which you can withdraw at any time.',
      'To measure how the site is used — only with your consent through analytics cookies.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      'We share only what is necessary, with: Stripe (payment processing), our delivery carriers (name, address and telephone number for the delivery), our hosting provider, and our accountant. We do not sell your personal data or share it for anyone else\u2019s marketing.',
      'Some providers process data outside the UK. Where that happens, transfers are covered by UK adequacy regulations or the International Data Transfer Agreement.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'Order and transaction records are kept for six years to meet HMRC requirements. Correspondence is kept for two years. Marketing consent records are kept until you withdraw consent and for two years afterwards as proof that consent existed.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'Under UK GDPR you have the right to access your data, to have inaccurate data corrected, to have data erased, to restrict or object to processing, and to data portability. Where processing is based on consent, you can withdraw it at any time.',
      `To exercise any of these rights, email ${contact.email}. We will respond within one month. If you are not satisfied with our response you can complain to the Information Commissioner\u2019s Office at ico.org.uk or on 0303 123 1113.`,
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'Strictly necessary cookies and local storage keep your basket and your cookie choice working. These do not require consent because the site cannot function without them.',
      'Non-essential cookies, such as analytics, are only set after you select "Accept all" in our cookie banner. Choosing "Reject non-essential" is equally easy and blocks them entirely. You can change your mind by clearing this site\u2019s data in your browser, which will show the banner again.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'The site is served over HTTPS. Payment card data is processed by Stripe, a PCI DSS Level 1 certified provider, and never reaches our servers. Access to order data is limited to staff who need it to fulfil orders.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy & cookies"
        description="What we collect, why we collect it, and the rights you have over it under UK GDPR."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy & cookies', path: '/privacy-policy' },
        ]}
      />
      <LegalContent sections={sections} updated="11 August 2026" />
    </>
  );
}
