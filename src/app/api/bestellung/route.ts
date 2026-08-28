import { NextResponse } from 'next/server';
import { isStripeConfigured } from '@/lib/stripe';
import { cancelOrder, lookupOrder } from '@/lib/orders';

export const dynamic = 'force-dynamic';

function parseBody(body: unknown) {
  if (!body || typeof body !== 'object') return null;
  const { action, sessionId, email } = body as Record<string, unknown>;
  if (action !== 'lookup' && action !== 'cancel') return null;
  if (typeof sessionId !== 'string' || typeof email !== 'string') return null;
  return { action, sessionId: sessionId.trim(), email: email.trim() };
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Die Bestellabfrage ist derzeit nicht verfügbar.' },
      { status: 503 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body) {
    return NextResponse.json(
      { error: 'Bitte Bestellreferenz und E-Mail-Adresse angeben.' },
      { status: 400 }
    );
  }

  try {
    if (body.action === 'lookup') {
      const order = await lookupOrder(body.sessionId, body.email);
      if (!order) {
        return NextResponse.json(
          {
            error:
              'Keine Bestellung gefunden. Prüfen Sie Bestellreferenz und E-Mail-Adresse aus der Bestätigungsmail.',
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ order });
    }

    const result = await cancelOrder(body.sessionId, body.email);
    if (!result.ok && result.error === 'not_found') {
      return NextResponse.json(
        {
          error:
            'Keine Bestellung gefunden. Prüfen Sie Bestellreferenz und E-Mail-Adresse aus der Bestätigungsmail.',
        },
        { status: 404 }
      );
    }
    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            'Diese Bestellung lässt sich hier nicht mehr stornieren, weil die Bearbeitung bereits fortgeschritten ist. Schreiben Sie uns oder nutzen Sie das Widerrufsrecht, falls das Paket schon unterwegs ist.',
          order: result.order,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      order: result.order,
      alreadyRefunded: result.alreadyRefunded,
    });
  } catch (error) {
    console.error('[bestellung]', error);
    return NextResponse.json(
      { error: 'Die Bestellung konnte gerade nicht bearbeitet werden.' },
      { status: 500 }
    );
  }
}
