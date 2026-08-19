import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from './config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatiert einen Betrag wie in Deutschland erwartet: 39,95 €. */
export function formatPrice(amount: number, currency: string = siteConfig.currency) {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Preisangabe für den Merchant-Center-Feed: "39.95 EUR".
 *
 * Bewusst nicht lokalisiert: Google verlangt den Punkt als Dezimaltrennzeichen.
 * Ein deutsches Komma würde als Tausendertrennzeichen gelesen und den Preis
 * verfälschen. Diese Funktion darf nicht mit formatPrice zusammengelegt werden.
 */
export function feedPrice(amount: number, currency: string = siteConfig.currency) {
  return `${amount.toFixed(2)} ${currency}`;
}

/** Datum im deutschen Format: 17. August 2026. */
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Versandkosten für einen gegebenen Warenwert. Dies ist die einzige Stelle, an
 * der Versandkosten berechnet werden — Versandseite, Produktseiten, Warenkorb,
 * Bestellübersicht und Stripe-Session rufen alle diese Funktion auf, sodass Feed
 * und Kasse nie voneinander abweichen können.
 */
export function shippingFor(subtotal: number) {
  const { standardCost, freeThreshold } = siteConfig.shipping;
  if (freeThreshold !== null && subtotal >= freeThreshold) return 0;
  return standardCost;
}

export function orderTotal(subtotal: number) {
  return subtotal + shippingFor(subtotal);
}

/**
 * Enthaltener Umsatzsteueranteil eines Bruttobetrags.
 *
 * Alle Preise im Katalog sind Bruttopreise, wie es die PAngV für Verbraucher
 * verlangt. Die Steuer wird daher herausgerechnet und nicht aufgeschlagen:
 * brutto × 19 / 119. Ein Aufschlag von 19 % auf den Bruttopreis wäre zu hoch.
 */
export function vatPortion(gross: number) {
  const { vatRate, smallBusinessScheme } = siteConfig.business;
  if (smallBusinessScheme) return 0;
  return (gross * vatRate) / (100 + vatRate);
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
