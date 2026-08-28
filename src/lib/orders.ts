import type Stripe from 'stripe';
import { siteConfig, deliveryWindow } from './config';
import { getStripe } from './stripe';
import { formatDate } from './utils';
import type { OrderStatus, OrderSummary } from './order-types';

export type { OrderStatus, OrderSummary } from './order-types';

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]+$/;

export function isCheckoutSessionId(value: string) {
  return SESSION_ID.test(value.trim());
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function emailsMatch(stored: string | null | undefined, given: string) {
  return Boolean(stored && normalizeEmail(stored) === normalizeEmail(given));
}

function paymentIntentId(
  intent: string | Stripe.PaymentIntent | null | undefined
) {
  if (!intent) return null;
  return typeof intent === 'string' ? intent : intent.id;
}

function cancelDeadline(createdUnix: number) {
  const { handlingDaysMax } = siteConfig.shipping;
  return new Date((createdUnix + handlingDaysMax * 24 * 60 * 60) * 1000);
}

function isWithinCancelWindow(createdUnix: number) {
  return Date.now() < cancelDeadline(createdUnix).getTime();
}

async function isRefunded(paymentIntent: string) {
  const refunds = await getStripe().refunds.list({
    payment_intent: paymentIntent,
    limit: 10,
  });
  return refunds.data.some(
    (refund) => refund.status === 'succeeded' || refund.status === 'pending'
  );
}

function statusCopy(
  status: OrderStatus,
  refunded: boolean
): { label: string; detail: string } {
  const { shipping } = siteConfig;
  const window = deliveryWindow();

  switch (status) {
    case 'storniert':
      return {
        label: 'Storniert',
        detail: refunded
          ? 'Die Zahlung wurde erstattet. Der Betrag erscheint je nach Bank innerhalb weniger Werktage auf dem ursprünglichen Zahlungsmittel.'
          : 'Diese Bestellung ist storniert.',
      };
    case 'zahlung_offen':
      return {
        label: 'Zahlung nicht abgeschlossen',
        detail:
          'Für diese Bestellung ist keine erfolgreiche Zahlung hinterlegt. Es wurde nichts abgebucht.',
      };
    case 'in_bearbeitung':
      return {
        label: 'In Bearbeitung',
        detail: `Ihre Bestellung wird vorbereitet. Die Übergabe an ${shipping.serviceName} erfolgt in der Regel innerhalb von ${shipping.handlingDaysMin} bis ${shipping.handlingDaysMax} Werktagen. Die Sendungsnummer kommt per E-Mail, sobald das Paket unterwegs ist.`,
      };
    default:
      return {
        label: 'Versand vorbereitet',
        detail: `Die Bearbeitung ist abgeschlossen. Falls Sie noch keine Sendungsnummer erhalten haben, prüfen Sie Ihr Postfach oder schreiben Sie uns. Die voraussichtliche Gesamtlieferzeit liegt bei ${window.min} bis ${window.max} Werktagen ab Bestelleingang.`,
      };
  }
}

function resolveStatus(
  paid: boolean,
  refunded: boolean,
  createdUnix: number
): OrderStatus {
  if (refunded) return 'storniert';
  if (!paid) return 'zahlung_offen';
  return isWithinCancelWindow(createdUnix) ? 'in_bearbeitung' : 'versendet';
}

function shippingLine(session: Stripe.Checkout.Session) {
  const address =
    session.collected_information?.shipping_details?.address ??
    session.customer_details?.address;
  const name =
    session.collected_information?.shipping_details?.name ??
    session.customer_details?.name;

  if (!address) return name || null;

  const parts = [
    name,
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean);

  return parts.join(', ') || null;
}

async function loadSession(sessionId: string) {
  return getStripe().checkout.sessions.retrieve(sessionId.trim(), {
    expand: ['line_items.data.price.product', 'payment_intent'],
  });
}

export async function lookupOrder(
  sessionId: string,
  email: string
): Promise<OrderSummary | null> {
  if (!isCheckoutSessionId(sessionId) || !normalizeEmail(email)) return null;

  let session: Stripe.Checkout.Session;
  try {
    session = await loadSession(sessionId);
  } catch {
    return null;
  }

  const storedEmail =
    session.customer_details?.email ?? session.customer_email ?? null;
  if (!emailsMatch(storedEmail, email)) return null;

  const intentId = paymentIntentId(session.payment_intent);
  const refunded = intentId ? await isRefunded(intentId) : false;
  const paid = session.payment_status === 'paid';
  const status = resolveStatus(paid, refunded, session.created);
  const copy = statusCopy(status, refunded);
  const canCancel =
    paid && !refunded && isWithinCancelWindow(session.created);
  const window = deliveryWindow();
  const paidAt = paid ? new Date(session.created * 1000) : null;

  return {
    id: session.id,
    email: storedEmail,
    amountTotal: session.amount_total,
    currency: (session.currency ?? siteConfig.currency.toLowerCase()).toUpperCase(),
    paidAt: paidAt ? paidAt.toISOString() : null,
    status,
    statusLabel: copy.label,
    statusDetail: copy.detail,
    items: (session.line_items?.data ?? []).map((item) => ({
      name: item.description ?? 'Artikel',
      quantity: item.quantity ?? 1,
      amount: item.amount_total ?? 0,
    })),
    shippingTo: shippingLine(session),
    estimatedDelivery: `${window.min}–${window.max} Werktage ab Bestelleingang`,
    canCancel,
    cancelUntil: canCancel ? formatDate(cancelDeadline(session.created)) : null,
    refunded,
  };
}

export async function cancelOrder(sessionId: string, email: string) {
  const order = await lookupOrder(sessionId, email);
  if (!order) return { ok: false as const, error: 'not_found' as const };
  if (order.refunded) {
    return { ok: true as const, alreadyRefunded: true as const, order };
  }
  if (!order.canCancel) {
    return { ok: false as const, error: 'too_late' as const, order };
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await loadSession(sessionId);
  } catch {
    return { ok: false as const, error: 'not_found' as const };
  }

  const intentId = paymentIntentId(session.payment_intent);
  if (!intentId) {
    return { ok: false as const, error: 'too_late' as const, order };
  }

  await getStripe().refunds.create({
    payment_intent: intentId,
    reason: 'requested_by_customer',
  });

  const updated = await lookupOrder(sessionId, email);
  return {
    ok: true as const,
    alreadyRefunded: false as const,
    order: updated ?? { ...order, refunded: true, canCancel: false, status: 'storniert' as const },
  };
}
