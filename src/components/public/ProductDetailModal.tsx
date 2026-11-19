import React, { useState, useEffect } from 'react';
import type { Product, ProductImage } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';
import { AvailabilityBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { X, ArrowLeft, ImageOff, AlertTriangle, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    if (product && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary) || product.images[0];
      setSelectedImage(primary);
    } else {
      setSelectedImage(null);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.availability === 'out_of_stock';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]">
        {/* Barre supérieure avec bouton retour */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 bg-stone-50/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-stone-700 hover:text-brand-800 font-medium text-sm sm:text-base px-3 py-2 rounded-xl hover:bg-stone-200/60 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Retour au catalogue</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            aria-label="Fermer la fiche produit"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Contenu de la fiche produit */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Galerie de photos */}
            <div className="flex flex-col gap-4">
              {/* Photo principale sélectionnée */}
              <div className="relative aspect-4/3 w-full rounded-2xl bg-stone-100 overflow-hidden border border-stone-200/80 shadow-inner">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <ImageOff className="w-12 h-12 mb-2 stroke-[1.5]" aria-hidden="true" />
                    <span className="text-sm font-medium">Aucune photo disponible</span>
                  </div>
                )}

                {/* Badge disponibilité */}
                <div className="absolute top-4 left-4 z-10">
                  <AvailabilityBadge availability={product.availability} size="md" />
                </div>
              </div>

              {/* Miniatures des autres photos (si multi-photos) */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {product.images.map((img) => {
                    const isSelected = selectedImage?.id === img.id;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                          isSelected
                            ? 'border-brand-700 ring-2 ring-brand-700/20 scale-105'
                            : 'border-stone-200 opacity-70 hover:opacity-100'
                        }`}
                        aria-label="Afficher cette photo"
                      >
                        <img
                          src={img.url}
                          alt={img.alt_text || product.name}
                          className="w-full h-full object-cover"
                        />
                        {img.is_primary && (
                          <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-[10px] text-white text-center py-0.5">
                            Principale
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Informations détaillées */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                {/* Catégorie */}
                {product.category && (
                  <div className="mb-2">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-md">
                      {product.category.name}
                    </span>
                  </div>
                )}

                {/* Nom complet */}
                <h1
                  id="product-detail-title"
                  className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight"
                >
                  {product.name}
                </h1>

                {/* Prix en FCFA */}
                <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs sm:text-sm text-stone-500 font-medium block">
                      Prix de vente indicatif
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-brand-800">
                      {formatFCFA(product.price)}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium bg-stone-200/80 px-2.5 py-1 rounded-md">
                    TTC en FCFA
                  </span>
                </div>

                {/* Message clair en cas de rupture de stock */}
                {isOutOfStock ? (
                  <div
                    className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 text-amber-900"
                    role="alert"
                  >
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-base">Actuellement en rupture de stock</p>
                      <p className="text-sm mt-0.5 text-amber-800 leading-relaxed">
                        Ce produit n'est pas disponible pour le moment. Vous pouvez nous contacter pour connaître la date du prochain réapprovisionnement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold">Produit actuellement disponible en entrepôt</span>
                  </div>
                )}

                {/* Description complète */}
                <div className="mt-6">
                  <h2 className="text-base font-bold text-stone-900 mb-2">Description du produit</h2>
                  <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
                    {product.description ||
                      product.short_description ||
                      'Aucune description complémentaire pour ce produit.'}
                  </p>
                </div>
              </div>

              {/* Contact direct entreprise */}
              <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${COMPANY_CONFIG.phone.replace(/\s+/g, '')}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base transition-all min-h-[48px] shadow-sm"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Renseignements : {COMPANY_CONFIG.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${COMPANY_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Bonjour, je souhaite des renseignements sur le produit : ${product.name} (${formatFCFA(product.price)})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all min-h-[48px] shadow-sm"
                >
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pied modal */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end shrink-0">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fermer la fiche
          </Button>
        </div>
      </div>
    </div>
  );
};
