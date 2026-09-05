export interface CartItem {
  id: number;
  toyId: number;
  toyName: string;
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
