export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          category_id: string;
          availability: 'in_stock' | 'out_of_stock';
          visibility: 'published' | 'hidden';
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          category_id: string;
          availability?: 'in_stock' | 'out_of_stock';
          visibility?: 'published' | 'hidden';
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          category_id?: string;
          availability?: 'in_stock' | 'out_of_stock';
          visibility?: 'published' | 'hidden';
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin';
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin';
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin';
          full_name?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
