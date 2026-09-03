export function StripeLoadError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-card px-6 py-5 text-sm">
      <p className="font-medium text-foreground">
        Bestellungen konnten nicht aus Stripe geladen werden.
      </p>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <p className="mt-3 text-muted-foreground">
        Prüfen Sie, ob <code className="font-mono">STRIPE_SECRET_KEY</code> zum
        gleichen Stripe-Konto gehört wie die Zahlungen (Test- und Live-Schlüssel
        nicht mischen).
      </p>
    </div>
  );
}
