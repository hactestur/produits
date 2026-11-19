import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import type { Category } from '../../types/category';
import type { ProductAvailability } from '../../types/product';
import { Button } from '../common/Button';

export interface FilterState {
  categoryId: string;
  availability: 'all' | ProductAvailability;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  currentFilters,
  onApplyFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  // État local dans le tiroir pour permettre la modification puis validation explicite
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      {/* Arrière-plan semi-transparent */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* En-tête du tiroir de filtres */}
          <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-100 text-brand-800 rounded-xl">
                <Filter className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="filter-title" className="text-xl font-bold text-stone-900">
                  Filtrer les produits
                </h2>
                <p className="text-xs text-stone-500">
                  Affinez votre sélection selon vos besoins
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label="Fermer les filtres"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Corps défilable des filtres */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Disponibilité */}
            <div>
              <label className="block text-base font-bold text-stone-900 mb-3">
                Disponibilité du produit
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { value: 'all', label: 'Tous les produits' },
                  { value: 'in_stock', label: 'Produits disponibles uniquement' },
                  { value: 'out_of_stock', label: 'Produits en rupture de stock' },
                ].map((item) => {
                  const isChecked = localFilters.availability === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          availability: item.value as 'all' | ProductAvailability,
                        }))
                      }
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all min-h-[48px] ${
                        isChecked
                          ? 'border-brand-700 bg-brand-50/70 text-brand-900 font-semibold ring-1 ring-brand-700'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-base">{item.label}</span>
                      {isChecked && <Check className="w-5 h-5 text-brand-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="filter-category" className="block text-base font-bold text-stone-900 mb-2">
                Famille de produits
              </label>
              <select
                id="filter-category"
                value={localFilters.categoryId}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                className="w-full p-3.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand-700 min-h-[48px]"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tranche de prix en FCFA */}
            <div>
              <label className="block text-base font-bold text-stone-900 mb-2">
                Prix indicatif (en FCFA)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="min-price" className="block text-xs font-medium text-stone-500 mb-1">
                    Prix Minimum (FCFA)
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="500"
                    placeholder="Ex : 1000"
                    value={localFilters.minPrice || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-xs font-medium text-stone-500 mb-1">
                    Prix Maximum (FCFA)
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="500"
                    placeholder="Ex : 50000"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full p-3 bg-white border border-stone-300 rounded-xl text-stone-900 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pied du tiroir : actions */}
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 shrink-0 space-y-2.5">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleApply}
              className="w-full shadow-md"
            >
              Afficher les résultats ({totalFilteredCount})
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full text-stone-600"
            >
              Réinitialiser tous les filtres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
