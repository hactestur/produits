import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '../../types/category';
import { categoryFormSchema } from '../../utils/validators';
import type { CategoryFormData } from '../../utils/validators';
import { categoriesService } from '../../services/categoriesService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FolderPlus, Edit2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onRefreshCategories: () => Promise<void>;
  productCountsByCategory: Record<string, number>;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRefreshCategories,
  productCountsByCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      display_order: 0,
      is_active: true,
    },
  });

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setFormError(null);
    reset({
      name: category.name,
      description: category.description || '',
      display_order: category.display_order,
      is_active: category.is_active,
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormError(null);
    reset({
      name: '',
      description: '',
      display_order: categories.length + 1,
      is_active: true,
    });
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Vérifier les doublons de nom (insensible à la casse)
      const isDuplicate = categories.some(
        (c) =>
          c.name.toLowerCase() === data.name.trim().toLowerCase() &&
          (!editingCategory || c.id !== editingCategory.id)
      );

      if (isDuplicate) {
        throw new Error('Une catégorie avec ce nom existe déjà.');
      }

      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, data);
      } else {
        await categoriesService.createCategory(data);
      }

      await onRefreshCategories();
      handleCancelEdit();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de l’opération.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      const associatedProductsCount = productCountsByCategory[cat.id] || 0;
      if (cat.is_active && associatedProductsCount > 0) {
        // Avertissement informatif : les produits existants restent conservés
        const confirmDeactivation = window.confirm(
          `Attention : Cette catégorie contient ${associatedProductsCount} produit(s).\n` +
          `Désactiver cette catégorie la masquera du catalogue public et empêchera la création de nouveaux produits dans cette catégorie.\n\n` +
          `Les ${associatedProductsCount} produits existants seront conservés intacts en base de données.\n\n` +
          `Souhaitez-vous continuer ?`
        );
        if (!confirmDeactivation) return;
      }

      await categoriesService.toggleCategoryStatus(cat.id, !cat.is_active);
      await onRefreshCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Échec de la modification du statut.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestion des Familles / Catégories"
      description="Créez et organisez les catégories de produits. Une catégorie désactivée conserve ses produits existants mais n'est plus proposée pour de nouvelles créations."
      maxWidth="2xl"
    >
      <div className="space-y-8">
        {/* Formulaire d'ajout / modification */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-brand-700" />
            <span>{editingCategory ? `Modifier : ${editingCategory.name}` : 'Ajouter une nouvelle catégorie'}</span>
          </h3>

          {formError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  placeholder="Ex : Épices & Condiments"
                  {...register('name')}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-brand-700"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('display_order')}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Description (Optionnelle)
              </label>
              <input
                type="text"
                placeholder="Courte description de cette famille d'aliments"
                {...register('description')}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-brand-700"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-4 h-4 text-brand-700 rounded-md focus:ring-brand-700 border-stone-300"
                />
                <span className="text-sm font-semibold text-stone-800">
                  Catégorie active et visible
                </span>
              </label>

              <div className="flex items-center gap-2">
                {editingCategory && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Annuler
                  </Button>
                )}
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  {editingCategory ? 'Mettre à jour' : 'Ajouter la catégorie'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Liste des catégories existantes */}
        <div>
          <h3 className="text-base font-bold text-stone-900 mb-3">
            Catégories existantes ({categories.length})
          </h3>
          <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden bg-white">
            {categories.map((cat) => {
              const count = productCountsByCategory[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 text-base">{cat.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                        {count} produit{count > 1 ? 's' : ''}
                      </span>
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300">
                          <XCircle className="w-3.5 h-3.5" /> Désactivée
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors min-h-[36px] ${
                        cat.is_active
                          ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                          : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      {cat.is_active ? 'Désactiver' : 'Réactiver'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                      title="Modifier cette catégorie"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
