import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ContactForm } from '@/components/contact-form';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'So erreichen Sie Hainholt: E-Mail und Postanschrift sowie unsere Erreichbarkeitszeiten.',
  alternates: { canonical: '/kontakt' },
};

export default function KontaktPage() {
  const { contact, business, returns } = siteConfig;

  const details = [
    {
      icon: Mail,
      label: 'E-Mail',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    { icon: MapPin, label: 'Anschrift', value: formattedAddress() },
    { icon: Clock, label: 'Erreichbarkeit', value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        title="Kontakt"
        description="Jede Nachricht wird von einem Menschen gelesen. E-Mails beantworten wir innerhalb eines Werktags."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Kontakt', path: '/kontakt' },
        ]}
      />

      <div className="container-page grid gap-12 px-6 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">So erreichen Sie uns</h2>
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
            <p className="font-medium text-foreground">{business.ownerName}</p>
            <p className="mt-1.5">
              Handelnd unter der Marke {business.tradingName}. Wir führen
              ausgewählte Küchengeräte bekannter Marken an Kundinnen und
              Kunden in Deutschland.
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href="/versand" className="text-brand hover:underline">
                Versand &amp; Lieferung
              </Link>
              <Link
                href="/bestellung-verfolgen"
                className="text-brand hover:underline"
              >
                Bestellung verfolgen
              </Link>
              <Link
                href="/bestellung-stornieren"
                className="text-brand hover:underline"
              >
                Stornieren
              </Link>
              <Link href="/widerruf" className="text-brand hover:underline">
                {returns.days} Tage Rückgabe
              </Link>
              <Link href="/datenschutz" className="text-brand hover:underline">
                Datenschutz
              </Link>
              <Link href="/impressum" className="text-brand hover:underline">
                Impressum
              </Link>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Nachricht schreiben</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Dieses Formular öffnet Ihr E-Mail-Programm mit der fertig
            vorbereiteten Nachricht. So behalten Sie eine Kopie von allem, was
            Sie uns geschickt haben.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
