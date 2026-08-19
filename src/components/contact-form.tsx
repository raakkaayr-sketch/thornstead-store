'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { siteConfig } from '@/lib/config';

/**
 * Die Website ist statisch. Statt einen Mailserver vorzugeben, stellen wir die
 * Nachricht zusammen und übergeben sie dem E-Mail-Programm der Besucherin oder
 * des Besuchers. Ohne Absenden verlässt nichts das Gerät, und wir speichern
 * keine personenbezogenen Daten, die wir nicht brauchen.
 */
export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const subject = form.orderNumber
      ? `Anfrage zu Bestellung ${form.orderNumber}`
      : 'Anfrage über die Website';

    const body = [
      form.message,
      '',
      '---',
      `Name: ${form.name}`,
      `E-Mail: ${form.email}`,
      form.orderNumber ? `Bestellnummer: ${form.orderNumber}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Ihr Name" htmlFor="name">
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          autoComplete="name"
        />
      </Field>

      <Field label="E-Mail-Adresse" htmlFor="email">
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
        />
      </Field>

      <Field label="Bestellnummer (optional)" htmlFor="orderNumber">
        <Input
          id="orderNumber"
          value={form.orderNumber}
          onChange={(e) => update('orderNumber', e.target.value)}
          placeholder="z. B. cs_live_…"
        />
      </Field>

      <Field label="Nachricht" htmlFor="message">
        <Textarea
          id="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </Field>

      <Button type="submit" variant="brand" className="w-full">
        <Send className="h-4 w-4" />
        Im E-Mail-Programm öffnen
      </Button>

      <p className="text-xs text-muted-foreground">
        Wir verwenden Ihre Angaben ausschließlich zur Beantwortung Ihrer Anfrage.
        Näheres in unserer{' '}
        <Link href="/datenschutz" className="text-brand hover:underline">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
