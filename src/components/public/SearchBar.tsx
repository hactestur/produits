import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher un produit (ex : Riz, Huile, Tomate...)',
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Synchronisation si la valeur change de l'extérieur (ex: réinitialisation)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Temporisation (debounce) pour éviter des recalculs à chaque frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <label htmlFor="catalog-search" className="sr-only">
        Rechercher un produit alimentaire
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-stone-400">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          id="catalog-search"
          type="search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 text-base sm:text-lg focus:outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10 shadow-xs transition-all min-h-[52px]"
          autoComplete="off"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            aria-label="Effacer la recherche"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
