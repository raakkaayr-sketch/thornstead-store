import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { siteConfig, deliveryWindow, vatNote } from '@/lib/config';
import { formatPrice } from '@/lib/utils';
import { jsonLdScript } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Häufige Fragen',
  description:
    'Antworten zu Lieferzeiten, Versandkosten, Widerruf, Zahlung und dazu, welche Marken Hainholt führt.',
  alternates: { canonical: '/faq' },
};

const { shipping, returns, contact, payment, business } = siteConfig;
const deliveryEstimate = deliveryWindow();

const faqs = [
  {
    q: 'Wohin liefern Sie?',
    a: 'Wir liefern ausschließlich an Adressen innerhalb Deutschlands, einschließlich der deutschen Inseln. Eine Lieferung ins Ausland ist derzeit nicht möglich.',
  },
  {
    q: 'Was kostet der Versand?',
    a:
      shipping.freeThreshold !== null
        ? `Der ${shipping.serviceName} kostet ${formatPrice(shipping.standardCost)} pro Bestellung. Ab einem Bestellwert von ${formatPrice(shipping.freeThreshold)} liefern wir versandkostenfrei. Die Versandkosten werden in der Bestellübersicht ausgewiesen, bevor Sie zahlen.`
        : `Der ${shipping.serviceName} kostet ${formatPrice(shipping.standardCost)} pro Bestellung und wird in der Bestellübersicht ausgewiesen, bevor Sie zahlen.`,
  },
  {
    q: 'Wie lange dauert meine Bestellung?',
    a: `Bestellungen werden innerhalb von ${shipping.handlingDaysMin} bis ${shipping.handlingDaysMax} Werktagen verpackt, der Transport dauert weitere ${shipping.transitDaysMin} bis ${shipping.transitDaysMax} Werktage. Insgesamt sind es also etwa ${deliveryEstimate.min} bis ${deliveryEstimate.max} Werktage.`,
  },
  {
    q: 'Sind die Preise inklusive Mehrwertsteuer?',
    a: business.smallBusinessScheme
      ? 'Alle angegebenen Preise sind Endpreise. Als Kleinunternehmer nach § 19 UStG weisen wir keine Umsatzsteuer aus. Versandkosten kommen gesondert hinzu.'
      : `Ja. Alle angegebenen Preise sind Endpreise, ${vatNote()}. Die Versandkosten werden gesondert ausgewiesen und erscheinen in der Bestellübersicht, bevor Sie zahlungspflichtig bestellen.`,
  },
  {
    q: 'Kann ich die Bestellung widerrufen, wenn ich es mir anders überlege?',
    a: `Ja. Sie haben ein gesetzliches Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen ab Erhalt der Ware nach § 355 BGB. Darüber hinaus gewähren wir freiwillig ein Rückgaberecht von ${returns.days} Tagen. Die vollständige Widerrufsbelehrung samt Muster-Widerrufsformular finden Sie unter „Widerrufsrecht & Rückgabe".`,
  },
  {
    q: 'Wer trägt die Kosten der Rücksendung?',
    a:
      returns.returnShippingPaidBy === 'merchant'
        ? 'Bei einem Widerruf tragen wir die unmittelbaren Kosten der Rücksendung.'
        : 'Bei einem Widerruf tragen Sie die unmittelbaren Kosten der Rücksendung. Ist die Ware mangelhaft, übernehmen wir die Rücksendekosten selbstverständlich.',
  },
  {
    q: 'Wie verfolge oder storniere ich eine Bestellung?',
    a: `Unter „Bestellung verfolgen“ sehen Sie den Status anhand der Bestellreferenz aus der Bestätigungsmail. Solange das Paket noch nicht übergeben wurde, können Sie unter „Bestellung stornieren“ die Zahlung erstatten lassen. Danach gilt das Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen.`,
  },
  {
    q: 'Wie bezahle ich, und ist das sicher?',
    a: `Die Zahlung läuft über ${payment.processor} auf dieser Website — Sie werden nicht auf eine fremde Zahlungsseite weitergeleitet. Akzeptiert werden ${payment.methods.join(', ')}. Ihre Kartendaten geben Sie im eingebetteten Zahlungsformular ein; sie erreichen unsere Server nie.`,
  },
  {
    q: 'Sind Sie der Hersteller der Geräte?',
    a: 'Nein. Hainholt ist der Händler. Im Sortiment stehen ausgewählte Küchengeräte und Kochwaren von Marken wie De’Longhi, Philips, KitchenAid, Le Creuset, Wüsthof und Weber. Verkauf und Versand laufen über uns; Hersteller, Garantie und Produktsicherheit stehen auf der jeweiligen Produktseite.',
  },
  {
    q: 'Gibt es eine Garantie?',
    a: 'Für alle Produkte gilt die gesetzliche Mängelhaftung nach §§ 434 ff. BGB mit einer Verjährungsfrist von zwei Jahren ab Erhalt der Ware. Zeigt sich ein Mangel, melden Sie sich bei uns — wir kümmern uns um Nachbesserung, Ersatzlieferung oder Rückzahlung.',
  },
  {
    q: 'Wo finde ich Angaben zum Hersteller und zur Produktsicherheit?',
    a: 'Auf jeder Produktseite steht ein Abschnitt mit den Pflichtangaben nach Artikel 19 der EU-Produktsicherheitsverordnung: Hersteller, in der EU verantwortliche Person und die zugehörigen Warn- und Sicherheitshinweise.',
  },
  {
    q: 'Haben Sie ein Ladengeschäft?',
    a: `Wir verkaufen ausschließlich online. Sie erreichen uns per E-Mail unter ${contact.email}, ${contact.hours}; wir antworten innerhalb eines Werktags.`,
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'de-DE',
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
        title="Häufige Fragen"
        description="Lieferung, Widerruf, Zahlung und wer hinter den Marken steht."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Häufige Fragen', path: '/faq' },
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
          Ihre Frage ist nicht dabei?{' '}
          <Link href="/kontakt" className="text-brand hover:underline">
            Schreiben Sie uns
          </Link>
          , oder prüfen Sie unter{' '}
          <Link
            href="/bestellung-verfolgen"
            className="text-brand hover:underline"
          >
            Bestellung verfolgen
          </Link>{' '}
          und{' '}
          <Link
            href="/bestellung-stornieren"
            className="text-brand hover:underline"
          >
            Bestellung stornieren
          </Link>{' '}
          den Status. Wir antworten innerhalb eines Werktags.
        </p>
      </div>
    </>
  );
}
