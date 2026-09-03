'use client';

import { clearConsent } from '@/lib/consent';

/**
 * Widerruf der Einwilligung. Art. 7 Abs. 3 DSGVO verlangt, dass der Widerruf
 * so einfach ist wie die Erteilung — deshalb steht dieser Punkt dauerhaft im
 * Footer und nicht nur in der Datenschutzerklärung. Ein Klick verwirft die
 * gespeicherte Entscheidung, setzt die Google-Signale zurück auf "denied" und
 * blendet das Banner wieder ein.
 */
export function ConsentSettingsLink() {
  return (
    <button
      type="button"
      onClick={clearConsent}
      className="underline underline-offset-2 transition-colors hover:text-foreground"
    >
      Cookie-Einstellungen
    </button>
  );
}
