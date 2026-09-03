import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Wie wir personenbezogene Daten nach DSGVO und TDDDG verarbeiten: Hosting, Bestellabwicklung, Zahlung, Google Ads, lokale Browserspeicherung und Ihre Rechte.',
  alternates: { canonical: '/datenschutz' },
};

const { business, contact, payment } = siteConfig;

/**
 * Diese Erklärung beschreibt nur, was tatsächlich stattfindet: Shop-Betrieb
 * über Local Storage (einwilligungsfrei nach § 25 Abs. 2 Nr. 2 TDDDG) und
 * Google Ads Conversion Tracking nach Einwilligung (§ 25 Abs. 1 TDDDG).
 */
const sections: LegalSection[] = [
  {
    heading: '1. Verantwortlicher',
    body: [
      'Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne von Artikel 4 Nummer 7 DSGVO ist:',
      `${business.ownerName}, handelnd unter der Marke ${business.tradingName}, ${formattedAddress()}. E-Mail: ${contact.email}, Telefon: ${contact.phone}.`,
      'Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen des § 38 BDSG nicht erfüllt sind.',
    ],
  },
  {
    heading: '2. Umfang der Verarbeitung',
    body: [
      'Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung dieser Website und die Abwicklung Ihrer Bestellung erforderlich ist oder Sie eingewilligt haben.',
      'Wir verkaufen keine personenbezogenen Daten. Conversion-Daten übermitteln wir an Google nur, wenn Sie in Google Ads eingewilligt haben.',
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
      'Für den Betrieb des Shops speichern wir einige Angaben im Local Storage Ihres Browsers. Diese Daten verlassen Ihr Gerät nicht und werden von uns nicht ausgelesen:',
    ],
    list: [
      'Inhalt des Warenkorbs, damit Ihre Auswahl beim Neuladen der Seite erhalten bleibt',
      'Ihre Merkliste',
      'Die zuletzt angesehenen Produkte',
      'Ihre Auswahl zwischen hellem und dunklem Design',
      'Ihre Entscheidung zu Google Ads, damit das Banner nicht erneut erscheint',
    ],
  },
  {
    heading: '5. Rechtsgrundlage der lokalen Speicherung',
    body: [
      'Der Zugriff auf Informationen in Ihrem Endgerät ist nach § 25 Absatz 2 Nummer 2 TDDDG einwilligungsfrei, wenn er unbedingt erforderlich ist, damit ein von Ihnen ausdrücklich gewünschter Dienst bereitgestellt werden kann. Das gilt für Warenkorb, Merkliste, Ansichtsverlauf und Designwahl.',
      'Google-Ads-Cookies setzen wir nur nach Ihrer Einwilligung (§ 25 Absatz 1 TDDDG). Sie können den Local Storage und Cookies jederzeit über die Einstellungen Ihres Browsers löschen. Warenkorb, Merkliste und Designwahl werden dadurch zurückgesetzt.',
    ],
  },
  {
    heading: '6. Google Ads Conversion Tracking',
    body: [
      'Mit Ihrer Einwilligung setzen wir Google Ads Conversion Tracking ein, um zu messen, ob eine über eine Google-Anzeige begonnene Sitzung zu einem Kauf auf dieser Website geführt hat. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA, kann als Unterauftragsverarbeiter eingesetzt werden.',
      'Auf allen Seiten laden wir das Google-Tag (gtag.js). Ohne Einwilligung bleibt der Consent Mode auf „denied“: Es werden keine Werbe-Cookies gesetzt. Nach Einwilligung kann Google Cookies setzen (insbesondere zur Zuordnung von Anzeigenklicks) und auf der Bestätigungsseite nach einem Kauf ein Conversion-Ereignis mit Bestellwert, Währung und einer Bestellreferenz empfangen.',
      'Rechtsgrundlage ist Ihre Einwilligung nach Artikel 6 Absatz 1 Buchstabe a DSGVO und § 25 Absatz 1 TDDDG. Die Einwilligung ist freiwillig und kann jederzeit mit Wirkung für die Zukunft über den Link „Cookie-Einstellungen“ im Footer oder über die Einstellungen Ihres Browsers widerrufen werden. Der Widerruf berührt nicht die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung.',
      'Google kann Daten in den USA verarbeiten. Soweit der Empfänger nach dem EU-US Data Privacy Framework zertifiziert ist, erfolgt die Übermittlung nach Artikel 45 DSGVO, im Übrigen auf Grundlage der Standardvertragsklauseln nach Artikel 46 Absatz 2 Buchstabe c DSGVO. Weitere Angaben finden Sie unter policies.google.com/privacy und business.safety.google/privacy/.',
    ],
  },
  {
    heading: '7. Bestellabwicklung',
    body: [
      'Für eine Bestellung verarbeiten wir Ihren Namen, Ihre Lieferanschrift, Ihre E-Mail-Adresse, die bestellten Artikel und die Zahlungsinformationen.',
      'Wenn Sie den Status einer Bestellung abfragen oder sie stornieren, prüfen wir Bestellreferenz und E-Mail-Adresse gegen die bei Stripe gespeicherten Angaben. Ohne diese Übereinstimmung wird keine Bestellung angezeigt.',
      'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO, da die Verarbeitung zur Erfüllung des Kaufvertrags erforderlich ist. Ohne diese Angaben kann der Vertrag nicht geschlossen und die Ware nicht zugestellt werden.',
      'Ihre Lieferdaten geben wir an das mit dem Versand beauftragte Unternehmen weiter, soweit dies für die Zustellung erforderlich ist. Rechnungsdaten übermitteln wir an unser Steuerbüro, soweit dies zur Erfüllung steuerlicher Pflichten erforderlich ist.',
    ],
  },
  {
    heading: '8. Zahlungsabwicklung',
    body: [
      `Die Zahlung erfolgt über ${payment.processor}. Für Kundinnen und Kunden im Europäischen Wirtschaftsraum ist Stripe Payments Europe Limited, 1 Grand Canal Street Lower, Dublin 2, Irland verantwortlich.`,
      'Wenn Sie die Bestellung abschicken, erscheint auf unserer Kasse ein von Stripe betriebenes Zahlungsformular. Ihre Kartendaten geben Sie ausschließlich dort ein; sie werden weder an uns übermittelt noch von uns gespeichert. Wir erhalten lediglich die Information, ob die Zahlung erfolgreich war, sowie die zur Bestellzuordnung notwendigen Angaben. Eine Weiterleitung auf checkout.stripe.com findet nicht statt.',
      'Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO. Stripe verarbeitet die Daten zusätzlich zur Betrugsprävention und zur Erfüllung eigener gesetzlicher Pflichten auf Grundlage von Artikel 6 Absatz 1 Buchstabe f und Buchstabe c DSGVO. Einzelheiten finden Sie in der Datenschutzerklärung von Stripe unter stripe.com/de/privacy.',
    ],
  },
  {
    heading: '9. Kontaktaufnahme',
    body: [
      'Das Formular auf unserer Kontaktseite überträgt keine Daten an unseren Server. Es öffnet lediglich Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht, die Sie selbst absenden.',
      'Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben ausschließlich zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist Artikel 6 Absatz 1 Buchstabe b DSGVO bei Anfragen mit Vertragsbezug, im Übrigen Artikel 6 Absatz 1 Buchstabe f DSGVO.',
      'Anfragen ohne Vertragsbezug löschen wir spätestens zwei Jahre nach abschließender Bearbeitung.',
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
      'Unser Hosting-Anbieter Vercel hat seinen Sitz in den USA. Bei Einwilligung in Google Ads kann Google LLC Daten in den USA verarbeiten. Eine Übermittlung personenbezogener Daten in die USA kann daher nicht vollständig ausgeschlossen werden.',
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
      <LegalContent sections={sections} updated="3. September 2026" />
    </>
  );
}
