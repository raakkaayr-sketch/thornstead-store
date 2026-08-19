import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { LegalContent, type LegalSection } from '@/components/legal-content';
import { siteConfig, formattedAddress } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Widerrufsrecht & Rückgabe',
  description:
    'Ihr gesetzliches Widerrufsrecht von 14 Tagen, das Muster-Widerrufsformular und unser freiwilliges Rückgaberecht von 30 Tagen.',
  alternates: { canonical: '/widerruf' },
};

const { returns, contact, business } = siteConfig;

/**
 * Widerrufsbelehrung nach Anlage 1 und Muster-Widerrufsformular nach Anlage 2
 * zu Art. 246a EGBGB. Der Wortlaut folgt dem gesetzlichen Muster, weil
 * Abweichungen die Belehrung angreifbar machen und die Widerrufsfrist dann
 * nicht zu laufen beginnt.
 *
 * Wichtig: Verschmutzte oder benutzte Ware ist in Deutschland kein Grund, das
 * Widerrufsrecht auszuschließen. Die Ausnahmen stehen abschließend in
 * § 312g Abs. 2 BGB und greifen für dieses Sortiment nicht. Ein Wertverlust
 * wird stattdessen über Wertersatz nach § 357a Abs. 2 BGB abgebildet.
 */
const sections: LegalSection[] = [
  {
    heading: 'Widerrufsrecht',
    body: [
      `Sie haben das Recht, binnen ${returns.statutoryCancellationDays} Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.`,
      `Die Widerrufsfrist beträgt ${returns.statutoryCancellationDays} Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben beziehungsweise hat. Bei einer Bestellung mehrerer Waren, die getrennt geliefert werden, beginnt die Frist mit dem Erhalt der letzten Ware.`,
      `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${business.ownerName}, ${formattedAddress()}, E-Mail ${contact.email}, Telefon ${contact.phone}) mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten abgedruckte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
      'Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.',
    ],
  },
  {
    heading: 'Folgen des Widerrufs',
    body: [
      'Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Ausgenommen sind zusätzliche Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene günstigste Standardlieferung gewählt haben.',
      'Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart. In keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.',
      'Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.',
      'Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen 14 Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von 14 Tagen absenden.',
      returns.returnShippingPaidBy === 'merchant'
        ? 'Wir tragen die Kosten der Rücksendung der Waren.'
        : 'Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.',
      'Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.',
    ],
  },
  {
    heading: 'Muster-Widerrufsformular',
    body: [
      'Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und an uns zurücksenden. Sie können uns Ihren Widerruf auch formlos per E-Mail mitteilen.',
    ],
    boxed: [
      `An ${business.ownerName}, ${formattedAddress()}, E-Mail: ${contact.email}`,
      'Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)',
      'Bestellt am (*)/erhalten am (*)',
      'Name des/der Verbraucher(s)',
      'Anschrift des/der Verbraucher(s)',
      'Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)',
      'Datum',
      '(*) Unzutreffendes streichen.',
    ],
  },
  {
    heading: `Freiwilliges Rückgaberecht von ${returns.days} Tagen`,
    body: [
      `Über Ihr gesetzliches Widerrufsrecht hinaus nehmen wir Waren ${returns.days} Tage ab Erhalt ohne Angabe von Gründen zurück. Die Artikel sollten dafür unbenutzt und in wiederverkäuflichem Zustand sein, möglichst in der Originalverpackung.`,
      'Dieses freiwillige Rückgaberecht tritt neben Ihre gesetzlichen Rechte und schränkt sie nicht ein. Ihr Widerrufsrecht innerhalb der ersten 14 Tage bleibt davon unberührt.',
    ],
  },
  {
    heading: 'So senden Sie etwas zurück',
    list: [
      `Schreiben Sie an ${contact.email} und nennen Sie Ihre Bestellnummer sowie die Artikel, die Sie zurücksenden möchten.`,
      'Wir antworten innerhalb eines Werktags mit einer Rücksendenummer und der Rücksendeadresse.',
      'Verpacken Sie die Artikel sicher, legen Sie die Rücksendenummer bei und versenden Sie das Paket mit einer nachverfolgbaren Versandart.',
      'Bewahren Sie den Einlieferungsbeleg auf, bis die Rückzahlung bei Ihnen eingegangen ist.',
    ],
  },
  {
    heading: 'Gewährleistung bei Mängeln',
    body: [
      'Für alle Waren gilt die gesetzliche Mängelhaftung nach §§ 434 ff. BGB. Die Verjährungsfrist für Mängelansprüche beträgt zwei Jahre ab Erhalt der Ware.',
      'Zeigt sich ein Mangel, melden Sie sich mit Ihrer Bestellnummer und einer Beschreibung oder einem Foto des Problems. Sie haben dann Anspruch auf Nacherfüllung, also Nachbesserung oder Ersatzlieferung, und unter den gesetzlichen Voraussetzungen auf Rücktritt oder Minderung. Bei einem berechtigten Mangel tragen wir die Rücksendekosten.',
    ],
  },
  {
    heading: 'Rücksendeadresse und Kontakt',
    body: [
      `Bitte senden Sie Waren nicht ohne vorherige Absprache zurück, da Rücksendungen ohne Referenz deutlich länger in der Bearbeitung brauchen. Unsere Anschrift lautet ${formattedAddress()}. Sie erreichen uns unter ${contact.email} oder ${contact.phone}, ${contact.hours}.`,
    ],
  },
];

export default function WiderrufPage() {
  return (
    <>
      <PageHeader
        title="Widerrufsrecht & Rückgabe"
        description={`Ihr gesetzliches Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen, dazu ein freiwilliges Rückgaberecht von ${returns.days} Tagen.`}
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Widerrufsrecht', path: '/widerruf' },
        ]}
      />
      <LegalContent sections={sections} updated="17. August 2026" />
    </>
  );
}
