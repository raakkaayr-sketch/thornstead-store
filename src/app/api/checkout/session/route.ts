import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

/** Bestätigt eine abgeschlossene Session, damit die Bestätigungsseite echte Zahlen zeigen kann. */
export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Die Zahlungsabwicklung ist nicht eingerichtet.' },
      { status: 503 }
    );
  }

  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Ungültige Sitzung.' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Diese Zahlung ist noch nicht abgeschlossen.' },
        { status: 402 }
      );
    }

    return NextResponse.json({
      id: session.id,
      amountTotal: session.amount_total,
      currency: (session.currency ?? siteConfig.currency.toLowerCase()).toUpperCase(),
      email: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error('[kasse sitzung]', error);
    return NextResponse.json(
      { error: 'Die Bestellung konnte nicht bestätigt werden.' },
      { status: 500 }
    );
  }
}
