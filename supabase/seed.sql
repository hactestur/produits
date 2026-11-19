-- ==============================================================================
-- SEED DATA : supabase/seed.sql
-- Données initiales réalistes pour le catalogue alimentaire en FCFA
-- ==============================================================================

-- 1. CATÉGORIES
INSERT INTO public.categories (id, name, slug, description, is_active, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Riz, Pâtes & Céréales', 'riz-pates-cereales', 'Riz parfumé, brisures de qualité, spaghettis, couscous et céréales de base.', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Huiles & Matières grasses', 'huiles-matieres-grasses', 'Huiles végétales raffinées, huiles de palme certifiées, beurre et margarine.', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Conserves & Produits emballés', 'conserves-produits-emballes', 'Concentrés de tomates, sardines, thon, petits pois et légumes en boîte.', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Farines, Sucres & Épicerie', 'farines-sucres-epicerie', 'Farines de blé, sucres en morceaux et poudre, sels iodés, épices et bouillons.', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Boissons & Produits laitiers', 'boissons-produits-laitiers', 'Laits en poudre, laits concentrés, jus de fruits naturels, sodas et eaux minérales.', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Produits Frais & Condiments', 'produits-frais-condiments', 'Oignons, ail, pommes de terre, sauces et assaisonnements traditionnels.', true, 6)
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUITS
INSERT INTO public.products (id, name, slug, short_description, description, price, category_id, availability, visibility)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Riz Parfumé Brisé Dinor — Sac 25 kg',
    'riz-parfume-brise-dinor-25kg',
    'Riz blanc parfumé 100% brisé de qualité supérieure, cuisson tendre et parfum naturel.',
    'Le riz parfumé brisé Dinor est sélectionné auprès des meilleurs terroirs. Idéal pour les repas de famille, les restaurants et les cérémonies. Grains triés, sans impuretés, offrant une cuisson uniforme et savoureuse.',
    18500,
    'c1000000-0000-0000-0000-000000000001',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Huile Végétale Raffinée Dinor — Bidon 5 Litres',
    'huile-vegetale-raffine-dinor-5l',
    'Huile de table 100% végétale enrichie en Vitamines A et E, sans cholestérol.',
    'Huile de cuisson et friture de grande pureté. Résiste aux hautes températures sans fumer ni altérer la saveur des aliments. Idéale pour les beignets, sauces graines et sautés quotidiens.',
    7800,
    'c1000000-0000-0000-0000-000000000002',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Pâte de Tomate Double Concentrée Gino — Carton de 50 boîtes 70g',
    'pate-tomate-gino-carton-50x70g',
    'Double concentré de tomate rouge vif, texture épaisse et acidité équilibrée.',
    'Idéale pour donner une couleur éclatante et un goût riche à vos sauces, ragoûts, pâtes et riz au gras. Emballage scellé garantissant une longue conservation.',
    8500,
    'c1000000-0000-0000-0000-000000000003',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Spaghetti Maman — Carton de 20 paquets de 500g',
    'spaghetti-maman-carton-20x500g',
    'Pâtes alimentaires à base de semoule de blé dur de premier choix.',
    'Cuisson ferme en 8 à 10 minutes. Ne colle pas, absorption optimale des sauces bolognaises, sauces tomates et soupes. Format familial très économique.',
    9200,
    'c1000000-0000-0000-0000-000000000001',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'Lait Concentré Sucré Bonnet Rouge — Carton de 48 boîtes 397g',
    'lait-concentre-sucre-bonnet-rouge-48x397g',
    'Lait entier concentré sucré onctueux pour le petit déjeuner et pâtisseries.',
    'La référence incontournable pour le café, le thé, la bouillie de mil, le gâteau et les desserts gourmands. Riche en calcium et nutriments essentiels.',
    36000,
    'c1000000-0000-0000-0000-000000000005',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Farine de Blé Panifiable Grands Moulins — Sac 50 kg',
    'farine-ble-panifiable-sac-50kg',
    'Farine de type 55 extra blanche pour boulangerie, pâtisserie et beignets.',
    'Qualité meunière certifiée. Pouvoir de levée élevé, mie légère et aérée. Conçue pour les professionnels de la boulangerie et les traiteurs.',
    24500,
    'c1000000-0000-0000-0000-000000000004',
    'in_stock',
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'Huile d’Olive Vierge Extra — Carton de 12 bouteilles de 1 Litre',
    'huile-olive-vierge-extra-carton-12x1l',
    'Première pression à froid, fruité mûr et arôme délicat.',
    'Produit premium importé. Parfaite pour les assaisonnements de salades, poissons grillés et marinades diététiques.',
    48000,
    'c1000000-0000-0000-0000-000000000002',
    'out_of_stock', -- Produit en rupture pour tester l'alerte
    'published'
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Piment Bec d’Oiseau Séché — Carton 10 kg',
    'piment-bec-oiseau-seche-10kg',
    'Piment très fort séché au soleil, réservé pour la transformation industrielle.',
    'Produit masqué temporairement du catalogue public.',
    32000,
    'c1000000-0000-0000-0000-000000000006',
    'in_stock',
    'hidden' -- Produit masqué (soft deleted)
  )
ON CONFLICT (id) DO NOTHING;

-- 3. PHOTOS INITIALES ASSOCIÉES
INSERT INTO public.product_images (id, product_id, storage_path, alt_text, display_order, is_primary)
VALUES
  ('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'Sac de riz blanc parfumé', 0, true),
  ('i1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', 'Bouteille d’huile de table', 0, true),
  ('i1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Pâte de tomate concentrée', 0, true),
  ('i1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', 'Spaghettis en paquet', 0, true),
  ('i1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', 'Lait entier de qualité', 0, true),
  ('i1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 'Farine de blé tamisée', 0, true),
  ('i1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80', 'Bouteille huile d’olive', 0, true),
  ('i1000000-0000-0000-0000-000000000008', 'p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80', 'Piments forts séchés', 0, true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 4. PROFIL ADMINISTRATEUR INITIAL (PROCÉDURE SÉCURISÉE)
-- ==============================================================================
-- Le rôle administrateur est strictement réservé aux utilisateurs enregistrés
-- dans la table public.admin_profiles et liés à un compte valide dans auth.users.
--
-- Pour initialiser votre premier compte administrateur :
-- 1. Créez un compte dans l'onglet Authentication de votre projet Supabase (ex: admin@saveursdor.ci).
-- 2. Copiez l'UUID de l'utilisateur généré par Supabase Auth.
-- 3. Exécutez la commande suivante dans l'éditeur SQL de Supabase :
--
-- INSERT INTO public.admin_profiles (id, email, role, full_name)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Remplacer par l'UUID réel auth.users
--   'admin@saveursdor.ci',
--   'admin',
--   'Administrateur Saveurs d’Or'
-- ) ON CONFLICT (id) DO UPDATE SET role = 'admin';

