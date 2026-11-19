import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import type { Category } from '../../types/category';
import { categoriesService } from '../../services/categoriesService';
import { productsService } from '../../services/productsService';
import { CategoryManagerModal } from '../../components/admin/CategoryManagerModal';
import { Button } from '../../components/common/Button';
import { FolderTree, Plus, CheckCircle2, XCircle, Edit2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allCats, allProds] = await Promise.all([
        categoriesService.getCategories(true),
        productsService.getAllProductsAdmin(),
      ]);

      setCategories(allCats);

      const counts: Record<string, number> = {};
      allProds.forEach((p) => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      });
      setProductCounts(counts);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (cat: Category) => {
    const count = productCounts[cat.id] || 0;
    if (cat.is_active && count > 0) {
      const confirmed = window.confirm(
        `Attention : Cette catégorie regroupe actuellement ${count} produit(s).\n\n` +
        `En la désactivant, elle ne sera plus proposée pour la création de nouveaux produits, mais ses ${count} produits existants sont scrupuleusement conservés en base.\n\n` +
        `Confirmez-vous la désactivation ?`
      );
      if (!confirmed) return;
    }

    try {
      await categoriesService.toggleCategoryStatus(cat.id, !cat.is_active);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur modification statut');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Familles & Catégories de Produits
            </h1>
            <p className="text-sm text-stone-600 mt-0.5">
              Organisez les rayons du catalogue alimentaire et contrôlez leur visibilité
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-md"
          >
            Nouvelle Catégorie
          </Button>
        </div>

        {/* Tableau / Cartes des catégories */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-brand-700 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-stone-600">Chargement des catégories...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-stone-200">
              {categories.map((cat) => {
                const count = productCounts[cat.id] || 0;
                return (
                  <div
                    key={cat.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-brand-50 text-brand-700 rounded-xl shrink-0 mt-0.5">
                        <FolderTree className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h2 className="text-lg font-bold text-stone-900">{cat.name}</h2>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
                            {count} produit{count > 1 ? 's' : ''} associé{count > 1 ? 's' : ''}
                          </span>
                          {cat.is_active ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-stone-600 font-bold bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-300">
                              <XCircle className="w-3.5 h-3.5 text-stone-500" /> Désactivée
                            </span>
                          )}
                        </div>
                        {cat.description && (
                          <p className="mt-1 text-sm text-stone-600 leading-relaxed max-w-2xl">
                            {cat.description}
                          </p>
                        )}
                        <span className="inline-block mt-2 text-xs text-stone-400 font-medium">
                          Ordre d'affichage : #{cat.display_order} • Slug : {cat.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat)}
                        className={`text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl border transition-colors min-h-[40px] ${
                          cat.is_active
                            ? 'border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100'
                            : 'border-emerald-300 text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {cat.is_active ? 'Désactiver' : 'Réactiver'}
                      </button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        icon={<Edit2 className="w-3.5 h-3.5" />}
                      >
                        Gérer
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <CategoryManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onRefreshCategories={loadData}
        productCountsByCategory={productCounts}
      />
    </AdminLayout>
  );
};
