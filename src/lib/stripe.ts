import Stripe from 'stripe';

/**
 * Stripe is initialised lazily and only on the server. The secret key lives in
 * an environment variable and must never be imported into a client component
 * or committed to git.
 */
export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || '';
}

export function isStripeConfigured() {
  return getStripeSecretKey().startsWith('sk_');
}

let client: Stripe | null = null;

export function getStripe() {
  const key = getStripeSecretKey();
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  if (!client) client = new Stripe(key);
  return client;
}
