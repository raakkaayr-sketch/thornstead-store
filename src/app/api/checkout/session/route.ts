import { NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

/** Confirms a completed session so the success page can show real figures. */
export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Payments are not configured.' },
      { status: 503 }
    );
  }

  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'This payment has not completed.' },
        { status: 402 }
      );
    }

    return NextResponse.json({
      id: session.id,
      amountTotal: session.amount_total,
      currency: (session.currency ?? 'gbp').toUpperCase(),
      email: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error('[checkout session]', error);
    return NextResponse.json(
      { error: 'We could not verify that order.' },
      { status: 500 }
    );
  }
}
