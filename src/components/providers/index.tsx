'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from './cart-provider';
import { WishlistProvider } from './wishlist-provider';
import { RecentlyViewedProvider } from './recently-viewed-provider';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { CookieBanner } from '@/components/layout/cookie-banner';
import { GoogleAds } from '@/components/analytics/google-ads';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            {children}
            {isAdmin ? null : <CartDrawer />}
            {isAdmin ? null : <CookieBanner />}
            {isAdmin ? null : <GoogleAds />}
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
