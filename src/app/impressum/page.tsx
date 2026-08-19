import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Anbieterkennzeichnung nach § 5 DDG: Name, Anschrift und Kontaktdaten des Betreibers von Hainholt.',
  alternates: { canonical: '/impressum' },
};

const { business, contact, compliance } = siteConfig;

/**
 * Pflichtangaben nach § 5 DDG. Das Digitale-Dienste-Gesetz hat am 14. Mai 2024
 * das Telemediengesetz ersetzt, ein Verweis auf § 5 TMG wäre veraltet.
 *
 * Bewusst nicht enthalten: der frühere Link auf die EU-Plattform zur
 * Online-Streitbeilegung. Die Plattform wurde am 20. Juli 2025 abgeschaltet und
 * die Hinweispflicht ersatzlos aufgehoben — ein verbleibender Link würde eine
 * Streitbeilegungsmöglichkeit vortäuschen, die es nicht mehr gibt, und ist
 * dadurch selbst abmahnbar.
 */
const sections: LegalSection[] = [
  {
    heading: 'Angaben gemäß § 5 DDG',
    body: [
      `${business.ownerName}, handelnd unter der Marke ${business.tradingName}.`,
      `Ladungsfähige Anschrift: ${formattedAddress()}.`,
      'Rechtsform: Einzelunternehmen. Eine Eintragung im Handelsregister besteht nicht.',
    ],
  },
  {
    heading: 'Kontakt',
    list: [
      `E-Mail: ${contact.email}`,
      `Telefon: ${contact.phone}`,
      `Erreichbarkeit: ${contact.hours}`,
    ],
  },
  {
    heading: 'Umsatzsteuer',
    body: [
      business.vatNumber
        ? `Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: ${business.vatNumber}.`
        : 'Eine Umsatzsteuer-Identifikationsnummer nach § 27a Umsatzsteuergesetz liegt derzeit nicht vor und wird hier ergänzt, sobald sie erteilt ist.',
      business.smallBusinessScheme
        ? 'Als Kleinunternehmer im Sinne von § 19 Absatz 1 Umsatzsteuergesetz wird keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen.'
        : `Alle Preise auf dieser Website enthalten die gesetzliche Umsatzsteuer von ${business.vatRate} Prozent.`,
    ],
  },
  {
    heading: 'Verantwortlich für den Inhalt',
    body: [
      `Verantwortlich für journalistisch-redaktionelle Inhalte nach § 18 Absatz 2 Medienstaatsvertrag ist ${business.ownerName}, ${formattedAddress()}.`,
    ],
  },
  {
    heading: 'Verpackungsregister',
    body: [
      compliance.lucidNumber
        ? `Registrierungsnummer im Verpackungsregister LUCID der Zentralen Stelle Verpackungsregister: ${compliance.lucidNumber}.`
        : 'Die Registrierung im Verpackungsregister LUCID der Zentralen Stelle Verpackungsregister nach dem Verpackungsgesetz erfolgt vor dem ersten Versand; die Registrierungsnummer wird hier ergänzt.',
    ],
  },
  {
    heading: 'Verbraucherstreitbeilegung',
    body: [
      'Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
      'Für Beschwerden und Rückfragen erreichen Sie uns jederzeit direkt unter den oben genannten Kontaktdaten. Wir antworten in der Regel innerhalb eines Werktags.',
    ],
  },
  {
    heading: 'Haftung für Inhalte und Links',
    body: [
      'Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.',
      'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter verantwortlich. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.',
    ],
  },
  {
    heading: 'Urheberrecht',
    body: [
      `Die auf dieser Website erstellten Inhalte, Texte und Produktabbildungen unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung oder Verwendung außerhalb der gesetzlich zugelassenen Fälle bedarf der schriftlichen Zustimmung von ${business.tradingName}.`,
    ],
  },
];

export default function ImpressumPage() {
  return (
    <>
      <PageHeader
        title="Impressum"
        description="Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Impressum', path: '/impressum' },
        ]}
      />
      <LegalContent sections={sections} updated="17. August 2026" />
    </>
  );
}
