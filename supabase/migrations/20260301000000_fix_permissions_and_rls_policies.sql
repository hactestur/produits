-- ==============================================================================
-- MIGRATION : 20260301000000_fix_permissions_and_rls_policies.sql
-- APPLICATION : Saveurs d'Or — Catalogue Alimentaire
-- OBJECTIF : Audit et correction globale des privilèges PostgreSQL et des politiques RLS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PRIVILÈGES SUR LE SCHÉMA PUBLIC
-- ------------------------------------------------------------------------------
-- Assurer que les rôles PostgREST disposent de l'accès USAGE sur le schéma public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 2. FONCTION DE CONTRÔLE D'ACCÈS ADMINISTRATEUR (is_admin)
-- ------------------------------------------------------------------------------
-- Sécurisation stricte :
-- - SECURITY DEFINER : s'exécute avec les privilèges du créateur (postgres)
--   pour interroger admin_profiles sans récursion RLS.
-- - SET search_path = public, pg_temp : prévient les failles de détournement de schéma.
-- - STABLE : permet au planificateur de requêtes de mettre en cache le résultat
--   au sein d'une même instruction SQL, améliorant considérablement les performances.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Révocation de PUBLIC et attribution explicite aux rôles anon et authenticated
-- (anon doit pouvoir évaluer is_admin() dans les politiques SELECT sans erreur 42501)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Sécurisation du trigger updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. ATTRIBUTION DES PRIVILÈGES TABLES POSTGRESQL (GRANT / REVOKE)
-- ------------------------------------------------------------------------------

-- 3.1 Table categories
-- anon : lecture seule
GRANT SELECT ON public.categories TO anon;
-- authenticated : lecture, insertion, mise à jour, suppression (filtrées par RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

-- 3.2 Table products
-- anon : lecture seule
GRANT SELECT ON public.products TO anon;
-- authenticated : lecture, insertion, mise à jour, suppression (filtrées par RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

-- 3.3 Table product_images
-- anon : lecture seule
GRANT SELECT ON public.product_images TO anon;
-- authenticated : lecture, insertion, mise à jour, suppression (filtrées par RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;

-- 3.4 Table admin_profiles
-- SÉCURITÉ CRITIQUE : aucun privilège pour le rôle public anon
REVOKE ALL ON public.admin_profiles FROM anon;
-- authenticated : lecture et gestion sous contrôle strict RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO service_role;

-- 3.5 Séquences PostgreSQL dans le schéma public
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 4. POLITIQUES ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

-- Ré-activation explicite du RLS sur l'ensemble des tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4.1 POLITIQUES : CATEGORIES
-- ------------------------------------------------------------------------------
-- Lecture : les catégories actives sont publiques ; les admins voient tout
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

-- Insertion : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Mise à jour : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Suppression : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4.2 POLITIQUES : PRODUCTS
-- ------------------------------------------------------------------------------
-- Lecture : les produits publiés sont visibles par tous ; les admins voient tout
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (visibility = 'published' OR public.is_admin());

-- Insertion : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Mise à jour : réservée aux administrateurs vérifiés (modification et masquage soft delete)
DROP POLICY IF EXISTS "Admins can update products (including soft delete/visibilité)" ON public.products;
CREATE POLICY "Admins can update products (including soft delete/visibilité)"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Suppression : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- Attribution automatique du créateur du produit
ALTER TABLE public.products ALTER COLUMN created_by SET DEFAULT auth.uid();

-- ------------------------------------------------------------------------------
-- 4.3 POLITIQUES : PRODUCT_IMAGES
-- ------------------------------------------------------------------------------
-- Lecture : les images de produits publiés sont visibles par tous ; les admins voient tout
DROP POLICY IF EXISTS "Public can view images of published products" ON public.product_images;
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

-- Administration complète des images : réservée aux administrateurs vérifiés
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4.4 POLITIQUES : ADMIN_PROFILES
-- ------------------------------------------------------------------------------
-- Lecture : un utilisateur connecté peut lire son propre profil admin (pour valider sa session)
-- ou un administrateur déjà vérifié peut lire l'ensemble des profils
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

-- Insertion : seuls les administrateurs peuvent ajouter un nouveau compte d'administration
DROP POLICY IF EXISTS "Admins can insert admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can insert admin profiles"
    ON public.admin_profiles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Mise à jour : seuls les administrateurs peuvent modifier les informations d'un compte admin
DROP POLICY IF EXISTS "Admins can update admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can update admin profiles"
    ON public.admin_profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Suppression : seuls les administrateurs peuvent révoquer un profil admin (sauf le leur pour éviter tout blocage)
DROP POLICY IF EXISTS "Admins can delete admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can delete admin profiles"
    ON public.admin_profiles FOR DELETE
    TO authenticated
    USING (public.is_admin() AND id <> auth.uid());

-- ------------------------------------------------------------------------------
-- 5. POLITIQUES ROW LEVEL SECURITY : STORAGE (BUCKET product-images)
-- ------------------------------------------------------------------------------
-- Consultation publique des photos du catalogue
DROP POLICY IF EXISTS "Public can view product images bucket" ON storage.objects;
CREATE POLICY "Public can view product images bucket"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'product-images');

-- Téléversement (Upload) réservé aux administrateurs
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Mise à jour (Update/Remplacement) réservée aux administrateurs
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Suppression réservée aux administrateurs
DROP POLICY IF EXISTS "Admins can update and delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

