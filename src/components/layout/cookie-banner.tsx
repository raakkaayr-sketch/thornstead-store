'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { readConsent, subscribeConsent, writeConsent } from '@/lib/consent';

/**
 * Echtes Consent-Banner, seit der Shop Google Ads einsetzt.
 *
 * Vorgaben, die hier bewusst umgesetzt sind:
 *  - Der Google-Tag lädt erst nach aktiver Einwilligung (§ 25 Abs. 1 TDDDG).
 *    Ohne Klick wird keine Verbindung zu Google aufgebaut.
 *  - "Ablehnen" ist gleichwertig gestaltet wie "Akzeptieren" — gleiche Größe,
 *    gleiche Ebene. Ein weggedrücktes oder optisch untergeordnetes Ablehnen
 *    gilt als unwirksame Einwilligung.
 *  - Wegklicken ohne Entscheidung gibt es nicht; es gibt keinen X-Button, der
 *    als Zustimmung gewertet würde.
 *  - Der Widerruf läuft über "Cookie-Einstellungen" im Footer und ist damit
 *    so einfach wie die Erteilung (Art. 7 Abs. 3 DSGVO).
 *
 * Technisch notwendige Speicherung — Warenkorb, Merkliste, Designwahl — ist
 * davon unberührt und nach § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
    return subscribeConsent((choice) => setVisible(choice === null));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Einwilligung in Marketing-Cookies"
      className="fixed inset-x-0 bottom-0 z-[70] animate-fade-up border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="container-page flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Warenkorb, Merkliste und Designwahl speichern wir lokal in Ihrem
          Browser — das ist für den Shop notwendig. Zusätzlich möchten wir
          Google Ads einsetzen, um zu messen, welche Anzeige zu einer
          Bestellung geführt hat. Das setzen wir nur mit Ihrer Einwilligung
          ein; ohne Zustimmung wird nichts an Google übertragen. Einzelheiten
          in der{' '}
          <Link href="/datenschutz" className="text-brand hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-w-[120px]"
            onClick={() => writeConsent('denied')}
          >
            Ablehnen
          </Button>
          <Button
            variant="brand"
            size="sm"
            className="min-w-[120px]"
            onClick={() => writeConsent('granted')}
          >
            Akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
}
