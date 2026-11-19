import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Filter, RotateCcw, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CataloguePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    categoryId: 'all',
    availability: 'all',
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Modal Fiche Détail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Chargement des données
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        categoriesService.getCategories(false), // Catégories actives uniquement
        productsService.getPublicProducts({
          search,
          categoryId: selectedCategory !== 'all' ? selectedCategory : advancedFilters.categoryId,
          availability: advancedFilters.availability,
          minPrice: advancedFilters.minPrice,
          maxPrice: advancedFilters.maxPrice,
          sortBy,
        }),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err: unknown) {
      console.error('Erreur chargement catalogue:', err);
      setError('Impossible de charger le catalogue de produits pour le moment. Veuillez vérifier votre connexion.');
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
  };

  // Appliquer les filtres du tiroir
  const handleApplyDrawerFilters = (newFilters: FilterState) => {
    setAdvancedFilters(newFilters);
    setSelectedCategory(newFilters.categoryId);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-900 text-xs sm:text-sm font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-brand-700" aria-hidden="true" />
            <span>Catalogue Alimentaire Officiel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Découvrez nos produits alimentaires
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            Consultez nos arrivages réguliers en céréales, huiles, farines, conserves et boissons. Tarifs en Francs CFA (FCFA) et disponibilités actualisés.
          </p>
        </section>

        {/* Barre de Recherche principale */}
        <section aria-label="Recherche">
          <SearchBar value={search} onChange={setSearch} />
        </section>

        {/* Barre des Catégories rapides */}
        <section aria-label="Familles de produits">
          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={handleSelectCategory}
            totalProductsCount={products.length}
          />
        </section>

        {/* Barre de Filtres et Tri */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsFilterDrawerOpen(true)}
              icon={<Filter className="w-4 h-4" />}
              className="relative shadow-xs"
              aria-label="Ouvrir le panneau des filtres"
            >
              <span>Filtrer les produits</span>
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-extrabold bg-brand-700 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {(activeFiltersCount > 0 || search || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-brand-800 font-medium px-2 py-2 min-h-[44px] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Effacer les filtres</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-sm font-semibold text-stone-600">
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
            <div className="py-16 px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-xs max-w-xl mx-auto my-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-700">
                <ShoppingBag className="w-8 h-8" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">
                Aucun produit ne correspond à votre recherche
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Essayez d'ajuster vos mots-clés, de sélectionner une autre famille de produits ou de réinitialiser vos filtres.
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

      {/* Fiche Détaillée d'un Produit */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <Footer />
    </div>
  );
};
