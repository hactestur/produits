import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';
import { AvailabilityBadge } from '../common/Badge';
import { ImageOff, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  // Recherche de la photo principale, sinon la première image disponible
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  const isOutOfStock = product.availability === 'out_of_stock';

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-brand-600/60 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer active:scale-[0.99] focus-within:ring-2 focus-within:ring-brand-700"
    >
      {/* Zone Image */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-85 grayscale-25' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
            <ImageOff className="w-10 h-10 mb-2 stroke-[1.5]" aria-hidden="true" />
            <span className="text-xs font-medium">Photo non disponible</span>
          </div>
        )}

        {/* Badge disponibilité en superposition sur l'image */}
        <div className="absolute top-3 left-3 z-10 drop-shadow-xs">
          <AvailabilityBadge availability={product.availability} size="sm" />
        </div>

        {/* Catégorie en haut à droite */}
        {product.category && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900/80 text-white backdrop-blur-xs">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Zone Informations Produit */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nom du produit bien lisible et non tronqué */}
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-brand-800 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Courte description si disponible */}
          {product.short_description && (
            <p className="mt-2 text-sm text-stone-600 line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Prix en FCFA et Bouton d'action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-500 font-medium block">Prix unitaire</span>
            <span className="text-xl sm:text-2xl font-black text-brand-800 tracking-tight">
              {formatFCFA(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-brand-700 text-stone-800 hover:text-white font-medium text-sm transition-all duration-150 min-h-[44px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            aria-label={`Consulter la fiche détaillée de ${product.name}`}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>Détails</span>
          </button>
        </div>
      </div>
    </article>
  );
};
