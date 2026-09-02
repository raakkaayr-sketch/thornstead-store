import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from './admin-auth';

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminApi() {
  const ok = await isAdminAuthenticated();
  if (ok) return null;
  return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
}
