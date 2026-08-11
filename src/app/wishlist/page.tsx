import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { WishlistGrid } from '@/components/shop/wishlist-grid';
import { getAllProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Products you have saved from the Thornstead range.',
  alternates: { canonical: '/wishlist' },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        title="Your wishlist"
        description="Saved on this device only — nothing is sent to us until you order."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Wishlist', path: '/wishlist' },
        ]}
      />
      <div className="container-page px-6 py-12">
        <WishlistGrid products={getAllProducts()} />
      </div>
    </>
  );
}
