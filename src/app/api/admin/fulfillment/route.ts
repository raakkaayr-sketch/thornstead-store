import { NextResponse } from 'next/server';
import { isCheckoutSessionId } from '@/lib/orders';
import { requireAdminApi } from '@/lib/admin-session';
import { updateFulfillment, type AdminFulfillment } from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const STATUSES: AdminFulfillment[] = [
  'in_bearbeitung',
  'versendet',
  'storniert',
];

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe ist nicht eingerichtet.' },
      { status: 503 }
    );
  }

  let body: { sessionId?: string; fulfillment?: string; tracking?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  const fulfillment = body.fulfillment as AdminFulfillment;
  const tracking = typeof body.tracking === 'string' ? body.tracking : '';

  if (!isCheckoutSessionId(sessionId) || !STATUSES.includes(fulfillment)) {
    return NextResponse.json({ error: 'Ungültige Angaben.' }, { status: 400 });
  }

  try {
    await updateFulfillment(sessionId, fulfillment, tracking);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/fulfillment]', error);
    return NextResponse.json(
      { error: 'Der Status konnte nicht gespeichert werden.' },
      { status: 500 }
    );
  }
}
