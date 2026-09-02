'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function RefundButton({
  sessionId,
  disabled,
}: {
  sessionId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onRefund() {
    if (
      !window.confirm(
        'Zahlung vollständig erstatten? Der Betrag geht an das ursprüngliche Zahlungsmittel zurück.'
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Erstattung fehlgeschlagen.');
        return;
      }
      router.refresh();
    } catch {
      setError('Erstattung fehlgeschlagen.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRefund}
        disabled={disabled || pending}
      >
        {pending ? 'Erstattet…' : 'Zahlung erstatten'}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
