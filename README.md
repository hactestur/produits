# 🛒 Saveurs d'Or — Catalogue Alimentaire Évolutif

Application web moderne, accessible et responsive conçue pour présenter un catalogue de produits alimentaires en Francs CFA (FCFA), avec un espace public pour les clients et un espace d'administration sécurisé.

Cette application constitue la **Version 1** d'un projet évolutif conçu pour progresser vers :
1. **V1 (Actuelle) :** Catalogue public de produits alimentaires + Administration complète.
2. **V2 (Prévue) :** Prise de commandes avec coordonnées client et validation administrateur.
3. **V3 (Prévue) :** Plateforme e-commerce intégrale (panier, paiements, livraisons, suivi des achats).

---

## 🚀 Fonctionnalités Implémentées

### 1. Espace Public (Clients)
- **Consultation sans compte :** Découverte immédiate de l'ensemble des denrées alimentaires.
- **Affichage des prix en FCFA :** Montants entiers formatés avec séparateurs d'espaces (`18 500 FCFA`).
- **Recherche réactive :** Recherche insensible à la casse sur les noms et descriptions, avec temporisation (debounce) et bouton d'effacement rapide.
- **Catégories dynamiques :** Filtre par famille de produits avec défilement tactile fluide sur mobile et compteur en temps réel.
- **Tiroir de filtres accessible :**
  - Filtrage par famille de produits.
  - Filtrage par disponibilité (Tous, Disponibles uniquement, En rupture).
  - Tranches de prix minimum et maximum en FCFA.
  - Boutons « Afficher les résultats » et « Réinitialiser ».
- **Tri multi-critères :** Nouveautés d'abord, ordre alphabétique (A → Z), prix croissant, prix décroissant.
- **Fiche détaillée d'un produit :**
  - Galerie photos avec zoom sur la photo principale et sélecteur de miniatures.
  - Avertissement clair en cas de rupture : « Actuellement en rupture de stock ».
  - Prise de contact direct par appel téléphonique et bouton WhatsApp pré-rempli.
- **Accessibilité & Mobile-First :** Zones tactiles d'au moins 48px, contrastes élevés (WCAG 2.2 AA), navigation au clavier et lecteurs d'écran.

### 2. Espace Administrateur Sécurisé
- **Authentification forte :** Connexion par e-mail et mot de passe via Supabase Auth + vérification du rôle dans `admin_profiles`. Aucune inscription publique libre.
- **Tableau de bord (Dashboard) :** 5 indicateurs calculés en temps réel (Total enregistrés, Publiés, Disponibles, En rupture, Masqués).
- **Gestion des Produits (CRUD & Soft Delete) :**
  - Création et modification complète des articles.
  - Gestionnaire multi-photos avec désignation de la photo principale.
  - Bascule rapide de disponibilité (`in_stock` / `out_of_stock`).
  - **Suppression logique (Masquage / Soft delete) :** Un produit masqué disparaît instantanément du catalogue public tout en conservant son historique, ses photos et ses caractéristiques. Il peut être réactivé à tout moment.
- **Gestion des Catégories :**
  - Création, modification, ordre d'affichage, activation / désactivation.
  - Protection contre les orphelins : désactiver une catégorie conserve intacts ses produits existants.

---

## 🛠️ Stack Technique

- **Frontend :** React 19, TypeScript (mode strict), Vite 8.
- **Styles :** Tailwind CSS avec palette personnalisée `brand` (verts profonds alimentaires) et `surface-light` (tons neutres chaleureux).
- **Navigation :** React Router v7.
- **Icônes :** Lucide React.
- **Formulaires & Validations :** React Hook Form + Zod (schémas de validation stricts).
- **Backend & Base de données :** Supabase (PostgreSQL 15+, Auth, Storage, Row Level Security - RLS).

---

## 📦 Installation et Démarrage

