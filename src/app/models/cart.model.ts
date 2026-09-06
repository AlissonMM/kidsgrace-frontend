export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalValue: number;
}
