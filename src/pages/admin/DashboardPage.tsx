import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardStats } from '../../components/admin/DashboardStats';
import type { ProductKPIs, Product } from '../../types/product';
import type { Category } from '../../types/category';
import { productsService } from '../../services/productsService';
import { categoriesService } from '../../services/categoriesService';
import { AdminProductCard } from '../../components/admin/AdminProductCard';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { CategoryManagerModal } from '../../components/admin/CategoryManagerModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/common/Button';
import { Plus, FolderTree, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<ProductKPIs>({
    totalRegistered: 0,
    publishedCount: 0,
    availableCount: 0,
    outOfStockCount: 0,
    hiddenCount: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Dialogue de confirmation de masquage
  const [visibilityConfirmTarget, setVisibilityConfirmTarget] = useState<{
    product: Product;
    newVisibility: 'published' | 'hidden';
  } | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [kpisData, allProducts, allCategories] = await Promise.all([
        productsService.getProductKPIs(),
        productsService.getAllProductsAdmin(),
        categoriesService.getCategories(true),
      ]);

      setKpis(kpisData);
      setRecentProducts(allProducts.slice(0, 5)); // 5 produits récents
      setCategories(allCategories);

      // Calcul des comptages par catégorie
      const counts: Record<string, number> = {};
      allProducts.forEach((p) => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      });
      setProductCounts(counts);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Actions produits
  const handleEditProduct = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleToggleAvailability = async (product: Product, newStatus: 'in_stock' | 'out_of_stock') => {
    try {
      await productsService.toggleAvailability(product.id, newStatus);
      await loadDashboardData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur modification disponibilité');
    }
  };

  const handleRequestToggleVisibility = (product: Product, newVisibility: 'published' | 'hidden') => {
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
      await loadDashboardData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur modification visibilité');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Titre & Boutons d'actions rapides */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Tableau de bord de gestion
            </h1>
            <p className="text-sm text-stone-600 mt-0.5">
              Suivi en temps réel de votre catalogue alimentaire
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateProduct}
              icon={<Plus className="w-5 h-5" />}
              className="flex-1 sm:flex-initial shadow-md"
            >
              Nouveau Produit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              icon={<FolderTree className="w-4 h-4" />}
              className="flex-1 sm:flex-initial bg-white"
            >
              Catégories
            </Button>
          </div>
        </div>

        {/* Indicateurs clés (KPIs) calculés dynamiquement */}
        <section aria-label="Statistiques du catalogue">
          <DashboardStats kpis={kpis} isLoading={isLoading} />
        </section>

        {/* Section Récents Produits & Raccourcis */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Derniers produits enregistrés
              </h2>
              <p className="text-xs text-stone-500">
                Aperçu rapide avec modifications directes de statut
              </p>
            </div>
            <Link
              to="/admin/produits"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors p-2"
            >
              <span>Voir tous les produits ({kpis.totalRegistered})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onToggleAvailability={handleToggleAvailability}
                onRequestToggleVisibility={handleRequestToggleVisibility}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Modale de création / édition de produit */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        categories={categories}
        onSubmitSuccess={loadDashboardData}
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

      {/* Modale de gestion des catégories */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefreshCategories={loadDashboardData}
        productCountsByCategory={productCounts}
      />

      {/* Confirmation de masquage / soft delete */}
      <ConfirmDialog
        isOpen={Boolean(visibilityConfirmTarget)}
        title={
          visibilityConfirmTarget?.newVisibility === 'hidden'
            ? 'Masquer ce produit du catalogue public ?'
            : 'Republier ce produit dans le catalogue ?'
        }
        message={
          visibilityConfirmTarget?.newVisibility === 'hidden'
            ? `Le produit « ${visibilityConfirmTarget?.product.name} » ne sera plus visible par les visiteurs. Toutes ses données, prix et photos restent conservés en base et pourront être réactivés à tout moment.`
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
