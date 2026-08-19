'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'hainholt:hinweis-speicherung';

/**
 * Bewusst ein reiner Hinweis und kein Consent-Banner.
 *
 * Die Website bindet keine Analyse-, Tracking- oder Marketing-Dienste ein.
 * Gespeichert werden ausschließlich Warenkorb, Merkliste, Ansichtsverlauf und
 * Designwahl im Local Storage — das ist nach § 25 Abs. 2 Nr. 2 TDDDG
 * einwilligungsfrei, weil es für den vom Nutzer gewünschten Dienst erforderlich
 * ist. Eine Einwilligung für nicht existierende Cookies abzufragen wäre eine
 * unzutreffende Angabe und selbst angreifbar.
 *
 * Wird später ein Tracking-Dienst eingebunden, ist dieser Hinweis durch ein
 * echtes Consent-Management mit gleichwertigen Schaltflächen für Annehmen und
 * Ablehnen zu ersetzen, das die Skripte erst nach Einwilligung lädt.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* Local Storage nicht verfügbar, Hinweis entfällt */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'gelesen');
    } catch {
      /* ignorieren */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Hinweis zur Datenspeicherung"
      className="fixed inset-x-0 bottom-0 z-[70] animate-fade-up border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="container-page flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Wir speichern Warenkorb, Merkliste und Designwahl lokal in Ihrem
          Browser, damit der Shop funktioniert. Analyse- und Tracking-Dienste
          setzen wir nicht ein. Mehr dazu in unserer{' '}
          <Link href="/datenschutz" className="text-brand hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="brand" size="sm" onClick={dismiss}>
            Verstanden
          </Button>
        </div>
      </div>
    </div>
  );
}
