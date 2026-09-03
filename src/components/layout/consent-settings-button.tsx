'use client';

import { openAdsConsentDialog } from '@/lib/ads';

export function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={openAdsConsentDialog}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookie-Einstellungen
    </button>
  );
}
