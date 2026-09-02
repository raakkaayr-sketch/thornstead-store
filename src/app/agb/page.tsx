import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress, deliveryWindow, vatNote } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description:
    'Allgemeine Geschäftsbedingungen für Bestellungen bei Hainholt: Vertragsschluss, Preise, Zahlung, Lieferung, Gewährleistung und Haftung.',
  alternates: { canonical: '/agb' },
};

const { business, contact, shipping, returns, payment } = siteConfig;
const total = deliveryWindow();

const sections: LegalSection[] = [
  {
    heading: '1. Geltungsbereich und Vertragspartner',
    body: [
      `Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die über diese Website zwischen Ihnen und ${business.ownerName}, handelnd unter der Marke ${business.tradingName}, ${formattedAddress()} (im Folgenden „wir") geschlossen werden.`,
      'Verbraucher im Sinne dieser Bedingungen ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.',
      'Abweichende Bedingungen der Kundin oder des Kunden werden nicht Vertragsinhalt, es sei denn, wir stimmen ihrer Geltung ausdrücklich in Textform zu.',
    ],
  },
  {
    heading: '2. Vertragsschluss',
    body: [
      'Die Darstellung der Produkte auf dieser Website stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung.',
      'Sie legen die gewünschte Ware in den Warenkorb und gelangen über die Bestellübersicht zur Kasse. Auf der Bestellübersicht sehen Sie vor dem Absenden nochmals alle Artikel, Mengen, Einzel- und Gesamtpreise sowie die Versandkosten und können Ihre Eingaben mit den üblichen Browserfunktionen sowie über die angebotenen Korrekturmöglichkeiten berichtigen.',
      'Mit Anklicken der Schaltfläche „Zahlungspflichtig bestellen" geben Sie ein verbindliches Angebot zum Kauf der im Warenkorb enthaltenen Waren ab.',
      'Wir bestätigen den Eingang Ihrer Bestellung unverzüglich per E-Mail. Diese Eingangsbestätigung stellt noch keine Annahme Ihres Angebots dar. Der Vertrag kommt erst zustande, wenn wir die Annahme ausdrücklich erklären oder die Ware an Sie versenden und dies bestätigen.',
      'Der Vertragstext wird von uns gespeichert und Ihnen zusammen mit diesen Bedingungen und der Widerrufsbelehrung in Textform per E-Mail zugesandt. Die Vertragssprache ist Deutsch.',
    ],
  },
  {
    heading: '3. Preise und Versandkosten',
    body: [
      `Alle angegebenen Preise sind Endpreise und verstehen sich ${vatNote()}. Sie enthalten keine Versandkosten.`,
      shipping.freeThreshold === null
        ? `Zu den Warenpreisen treten Versandkosten von ${formatPrice(shipping.standardCost)} hinzu.`
        : `Zu den Warenpreisen treten Versandkosten von ${formatPrice(shipping.standardCost)} hinzu. Ab einem Bestellwert von ${formatPrice(shipping.freeThreshold)} liefern wir innerhalb Deutschlands versandkostenfrei.`,
      'Die Versandkosten werden Ihnen in der Bestellübersicht gesondert ausgewiesen, bevor Sie die Bestellung abschicken. Zusätzliche Zölle oder Einfuhrabgaben fallen nicht an, da wir ausschließlich innerhalb Deutschlands liefern.',
    ],
  },
  {
    heading: '4. Zahlung',
    body: [
      `Die Zahlung erfolgt über unseren Zahlungsdienstleister ${payment.processor}. Akzeptiert werden ${payment.methods.join(', ')}.`,
      'Der Kaufpreis ist mit Vertragsschluss sofort zur Zahlung fällig. Lieferadresse und Zahlungsdaten geben Sie auf der Bestellseite in einem von Stripe betriebenen Formular ein; Sie bleiben dabei auf unserer Website. Vollständige Kartendaten werden von uns weder verarbeitet noch gespeichert.',
      'Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen in gesetzlicher Höhe zu verlangen.',
    ],
  },
  {
    heading: '5. Lieferung',
    body: [
      `Die Lieferung erfolgt mit ${shipping.serviceName} an die von Ihnen angegebene Lieferadresse innerhalb Deutschlands. Eine Lieferung an Postfächer ist nicht möglich.`,
      `Die voraussichtliche Lieferzeit beträgt ${total.min} bis ${total.max} Werktage ab Bestelleingang und setzt sich aus ${shipping.handlingDaysMin} bis ${shipping.handlingDaysMax} Werktagen Bearbeitungszeit und ${shipping.transitDaysMin} bis ${shipping.transitDaysMax} Werktagen Transportzeit zusammen. Angaben zur Lieferzeit sind unverbindliche Schätzungen, sofern kein Liefertermin ausdrücklich verbindlich zugesagt wurde.`,
      'Ist ein Artikel nicht verfügbar, informieren wir Sie unverzüglich. Bereits geleistete Zahlungen erstatten wir in diesem Fall unverzüglich zurück.',
      'Das Risiko des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht bei Verbrauchern erst mit Übergabe der Ware auf Sie über.',
    ],
  },
  {
    heading: '6. Eigentumsvorbehalt',
    body: [
      'Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.',
    ],
  },
  {
    heading: '7. Widerrufsrecht',
    body: [
      `Verbrauchern steht ein gesetzliches Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen zu. Die vollständige Widerrufsbelehrung samt Muster-Widerrufsformular finden Sie auf der Seite „Widerrufsrecht & Rückgabe"; sie ist Bestandteil dieser Bedingungen.`,
      `Über das gesetzliche Widerrufsrecht hinaus gewähren wir freiwillig ein Rückgaberecht von ${returns.days} Tagen ab Erhalt der Ware. Dieses freiwillige Recht beschränkt Ihre gesetzlichen Rechte nicht.`,
    ],
  },
  {
    heading: '8. Gewährleistung',
    body: [
      'Es gilt die gesetzliche Mängelhaftung nach §§ 434 ff. BGB. Die Verjährungsfrist für Mängelansprüche beträgt bei Verbrauchern zwei Jahre ab Erhalt der Ware.',
      'Eine über die gesetzliche Mängelhaftung hinausgehende Garantie besteht nur, wenn sie für den jeweiligen Artikel ausdrücklich in Textform erklärt wurde.',
    ],
  },
  {
    heading: '9. Haftung',
    body: [
      'Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, für Schäden aus der Übernahme einer Garantie sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.',
      'Bei der leicht fahrlässigen Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die Erreichung des Vertragszwecks erst ermöglicht, haften wir begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Im Übrigen ist die Haftung ausgeschlossen.',
      'Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.',
    ],
  },
  {
    heading: '10. Produktsicherheit und bestimmungsgemäße Verwendung',
    body: [
      'Unsere Produkte sind für den privaten Gebrauch in Küche und Haushalt bestimmt. Angaben zum Hersteller und zur in der EU niedergelassenen verantwortlichen Person nach Artikel 19 der Verordnung (EU) 2023/988 sowie Sicherheits- und Pflegehinweise finden Sie auf der jeweiligen Produktseite.',
      'Bei Verwendung entgegen den Sicherheits- und Pflegehinweisen können wir für daraus entstehende Schäden nicht einstehen.',
    ],
  },
  {
    heading: '11. Streitbeilegung',
    body: [
      'Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
      `Bei Beanstandungen wenden Sie sich bitte zunächst direkt an uns unter ${contact.email}. Erfahrungsgemäß lassen sich Anliegen auf diesem Weg am schnellsten klären.`,
    ],
  },
  {
    heading: '12. Schlussbestimmungen',
    body: [
      'Es gilt deutsches Recht. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als dadurch nicht der Schutz entzogen wird, der durch zwingende Bestimmungen des Rechts des Staates gewährt wird, in dem die Verbraucherin oder der Verbraucher ihren beziehungsweise seinen gewöhnlichen Aufenthalt hat.',
      'Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.',
    ],
  },
];

export default function AgbPage() {
  return (
    <>
      <PageHeader
        title="Allgemeine Geschäftsbedingungen"
        description="Die Bedingungen, zu denen wir Bestellungen über diese Website annehmen und ausführen."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'AGB', path: '/agb' },
        ]}
      />
      <LegalContent sections={sections} updated="17. August 2026" />
    </>
  );
}
