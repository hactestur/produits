import React from 'react';
import { ArrowDownUp } from 'lucide-react';

export type SortOption = 'newest' | 'name_asc' | 'price_asc' | 'price_desc';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="catalog-sort" className="sr-only">
        Trier les produits
      </label>
      <div className="absolute left-3.5 pointer-events-none text-forest-700">
        <ArrowDownUp className="w-4 h-4" aria-hidden="true" />
      </div>
      <select
        id="catalog-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="pl-10 pr-9 py-2.5 bg-white border border-cream-300 rounded-xl text-earth-800 text-sm sm:text-base font-semibold focus:outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-700/20 shadow-warm-xs appearance-none cursor-pointer min-h-[44px]"
      >
        <option value="newest">Nouveautés d'abord</option>
        <option value="name_asc">Nom (A → Z)</option>
        <option value="price_asc">Prix croissant (Moins cher)</option>
        <option value="price_desc">Prix décroissant (Plus cher)</option>
      </select>
      <div className="absolute right-3.5 pointer-events-none text-earth-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
