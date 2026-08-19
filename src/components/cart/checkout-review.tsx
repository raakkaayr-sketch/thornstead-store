'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Info,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { useCart } from '@/components/providers/cart-provider';
import { useCheckout } from './use-checkout';
import { siteConfig, deliveryWindow, vatNote } from '@/lib/config';
import { formatPrice, orderTotal, shippingFor, vatPortion } from '@/lib/utils';

const { shipping, payment, returns, business } = siteConfig;
const deliveryEstimate = deliveryWindow();

/**
 * Bestellübersicht nach § 312j Abs. 2 BGB („Button-Lösung").
 *
 * Unmittelbar vor der Bestellschaltfläche müssen klar und hervorgehoben stehen:
 * die wesentlichen Merkmale der Ware, der Gesamtpreis einschließlich Steuern und
 * aller Versandkosten sowie — bei Dauerschuldverhältnissen — die Vertragslaufzeit.
 * Die Schaltfläche selbst muss nach § 312j Abs. 3 BGB mit „Zahlungspflichtig
 * bestellen" oder einer entsprechend eindeutigen Formulierung beschriftet sein.
 * „Bestellen", „Weiter" oder „Kaufen" genügen nicht; fehlt die Beschriftung,
 * kommt kein Vertrag zustande.
 *
 * Diese Seite darf daher nicht übersprungen werden. Sowohl „Jetzt kaufen" auf
 * der Produktseite als auch „Zur Kasse" im Warenkorb führen hierher, nicht
 * direkt zu Stripe.
 */
export function CheckoutReview() {
  const { items, subtotal, hydrated, updateQuantity, removeItem } = useCart();
  const { checkout, loading, error } = useCheckout();
  const searchParams = useSearchParams();
  const [accepted, setAccepted] = useState(false);

  const cancelled = searchParams.get('abgebrochen') === '1';
  const shippingCost = shippingFor(subtotal);
  const total = orderTotal(subtotal);
  const vat = vatPortion(total);
  const net = total - vat;
  const remainingForFree =
    shipping.freeThreshold !== null
      ? Math.max(shipping.freeThreshold - subtotal, 0)
      : 0;

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="sr-only">Warenkorb wird geladen</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Ihr Warenkorb ist leer</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sehen Sie sich das Sortiment an und legen Sie etwas hinein.
          </p>
        </div>
        <Link href="/shop" className={buttonVariants({ variant: 'brand' })}>
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div className="space-y-6">
        {cancelled && (
          <p className="flex items-start gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Die Zahlung wurde abgebrochen. Ihr Warenkorb ist unverändert, es
            wurde nichts abgebucht.
          </p>
        )}

        <section aria-labelledby="artikel">
          <h2 id="artikel" className="font-display text-lg font-semibold">
            Ihre Artikel
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prüfen Sie Artikel, Menge und Preis. Sie können hier noch alles
            ändern.
          </p>

          <ul className="mt-5 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <Link
                  href={`/produkte/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div>
                    <Link
                      href={`/produkte/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Artikelnummer {item.sku} · {formatPrice(item.price)} pro
                      Stück, {vatNote()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label={`Menge von ${item.title} verringern`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Menge von ${item.title} erhöhen`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-medium tabular-nums">
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
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="lieferung" className="space-y-2">
          <h2 id="lieferung" className="font-display text-lg font-semibold">
            Lieferung und Zahlung
          </h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-muted-foreground">Versandart</dt>
            <dd>{shipping.serviceName}, nur innerhalb Deutschlands</dd>
            <dt className="text-muted-foreground">Voraussichtlich</dt>
            <dd>
              {deliveryEstimate.min} bis {deliveryEstimate.max} Werktage ab
              Bestelleingang
            </dd>
            <dt className="text-muted-foreground">Zahlungsarten</dt>
            <dd>{payment.methods.join(', ')}</dd>
            <dt className="text-muted-foreground">Widerruf</dt>
            <dd>
              {returns.statutoryCancellationDays} Tage gesetzliches
              Widerrufsrecht, dazu {returns.days} Tage freiwillige Rückgabe
            </dd>
          </dl>
        </section>
      </div>

      {/*
        Die Zusammenfassung ist der Bereich "unmittelbar bevor der Verbraucher
        seine Bestellung abgibt" im Sinne von § 312j Abs. 2 BGB. Gesamtpreis,
        Steuer- und Versandanteil müssen hier stehen, nicht erst bei Stripe.
      */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">
            Zahlungspflichtige Bestellung
          </h2>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Zwischensumme</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {shipping.serviceName}
              </dt>
              <dd className="tabular-nums">
                {shippingCost === 0 ? 'kostenlos' : formatPrice(shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Gesamtbetrag</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
            {!business.smallBusinessScheme && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>
                  darin enthalten: {business.vatRate} % MwSt. auf{' '}
                  {formatPrice(net)}
                </dt>
                <dd className="tabular-nums">{formatPrice(vat)}</dd>
              </div>
            )}
          </dl>

          {remainingForFree > 0 && (
            <p className="mt-4 rounded-xl bg-brand/10 px-3 py-2 text-xs text-brand">
              Noch {formatPrice(remainingForFree)} bis zum versandkostenfreien
              Versand.
            </p>
          )}

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
            />
            <span>
              Ich habe die{' '}
              <Link href="/agb" className="underline underline-offset-2">
                AGB
              </Link>
              , die{' '}
              <Link href="/widerruf" className="underline underline-offset-2">
                Widerrufsbelehrung
              </Link>{' '}
              und die{' '}
              <Link href="/datenschutz" className="underline underline-offset-2">
                Datenschutzerklärung
              </Link>{' '}
              gelesen und akzeptiere sie.
            </span>
          </label>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          {/*
            Die Beschriftung ist gesetzlich vorgegeben (§ 312j Abs. 3 BGB) und
            darf nicht zu "Weiter", "Kaufen" oder "Bezahlen" geändert werden.
          */}
          <Button
            variant="brand"
            size="lg"
            className="mt-5 w-full"
            disabled={loading || !accepted}
            onClick={() => checkout(items)}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Weiterleitung zur
                Zahlung…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Zahlungspflichtig bestellen
              </>
            )}
          </Button>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            Mit Klick auf „Zahlungspflichtig bestellen" geben Sie ein
            verbindliches Angebot ab. Lieferadresse und Zahlungsdaten geben Sie
            im nächsten Schritt bei {payment.processor} ein. Wir erhalten keine
            vollständigen Kartendaten.
          </p>
        </div>
      </aside>
    </div>
  );
}
