import React, { useState, useEffect } from 'react';
import type { Product, ProductImage } from '../../types/product';
import { formatFCFA } from '../../utils/formatters';
import { AvailabilityBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import {
  X,
  ArrowLeft,
  ImageOff,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { COMPANY_CONFIG } from '../../config/company';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  allProducts = [],
  onSelectProduct,
}) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    if (product && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary) || product.images[0];
      setSelectedImage(primary);
    } else {
      setSelectedImage(null);
    }
    setQuantity(1);
    setJustAdded(false);
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

  // Produits similaires dans le même rayon
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const directWhatsAppUrl = `https://wa.me/${COMPANY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
    `Bonjour ${COMPANY_CONFIG.fullName}, je souhaite des informations sur le produit : ${product.name} (Réf: ${
      product.sku || 'REF'
    }, Prix: ${formatFCFA(product.price)}). Pouvez-vous me confirmer le stock disponible à Makepe Missoke ?`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-warm-xl overflow-hidden border border-cream-200 my-auto flex flex-col max-h-[92vh]">
        {/* Barre supérieure avec bouton retour */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cream-200 bg-cream-50/90 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-earth-700 hover:text-forest-900 font-bold text-sm sm:text-base px-3 py-2 rounded-xl hover:bg-cream-100 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700"
          >
            <ArrowLeft className="w-5 h-5 text-forest-700" aria-hidden="true" />
            <span>Retour au catalogue</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-earth-400 hover:text-forest-950 hover:bg-cream-100 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700"
            aria-label="Fermer la fiche produit"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Contenu de la fiche produit */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Colonne Galerie de photos */}
            <div className="flex flex-col gap-4">
              {/* Photo principale sélectionnée */}
              <div className="relative aspect-4/3 w-full rounded-2xl bg-cream-100/60 overflow-hidden border border-cream-300 shadow-inner">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-earth-400">
                    <ImageOff className="w-12 h-12 mb-2 stroke-[1.5]" aria-hidden="true" />
                    <span className="text-sm font-medium">Photo Saveurs d'Or</span>
                  </div>
                )}

                {/* Badge disponibilité */}
                <div className="absolute top-4 left-4 z-10">
                  <AvailabilityBadge availability={product.availability} size="md" />
                </div>

                {/* Conditionnement */}
                {product.packaging && (
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-forest-950/90 text-white backdrop-blur-xs shadow-warm-xs">
                      {product.packaging}
                    </span>
                  </div>
                )}
              </div>

              {/* Miniatures des autres photos */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {product.images.map((img) => {
                    const isSelected = selectedImage?.id === img.id;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 ${
                          isSelected
                            ? 'border-forest-800 ring-2 ring-forest-700/20 scale-105'
                            : 'border-cream-300 opacity-70 hover:opacity-100'
                        }`}
                        aria-label="Afficher cette photo"
                      >
                        <img
                          src={img.url}
                          alt={img.alt_text || product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fiche technique rapide */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-2 text-earth-800">
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span className="text-earth-500">Référence produit :</span>
                  <span className="font-mono font-bold text-forest-950">
                    {product.sku || 'SO-REF'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span className="text-earth-500">Rayon / Famille :</span>
                  <span className="font-bold text-forest-950">{product.category?.name || 'Épicerie'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-earth-500">Conditionnement :</span>
                  <span className="font-bold text-forest-950">
                    {product.packaging || 'Conditionnement standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne Informations détaillées & Achat */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Catégorie & SKU */}
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-50 border border-forest-200 px-3 py-1 rounded-lg">
                      {product.category.name}
                    </span>
                  )}
                  {product.sku && (
                    <span className="text-xs font-mono font-bold text-earth-500 bg-cream-100 px-2.5 py-1 rounded-lg">
                      {product.sku}
                    </span>
                  )}
                </div>

                {/* Nom complet */}
                <h1
                  id="product-detail-title"
                  className="text-2xl sm:text-3xl font-serif font-black text-forest-950 leading-tight"
                >
                  {product.name}
                </h1>

                {/* Prix unitaire en FCFA */}
                <div className="p-4 sm:p-5 rounded-2xl bg-cream-100/70 border border-cream-300 flex items-baseline justify-between shadow-warm-xs">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-earth-500 block">
                      Tarif direct grossiste & demi-gros
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-forest-900 tracking-tight">
                      {formatFCFA(product.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-forest-900 font-extrabold bg-gold-400/30 border border-gold-400 px-2.5 py-1 rounded-md block">
                      Devise : FCFA
                    </span>
                    <span className="text-[11px] text-earth-500 mt-1 block">Prix en entrepôt</span>
                  </div>
                </div>

                {/* Statut de stock */}
                {isOutOfStock ? (
                  <div
                    className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-amber-950"
                    role="alert"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-sm">Rupture temporaire de stock</p>
                      <p className="text-xs mt-0.5 text-amber-900 leading-relaxed">
                        Ce produit n'est pas disponible actuellement à Makepe Missoke. Contactez-nous sur WhatsApp pour être averti du prochain arrivage.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 flex items-center gap-2.5 text-forest-950">
                    <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-bold">
                      Produit disponible en entrepôt (Marché Makepe Missoke, Douala)
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                    Description & Spécifications
                  </h2>
                  <p className="text-sm text-earth-700 leading-relaxed whitespace-pre-line">
                    {product.description ||
                      product.short_description ||
                      'Denrée alimentaire de qualité supérieure sélectionnée et distribuée par Saveurs d\'Or au Cameroun.'}
                  </p>
                </div>
              </div>

              {/* Actions d'ajout au panier & WhatsApp */}
              <div className="pt-6 border-t border-cream-200 space-y-4">
                {/* Sélecteur de quantité & Bouton d'ajout au panier */}
                {!isOutOfStock && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Stepper quantité */}
                    <div className="flex items-center justify-between border-2 border-cream-300 rounded-xl p-1 bg-white min-h-[48px] sm:w-36 shadow-warm-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-earth-700 hover:bg-cream-100 rounded-lg active:bg-cream-200 transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-base text-forest-950 w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 flex items-center justify-center text-earth-700 hover:bg-cream-100 rounded-lg active:bg-cream-200 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bouton Ajouter au Panier */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-base transition-all duration-150 min-h-[48px] shadow-warm-md ${
                        justAdded
                          ? 'bg-forest-600'
                          : 'bg-forest-800 hover:bg-forest-700 active:scale-98'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-5 h-5 text-gold-300" />
                          <span>Ajouté au panier !</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>Ajouter {quantity} au panier</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Bouton WhatsApp direct */}
                <div className="flex gap-2.5">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all min-h-[46px] shadow-warm-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Demander confirmation sur WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${COMPANY_CONFIG.phoneRaw}`}
                    className="inline-flex items-center justify-center p-3 rounded-xl border border-cream-300 hover:bg-cream-100 text-earth-700 transition-colors min-h-[46px] min-w-[46px]"
                    aria-label={`Appeler le ${COMPANY_CONFIG.phone}`}
                    title="Appeler notre service commercial"
                  >
                    <Phone className="w-4 h-4 text-forest-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section Produits similaires */}
          {similarProducts.length > 0 && onSelectProduct && (
            <div className="pt-8 border-t border-cream-200 space-y-4">
              <h3 className="text-base font-serif font-black text-forest-950">
                Dans le même rayon ({product.category?.name})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarProducts.map((sp) => {
                  const spImg = sp.images.find((i) => i.is_primary) || sp.images[0];
                  return (
                    <div
                      key={sp.id}
                      onClick={() => onSelectProduct(sp)}
                      className="p-3 rounded-xl border border-cream-200 hover:border-gold-500 bg-white hover:bg-cream-50/50 cursor-pointer transition-all flex items-center gap-3 shadow-warm-xs"
                    >
                      <div className="w-14 h-14 rounded-lg bg-cream-100 overflow-hidden shrink-0 border border-cream-200">
                        {spImg ? (
                          <img src={spImg.url} alt={sp.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-earth-400 text-[10px]">
                            Photo
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-forest-950 truncate">{sp.name}</h4>
                        <span className="text-xs font-serif font-black text-forest-900">
                          {formatFCFA(sp.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pied modal */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={openCart}
            className="inline-flex items-center gap-2 text-xs font-bold text-forest-800 hover:text-forest-950"
          >
            <ShoppingBag className="w-4 h-4 text-forest-700" />
            <span>Voir mon panier de commande</span>
          </button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Fermer la fiche
          </Button>
        </div>
      </div>
    </div>
  );
};
