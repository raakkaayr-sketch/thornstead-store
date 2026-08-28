export type OrderStatus =
  | 'zahlung_offen'
  | 'in_bearbeitung'
  | 'versendet'
  | 'storniert';

export interface OrderSummary {
  id: string;
  email: string | null;
  amountTotal: number | null;
  currency: string;
  paidAt: string | null;
  status: OrderStatus;
  statusLabel: string;
  statusDetail: string;
  items: { name: string; quantity: number; amount: number }[];
  shippingTo: string | null;
  estimatedDelivery: string;
  canCancel: boolean;
  cancelUntil: string | null;
  refunded: boolean;
}
