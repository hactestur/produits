import React from 'react';
import type { Category } from '../../types/category';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  totalProductsCount: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId = 'all',
  onSelectCategory,
  totalProductsCount,
}) => {
  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
        role="tablist"
        aria-label="Catégories de produits"
      >
        {/* Bouton "Tous les produits" */}
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === 'all'}
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 select-none ${
            selectedCategoryId === 'all'
              ? 'bg-brand-800 text-white shadow-sm ring-1 ring-brand-800'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Tous les produits</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              selectedCategoryId === 'all'
                ? 'bg-brand-900/60 text-brand-100'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {totalProductsCount}
          </span>
        </button>

        {/* Liste dynamique des catégories actives */}
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(category.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 select-none ${
                isSelected
                  ? 'bg-brand-800 text-white shadow-sm ring-1 ring-brand-800'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
