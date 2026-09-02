'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import type { AdminFulfillment } from '@/lib/admin-orders';
import type { OrderStatus } from '@/lib/order-types';

export function FulfillmentForm({
  sessionId,
  status,
  tracking,
}: {
  sessionId: string;
  status: OrderStatus;
  tracking: string | null;
}) {
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<AdminFulfillment>(
    status === 'versendet' || status === 'storniert' ? status : 'in_bearbeitung'
  );
  const [note, setNote] = useState(tracking ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (status === 'zahlung_offen') {
    return (
      <p className="text-sm text-muted-foreground">
        Ohne erfolgreiche Zahlung kann der Versandstatus nicht gesetzt werden.
      </p>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/fulfillment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fulfillment,
          tracking: note,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Speichern fehlgeschlagen.');
        return;
      }
      router.refresh();
    } catch {
      setError('Speichern fehlgeschlagen.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted-foreground">Status</span>
        <Select
          value={fulfillment}
          onChange={(event) =>
            setFulfillment(event.target.value as AdminFulfillment)
          }
        >
          <option value="in_bearbeitung">In Bearbeitung</option>
          <option value="versendet">Versendet</option>
          <option value="storniert">Storniert</option>
        </Select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted-foreground">
          Sendungsnummer (optional)
        </span>
        <Input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="z. B. DHL-Sendungsnummer"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="brand" size="sm" disabled={pending}>
        {pending ? 'Speichert…' : 'Status speichern'}
      </Button>
    </form>
  );
}
