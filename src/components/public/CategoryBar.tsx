import React from 'react';
import type { Category } from '../../types/category';
import { sanitizeCategoryName } from '../../utils/formatters';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  totalProductsCount: number;
  categoryCounts?: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId = 'all',
  onSelectCategory,
  totalProductsCount,
  categoryCounts = {},
}) => {
  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
        role="tablist"
        aria-label="Rayons et familles de produits alimentaires"
      >
        {/* Bouton "Tous les rayons" */}
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === 'all'}
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 select-none ${
            selectedCategoryId === 'all'
              ? 'bg-forest-900 text-white shadow-warm-sm border border-forest-950'
              : 'bg-white text-earth-700 hover:bg-cream-100 hover:text-forest-950 border border-cream-200 shadow-warm-xs'
          }`}
        >
          <span>Tous les rayons</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-black ${
              selectedCategoryId === 'all'
                ? 'bg-gold-500 text-forest-950'
                : 'bg-cream-100 text-earth-600'
            }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {/* Liste dynamique des catégories avec compteurs */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const count = categoryCounts[category.id];
          const cleanName = sanitizeCategoryName(category.name);

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(category.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 select-none ${
                isSelected
                  ? 'bg-forest-900 text-white shadow-warm-sm border border-forest-950'
                  : 'bg-white text-earth-700 hover:bg-cream-100 hover:text-forest-950 border border-cream-200 shadow-warm-xs'
              }`}
            >
              <span>{cleanName}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    isSelected
                      ? 'bg-gold-500 text-forest-950'
                      : 'bg-cream-100 text-earth-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
