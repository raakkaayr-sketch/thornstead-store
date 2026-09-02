import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const url = new URL('/admin/anmelden', request.url);
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(ADMIN_COOKIE, '', {
    ...adminCookieOptions(),
    maxAge: 0,
  });
  return response;
}
