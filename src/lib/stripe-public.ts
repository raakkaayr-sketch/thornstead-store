/** Publishable Stripe key for the on-site (embedded) checkout form. */
export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || '';
}

export function isStripePublishableConfigured() {
  return getStripePublishableKey().startsWith('pk_');
}
