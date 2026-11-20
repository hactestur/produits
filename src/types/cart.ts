import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface ClientOrderInfo {
  fullName: string;
  phone: string;
  city: string;
  neighborhood: string;
  email?: string;
  notes?: string;
}
