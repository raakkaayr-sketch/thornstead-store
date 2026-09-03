import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Wie wir personenbezogene Daten nach DSGVO und TDDDG verarbeiten: Hosting, Bestellabwicklung, Zahlung, lokale Browserspeicherung, Google Ads und Ihre Rechte.',
  alternates: { canonical: '/datenschutz' },
};

const { business, contact, payment } = siteConfig;

/**
 * Diese Erklärung beschreibt bewusst nur, was tatsächlich stattfindet.
 *
 * Warenkorb, Merkliste, Ansichtsverlauf und Designwahl liegen ausschließlich im
 * Local Storage des Browsers und sind für den Betrieb des Shops erforderlich
 * (§ 25 Abs. 2 Nr. 2 TDDDG) — dafür wird keine Einwilligung eingeholt.
 *
 * Darüber hinaus ist Google Ads Conversion Tracking eingebunden. Der
 * Google-Tag wird nicht mit der Seite ausgeliefert, sondern erst nach aktiver
 * Einwilligung nachgeladen (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO);
 * die Logik dazu steht in src/lib/consent.ts und src/lib/gtag.ts.
 *
 * Wird ein weiterer Dienst ergänzt — Google Analytics, Meta Pixel und
 * Ähnliches —, gehört er in Abschnitt 9 und in den Text des Banners.
 */
