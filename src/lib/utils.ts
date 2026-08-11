import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from './config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a GBP amount the way a UK shopper expects: £34.95. */
export function formatPrice(amount: number, currency: string = siteConfig.currency) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Feed-friendly price string: "34.95 GBP". */
export function feedPrice(amount: number, currency: string = siteConfig.currency) {
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Delivery charge for a given basket subtotal. This is the only place shipping
 * is calculated — the policy page, product pages, cart and Stripe session all
 * call it, so the feed and the checkout can never disagree.
 */
export function shippingFor(subtotal: number) {
  const { standardCost, freeThreshold } = siteConfig.shipping;
  if (freeThreshold !== null && subtotal >= freeThreshold) return 0;
  return standardCost;
}

export function orderTotal(subtotal: number) {
  return subtotal + shippingFor(subtotal);
}

export function absoluteUrl(path: string) {
  const base = siteConfig.url.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return `${str.slice(0, length).trimEnd()}…`;
}

/** Escapes text for safe inclusion in XML feeds. */
export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Escapes a value for a CSV cell. */
export function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
