'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, ShoppingBag, X } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { SearchDialog } from './search-dialog';
import { ThemeToggle } from './theme-toggle';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlist } from '@/components/providers/wishlist-provider';
import { cn } from '@/lib/utils';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/kategorien', label: 'Kategorien' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/faq', label: 'Fragen' },
  { href: '/kontakt', label: 'Kontakt' },
];

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();
  const { ids: wishlistIds, hydrated: wishlistHydrated } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="Thornstead Startseite" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-accent',
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <SearchDialog />
          <ThemeToggle />

          <Link
            href="/merkliste"
            aria-label="Merkliste"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Heart className="h-[18px] w-[18px]" />
            {wishlistHydrated && wishlistIds.length > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand" />
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Warenkorb öffnen${
              hydrated && count ? `, ${count} Artikel` : ''
            }`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {hydrated && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Menu className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="animate-fade-in border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col px-6 py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-border/60 py-3 text-sm last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
