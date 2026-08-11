'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { siteConfig } from '@/lib/config';

/**
 * The site is static, so rather than pretend to run a mail server we compose
 * the message and hand it to the visitor's own email client. Nothing is sent
 * anywhere without them pressing send, which also keeps us out of storing
 * personal data we do not need.
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
      ? `Enquiry about order ${form.orderNumber}`
      : 'Website enquiry';

    const body = [
      form.message,
      '',
      '---',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.orderNumber ? `Order number: ${form.orderNumber}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Your name" htmlFor="name">
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          autoComplete="name"
        />
      </Field>

      <Field label="Email address" htmlFor="email">
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          autoComplete="email"
        />
      </Field>

      <Field label="Order number (optional)" htmlFor="orderNumber">
        <Input
          id="orderNumber"
          value={form.orderNumber}
          onChange={(e) => update('orderNumber', e.target.value)}
          placeholder="e.g. cs_live_…"
        />
      </Field>

      <Field label="Message" htmlFor="message">
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
        Open in your email app
      </Button>

      <p className="text-xs text-muted-foreground">
        We use what you send only to answer your enquiry. See our{' '}
        <a href="/privacy-policy" className="text-brand hover:underline">
          privacy policy
        </a>
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
