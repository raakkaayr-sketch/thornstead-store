import Link from 'next/link';
import { RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import { siteConfig, deliveryWindow } from '@/lib/config';
import { formatPrice } from '@/lib/utils';

/**
 * Versand- und Rückgabebedingungen auf jeder Produktseite. Alle Werte stammen
 * aus der Konfiguration und stimmen dadurch immer mit der Versandseite, dem
 * Gesamtbetrag an der Kasse und dem Merchant-Center-Feed überein.
 */
export function DeliveryInfo() {
  const { shipping, returns, payment } = siteConfig;
  const deliveryEstimate = deliveryWindow();

  const deliveryLine =
    shipping.freeThreshold !== null
      ? `${formatPrice(shipping.standardCost)} ${shipping.serviceName}, versandkostenfrei ab ${formatPrice(shipping.freeThreshold)}.`
      : `${formatPrice(shipping.standardCost)} ${shipping.serviceName}.`;

  const items = [
    {
      icon: Truck,
      title: 'Versand innerhalb Deutschlands',
      body: `${deliveryLine} Voraussichtlich ${deliveryEstimate.min} bis ${deliveryEstimate.max} Werktage, davon ${shipping.handlingDaysMin} bis ${shipping.handlingDaysMax} Tage für Verpackung und Übergabe.`,
    },
    {
      icon: RefreshCcw,
      title: `${returns.days} Tage Rückgaberecht`,
      body: `Sie können es sich ${returns.days} Tage lang anders überlegen und die Ware zurücksenden. Das gilt zusätzlich zu Ihrem gesetzlichen Widerrufsrecht von ${returns.statutoryCancellationDays} Tagen.`,
    },
    {
      icon: ShieldCheck,
      title: 'Sichere Zahlung',
      body: `Kartenzahlungen werden über ${payment.processor} abgewickelt. Wir sehen und speichern Ihre Kartendaten nie.`,
    },
  ];

  return (
    <div className="divide-y divide-border rounded-2xl border border-border">
      {items.map((item) => (
        <div key={item.title} className="flex gap-3 p-4">
          <item.icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" />
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        </div>
      ))}
      <p className="p-4 text-xs text-muted-foreground">
        Alle Einzelheiten unter{' '}
        <Link href="/versand" className="text-brand hover:underline">
          Versand &amp; Lieferung
        </Link>{' '}
        und{' '}
        <Link href="/widerruf" className="text-brand hover:underline">
          Widerrufsrecht &amp; Rückgabe
        </Link>
        .
      </p>
    </div>
  );
}
