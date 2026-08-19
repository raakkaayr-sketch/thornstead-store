import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { buttonVariants } from '@/components/ui/button-variants';
import { siteConfig, formattedAddress } from '@/lib/config';
import { getAllProducts, getAllCategories } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Über Thornstead',
  description:
    'Thornstead ist eine Eigenmarke für Garten und Zuhause. Wir entwerfen unser Sortiment selbst und verkaufen direkt — wir sind die Marke, kein Wiederverkäufer.',
  alternates: { canonical: '/ueber-uns' },
};

export default function UeberUnsPage() {
  const productCount = getAllProducts().length;
  const categoryCount = getAllCategories().length;
  const { business, contact, payment, shipping } = siteConfig;

  return (
    <>
      <PageHeader
        title="Über Thornstead"
        description="Eine kleine Marke, die ihr Sortiment für Haus und Garten selbst entwickelt und direkt verkauft."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Über uns', path: '/ueber-uns' },
        ]}
      />

      <div className="container-page grid gap-12 px-6 py-12 lg:grid-cols-[1fr_320px]">
        <div className="prose-legal max-w-2xl">
          <h2>Wir sind die Marke, kein Wiederverkäufer</h2>
          <p>
            Das ist wichtig genug, um es gleich am Anfang klar zu sagen: Jedes
            Produkt auf dieser Website wird von Thornstead entworfen, nach
            unserer Spezifikation gefertigt, unter unserem Namen verkauft und von
            uns versandt. Wir sind für das gesamte Sortiment die Marke selbst.
            Wir führen keine Markenware anderer Unternehmen, wir bezeichnen uns
            nicht als autorisierten Händler für irgendwen, und Sie werden in
            diesem Shop kein Fremdlogo finden.
          </p>
          <p>
            Für Sie bleibt es damit einfach: Ein Unternehmen hat es entworfen,
            ein Unternehmen hat es Ihnen verkauft, und ein Unternehmen geht ans
            Telefon, wenn etwas nicht stimmt.
          </p>

          <h2>Wie das Sortiment entstanden ist</h2>
          <p>
            Thornstead ist aus einem Ärger entstanden, den jeder kennt, der
            Gartenausrüstung online gekauft hat: die Kniebank, deren Rahmen in
            der zweiten Saison nachgibt, der Pflanzkübel, dessen Lack nach einem
            Winter abblättert, die Aufbewahrungsbox, die am Deckelfalz Wasser
            zieht. Günstig ist nicht das Problem. Auf Ersatz ausgelegt ist das
            Problem.
          </p>
          <p>
            Wir haben deshalb eine überschaubare Auswahl an Dingen genommen, die
            man wirklich jede Woche benutzt — etwas zum Knien, etwas zum
            Einpflanzen, einen trockenen Platz für die Polster, eine Lösung für
            Küchenabfälle, Futter für die Vögel — und an jedem einzelnen
            gearbeitet, bis es sich zu behalten lohnt. Das Sortiment ist bewusst
            klein: {productCount} Produkte in {categoryCount} Kategorien statt
            eines Katalogs mit Tausenden Artikeln.
          </p>

          <h2>Wie wir verkaufen</h2>
          <p>
            Direkt, über diese Website, an Kundinnen und Kunden in Deutschland.
            Direktverkauf bedeutet, dass keine Großhandels- und keine
            Handelsmarge auf die tatsächlichen Herstellungskosten aufgeschlagen
            wird. Genau deshalb kostet ein Stück von Thornstead in der Regel
            weniger als ein vergleichbares im Ladenregal.
          </p>
          <p>
            Kartenzahlungen werden von {payment.processor} abgewickelt. Wir sehen
            und speichern Ihre Kartendaten nie. Der Versand erfolgt mit{' '}
            {shipping.serviceName} innerhalb Deutschlands.
          </p>

          <h2>Materialien, und Ehrlichkeit darüber</h2>
          <p>
            Wir verwenden verzinkten Stahl dort, wo es nass wird,
            geschlossenzelligen Schaum dort, wo etwas auf feuchtem Boden liegt,
            FSC-zertifiziertes Holz, wo wir überhaupt Holz einsetzen, und
            beschichtetes Polyester mit verschweißten Nähten, wo Regen ablaufen
            soll. Wo ein Material eine Grenze hat — Bambus braucht alle paar
            Jahre neues Öl, unbehandeltes Holz vergraut — steht das auf der
            Produktseite, statt zu hoffen, dass es niemandem auffällt.
          </p>

          <h2>Kontakt</h2>
          <p>
            Verantwortlich ist {business.ownerName}, {formattedAddress()}.
            Schreiben Sie an {contact.email} oder rufen Sie an unter{' '}
            {contact.phone}, {contact.hours}. Beides liest und beantwortet ein
            Mensch.
          </p>
        </div>

        <aside className="h-fit rounded-3xl border border-border p-6 lg:sticky lg:top-24">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider">
            Unternehmensangaben
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Inhaber" value={business.ownerName} />
            <Row label="Marke" value={business.tradingName} />
            <Row label="Rechtsform" value="Einzelunternehmen" />
            {business.vatNumber && (
              <Row label="USt-IdNr." value={business.vatNumber} />
            )}
            <Row label="Anschrift" value={formattedAddress()} />
            <Row label="E-Mail" value={contact.email} />
            <Row label="Telefon" value={contact.phone} />
            <Row label="Lieferung nach" value="Deutschland" />
            <Row label="Währung" value="Euro (EUR)" />
          </dl>

          <Link
            href="/kontakt"
            className={`${buttonVariants({ variant: 'brand' })} mt-6 w-full`}
          >
            Kontakt aufnehmen
          </Link>

          <Link
            href="/impressum"
            className="mt-3 block text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Vollständiges Impressum
          </Link>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
