/**
 * Einwilligung für Marketing-Dienste (Google Ads).
 *
 * Nach § 25 Abs. 1 TDDDG darf auf Informationen im Endgerät erst nach
 * Einwilligung zugegriffen werden. Der Google-Tag wird deshalb nicht mit der
 * Seite ausgeliefert, sondern erst nachgeladen, wenn hier "granted" steht —
 * ohne Einwilligung wird keine Verbindung zu Google aufgebaut.
 *
 * Die Entscheidung liegt im Local Storage und damit ausschließlich im Browser
 * der Nutzerin oder des Nutzers. Ein Widerruf muss so einfach sein wie die
 * Erteilung (Art. 7 Abs. 3 DSGVO); dafür gibt es clearConsent(), das der
 * Footer über "Cookie-Einstellungen" aufruft.
 */

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'hainholt:einwilligung-marketing';
export const CONSENT_EVENT = 'hainholt:consent-changed';

function isChoice(value: string | null): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}

/** Gespeicherte Entscheidung, oder null wenn noch keine getroffen wurde. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return isChoice(raw) ? raw : null;
  } catch {
    // Local Storage gesperrt (privates Fenster, Browsereinstellung):
    // dann gilt keine Einwilligung, es wird nichts geladen.
    return null;
  }
}

function announce(choice: ConsentChoice | null) {
  window.dispatchEvent(
    new CustomEvent<ConsentChoice | null>(CONSENT_EVENT, { detail: choice }),
  );
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* nicht speicherbar — die Entscheidung gilt dann nur für diese Sitzung */
  }
  announce(choice);
}

/** Widerruf: Entscheidung verwerfen, Banner erscheint erneut. */
export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignorieren */
  }
  announce(null);
}

export function subscribeConsent(fn: (choice: ConsentChoice | null) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<ConsentChoice | null>).detail);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
