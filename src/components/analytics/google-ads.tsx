'use client';

import { useEffect } from 'react';
import { readConsent, subscribeConsent } from '@/lib/consent';
import { loadGoogleAds, revokeGoogleAds } from '@/lib/gtag';

/**
 * Hängt den Google-Tag an die Einwilligung.
 *
 * Rendert nichts. Beim ersten Rendern wird geprüft, ob bereits eine
 * Einwilligung vorliegt; danach reicht ein Klick im Banner, der Tag lädt ohne
 * Neuladen der Seite nach.
 */
export function GoogleAds() {
  useEffect(() => {
    if (readConsent() === 'granted') loadGoogleAds();

    return subscribeConsent((choice) => {
      if (choice === 'granted') loadGoogleAds();
      else revokeGoogleAds();
    });
  }, []);

  return null;
}
