import type { Category } from './category';

export type ProductVisibility = 'published' | 'hidden';
export type ProductAvailability = 'in_stock' | 'out_of_stock';

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  brand?: string | null;
  packaging?: string | null; // e.g. "Sac de 25 kg", "Carton de 20 paquets", "Bidon 5L"
  unit?: string | null;      // e.g. "Sac", "Carton", "Bidon", "Bouteille", "Paquet"
  short_description?: string | null;
  description?: string | null;
  price: number; // Stored in FCFA as positive integer/numeric
  category_id: string;
  availability: ProductAvailability;
  visibility: ProductVisibility;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  category?: Category;
  images: ProductImage[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  availability?: 'all' | ProductAvailability;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name_asc' | 'price_asc' | 'price_desc' | 'newest';
}

export interface ProductKPIs {
  totalRegistered: number;
  publishedCount: number;
  availableCount: number;
  outOfStockCount: number;
  hiddenCount: number;
}

export interface CreateProductInput {
  name: string;
  category_id: string;
  price: number;
  availability: ProductAvailability;
  visibility?: ProductVisibility;
  short_description?: string;
  description?: string;
  sku?: string;
  brand?: string;
  packaging?: string;
  unit?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;
