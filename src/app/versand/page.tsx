import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, deliveryWindow, vatNote } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Versand & Lieferung',
  description:
    'Versandkosten, Bearbeitungszeit und Lieferzeiten für Lieferungen innerhalb Deutschlands. Versandkostenfrei ab 50 €.',
  alternates: { canonical: '/versand' },
};

const { shipping, contact, returns } = siteConfig;
const total = deliveryWindow();

const standardCost = formatPrice(shipping.standardCost);
const freeThreshold =
  shipping.freeThreshold === null ? null : formatPrice(shipping.freeThreshold);

/**
 * Diese Angaben müssen mit den Versandeinstellungen im Merchant Center
 * übereinstimmen. Google vergleicht die im Feed übermittelten Versandkosten mit
 * denen an der Kasse; eine Abweichung führt zur Ablehnung wegen
 * "Preisangaben stimmen nicht überein".
 */
const sections: LegalSection[] = [
  {
    heading: 'Versandkosten',
    list: [
      `${shipping.serviceName} innerhalb Deutschlands: ${standardCost}`,
      freeThreshold
        ? `Versandkostenfrei ab einem Bestellwert von ${freeThreshold}`
        : 'Die Versandkosten werden bei jeder Bestellung berechnet.',
      `Alle Preise verstehen sich ${vatNote()}. Die Versandkosten werden im Warenkorb und in der Bestellübersicht gesondert ausgewiesen, bevor Sie die Bestellung abschicken.`,
    ],
  },
  {
    heading: 'Bearbeitungszeit',
    body: [
      `Bestellungen, die an einem Werktag bis 14:00 Uhr eingehen, werden innerhalb von ${shipping.handlingDaysMin} bis ${shipping.handlingDaysMax} Werktagen verpackt und übergeben. Bestellungen von Samstag, Sonntag oder an gesetzlichen Feiertagen bearbeiten wir am nächsten Werktag.`,
      'Sobald das Paket unser Lager verlässt, erhalten Sie eine E-Mail mit der Sendungsnummer.',
    ],
  },
  {
    heading: 'Lieferzeit',
    body: [
      `Nach der Übergabe an ${shipping.serviceName} beträgt die Transportzeit in der Regel ${shipping.transitDaysMin} bis ${shipping.transitDaysMax} Werktage.`,
      `Die voraussichtliche Gesamtlieferzeit liegt damit bei ${total.min} bis ${total.max} Werktagen ab Bestelleingang. Diese Angabe ist eine Schätzung und keine verbindliche Zusage eines Liefertermins; in Zeiten hohen Versandvolumens, etwa im Dezember, kann es zu Verzögerungen kommen.`,
    ],
  },
  {
    heading: 'Liefergebiet',
    body: [
      'Wir liefern ausschließlich an Adressen innerhalb Deutschlands, einschließlich der deutschen Inseln. Eine Lieferung an Packstationen ist möglich, an Postfächer nicht.',
      'Bestellungen in andere Länder können wir derzeit nicht annehmen. Sollten Sie außerhalb Deutschlands ansässig sein, schreiben Sie uns gern — wir informieren Sie, sobald wir weitere Länder aufnehmen.',
    ],
  },
  {
    heading: 'Wenn etwas nicht ankommt',
    body: [
      `Sollte ein Paket nach Ablauf der genannten Lieferzeit nicht bei Ihnen eingetroffen sein, melden Sie sich unter ${contact.email} mit Ihrer Bestellnummer. Wir klären den Fall mit dem Versanddienstleister und senden Ihnen die Ware erneut oder erstatten den Betrag.`,
      'Kommt eine Sendung beschädigt bei Ihnen an, fotografieren Sie bitte die Verpackung und den Inhalt, bevor Sie etwas entsorgen. Das beschleunigt die Bearbeitung erheblich.',
      'Das Risiko des Verlusts oder der Beschädigung während des Transports liegt bei uns, bis die Ware bei Ihnen als Verbraucherin oder Verbraucher eingetroffen ist.',
    ],
  },
  {
    heading: 'Adressänderung und Stornierung',
    body: [
      `Solange eine Bestellung noch nicht versendet wurde, können wir die Lieferadresse ändern oder die Bestellung stornieren. Schreiben Sie dafür so früh wie möglich an ${contact.email}.`,
      `Nach dem Versand greift Ihr Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen sowie unser freiwilliges Rückgaberecht von ${returns.days} Tagen. Die Einzelheiten stehen unter „Widerrufsrecht & Rückgabe".`,
    ],
  },
  {
    heading: 'Verpackung',
    body: [
      'Wir versenden in Kartonagen ohne Kunststofffüllmaterial. Verpackungen sind recyclingfähig und können über die Papiertonne entsorgt werden.',
      'Für die in Verkehr gebrachten Verpackungen beteiligen wir uns nach dem Verpackungsgesetz an einem dualen System; die Registrierungsnummer im Verpackungsregister LUCID finden Sie im Impressum.',
    ],
  },
];

export default function VersandPage() {
  return (
    <>
      <PageHeader
        title="Versand & Lieferung"
        description={
          freeThreshold
            ? `${shipping.serviceName} für ${standardCost}, versandkostenfrei ab ${freeThreshold}.`
            : `${shipping.serviceName} für ${standardCost} innerhalb Deutschlands.`
        }
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Versand', path: '/versand' },
        ]}
      />
      <LegalContent sections={sections} updated="17. August 2026" />
    </>
  );
}
