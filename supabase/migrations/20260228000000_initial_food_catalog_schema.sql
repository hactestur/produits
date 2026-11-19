-- ==============================================================================
-- MIGRATION : 20260228000000_initial_food_catalog_schema.sql
-- APPLICATION : Catalogue de Produits Alimentaires Évolutif vers E-commerce
-- CIBLE : PostgreSQL 15+ sous Supabase
-- ==============================================================================

-- 1. EXTENSIONS NÉCESSAIRES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS MÉTIER
CREATE TYPE product_availability AS ENUM ('in_stock', 'out_of_stock');
CREATE TYPE product_visibility AS ENUM ('published', 'hidden');
CREATE TYPE admin_role AS ENUM ('admin');

-- ==============================================================================
-- 3. TABLES RELATIONNELLES
-- ==============================================================================

-- 3.1 TABLE : CATEGORIES (Familles de produits)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour optimiser le tri public et les filtres
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON public.categories (is_active, display_order);

-- 3.2 TABLE : PRODUCTS (Articles du catalogue)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    short_description VARCHAR(300),
    description TEXT,
    price NUMERIC(12, 0) NOT NULL CHECK (price > 0), -- Prix entier strict en Francs CFA (FCFA)
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    availability product_availability NOT NULL DEFAULT 'in_stock',
    visibility product_visibility NOT NULL DEFAULT 'published',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour la recherche textuelle et les requêtes catalogue public
CREATE INDEX IF NOT EXISTS idx_products_public ON public.products (visibility, category_id, availability);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products (name);

-- 3.3 TABLE : PRODUCT_IMAGES (Photos et galeries)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text VARCHAR(200),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour charger rapidement les photos par produit
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images (product_id, display_order);

-- 3.4 TABLE : ADMIN_PROFILES (Profils d'administration vérifiés côté serveur)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role admin_role NOT NULL DEFAULT 'admin',
    full_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. FONCTIONS ET TRIGGERS AUTOMATIQUES
-- ==============================================================================

-- Trigger de mise à jour automatique de "updated_at"
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_categories ON public.categories;
CREATE TRIGGER set_updated_at_categories
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_products ON public.products;
CREATE TRIGGER set_updated_at_products
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. SÉCURITÉ & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Activation du RLS sur chaque table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Fonction helper pour vérifier si l'utilisateur connecté est administrateur
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.1 POLITIQUES : CATEGORIES
-- Lecture publique des catégories actives
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

-- Gestion complète réservée aux administrateurs autorisés
CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5.2 POLITIQUES : PRODUCTS
-- Lecture publique STRICTE : Uniquement les produits dont la visibilité est 'published'
CREATE POLICY "Public can view published products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (visibility = 'published' OR public.is_admin());

-- Gestion complète des produits réservée aux administrateurs autorisés
CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products (including soft delete/visibilité)"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5.3 POLITIQUES : PRODUCT_IMAGES
-- Lecture publique des photos associées aux produits publiés
CREATE POLICY "Public can view images of published products"
    ON public.product_images FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_images.product_id
              AND (p.visibility = 'published' OR public.is_admin())
        )
    );

-- Administration des images par les admins
CREATE POLICY "Admins can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5.4 POLITIQUES : ADMIN_PROFILES
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

-- ==============================================================================
-- 6. CONFIGURATION DU BUCKET SUPABASE STORAGE
-- ==============================================================================

-- Création du bucket 'product-images' (public pour consultation des photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS sur le bucket Storage
CREATE POLICY "Public can view product images bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can update and delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());