### Prérequis
- Node.js (version 20 ou supérieure recommandée)
- npm ou pnpm

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement en développement local
```bash
npm run dev
```
L'application démarre sur `http://localhost:5173`.

### 3. Compilation de production
```bash
npm run build
```
Le bundle optimisé est généré dans le dossier `dist/`.

---

## 🔑 Mode Démo Local vs Supabase

Pour vous permettre d'évaluer et de tester immédiatement l'application sans créer de projet Supabase au préalable :
- **Mode Démo Local actif par défaut** : Si aucun fichier `.env` avec les identifiants Supabase n'est détecté, l'application fonctionne avec un stockage local persistant (`localStorage`) et un jeu de données alimentaires réalistes (Riz, Huiles, Farines, Tomates...).
- **Compte Administrateur de Démo :**
  - **Email :** `admin@saveursdor.ci`
  - **Mot de passe :** `admin123`

---

## 🌐 Configuration avec Supabase

Lorsque vous souhaitez connecter votre projet Supabase en production :

### 1. Variables d'environnement
Créez un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
```

### 2. Application de la migration SQL
Dans votre console Supabase, ouvrez le **SQL Editor** et exécutez le script situé dans :
`supabase/migrations/20260228000000_initial_food_catalog_schema.sql`

Ce script configure :
1. Les tables `categories`, `products`, `product_images`, `admin_profiles`.
2. Les index de performance pour les recherches et filtres.
3. Les politiques de sécurité **Row Level Security (RLS)** pour le public et les admins.
4. Le bucket Supabase Storage `product-images`.

*(Optionnel)* Pour charger les données d'exemple en base, exécutez le fichier `supabase/seed.sql`.

### 3. Création sécurisée du premier administrateur
Pour créer le premier administrateur :
1. Dans la console Supabase, rendez-vous dans **Authentication** > **Users** > **Add User** (Create User).
2. Saisissez l'email de l'administrateur (ex: `directeur@saveursdor.ci`) et définissez un mot de passe fort.
3. Copiez l'**User UID** généré (ex: `a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
4. Dans le **SQL Editor**, attribuez-lui le rôle administrateur :
```sql
INSERT INTO public.admin_profiles (id, email, role, full_name)
VALUES (
  'VOTRE_USER_UID_ICI',
  'directeur@saveursdor.ci',
  'admin',
  'Directeur Commercial'
);
```

Dès cette étape validée, ce compte peut se connecter via la page `/admin/login`.

---

## 🛡️ Règles de Sécurité RLS

- **Catalogue Public (`anon`) :** Lecture seule des produits ayant `visibility = 'published'` et des catégories ayant `is_active = true`. Aucune insertion, modification ou suppression n'est permise.
- **Espace Administration (`authenticated + is_admin()`) :** Vérification stricte via la fonction SQL `public.is_admin()`. Un simple utilisateur connecté sans enregistrement dans `admin_profiles` ne peut modifier aucune donnée.
- **Stockage Photos :** Lecture publique des objets dans `product-images`, envoi et suppression réservés aux administrateurs autorisés.

---

## 📋 Critères d'Acceptation Validés

- [x] Consultation fluide du catalogue public sans authentification.
- [x] Recherche textuelle insensible à la casse avec debounce et bouton effacer.
- [x] Filtres par famille, disponibilité et prix en FCFA.
- [x] Fiche produit avec galerie d'images et statut d'indisponibilité transparent.
- [x] Authentification administrateur sécurisée (Supabase Auth + fallback démo documenté).
- [x] Tableau de bord calculant les 5 indicateurs réels.
- [x] Gestion des produits (Création, modification, multi-photos, désignation photo principale).
- [x] Gestion du masquage (Soft Delete) avec fenêtre de confirmation explicite.
- [x] Gestion des catégories avec prévention des doublons et protection des produits existants.
- [x] Responsive testé pour smartphone, tablette et écran de bureau.
- [x] Typage TypeScript strict et compilation de production `npm run build` validée à 100%.
