'use client';

import { ThemeProvider } from 'next-themes';
import { CartProvider } from './cart-provider';
import { WishlistProvider } from './wishlist-provider';
import { RecentlyViewedProvider } from './recently-viewed-provider';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { CookieBanner } from '@/components/layout/cookie-banner';

export function Providers({ children }: { children: React.ReactNode }) {
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
            <CartDrawer />
            <CookieBanner />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
