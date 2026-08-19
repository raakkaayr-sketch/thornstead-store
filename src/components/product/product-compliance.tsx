import { ShieldCheck } from 'lucide-react';
import { siteConfig, formattedAddress, euResponsibleAddress } from '@/lib/config';
import type { Product } from '@/lib/types';

const { gpsr, contact } = siteConfig;

const DEFAULT_SAFETY_NOTES = [
  'Nur für den privaten Gebrauch in Haus und Garten bestimmt.',
  'Nicht als Trittfläche, Sitzgelegenheit oder Leiter verwenden, sofern nicht ausdrücklich dafür vorgesehen.',
  'Von kleinen Kindern fernhalten; Verpackungsmaterial ist kein Spielzeug.',
];

/**
 * Herstellerangaben nach Art. 19 der Verordnung (EU) 2023/988 (GPSR).
 *
 * Diese Angaben müssen bei Fernabsatz vor dem Kaufabschluss klar sichtbar auf der
 * Produktseite selbst stehen — ein Verweis auf das Impressum oder die AGB genügt
 * nicht. Erforderlich sind Name, Postanschrift und elektronische Adresse des
 * Herstellers sowie, wenn der Hersteller nicht in der EU niedergelassen ist,
 * dieselben Angaben zur verantwortlichen Person in der Union. Ohne benannte
 * verantwortliche Person darf das Produkt in der EU nicht angeboten werden.
 */
export function ProductCompliance({ product }: { product: Product }) {
  const notes = product.safetyNotes?.length
    ? product.safetyNotes
    : DEFAULT_SAFETY_NOTES;

  return (
    <section
      aria-labelledby="produktsicherheit"
      className="mt-16 rounded-3xl border border-border bg-muted/30 p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <h2 id="produktsicherheit" className="text-xl font-semibold">
          Produktsicherheit und Herstellerangaben
        </h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Pflichtangaben nach Artikel 19 der Verordnung (EU) 2023/988 über die
        allgemeine Produktsicherheit.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Hersteller</h3>
          <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div>
              <dt className="sr-only">Name</dt>
              <dd>{gpsr.manufacturerName}</dd>
            </div>
            <div>
              <dt className="sr-only">Anschrift</dt>
              <dd>{formattedAddress()}</dd>
            </div>
            <div>
              <dt className="sr-only">E-Mail</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            Verantwortliche Person in der EU
          </h3>
          <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div>
              <dt className="sr-only">Name</dt>
              <dd>{gpsr.euResponsiblePerson.name}</dd>
            </div>
            <div>
              <dt className="sr-only">Anschrift</dt>
              <dd>{euResponsibleAddress()}</dd>
            </div>
            <div>
              <dt className="sr-only">E-Mail</dt>
              <dd>{gpsr.euResponsiblePerson.email}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-sm font-semibold">Warn- und Sicherheitshinweise</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Artikelnummer {product.sku}. Sollte Ihnen ein Sicherheitsproblem
        auffallen, melden Sie es bitte unter {contact.email}. Wir prüfen jede
        Meldung und informieren die zuständigen Behörden, wenn dies erforderlich
        ist.
      </p>
    </section>
  );
}
