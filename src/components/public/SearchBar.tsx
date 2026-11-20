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
  placeholder = 'Rechercher un produit (ex : Riz parfumé, Huile raffinée, Tomate...)...',
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
        <div className="absolute left-4 pointer-events-none text-forest-700">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          id="catalog-search"
          type="search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-cream-50/70 border-2 border-cream-300 rounded-2xl text-earth-950 placeholder-earth-400 text-base sm:text-lg focus:outline-none focus:border-forest-800 focus:ring-4 focus:ring-gold-500/15 shadow-warm-xs transition-all min-h-[52px]"
          autoComplete="off"
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-2 text-earth-400 hover:text-earth-800 hover:bg-cream-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700"
            aria-label="Effacer la recherche"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
