import type Stripe from 'stripe';
import { siteConfig } from './config';
import type { OrderStatus } from './order-types';
import { getStripe } from './stripe';
import { formatPrice } from './utils';

/** Wie viele Checkout-Sessions höchstens von Stripe gelesen werden. */
const SESSION_CAP = 150;

export const FULFILLMENT_META = 'fulfillment';
export const TRACKING_META = 'tracking';

export type AdminFulfillment = 'in_bearbeitung' | 'versendet' | 'storniert';

export interface AdminAddress {
  name: string | null;
  line1: string | null;
  line2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}

export interface AdminOrderItem {
  name: string;
  quantity: number;
  amount: number;
  sku: string | null;
}

export interface AdminOrder {
  id: string;
  created: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  amountTotal: number | null;
  amountSubtotal: number | null;
  amountShipping: number | null;
  amountTax: number | null;
  amountRefunded: number;
  currency: string;
  paymentStatus: string;
  sessionStatus: string;
  status: OrderStatus;
  statusLabel: string;
  itemSummary: string;
  items: AdminOrderItem[];
  itemCount: number;
  refunded: boolean;
  tracking: string | null;
  customerId: string | null;
  paymentIntentId: string | null;
  billing: AdminAddress | null;
  shipping: AdminAddress | null;
  shippingLine: string | null;
}

export interface AdminCustomer {
  key: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  stripeCustomerId: string | null;
  orderCount: number;
  paidCount: number;
  totalSpent: number;
  lastOrderAt: number;
  orders: AdminOrder[];
}

export function customerKey(email: string) {
  return Buffer.from(email.trim().toLowerCase(), 'utf8').toString('base64url');
}

export function emailFromCustomerKey(key: string) {
  try {
    return Buffer.from(key, 'base64url').toString('utf8').trim().toLowerCase();
  } catch {
    return '';
  }
}

export function formatAdminDateTime(unix: number) {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(unix * 1000));
}

export function formatCents(cents: number | null | undefined, currency = 'EUR') {
  return formatPrice((cents ?? 0) / 100, currency.toUpperCase());
}

export function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'storniert':
      return 'Storniert';
    case 'zahlung_offen':
      return 'Zahlung offen';
    case 'versendet':
      return 'Versendet';
    default:
      return 'In Bearbeitung';
  }
}

