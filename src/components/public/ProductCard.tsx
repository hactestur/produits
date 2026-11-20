import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';
import { AvailabilityBadge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { ImageOff, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  const isOutOfStock = product.availability === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-cream-200 hover:border-gold-500/70 shadow-warm-xs hover:shadow-warm-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer active:scale-[0.995] focus-within:ring-2 focus-within:ring-forest-700"
    >
      {/* Zone Image */}
      <div className="relative aspect-4/3 w-full bg-cream-100/50 overflow-hidden">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-70 grayscale-25' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-earth-400 bg-cream-50">
            <ImageOff className="w-10 h-10 mb-2 stroke-[1.5]" aria-hidden="true" />
            <span className="text-xs font-medium">Photo Saveurs d'Or</span>
          </div>
        )}

        {/* Badge disponibilité en superposition sur l'image */}
        <div className="absolute top-3 left-3 z-10">
          <AvailabilityBadge availability={product.availability} size="sm" />
        </div>

        {/* Catégorie en haut à droite */}
        {product.category && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-forest-950/85 text-gold-300 border border-forest-800/80 backdrop-blur-xs shadow-warm-xs">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Conditionnement en bandeau bas d'image */}
        {product.packaging && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/95 text-earth-800 shadow-warm-xs border border-cream-300 backdrop-blur-xs">
              {product.packaging}
            </span>
          </div>
        )}
      </div>

      {/* Zone Informations Produit */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Référence SKU si existante */}
          {product.sku && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-earth-400 block mb-1">
              Réf : {product.sku}
            </span>
          )}

          {/* Nom du produit */}
          <h3 className="text-base sm:text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* Courte description */}
          {product.short_description && (
            <p className="mt-1.5 text-xs sm:text-sm text-earth-600 line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Prix et Boutons d'action */}
        <div className="mt-4 pt-3.5 border-t border-cream-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-earth-500 font-bold uppercase tracking-wider block">Prix unitaire</span>
            <span className="text-lg sm:text-xl font-black text-forest-900 font-serif tracking-tight">
              {formatFCFA(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bouton Consulter détails */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-earth-800 font-bold text-xs transition-colors min-h-[40px] flex items-center gap-1.5 border border-cream-200"
              aria-label={`Détails de ${product.name}`}
            >
              <Eye className="w-4 h-4 text-forest-700" />
              <span className="hidden sm:inline">Détails</span>
            </button>

            {/* Bouton Ajouter au Panier */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 min-h-[40px] shadow-warm-xs ${
                isOutOfStock
                  ? 'bg-cream-100 text-earth-400 cursor-not-allowed border border-cream-200'
                  : justAdded
                  ? 'bg-forest-600 text-white'
                  : 'bg-forest-800 hover:bg-forest-700 active:scale-95 text-white shadow-warm-sm border border-forest-900/30'
              }`}
              aria-label={
                isOutOfStock
                  ? 'Produit en rupture de stock'
                  : `Ajouter ${product.name} au panier`
              }
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-gold-300" />
                  <span>Ajouté</span>
                </>
              ) : isOutOfStock ? (
                <span>Rupture</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
