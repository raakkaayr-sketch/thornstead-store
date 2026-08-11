'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'thornstead:cookie-consent';

/**
 * UK PECR / GDPR: non-essential cookies need consent before they are set, and
 * rejecting must be as easy as accepting. This site sets no analytics or
 * marketing cookies unless the visitor accepts — the choice is recorded in
 * localStorage, which is strictly necessary for remembering the preference.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const decide = (choice: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-0 z-[70] animate-fade-up border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="container-page flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies to run the basket and checkout. With your
          consent we would also use analytics cookies to understand how the shop
          is used. Read our{' '}
          <Link href="/privacy-policy" className="text-brand hover:underline">
            privacy and cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => decide('rejected')}>
            Reject non-essential
          </Button>
          <Button variant="brand" size="sm" onClick={() => decide('accepted')}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
