export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  totalValue: number;
  createdAt: string;
  paidAt?: string;
  cancelledAt?: string;
}
