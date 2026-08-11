import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContactForm } from '@/components/contact-form';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Get in touch with Thornstead by email, telephone or post. Our UK address, phone number and customer service hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const { contact, business, returns } = siteConfig;

  const details = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      label: 'Telephone',
      value: contact.phone,
      href: `tel:${contact.phoneHref}`,
    },
    { icon: MapPin, label: 'Address', value: formattedAddress() },
    { icon: Clock, label: 'Hours', value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        title="Contact us"
        description="A real person reads every message. We answer emails within one business day."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <div className="container-page grid gap-12 px-6 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Ways to reach us</h2>
          <dl className="mt-6 space-y-5">
            {details.map((detail) => (
              <div key={detail.label} className="flex gap-3.5">
                <detail.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="mt-0.5 text-[15px]">
                    {detail.href ? (
                      <a href={detail.href} className="hover:underline">
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{business.legalName}</p>
            <p className="mt-1.5">
              Trading as {business.tradingName}. We sell our own-brand home and
              garden products to customers in the United Kingdom.
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href="/shipping-policy" className="text-brand hover:underline">
                Shipping &amp; delivery
              </Link>
              <Link href="/returns-policy" className="text-brand hover:underline">
                {returns.days}-day returns
              </Link>
              <Link href="/privacy-policy" className="text-brand hover:underline">
                Privacy &amp; cookies
              </Link>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This form opens your email app with the message ready to send, so
            you keep a copy of what you sent us.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
