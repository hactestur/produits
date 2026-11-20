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
        className="fixed inset-0 bg-forest-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-warm-xl flex flex-col border-l border-cream-200">
          {/* En-tête du tiroir de filtres */}
          <div className="p-5 sm:p-6 border-b border-cream-200 flex items-center justify-between bg-cream-50/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-forest-800 text-gold-400 rounded-xl shadow-warm-xs">
                <Filter className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="filter-title" className="text-xl font-serif font-black text-forest-950">
                  Filtrer les rayons
                </h2>
                <p className="text-xs text-earth-600 font-medium">
                  Affinez votre sélection Saveurs d'Or
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-earth-500 hover:text-forest-950 hover:bg-cream-200/60 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700"
              aria-label="Fermer les filtres"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Corps défilable des filtres */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Disponibilité */}
            <div>
              <label className="block text-sm font-bold text-forest-950 uppercase tracking-wider mb-3">
                Disponibilité en entrepôt
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { value: 'all', label: 'Tous les produits' },
                  { value: 'in_stock', label: 'En stock à Makepe Missoke uniquement' },
                  { value: 'out_of_stock', label: 'Produits en cours de réapprovisionnement' },
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
                          ? 'border-forest-700 bg-forest-50 text-forest-950 font-bold ring-1 ring-forest-700'
                          : 'border-cream-300 bg-white text-earth-700 hover:bg-cream-50'
                      }`}
                    >
                      <span className="text-sm">{item.label}</span>
                      {isChecked && <Check className="w-5 h-5 text-forest-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="filter-category" className="block text-sm font-bold text-forest-950 uppercase tracking-wider mb-2">
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
                className="w-full p-3.5 bg-white border border-cream-300 rounded-xl text-earth-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest-700 min-h-[48px]"
              >
                <option value="all">Tous les rayons confondus</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tranche de prix en FCFA */}
            <div>
              <label className="block text-sm font-bold text-forest-950 uppercase tracking-wider mb-2">
                Prix unitaire indicatif (en FCFA)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="min-price" className="block text-[11px] font-bold text-earth-500 mb-1">
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
                    className="w-full p-3 bg-white border border-cream-300 rounded-xl text-earth-950 text-sm font-semibold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-[11px] font-bold text-earth-500 mb-1">
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
                    className="w-full p-3 bg-white border border-cream-300 rounded-xl text-earth-950 text-sm font-semibold min-h-[48px] focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pied du tiroir : actions */}
          <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50/80 shrink-0 space-y-2.5">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleApply}
              className="w-full shadow-warm-md font-bold"
            >
              Afficher les {totalFilteredCount} produit{totalFilteredCount > 1 ? 's' : ''}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full text-earth-700 font-semibold"
            >
              Réinitialiser tous les filtres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
