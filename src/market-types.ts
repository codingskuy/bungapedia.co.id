// Bungapedia marketplace types — PRD v1.0 + prompt-programming §27
// Customer → Platform → Partner. Payment disimulasikan, bukan gateway sungguhan.

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type SettlementStatus = 'pending' | 'available' | 'withdrawn';
export type PaymentMethod = 'qris' | 'transfer' | 'ewallet';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

export interface Partner {
  id: string;
  name: string;
  city: string;
  area: string[];
  logo: string;
  cover: string;
  verified: boolean;
  rating: number;
  reviews: number;
  orders: number;
  responseRate: number;
  productionTime: string;
  description: string;
  since: string;
}

export interface MarketProduct {
  id: string;
  name: string;
  slug: string;
  partnerId: string;
  price: number;
  was?: number;
  category: string;
  occasions: string[];
  recipients: string[];
  rating: number;
  reviews: number;
  img: string;
  gallery: string[];
  description: string;
  materials: string;
  size: string;
  productionTime: string;
  deliveryArea: string[];
  deliveryEstimate: string;
  available: boolean;
  popular?: boolean;
  reviewSnippets: { name: string; text: string; rating: number }[];
}

export interface Customer {
  id: string;
  name: string;
  city: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  img: string;
  price: number;
  qty: number;
  partnerId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  partnerId: string;
  productTotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  recipient: { name: string; phone: string; address: string };
  delivery: { date: string; time: string; note: string };
  message: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  settlement: SettlementStatus;
  createdAt: string;
  timeline: { key: OrderStatus; at: string; done: boolean }[];
  dispute?: { reason: string; status: string };
}

export interface CheckoutDraft {
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryNote: string;
  message: string;
  paymentMethod: PaymentMethod;
}

export interface AppError {
  code: string;
  message: string;
  recover: string;
}