function asId(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

function chargeOf(
  intent: string | Stripe.PaymentIntent | null | undefined
): Stripe.Charge | null {
  if (!intent || typeof intent === 'string') return null;
  const charge = intent.latest_charge;
  if (!charge || typeof charge === 'string') return null;
  return charge;
}

function refundedAmount(session: Stripe.Checkout.Session) {
  const charge = chargeOf(session.payment_intent);
  return charge?.amount_refunded ?? 0;
}

function isRefunded(session: Stripe.Checkout.Session) {
  if (session.metadata?.[FULFILLMENT_META] === 'storniert') return true;
  const amount = refundedAmount(session);
  if (amount > 0) return true;
  const charge = chargeOf(session.payment_intent);
  return Boolean(charge?.refunded);
}

function fulfillmentOf(session: Stripe.Checkout.Session): AdminFulfillment | null {
  const value = session.metadata?.[FULFILLMENT_META];
  if (value === 'versendet' || value === 'storniert' || value === 'in_bearbeitung') {
    return value;
  }
  return null;
}

function resolveAdminStatus(session: Stripe.Checkout.Session): OrderStatus {
  if (isRefunded(session) || fulfillmentOf(session) === 'storniert') {
    return 'storniert';
  }
  if (session.payment_status !== 'paid') return 'zahlung_offen';
  if (fulfillmentOf(session) === 'versendet') return 'versendet';
  return 'in_bearbeitung';
}

function mapAddress(
  name: string | null | undefined,
  address: Stripe.Address | null | undefined
): AdminAddress | null {
  if (!name && !address) return null;
  return {
    name: name || null,
    line1: address?.line1 || null,
    line2: address?.line2 || null,
    postalCode: address?.postal_code || null,
    city: address?.city || null,
    country: address?.country || null,
  };
}

function formatAddress(address: AdminAddress | null) {
  if (!address) return null;
  const parts = [
    address.name,
    address.line1,
    address.line2,
    [address.postalCode, address.city].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean);
  return parts.join(', ') || null;
}

function skuFromItem(item: Stripe.LineItem) {
  const product = item.price?.product;
  if (!product || typeof product === 'string') return null;
  if ('deleted' in product && product.deleted) return null;
  return product.metadata?.sku || null;
}

export function mapSession(session: Stripe.Checkout.Session): AdminOrder {
  const items = (session.line_items?.data ?? []).map((item) => ({
    name: item.description ?? 'Artikel',
    quantity: item.quantity ?? 1,
    amount: item.amount_total ?? 0,
    sku: skuFromItem(item),
  }));
  const shippingDetails = session.collected_information?.shipping_details;
  const shipping = mapAddress(
    shippingDetails?.name ?? session.customer_details?.name,
    shippingDetails?.address ?? session.customer_details?.address
  );
  const billing = mapAddress(
    session.customer_details?.name,
    session.customer_details?.address
  );
  const status = resolveAdminStatus(session);
  const currency = (session.currency ?? siteConfig.currency.toLowerCase()).toUpperCase();
  const names = items.map((item) =>
    item.quantity > 1 ? `${item.quantity}× ${item.name}` : item.name
  );

  return {
    id: session.id,
    created: session.created,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    name:
      shippingDetails?.name ??
      session.customer_details?.name ??
      null,
    phone: session.customer_details?.phone ?? null,
    amountTotal: session.amount_total,
    amountSubtotal: session.amount_subtotal,
    amountShipping: session.total_details?.amount_shipping ?? null,
    amountTax: session.total_details?.amount_tax ?? null,
    amountRefunded: refundedAmount(session),
    currency,
    paymentStatus: session.payment_status,
    sessionStatus: session.status ?? 'open',
    status,
    statusLabel: statusLabel(status),
    itemSummary: names.slice(0, 3).join(', ') || '—',
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    refunded: isRefunded(session),
    tracking: session.metadata?.[TRACKING_META] || null,
    customerId: asId(session.customer),
    paymentIntentId: asId(session.payment_intent),
    billing,
    shipping,
    shippingLine: formatAddress(shipping),
  };
}

async function listSessionsPage(
  startingAfter: string | undefined,
  limit: number,
  expandCharge: boolean
) {
  return getStripe().checkout.sessions.list({
    limit,
    starting_after: startingAfter,
    expand: expandCharge
      ? ['data.line_items', 'data.payment_intent.latest_charge']
      : ['data.line_items', 'data.payment_intent'],
  });
}

/**
 * Liest Bestellungen live von der Stripe-API. Es gibt keinen Webhook und
 * keine eigene Bestelldatenbank — Stripe bleibt die Quelle.
 */
export async function listAdminOrders(): Promise<AdminOrder[]> {
  const collected: Stripe.Checkout.Session[] = [];
  let startingAfter: string | undefined;
  let expandCharge = true;

  while (collected.length < SESSION_CAP) {
    const limit = Math.min(100, SESSION_CAP - collected.length);
    let page: Stripe.ApiList<Stripe.Checkout.Session>;
    try {
      page = await listSessionsPage(startingAfter, limit, expandCharge);
    } catch (error) {
      if (expandCharge) {
        expandCharge = false;
        page = await listSessionsPage(startingAfter, limit, false);
      } else {
        throw error;
      }
    }
    collected.push(...page.data);
    if (!page.has_more || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  return collected.map(mapSession);
}

export async function getAdminOrder(sessionId: string): Promise<AdminOrder | null> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: [
        'line_items.data.price.product',
        'payment_intent',
        'payment_intent.latest_charge',
        'customer',
      ],
    });
    return mapSession(session);
  } catch {
    return null;
  }
}

