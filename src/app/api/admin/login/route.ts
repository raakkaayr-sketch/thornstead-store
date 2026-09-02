import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
  credentialsMatch,
  isAdminConfigured,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          'Die Verwaltung ist noch nicht eingerichtet. Bitte ADMIN_PASSWORD (mindestens 8 Zeichen) in der Umgebung setzen.',
      },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!credentialsMatch(username, password)) {
    return NextResponse.json(
      { error: 'Benutzername oder Passwort ist falsch.' },
      { status: 401 }
    );
  }

  const token = await createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return response;
}
