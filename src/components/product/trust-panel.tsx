import { siteConfig } from '@/lib/config';
import type { Product } from '@/lib/types';

/**
 * Identity block for each product. Merchant Center reviewers look for the
 * seller, the brand and the item identifiers to be stated plainly on the
 * landing page, and these values match the feed exactly.
 */
export function TrustPanel({ product }: { product: Product }) {
  const rows = [
    { label: 'Brand', value: product.brand },
    { label: 'SKU', value: product.sku },
    { label: 'Condition', value: 'New' },
    { label: 'Sold and shipped by', value: siteConfig.business.legalName },
  ];

  return (
    <div className="rounded-2xl bg-muted/60 p-5">
      <p className="text-sm text-muted-foreground">
        Sold and shipped by {siteConfig.name}. Every item in this shop is
        designed and branded by us — we are the brand of record, not a reseller
        of other companies&apos; products.
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