const sections: LegalSection[] = [
  {
    heading: '1. Verantwortlicher',
    body: [
      'Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne von Artikel 4 Nummer 7 DSGVO ist:',
      `${business.ownerName}, handelnd unter der Marke ${business.tradingName}, ${formattedAddress()}. E-Mail: ${contact.email}.`,
      'Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen des § 38 BDSG nicht erfüllt sind.',
    ],
  },
  {
    heading: '2. Umfang der Verarbeitung',
    body: [
      'Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung dieser Website und die Abwicklung Ihrer Bestellung erforderlich ist oder Sie eingewilligt haben.',
      'Wir verkaufen keine personenbezogenen Daten und geben sie nicht zu Werbezwecken an Dritte weiter.',
    ],
  },
  {
    heading: '3. Hosting und Server-Logfiles',
    body: [
      'Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel verarbeitet die Daten als Auftragsverarbeiter auf Grundlage eines Vertrags nach Artikel 28 DSGVO.',
      'Bei jedem Aufruf werden automatisch technische Zugriffsdaten übermittelt und kurzzeitig in Logdateien gespeichert: aufgerufene Adresse, Datum und Uhrzeit, übertragene Datenmenge, Statuscode, Browsertyp und Betriebssystem sowie die IP-Adresse in gekürzter Form.',
      'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe f DSGVO. Unser berechtigtes Interesse liegt im technisch fehlerfreien und sicheren Betrieb der Website. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach spätestens 30 Tagen gelöscht.',
    ],
  },
  {
    heading: '4. Lokale Speicherung im Browser und Cookies',
    body: [
      'Ohne Ihre Einwilligung setzen wir keine Analyse-, Tracking- oder Werbe-Cookies ein. Wie Google Ads behandelt wird, steht in Abschnitt 9.',
      'Für den Betrieb des Shops speichern wir einige Angaben im Local Storage Ihres Browsers. Diese Daten verlassen Ihr Gerät nicht und werden von uns nicht ausgelesen:',
    ],
    list: [
      'Inhalt des Warenkorbs, damit Ihre Auswahl beim Neuladen der Seite erhalten bleibt',
      'Ihre Merkliste',
      'Die zuletzt angesehenen Produkte',
      'Ihre Auswahl zwischen hellem und dunklem Design',
      'Ihre Entscheidung über Marketing-Cookies, damit das Banner nicht erneut erscheint',
    ],
  },
  {
    heading: '5. Rechtsgrundlage der lokalen Speicherung',
    body: [
      'Der Zugriff auf Informationen in Ihrem Endgerät ist nach § 25 Absatz 2 Nummer 2 TDDDG einwilligungsfrei, wenn er unbedingt erforderlich ist, damit ein von Ihnen ausdrücklich gewünschter Dienst bereitgestellt werden kann. Genau darauf beschränken wir uns.',
      'Sie können den Local Storage jederzeit über die Einstellungen Ihres Browsers löschen. Warenkorb, Merkliste und Designwahl werden dadurch zurückgesetzt.',
    ],
  },
  {
    heading: '6. Bestellabwicklung',
    body: [
      'Für eine Bestellung verarbeiten wir Ihren Namen, Ihre Lieferanschrift, Ihre E-Mail-Adresse, die bestellten Artikel und die Zahlungsinformationen.',
      'Wenn Sie den Status einer Bestellung abfragen oder sie stornieren, prüfen wir Bestellreferenz und E-Mail-Adresse gegen die bei Stripe gespeicherten Angaben. Ohne diese Übereinstimmung wird keine Bestellung angezeigt.',
      'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO, da die Verarbeitung zur Erfüllung des Kaufvertrags erforderlich ist. Ohne diese Angaben kann der Vertrag nicht geschlossen und die Ware nicht zugestellt werden.',
      'Ihre Lieferdaten geben wir an das mit dem Versand beauftragte Unternehmen weiter, soweit dies für die Zustellung erforderlich ist. Rechnungsdaten übermitteln wir an unser Steuerbüro, soweit dies zur Erfüllung steuerlicher Pflichten erforderlich ist.',
    ],
  },
  {
    heading: '7. Zahlungsabwicklung',
    body: [
      `Die Zahlung erfolgt über ${payment.processor}. Für Kundinnen und Kunden im Europäischen Wirtschaftsraum ist Stripe Payments Europe Limited, 1 Grand Canal Street Lower, Dublin 2, Irland verantwortlich.`,
      'Wenn Sie die Bestellung abschicken, erscheint auf unserer Kasse ein von Stripe betriebenes Zahlungsformular. Ihre Kartendaten geben Sie ausschließlich dort ein; sie werden weder an uns übermittelt noch von uns gespeichert. Wir erhalten lediglich die Information, ob die Zahlung erfolgreich war, sowie die zur Bestellzuordnung notwendigen Angaben. Eine Weiterleitung auf checkout.stripe.com findet nicht statt.',
      'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO. Stripe verarbeitet die Daten zusätzlich zur Betrugsprävention und zur Erfüllung eigener gesetzlicher Pflichten auf Grundlage von Artikel 6 Absatz 1 Buchstabe f und Buchstabe c DSGVO. Einzelheiten finden Sie in der Datenschutzerklärung von Stripe unter stripe.com/de/privacy.',
    ],
  },
  {
    heading: '8. Kontaktaufnahme',
    body: [
      'Das Formular auf unserer Kontaktseite überträgt keine Daten an unseren Server. Es öffnet lediglich Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht, die Sie selbst absenden.',
      'Wenn Sie uns per E-Mail oder über das Kontaktformular kontaktieren, verarbeiten wir Ihre Angaben ausschließlich zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO bei Anfragen mit Vertragsbezug, im Übrigen Artikel 6 Absatz 1 Buchstabe f DSGVO.',
      'Anfragen ohne Vertragsbezug löschen wir spätestens zwei Jahre nach abschließender Bearbeitung.',
    ],
  },
  {
    heading: '9. Google Ads und Conversion-Messung',
    body: [
      'Wir schalten Anzeigen über Google Ads und möchten messen, welche Anzeige tatsächlich zu einer Bestellung geführt hat. Dafür binden wir den Google-Tag (gtag.js) ein.',
      'Der Tag wird nicht mit der Seite ausgeliefert. Er wird erst nachgeladen, nachdem Sie im Banner auf „Akzeptieren" geklickt haben. Solange Sie nicht oder ablehnend entschieden haben, wird keine Verbindung zu Google hergestellt, es werden keine Cookies gesetzt und es werden keine Daten an Google übertragen.',
      'Nach Ihrer Einwilligung übermitteln wir beim Abschluss einer Bestellung die Bestellreferenz, den Bestellwert und die Währung. Google verarbeitet daneben die üblichen Verbindungsdaten wie IP-Adresse, Browser- und Geräteangaben sowie Cookie-Kennungen, um den Besuch einer vorherigen Anzeige zuzuordnen.',
      'Rechtsgrundlage für das Speichern und Auslesen von Informationen auf Ihrem Endgerät ist § 25 Absatz 1 TDDDG, für die anschließende Verarbeitung Artikel 6 Absatz 1 Buchstabe a DSGVO — jeweils Ihre Einwilligung.',
      'Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Eine Übermittlung an die Google LLC in den USA ist dabei nicht ausgeschlossen; sie erfolgt auf Grundlage des EU-US Data Privacy Framework nach Artikel 45 DSGVO sowie ergänzend der Standardvertragsklauseln nach Artikel 46 DSGVO.',
      'Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Dafür genügt ein Klick auf „Cookie-Einstellungen" im Fußbereich jeder Seite. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt davon unberührt.',
    ],
  },
  {
    heading: '10. Speicherdauer',
    body: [
      'Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist.',
      'Bestell- und Rechnungsdaten unterliegen den handels- und steuerrechtlichen Aufbewahrungsfristen. Buchungsbelege bewahren wir nach § 147 Absatz 3 Abgabenordnung und § 257 Handelsgesetzbuch zehn Jahre auf. Für die Dauer der Aufbewahrungspflicht sind diese Daten in der Verarbeitung eingeschränkt und werden nur noch zur Erfüllung dieser Pflicht verwendet.',
    ],
  },
  {
    heading: '11. Übermittlung in Drittländer',
    body: [
      'Unser Hosting-Anbieter Vercel hat seinen Sitz in den USA. Eine Übermittlung personenbezogener Daten in die USA kann daher nicht vollständig ausgeschlossen werden.',
      'Die Übermittlung erfolgt auf Grundlage der Standardvertragsklauseln der Europäischen Kommission nach Artikel 46 Absatz 2 Buchstabe c DSGVO in Verbindung mit ergänzenden Schutzmaßnahmen sowie, soweit der Empfänger zertifiziert ist, auf Grundlage des EU-US Data Privacy Framework nach Artikel 45 DSGVO.',
    ],
  },
  {
    heading: '12. Ihre Rechte',
    body: [
      'Sie haben uns gegenüber jederzeit die folgenden Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:',
    ],
    list: [
      'Recht auf Auskunft nach Artikel 15 DSGVO',
      'Recht auf Berichtigung unrichtiger oder unvollständiger Daten nach Artikel 16 DSGVO',
      'Recht auf Löschung nach Artikel 17 DSGVO, soweit keine Aufbewahrungspflicht entgegensteht',
      'Recht auf Einschränkung der Verarbeitung nach Artikel 18 DSGVO',
      'Recht auf Datenübertragbarkeit nach Artikel 20 DSGVO',
      'Recht auf Widerspruch gegen Verarbeitungen auf Grundlage von Artikel 6 Absatz 1 Buchstabe f DSGVO nach Artikel 21 DSGVO',
      'Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft nach Artikel 7 Absatz 3 DSGVO',
    ],
  },
  {
    heading: '13. Beschwerderecht',
    body: [
      `Zur Ausübung Ihrer Rechte genügt eine Nachricht an ${contact.email}. Wir antworten innerhalb der gesetzlichen Frist von einem Monat.`,
      'Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, insbesondere bei der Behörde Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Ortes des vermuteten Verstoßes.',
    ],
  },
  {
    heading: '14. Automatisierte Entscheidungsfindung',
    body: [
      'Eine automatisierte Entscheidungsfindung einschließlich Profiling nach Artikel 22 DSGVO findet nicht statt. Eine Ausnahme bilden die automatisierten Betrugsprüfungen unseres Zahlungsdienstleisters, die vor der Freigabe einer Zahlung durchgeführt werden.',
    ],
  },
  {
    heading: '15. Verschlüsselung',
    body: [
      'Diese Website verwendet aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresse mit „https://" beginnt und Ihr Browser ein Schlosssymbol anzeigt.',
    ],
  },
  {
    heading: '16. Änderungen dieser Erklärung',
    body: [
      'Wir passen diese Datenschutzerklärung an, wenn sich die Rechtslage oder die tatsächliche Verarbeitung ändert, etwa weil ein neuer Dienst eingebunden wird. Für Ihre Bestellung gilt jeweils die Fassung, die zum Zeitpunkt der Bestellung abrufbar war.',
    ],
  },
];

export default function DatenschutzPage() {
  return (
    <>
      <PageHeader
        title="Datenschutzerklärung"
        description="Welche Daten wir verarbeiten, auf welcher Rechtsgrundlage und welche Rechte Sie haben."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Datenschutz', path: '/datenschutz' },
        ]}
      />
      <LegalContent sections={sections} updated="17. August 2026" />
    </>
  );
}
