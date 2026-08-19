import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { WishlistGrid } from '@/components/shop/wishlist-grid';
import { getAllProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Merkliste',
  description: 'Produkte, die Sie aus dem Thornstead-Sortiment gemerkt haben.',
  alternates: { canonical: '/merkliste' },
  robots: { index: false, follow: true },
};

export default function MerklistePage() {
  return (
    <>
      <PageHeader
        title="Ihre Merkliste"
        description="Nur auf diesem Gerät gespeichert — an uns wird nichts übertragen, solange Sie nicht bestellen."
        crumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Merkliste', path: '/merkliste' },
        ]}
      />
      <div className="container-page px-6 py-12">
        <WishlistGrid products={getAllProducts()} />
      </div>
    </>
  );
}
