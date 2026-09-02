/**
 * Admin-Sitzung über ein signiertes httpOnly-Cookie.
 *
 * Läuft sowohl in Node (Login-API) als auch in der Edge-Middleware.
 * Kein next/headers hier, damit der Middleware-Bundle schlank bleibt.
 */

export const ADMIN_COOKIE = 'hainholt_admin';
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || '';
}

export function getAdminUsername() {
  return process.env.ADMIN_USER?.trim() || 'admin';
}

export function isAdminConfigured() {
  return getAdminPassword().length >= 8;
}

function getSigningSecret() {
  return (process.env.ADMIN_SECRET?.trim() || getAdminPassword()).trim();
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_MAX_AGE_SECONDS,
  };
}

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacHex(secret: string, message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  return bytesToHex(signature);
}

export function timingSafeEqual(a: string, b: string) {
  const length = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

export async function createAdminToken() {
  const secret = getSigningSecret();
  if (!secret) throw new Error('Admin secret is not configured');
  const exp = Math.floor(Date.now() / 1000) + ADMIN_MAX_AGE_SECONDS;
  const signature = await hmacHex(secret, `admin:${exp}`);
  return `${exp}.${signature}`;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const secret = getSigningSecret();
  if (!secret) return false;

  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const expStr = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!signature || !Number.isFinite(exp) || exp < Date.now() / 1000) {
    return false;
  }

  const expected = await hmacHex(secret, `admin:${exp}`);
  return timingSafeEqual(signature, expected);
}

export function credentialsMatch(username: string, password: string) {
  if (!isAdminConfigured()) return false;
  const userOk = timingSafeEqual(username.trim(), getAdminUsername());
  const passOk = timingSafeEqual(password, getAdminPassword());
  return userOk && passOk;
}
