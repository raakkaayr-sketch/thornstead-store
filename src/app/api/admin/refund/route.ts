import { NextResponse } from 'next/server';
import { isCheckoutSessionId } from '@/lib/orders';
import { requireAdminApi } from '@/lib/admin-session';
import { refundAdminOrder } from '@/lib/admin-orders';
import { isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe ist nicht eingerichtet.' },
      { status: 503 }
    );
  }

  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
  if (!isCheckoutSessionId(sessionId)) {
    return NextResponse.json({ error: 'Ungültige Bestellung.' }, { status: 400 });
  }

  try {
    await refundAdminOrder(sessionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/refund]', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Die Erstattung konnte nicht ausgeführt werden.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
