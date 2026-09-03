/**
 * Google Ads Conversion Tracking (Purchase).
 *
 * Das Basis-Tag liegt im Root-Layout, das Conversion-Ereignis nur auf
 * /kasse/bestaetigung. Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1
 * lit. a DSGVO steuert Consent Mode v2 — ohne Einwilligung setzt Google keine
 * Werbe-Cookies.
 */

export const GOOGLE_ADS_ID = 'AW-18399591655';
export const GOOGLE_ADS_PURCHASE_SEND_TO = `${GOOGLE_ADS_ID}/o_K1CLvejO0cEOf5zcVE`;

export const ADS_CONSENT_KEY = 'hainholt:werbung-einwilligung';
export const ADS_CONSENT_OPEN_EVENT = 'hainholt:consent-open';

export type AdsConsent = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const firedPurchases = new Set<string>();

export function readAdsConsent(): AdsConsent | null {
  try {
    const value = localStorage.getItem(ADS_CONSENT_KEY);
    if (value === 'granted' || value === 'denied') return value;
  } catch {
    /* Local Storage nicht verfügbar */
  }
  return null;
}

export function persistAdsConsent(consent: AdsConsent) {
  try {
    localStorage.setItem(ADS_CONSENT_KEY, consent);
  } catch {
    /* ignorieren */
  }
  applyAdsConsent(consent);
}

export function applyAdsConsent(consent: AdsConsent) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
  });
}

export function openAdsConsentDialog() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADS_CONSENT_OPEN_EVENT));
}

function waitForGtag(timeoutMs = 4000): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (typeof window.gtag === 'function') return Promise.resolve(true);

  return new Promise((resolve) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (typeof window.gtag === 'function') {
        window.clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 50);
  });
}

/**
 * Purchase-Conversion genau einmal je Stripe-Sitzung. transaction_id verhindert
 * Doppelzählung in Google Ads; das Set fängt React-Strict-Mode und Reloads ab.
 */
export async function trackPurchaseConversion({
  transactionId,
  value,
  currency,
}: {
  transactionId: string;
  value: number;
  currency: string;
}) {
  if (!transactionId || firedPurchases.has(transactionId)) return;

  try {
    if (sessionStorage.getItem(`hainholt:ads-purchase:${transactionId}`)) {
      firedPurchases.add(transactionId);
      return;
    }
  } catch {
    /* sessionStorage nicht verfügbar, weiter mit In-Memory-Guard */
  }

  const ready = await waitForGtag();
  if (!ready || firedPurchases.has(transactionId) || typeof window.gtag !== 'function') {
    return;
  }

  firedPurchases.add(transactionId);
  try {
    sessionStorage.setItem(`hainholt:ads-purchase:${transactionId}`, '1');
  } catch {
    /* ignorieren */
  }

  window.gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
    value,
    currency: currency || 'EUR',
    transaction_id: transactionId,
  });
}
