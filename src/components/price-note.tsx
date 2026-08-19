import Link from 'next/link';
import { siteConfig, vatNote } from '@/lib/config';
import { cn } from '@/lib/utils';

/**
 * Pflichthinweis zu jeder Preisangabe nach § 1 PAngV.
 *
 * Verbraucherpreise müssen den Gesamtpreis inklusive Umsatzsteuer nennen und
 * angeben, dass zusätzlich Versandkosten anfallen, mit einer leicht
 * erreichbaren Möglichkeit, diese einzusehen. Der Hinweis kommt aus einer
 * einzigen Komponente, damit die Formulierung überall identisch ist.
 */
export function PriceNote({
  withLink = true,
  className,
}: {
  withLink?: boolean;
  className?: string;
}) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {vatNote()},{' '}
      {withLink ? (
        <Link href="/versand" className="underline underline-offset-2 hover:text-foreground">
          zzgl. Versandkosten
        </Link>
      ) : (
        'zzgl. Versandkosten'
      )}
    </p>
  );
}

/** Kurzform für Produktkacheln, in denen kein Platz für einen Link ist. */
export function PriceNoteCompact({ className }: { className?: string }) {
  return (
    <p className={cn('text-[11px] text-muted-foreground', className)}>
      {vatNote()}, zzgl. Versand
    </p>
  );
}

/** Hinweis auf die Versandkostenfreigrenze, sofern eine gesetzt ist. */
export function FreeShippingNote({ className }: { className?: string }) {
  const { freeThreshold } = siteConfig.shipping;
  if (freeThreshold === null) return null;

  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      Versandkostenfrei ab{' '}
      {new Intl.NumberFormat(siteConfig.locale, {
        style: 'currency',
        currency: siteConfig.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(freeThreshold)}
    </p>
  );
}
