import React from 'react';
import type { Product, ProductAvailability, ProductVisibility } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';
import { AvailabilityBadge, VisibilityBadge } from '../common/Badge';
import { Edit2, Eye, EyeOff, CheckCircle2, AlertTriangle, ImageOff } from 'lucide-react';

interface AdminProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onToggleAvailability: (product: Product, newStatus: ProductAvailability) => void;
  onRequestToggleVisibility: (product: Product, newVisibility: ProductVisibility) => void;
}

export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  onEdit,
  onToggleAvailability,
  onRequestToggleVisibility,
}) => {
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  const isPublished = product.visibility === 'published';
  const isAvailable = product.availability === 'in_stock';

  return (
    <div
      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between gap-4 ${
        !isPublished ? 'border-dashed border-stone-300 bg-stone-50/70' : 'border-stone-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Photo Miniature */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              className={`w-full h-full object-cover ${!isPublished ? 'grayscale-40 opacity-80' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
              <ImageOff className="w-6 h-6 stroke-[1.5]" />
            </div>
          )}
          {product.images.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
              +{product.images.length - 1}
            </span>
          )}
        </div>

        {/* Détails Produit */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <VisibilityBadge visibility={product.visibility} size="sm" />
            <AvailabilityBadge availability={product.availability} size="sm" />
            {product.category && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                {product.category.name}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            {product.name}
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-brand-800">
              {formatFCFA(product.price)}
            </span>
          </div>

          {product.short_description && (
            <p className="mt-1 text-xs text-stone-500 line-clamp-1">
              {product.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Barre d'actions d'administration */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Bascule de disponibilité rapide */}
          <button
            type="button"
            onClick={() =>
              onToggleAvailability(
                product,
                isAvailable ? 'out_of_stock' : 'in_stock'
              )
            }
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors min-h-[40px] ${
              isAvailable
                ? 'border-amber-300 text-amber-900 bg-amber-50/60 hover:bg-amber-100'
                : 'border-emerald-300 text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100'
            }`}
          >
            {isAvailable ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Marquer en rupture</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rendre disponible</span>
              </>
            )}
          </button>

          {/* Bascule de visibilité (Soft delete / republish) */}
          <button
            type="button"
            onClick={() =>
              onRequestToggleVisibility(
                product,
                isPublished ? 'hidden' : 'published'
              )
            }
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors min-h-[40px] ${
              isPublished
                ? 'border-stone-300 text-stone-700 bg-stone-100 hover:bg-stone-200'
                : 'border-brand-300 text-brand-800 bg-brand-50 hover:bg-brand-100'
            }`}
            title={
              isPublished
                ? 'Masquer ce produit du catalogue public sans le supprimer'
                : 'Rendre ce produit à nouveau visible dans le catalogue public'
            }
          >
            {isPublished ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                <span>Masquer</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-brand-700" />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>

        {/* Bouton Modifier */}
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-brand-800 bg-stone-100 hover:bg-brand-50 px-3.5 py-2 rounded-xl transition-colors min-h-[40px]"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Modifier</span>
        </button>
      </div>
    </div>
  );
};
