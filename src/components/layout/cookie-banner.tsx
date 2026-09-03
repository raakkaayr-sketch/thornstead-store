'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ADS_CONSENT_OPEN_EVENT,
  persistAdsConsent,
  readAdsConsent,
  type AdsConsent,
} from '@/lib/ads';

/**
 * Einwilligung für Google Ads nach § 25 Abs. 1 TDDDG.
 *
 * Warenkorb, Merkliste, Ansichtsverlauf und Designwahl bleiben einwilligungsfrei
 * (§ 25 Abs. 2 Nr. 2 TDDDG). Google-Ads-Cookies werden erst nach ausdrücklicher
 * Zustimmung gesetzt. Ablehnen und Akzeptieren sind gleichwertig erreichbar.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!readAdsConsent()) setVisible(true);
    } catch {
      /* Local Storage nicht verfügbar, Hinweis entfällt */
    }

    const open = () => setVisible(true);
    window.addEventListener(ADS_CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(ADS_CONSENT_OPEN_EVENT, open);
  }, []);

  const choose = (consent: AdsConsent) => {
    persistAdsConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Einwilligung in Google Ads"
      className="fixed inset-x-0 bottom-0 z-[70] animate-fade-up border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="container-page flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Warenkorb, Merkliste und Designwahl speichern wir lokal in Ihrem
          Browser, damit der Shop funktioniert. Mit Ihrer Einwilligung setzen
          wir Google Ads ein, um Käufe als Conversions zu messen. Sie können
          ablehnen — der Einkauf bleibt davon unberührt. Einzelheiten in der{' '}
          <Link href="/datenschutz" className="text-brand hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose('denied')}>
            Ablehnen
          </Button>
          <Button variant="brand" size="sm" onClick={() => choose('granted')}>
            Akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
}
