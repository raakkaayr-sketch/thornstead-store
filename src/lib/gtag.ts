/**
 * Google-Tag (gtag.js) für Google Ads.
 *
 * Der Tag wird bewusst nicht im HTML ausgeliefert, sondern erst hier
 * nachgeladen, nachdem eine Einwilligung vorliegt. Ohne Einwilligung entsteht
 * keine Verbindung zu googletagmanager.com und es wird nichts gespeichert.
 *
 * Zusätzlich wird der Consent Mode v2 gesetzt. Google verlangt seit März 2024
 * für Nutzer im EWR die Signale ad_user_data und ad_personalization; fehlen
 * sie, meldet Google Ads die Conversions eingeschränkt.
 */

import { siteConfig } from './config';

type GtagArgs = unknown[];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    gtag?: (...args: GtagArgs) => void;
    __hainholtGtagLoaded?: boolean;
  }
}

const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const;

const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const;

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    // gtag.js erwartet das arguments-Objekt im dataLayer, keine Array-Kopie.
    // Deshalb bewusst eine klassische function ohne Rest-Parameter.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as GtagArgs);
    } as (...args: GtagArgs) => void;
  }
  return window.gtag!;
}

/**
 * Lädt gtag.js einmalig und schaltet die Einwilligungssignale frei.
 * Mehrfache Aufrufe sind unschädlich.
 */
export function loadGoogleAds() {
  const id = siteConfig.analytics.googleAdsId;
  if (typeof window === 'undefined' || !id) return;

  if (window.__hainholtGtagLoaded) {
    ensureGtag()('consent', 'update', GRANTED);
    return;
  }
  window.__hainholtGtagLoaded = true;

  const gtag = ensureGtag();
  // Default vor jedem config-Aufruf, so verlangt es der Consent Mode.
  gtag('consent', 'default', DENIED);
  gtag('js', new Date());

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  gtag('config', id);
  gtag('consent', 'update', GRANTED);
}

/** Einwilligung zurückgezogen: Signale wieder auf denied. */
export function revokeGoogleAds() {
  if (typeof window === 'undefined' || !window.__hainholtGtagLoaded) return;
  ensureGtag()('consent', 'update', DENIED);
}

interface PurchasePayload {
  transactionId: string;
  value: number;
  currency: string;
}

/**
 * Kauf-Conversion. Wird pro Bestellung nur einmal gesendet — die
 * Bestätigungsseite überlebt einen Reload und würde sonst doppelt zählen.
 */
export function trackPurchase({
  transactionId,
  value,
  currency,
}: PurchasePayload) {
  if (typeof window === 'undefined' || !window.__hainholtGtagLoaded) return;

  const dedupeKey = `hainholt:conversion:${transactionId}`;
  try {
    if (window.sessionStorage.getItem(dedupeKey)) return;
    window.sessionStorage.setItem(dedupeKey, '1');
  } catch {
    /* ohne Session Storage kann nicht entdoppelt werden — lieber senden */
  }

  const gtag = ensureGtag();
  const { googleAdsId, purchaseConversionLabel } = siteConfig.analytics;

  if (purchaseConversionLabel) {
    gtag('event', 'conversion', {
      send_to: `${googleAdsId}/${purchaseConversionLabel}`,
      transaction_id: transactionId,
      value,
      currency,
    });
  }

  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency,
  });
}