export function groupCustomers(orders: AdminOrder[]): AdminCustomer[] {
  const byEmail = new Map<string, AdminCustomer>();

  for (const order of orders) {
    const email = order.email?.trim().toLowerCase();
    if (!email) continue;

    const existing = byEmail.get(email);
    const spent =
      order.status === 'storniert'
        ? Math.max(0, (order.amountTotal ?? 0) - order.amountRefunded)
        : order.paymentStatus === 'paid'
          ? (order.amountTotal ?? 0) - order.amountRefunded
          : 0;

    if (!existing) {
      byEmail.set(email, {
        key: customerKey(email),
        email,
        name: order.name,
        phone: order.phone,
        address: order.shippingLine,
        stripeCustomerId: order.customerId,
        orderCount: 1,
        paidCount: order.paymentStatus === 'paid' ? 1 : 0,
        totalSpent: spent,
        lastOrderAt: order.created,
        orders: [order],
      });
      continue;
    }

    existing.orders.push(order);
    existing.orderCount += 1;
    if (order.paymentStatus === 'paid') existing.paidCount += 1;
    existing.totalSpent += spent;
    if (order.created > existing.lastOrderAt) {
      existing.lastOrderAt = order.created;
      existing.name = order.name || existing.name;
      existing.phone = order.phone || existing.phone;
      existing.address = order.shippingLine || existing.address;
      existing.stripeCustomerId = order.customerId || existing.stripeCustomerId;
    }
  }

  return [...byEmail.values()].sort((a, b) => b.lastOrderAt - a.lastOrderAt);
}

export function dashboardStats(orders: AdminOrder[]) {
  const now = new Date();
  const monthStart =
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000;
  const paid = orders.filter((order) => order.paymentStatus === 'paid');
  const thisMonth = paid.filter((order) => order.created >= monthStart);
  const revenue = (list: AdminOrder[]) =>
    list.reduce((sum, order) => {
      const net = (order.amountTotal ?? 0) - order.amountRefunded;
      return sum + Math.max(0, net);
    }, 0);

  return {
    paidCount: paid.length,
    openCount: orders.filter((order) => order.status === 'zahlung_offen').length,
    packingCount: orders.filter((order) => order.status === 'in_bearbeitung')
      .length,
    shippedCount: orders.filter((order) => order.status === 'versendet').length,
    cancelledCount: orders.filter((order) => order.status === 'storniert').length,
    monthCount: thisMonth.length,
    monthRevenue: revenue(thisMonth),
    totalRevenue: revenue(paid),
    customers: new Set(
      paid.map((order) => order.email?.toLowerCase()).filter(Boolean)
    ).size,
  };
}

export async function updateFulfillment(
  sessionId: string,
  fulfillment: AdminFulfillment,
  tracking: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...(session.metadata ?? {}),
      [FULFILLMENT_META]: fulfillment,
      [TRACKING_META]: tracking.trim(),
    },
  });
}

export async function refundAdminOrder(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
  const intentId = asId(session.payment_intent);
  if (!intentId) {
    throw new Error('Für diese Bestellung liegt keine Zahlung vor.');
  }
  if (session.payment_status !== 'paid') {
    throw new Error('Diese Bestellung ist nicht bezahlt.');
  }

  await stripe.refunds.create({
    payment_intent: intentId,
    reason: 'requested_by_customer',
  });
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...(session.metadata ?? {}),
      [FULFILLMENT_META]: 'storniert',
    },
  });
}

export function stripeDashboardUrl(paymentIntentId: string | null) {
  if (!paymentIntentId) return null;
  const test = (process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_');
  const base = test
    ? 'https://dashboard.stripe.com/test'
    : 'https://dashboard.stripe.com';
  return `${base}/payments/${paymentIntentId}`;
}
