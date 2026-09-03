import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { buttonVariants } from '@/components/ui/button-variants';
import { siteConfig, formattedAddress } from '@/lib/config';
import { getAllProducts, getAllCategories } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Über Hainholt',
  description:
    'Hainholt führt ausgewählte Küchengeräte bekannter Marken direkt nach Deutschland — Kaffee, Kochen, Messer und Grill.',
  alternates: { canonical: '/ueber-uns' },
};

export default function UeberUnsPage() {
  const productCount = getAllProducts().length;
  const categoryCount = getAllCategories().length;
  const { business, contact, payment, shipping } = siteConfig;

  return (
    <>
      <PageHeader
        title="Über Hainholt"
        description="Ausgewählte Küchengeräte bekannter Marken, direkt nach Deutschland."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Über uns', path: '/ueber-uns' },
        ]}
      />

      <div className="container-page grid gap-12 px-6 py-12 lg:grid-cols-[1fr_320px]">
        <div className="prose-legal max-w-2xl">
          <h2>Ein Küchenshop, kein Warenhaus</h2>
          <p>
            Hainholt verkauft ausgewählte Küchengeräte: Kaffeevollautomaten und
            Siebträger, Küchenmaschinen, Heißluftfritteusen, Kochgeschirr, Messer
            und Grills. Die Marken stehen auf der Produktseite — De’Longhi,
            Philips, KitchenAid, Le Creuset, Wüsthof, Weber und andere, die in
            ihrer Kategorie Maßstäbe setzen. Wir sind der Händler, nicht der
            Hersteller.
          </p>
          <p>
            Für Sie bleibt der Weg kurz: Ein Unternehmen verkauft, versendet und
            antwortet, wenn etwas nicht stimmt. Wer der Hersteller ist,
            steht zusammen mit den Pflichtangaben zur Produktsicherheit auf jeder
            Produktseite.
          </p>

          <h2>Wie das Sortiment entsteht</h2>
          <p>
            Wir führen wenige Geräte, die sich in der Beratung lohnen — nicht
            Tausende Artikel, die sich nur im Filter unterscheiden. Zusammen
            sind es {productCount} Produkte in {categoryCount} Kategorien.
            Jedes Stück hat eine Produktseite mit technischen Daten,
            Herstellerangaben und den Warnhinweisen, die nach GPSR dazugehören.
          </p>

          <h2>Wie wir verkaufen</h2>
          <p>
            Direkt, über diese Website, an Kundinnen und Kunden in Deutschland.
            Sie zahlen den Gerätepreis an uns; Hersteller, Garantie und
            Produktsicherheit stehen auf der jeweiligen Produktseite.
          </p>
          <p>
            Kartenzahlungen werden von {payment.processor} abgewickelt. Wir sehen
            und speichern Ihre Kartendaten nie. Der Versand erfolgt mit{' '}
            {shipping.serviceName} innerhalb Deutschlands.
          </p>

          <h2>Kontakt</h2>
          <p>
            Verantwortlich ist {business.ownerName}, {formattedAddress()}.
            Schreiben Sie an {contact.email}, {contact.hours}. Jede Nachricht
            liest und beantwortet ein Mensch.
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
