import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { SearchBar } from '../../components/public/SearchBar';
import { CategoryBar } from '../../components/public/CategoryBar';
import { SortSelect } from '../../components/public/SortSelect';
import type { SortOption } from '../../components/public/SortSelect';
import { FilterDrawer } from '../../components/public/FilterDrawer';
import type { FilterState } from '../../components/public/FilterDrawer';
import { ProductCard } from '../../components/public/ProductCard';
import { ProductDetailModal } from '../../components/public/ProductDetailModal';
import { SkeletonGrid } from '../../components/common/LoadingSpinner';
import { CartDrawer } from '../../components/cart/CartDrawer';
import { OrderRequestModal } from '../../components/cart/OrderRequestModal';
import { ToastNotification } from '../../components/common/ToastNotification';
import { COMPANY_CONFIG } from '../../config/company';
import {
  Filter,
  RotateCcw,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    categoryId: initialCategory,
    availability: 'all',
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Modal Fiche Détail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Synchronisation avec l'URL param si présent
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      setAdvancedFilters((prev) => ({ ...prev, categoryId: cat }));
    }
  }, [searchParams, selectedCategory]);

  // Chargement initial des catégories et de tous les produits pour les compteurs
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cats, allProds] = await Promise.all([
          categoriesService.getCategories(false),
          productsService.getPublicProducts(),
        ]);
        setCategories(cats);
        setAllProducts(allProds);

        // Calcul des compteurs réels par catégorie
        const counts: Record<string, number> = {};
        allProds.forEach((p) => {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Erreur initialisation catalogue:', err);
      }
    }
    loadInitialData();
  }, []);

  // Chargement des données filtrées
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prods = await productsService.getPublicProducts({
        search,
        categoryId: selectedCategory !== 'all' ? selectedCategory : advancedFilters.categoryId,
        availability: advancedFilters.availability,
        minPrice: advancedFilters.minPrice,
        maxPrice: advancedFilters.maxPrice,
        sortBy,
      });
      setProducts(prods);
    } catch (err: unknown) {
      console.error('Erreur chargement catalogue:', err);
      setError(
        'Impossible de charger le catalogue de produits pour le moment. Veuillez vérifier votre connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, advancedFilters, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.availability !== 'all') count++;
    if (advancedFilters.categoryId !== 'all') count++;
    if (advancedFilters.minPrice !== undefined && advancedFilters.minPrice > 0) count++;
    if (advancedFilters.maxPrice !== undefined && advancedFilters.maxPrice > 0) count++;
    return count;
  }, [advancedFilters]);

  // Gestion sélection catégorie via la barre rapide
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setAdvancedFilters((prev) => ({ ...prev, categoryId: catId }));
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Appliquer les filtres du tiroir
  const handleApplyDrawerFilters = (newFilters: FilterState) => {
    setAdvancedFilters(newFilters);
    setSelectedCategory(newFilters.categoryId);
    if (newFilters.categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newFilters.categoryId);
    }
    setSearchParams(searchParams);
  };

  // Réinitialiser tous les filtres
  const handleResetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setAdvancedFilters({
      categoryId: 'all',
      availability: 'all',
      minPrice: undefined,
      maxPrice: undefined,
    });
    setSearchParams({});
  };

  // Ouvrir la fiche détaillée
  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-light">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Titre & Section d'accueil */}
        <section className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream-100 text-forest-900 border border-cream-300 text-xs sm:text-sm font-bold mb-1 shadow-warm-xs">
            <Sparkles className="w-4 h-4 text-gold-500" aria-hidden="true" />
            <span>Catalogue Officiel {COMPANY_CONFIG.brandName} par {COMPANY_CONFIG.parentCompany} • Douala</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-forest-950 tracking-tight">
            Catalogue & Rayons Alimentaires
          </h1>
          <p className="text-base sm:text-lg text-earth-700 max-w-3xl leading-relaxed">
            Consultez nos arrivages réguliers en riz parfumé, huiles végétales pures, conserves, farines, sucres et boissons. Tarifs directs grossiste en Francs CFA (FCFA) et stocks actualisés.
          </p>
        </section>

        {/* Note commerciale sans paiement */}
        <section className="p-4 rounded-2xl bg-cream-100/90 border border-cream-300 text-earth-950 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-warm-xs">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-forest-700 shrink-0" />
            <span className="leading-snug">
              <strong>Demandes de commande indicatives</strong> : Constituez votre panier sans paiement en ligne. Notre équipe commerciale valide la disponibilité et planifie le règlement et la livraison directement sur WhatsApp.
            </span>
          </div>
          <a
            href={`https://wa.me/${COMPANY_CONFIG.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-warm-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Échanger sur WhatsApp</span>
          </a>
        </section>

        {/* Barre de Recherche principale */}
        <section aria-label="Recherche">
          <SearchBar value={search} onChange={setSearch} />
        </section>

        {/* Barre des Catégories rapides avec compteurs réels */}
        <section aria-label="Familles de produits">
          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={handleSelectCategory}
            totalProductsCount={allProducts.length}
            categoryCounts={categoryCounts}
          />
        </section>

        {/* Barre de Filtres et Tri */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-cream-200">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsFilterDrawerOpen(true)}
              icon={<Filter className="w-4 h-4 text-forest-700" />}
              className="relative shadow-warm-xs"
              aria-label="Ouvrir le panneau des filtres"
            >
              <span>Filtrer les rayons</span>
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-black bg-forest-800 text-gold-300 rounded-full border border-forest-950">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {(activeFiltersCount > 0 || search || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1 text-sm text-earth-600 hover:text-forest-900 font-semibold px-2 py-2 min-h-[44px] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Effacer les filtres</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-sm font-bold text-earth-700">
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </span>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </section>

        {/* Gestion des erreurs de connexion */}
        {error && (
          <div
            className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-4"
            role="alert"
          >
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-base font-bold">Erreur de chargement</h2>
              <p className="mt-1 text-sm text-rose-700">{error}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadData}
                className="mt-3 bg-white"
              >
                Réessayer le chargement
              </Button>
            </div>
          </div>
        )}

        {/* Grille de Produits ou Squelettes */}
        <section aria-label="Liste des produits">
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleOpenDetail}
                />
              ))}
            </div>
          ) : (
            /* État vide */
            <div className="py-16 px-4 text-center bg-white rounded-3xl border border-cream-200 shadow-warm-xs max-w-xl mx-auto my-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-cream-100 rounded-2xl flex items-center justify-center text-forest-800 border border-cream-200">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-serif font-black text-forest-950 mb-2">
                Aucun produit ne correspond à votre sélection
              </h2>
              <p className="text-sm text-earth-600 leading-relaxed mb-6">
                Essayez d'ajuster vos mots-clés, de sélectionner un autre rayon ou de réinitialiser vos filtres.
              </p>
              <Button
                type="button"
                variant="primary"
                onClick={handleResetAllFilters}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Réinitialiser les filtres et voir tous les produits
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Panneau Latéral de Filtres */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        currentFilters={advancedFilters}
        onApplyFilters={handleApplyDrawerFilters}
        onResetFilters={handleResetAllFilters}
        totalFilteredCount={products.length}
      />

      {/* Fiche Détaillée d'un Produit avec Produits Similaires */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        allProducts={allProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Tiroir Panier & Modale de Commande */}
      <CartDrawer />
      <OrderRequestModal />
      <ToastNotification />

      <Footer />
    </div>
  );
};
