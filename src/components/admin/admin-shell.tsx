'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Übersicht', icon: LayoutDashboard, exact: true },
  { href: '/admin/bestellungen', label: 'Bestellungen', icon: ShoppingBag },
  { href: '/admin/kunden', label: 'Kunden', icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
          <Link href="/admin" className="inline-flex items-center">
            <Logo />
          </Link>
          <p className="hidden text-xs text-muted-foreground lg:mt-2 lg:block">
            Shop-Verwaltung
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap',
                  active
                    ? 'bg-brand/10 font-medium text-brand'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-border px-3 py-3 lg:block">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Store className="h-4 w-4" />
            Zum Shop
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-end gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Link href="/shop" className="text-sm text-muted-foreground">
            Shop
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="text-sm text-muted-foreground">
              Abmelden
            </button>
          </form>
        </header>
        <div className="px-4 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
