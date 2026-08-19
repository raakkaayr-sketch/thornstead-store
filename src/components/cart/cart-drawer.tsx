'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { useCart } from '@/components/providers/cart-provider';
import { siteConfig, vatNote } from '@/lib/config';
import { formatPrice, orderTotal, shippingFor } from '@/lib/utils';

/**
 * Die Schublade endet bewusst mit einem Link auf /kasse und nicht mit einem
 * Zahlungsvorgang. Die Bestellung darf erst nach der Übersichtsseite ausgelöst
 * werden, damit die Pflichtangaben nach § 312j Abs. 2 BGB unmittelbar vor der
 * Bestellschaltfläche stehen.
 */
export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } =
    useCart();

  const shipping = shippingFor(subtotal);
  const total = orderTotal(subtotal);
  const freeThreshold = siteConfig.shipping.freeThreshold;
  const remainingForFree =
    freeThreshold !== null ? Math.max(freeThreshold - subtotal, 0) : 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[85] animate-fade-in">
      <div
        className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-border bg-background shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Ihr Warenkorb</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Warenkorb schließen"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Ihr Warenkorb ist leer</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sehen Sie sich das Sortiment an und legen Sie etwas hinein.
              </p>
            </div>
            <Link
              href="/shop"
              onClick={closeCart}
              className={buttonVariants({ variant: 'brand' })}
            >
              Zum Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <Link
                    href={`/produkte/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/produkte/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatPrice(item.price)} · {item.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label={`Menge von ${item.title} verringern`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Menge von ${item.title} erhöhen`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          aria-label={`${item.title} entfernen`}
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="space-y-3 border-t border-border px-5 py-4">
              {remainingForFree > 0 && (
                <p className="rounded-xl bg-brand/10 px-3 py-2 text-xs text-brand">
                  Noch {formatPrice(remainingForFree)} bis zum
                  versandkostenfreien Versand.
                </p>
              )}

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Zwischensumme</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Versand</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? 'kostenlos' : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                  <dt>Gesamt</dt>
                  <dd className="tabular-nums">{formatPrice(total)}</dd>
                </div>
              </dl>

              <p className="text-xs text-muted-foreground">{vatNote()}</p>

              <Link
                href="/kasse"
                onClick={closeCart}
                className={`${buttonVariants({ variant: 'brand', size: 'lg' })} w-full`}
              >
                Zur Kasse
              </Link>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                Zahlung über {siteConfig.payment.processor}. Versand nur
                innerhalb Deutschlands.{' '}
                <Link href="/widerruf" className="underline">
                  {siteConfig.returns.days} Tage Rückgaberecht
                </Link>
                .
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
