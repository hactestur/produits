import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import type { Product, ProductAvailability, ProductVisibility } from '../../types/product';
import type { Category } from '../../types/category';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
import { AdminProductCard } from '../../components/admin/AdminProductCard';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/public/SearchBar';
import { Plus, RotateCcw, Package } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | ProductAvailability>(
    (searchParams.get('availability') as 'all' | ProductAvailability) || 'all'
  );
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | ProductVisibility>(
    (searchParams.get('visibility') as 'all' | ProductVisibility) || 'all'
  );

  // Modale Produit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Confirmation Soft Delete
  const [visibilityConfirmTarget, setVisibilityConfirmTarget] = useState<{
    product: Product;
    newVisibility: ProductVisibility;
  } | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productsService.getAllProductsAdmin({
          search,
          categoryId: categoryFilter,
          availability: availabilityFilter,
          visibility: visibilityFilter,
        }),
        categoriesService.getCategories(true),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Erreur chargement produits admin:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryFilter, availabilityFilter, visibilityFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
    setVisibilityFilter('all');
    setSearchParams({});
  };

  const handleEditProduct = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleToggleAvailability = async (
    product: Product,
    newStatus: ProductAvailability
  ) => {
    try {
      await productsService.toggleAvailability(product.id, newStatus);
      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur disponibilité');
    }
  };

  const handleRequestToggleVisibility = (
    product: Product,
    newVisibility: ProductVisibility
  ) => {
    setVisibilityConfirmTarget({ product, newVisibility });
  };

  const handleConfirmVisibilityToggle = async () => {
    if (!visibilityConfirmTarget) return;
    try {
      await productsService.toggleVisibility(
        visibilityConfirmTarget.product.id,
        visibilityConfirmTarget.newVisibility
      );
      setVisibilityConfirmTarget(null);
      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur masquage/publication');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Titre & Bouton d'action principal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Gestion du Catalogue Produits
            </h1>
            <p className="text-sm text-stone-600 mt-0.5">
              Administrez l'ensemble des articles, leurs photos, prix et visibilités
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleCreateProduct}
            icon={<Plus className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-md"
          >
            Nouveau Produit
          </Button>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par nom de produit..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Filtre Famille */}
            <div>
              <label htmlFor="admin-cat-filter" className="block text-xs font-bold text-stone-600 mb-1">
                Catégorie
              </label>
              <select
                id="admin-cat-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:ring-2 focus:ring-brand-700 min-h-[44px]"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Visibilité (Soft Delete) */}
            <div>
              <label htmlFor="admin-vis-filter" className="block text-xs font-bold text-stone-600 mb-1">
                Visibilité
              </label>
              <select
                id="admin-vis-filter"
                value={visibilityFilter}
                onChange={(e) =>
                  setVisibilityFilter(e.target.value as 'all' | ProductVisibility)
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:ring-2 focus:ring-brand-700 min-h-[44px]"
              >
                <option value="all">Tous (Publiés et Masqués)</option>
                <option value="published">Publiés uniquement</option>
                <option value="hidden">Masqués uniquement</option>
              </select>
            </div>

            {/* Filtre Disponibilité */}
            <div>
              <label htmlFor="admin-disp-filter" className="block text-xs font-bold text-stone-600 mb-1">
                Disponibilité
              </label>
              <select
                id="admin-disp-filter"
                value={availabilityFilter}
                onChange={(e) =>
                  setAvailabilityFilter(e.target.value as 'all' | ProductAvailability)
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:ring-2 focus:ring-brand-700 min-h-[44px]"
              >
                <option value="all">Tous les états</option>
                <option value="in_stock">En stock uniquement</option>
                <option value="out_of_stock">En rupture uniquement</option>
              </select>
            </div>
          </div>

          {(search || categoryFilter !== 'all' || visibilityFilter !== 'all' || availabilityFilter !== 'all') && (
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-xs text-stone-500 font-medium">
                {products.length} produit{products.length > 1 ? 's' : ''} correspondant{products.length > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-900 font-semibold p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            </div>
          )}
        </div>

        {/* Liste des Produits */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-brand-700 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-stone-600">Chargement des produits...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onToggleAvailability={handleToggleAvailability}
                onRequestToggleVisibility={handleRequestToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-6">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-stone-800">Aucun produit trouvé</h2>
            <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              Aucun produit ne correspond à vos critères de recherche actuels.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Formulaire Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        categories={categories}
        onSubmitSuccess={loadProducts}
        onSaveProduct={async (data, images) => {
          if (productToEdit) {
            await productsService.updateProduct(
              productToEdit.id,
              data,
              images.map((img, idx) => ({
                id: `img-${idx}`,
                product_id: productToEdit.id,
                storage_path: img.storage_path,
                url: img.url,
                alt_text: img.alt_text || data.name,
                display_order: idx,
                is_primary: img.is_primary,
                created_at: new Date().toISOString(),
              }))
            );
          } else {
            await productsService.createProduct(data, images);
          }
        }}
      />

      {/* Confirmation Masquage */}
      <ConfirmDialog
        isOpen={Boolean(visibilityConfirmTarget)}
        title={
          visibilityConfirmTarget?.newVisibility === 'hidden'
            ? 'Masquer ce produit du catalogue ?'
            : 'Rendre visible ce produit dans le catalogue ?'
        }
        message={
          visibilityConfirmTarget?.newVisibility === 'hidden'
            ? `Le produit « ${visibilityConfirmTarget?.product.name} » ne sera plus visible par les visiteurs. Ses informations, son prix et ses photos restent conservés en base et pourront être réactivés à tout moment.`
            : `Le produit « ${visibilityConfirmTarget?.product.name} » redeviendra immédiatement visible pour les clients du catalogue public.`
        }
        confirmLabel={
          visibilityConfirmTarget?.newVisibility === 'hidden'
            ? 'Confirmer le masquage'
            : 'Confirmer la publication'
        }
        isDestructive={visibilityConfirmTarget?.newVisibility === 'hidden'}
        onConfirm={handleConfirmVisibilityToggle}
        onCancel={() => setVisibilityConfirmTarget(null)}
      />
    </AdminLayout>
  );
};
