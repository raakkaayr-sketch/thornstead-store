import { NextResponse } from 'next/server';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { getProductById } from '@/lib/products';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { absoluteUrl, shippingFor } from '@/lib/utils';

interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

/**
 * Creates a Stripe Checkout Session.
 *
 * Prices come from the server-side catalogue, never from the request body, so
 * the amount charged is always identical to the price rendered on the product
 * page and published in the Merchant Center feed. Shipping is calculated with
 * the same helper the basket and the shipping policy use.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          'Payments are not configured yet. Add STRIPE_SECRET_KEY to the environment and redeploy.',
      },
      { status: 503 }
    );
  }

  let body: { items?: CheckoutRequestItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const requested = body.items ?? [];
  if (!requested.length) {
    return NextResponse.json({ error: 'Your basket is empty.' }, { status: 400 });
  }

  const lineItems = [];
  let subtotal = 0;

  for (const item of requested) {
    const quantity = Math.floor(Number(item.quantity));
    if (!item.id || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'One of the items in your basket is invalid.' },
        { status: 400 }
      );
    }

    const product = getProductById(item.id);
    if (!product || product.availability !== 'in_stock') {
      return NextResponse.json(
        { error: 'One of the items in your basket is no longer available.' },
        { status: 400 }
      );
    }

    subtotal += product.price * quantity;

    lineItems.push({
      price_data: {
        currency: siteConfig.currency.toLowerCase(),
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title,
          description: `${product.brand} · SKU ${product.sku}`,
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
      line_items: lineItems,
      currency: siteConfig.currency.toLowerCase(),
      success_url: absoluteUrl(
        '/checkout/success?session_id={CHECKOUT_SESSION_ID}'
      ),
      cancel_url: absoluteUrl('/shop?checkout=cancelled'),
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['GB'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency: siteConfig.currency.toLowerCase(),
            },
            display_name:
              shippingCost === 0
                ? 'Free UK delivery'
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
        { error: 'Stripe did not return a checkout URL.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('[checkout]', error);
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again.' },
      { status: 500 }
    );
  }
}
