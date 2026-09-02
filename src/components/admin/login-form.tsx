'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/brand/logo';

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) return;
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Anmeldung fehlgeschlagen.');
        return;
      }
      router.push(next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <Logo className="mb-6" />
      <h1 className="font-display text-2xl text-foreground">Verwaltung</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bestellungen und Kundendaten aus Stripe. Nur für den Shop-Betreiber.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Bitte <code className="font-mono">ADMIN_PASSWORD</code> (mindestens 8
          Zeichen) in der Umgebung setzen und den Server neu starten.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Benutzername</span>
            <Input
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted-foreground">Passwort</span>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="brand" className="w-full" disabled={pending}>
            {pending ? 'Wird geprüft…' : 'Anmelden'}
          </Button>
        </form>
      )}
    </div>
  );
}
