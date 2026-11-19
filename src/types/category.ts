export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export type CreateCategoryInput = {
  name: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
