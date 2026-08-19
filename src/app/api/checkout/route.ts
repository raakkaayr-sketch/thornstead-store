import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { getProductById } from '@/lib/products';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { absoluteUrl, shippingFor } from '@/lib/utils';

interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

/**
 * Erstellt eine Stripe-Checkout-Session für Deutschland.
 *
 * Die Preise stammen ausschließlich aus dem serverseitigen Katalog, niemals aus
 * dem Request-Body. Der belastete Betrag ist damit immer identisch mit dem Preis
 * auf der Produktseite, in der Bestellübersicht und im Merchant-Center-Feed —
 * Abweichungen führen dort zur Ablehnung.
 *
 * Die Beträge sind bruttoinklusiv: `tax_behavior: 'inclusive'` teilt Stripe mit,
 * dass die 19 % Umsatzsteuer bereits im Preis enthalten sind. Ohne dieses Flag
 * würde Stripe die Steuer als zusätzlich behandeln und der Endbetrag wiche von
 * der Angabe "inkl. MwSt." auf der Website ab, was gegen die PAngV verstößt.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          'Die Zahlungsabwicklung ist noch nicht eingerichtet. Bitte STRIPE_SECRET_KEY in der Umgebung setzen und neu bereitstellen.',
      },
      { status: 503 }
    );
  }

  let body: { items?: CheckoutRequestItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const requested = body.items ?? [];
  if (!requested.length) {
    return NextResponse.json(
      { error: 'Ihr Warenkorb ist leer.' },
      { status: 400 }
    );
  }

  const currency = siteConfig.currency.toLowerCase();
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const item of requested) {
    const quantity = Math.floor(Number(item.quantity));
    if (!item.id || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'Ein Artikel in Ihrem Warenkorb ist ungültig.' },
        { status: 400 }
      );
    }

    const product = getProductById(item.id);
    if (!product || product.availability !== 'in_stock') {
      return NextResponse.json(
        { error: 'Ein Artikel in Ihrem Warenkorb ist nicht mehr verfügbar.' },
        { status: 400 }
      );
    }

    subtotal += product.price * quantity;

    lineItems.push({
      price_data: {
        currency,
        unit_amount: Math.round(product.price * 100),
        tax_behavior: 'inclusive',
        product_data: {
          name: product.title,
          description: `${product.brand} · Artikelnummer ${product.sku}`,
          images: [absoluteUrl(product.images[0].src)],
          metadata: { sku: product.sku, slug: product.slug },
        },
      },
      quantity,
    });
  }

  const shippingCost = shippingFor(subtotal);
  const window = deliveryWindow();

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      submit_type: 'pay',
      locale: 'de',
      line_items: lineItems,
      currency,
      success_url: absoluteUrl(
        '/kasse/bestaetigung?session_id={CHECKOUT_SESSION_ID}'
      ),
      cancel_url: absoluteUrl('/kasse?abgebrochen=1'),
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: [
          ...siteConfig.shipping.shipToCountries,
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency,
            },
            tax_behavior: 'inclusive',
            display_name:
              shippingCost === 0
                ? 'Versandkostenfreie Lieferung'
                : siteConfig.shipping.serviceName,
            delivery_estimate: {
              minimum: { unit: 'business_day', value: window.min },
              maximum: { unit: 'business_day', value: window.max },
            },
          },
        },
      ],
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe hat keine Zahlungsadresse zurückgegeben.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('[kasse]', error);
    return NextResponse.json(
      {
        error:
          'Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.',
      },
      { status: 500 }
    );
  }
}
