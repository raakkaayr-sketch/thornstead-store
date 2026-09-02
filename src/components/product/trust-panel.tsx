import { siteConfig } from '@/lib/config';
import type { Product } from '@/lib/types';

/**
 * Identitätsblock je Produkt. Prüfer im Merchant Center erwarten, dass
 * Verkäufer, Marke und Artikelkennungen auf der Zielseite klar benannt sind;
 * diese Werte stimmen exakt mit dem Feed überein.
 */
export function TrustPanel({ product }: { product: Product }) {
  const ownBrand = product.brand === siteConfig.name;
  const rows = [
    { label: 'Marke', value: product.brand },
    { label: 'Artikelnummer', value: product.sku },
    { label: 'Zustand', value: 'Neu' },
    { label: 'Verkauf und Versand', value: siteConfig.business.tradingName },
  ];

  return (
    <div className="rounded-2xl bg-muted/60 p-5">
      <p className="text-sm text-muted-foreground">
        {ownBrand
          ? `Verkauf und Versand durch ${siteConfig.name}. Dieser Artikel wird von uns entworfen und unter unserer Marke geführt.`
          : `Verkauf und Versand durch ${siteConfig.name}. Hersteller und Marke dieses Artikels ist ${product.brand}; wir sind der Händler.`}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-4 text-xs">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
