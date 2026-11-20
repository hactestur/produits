import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatFCFA } from '../../utils/formatters';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItems,
    totalAmount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openOrderModal,
  } = useCart();

  const [confirmClear, setConfirmClear] = useState(false);

  if (!isCartOpen) return null;

  const handleClear = () => {
    if (confirmClear) {
      clearCart();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Fond sombre avec flou d'arrière-plan */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-forest-950/70 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-warm-xl flex flex-col border-l border-cream-200">
          {/* En-tête du Panier */}
          <div className="p-4 sm:p-6 bg-forest-950 text-white flex items-center justify-between shrink-0 shadow-warm-xs border-b border-forest-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 border border-forest-700 text-gold-400 flex items-center justify-center shadow-warm-xs">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="text-lg sm:text-xl font-serif font-black tracking-tight">
                  Panier de Commande
                </h2>
                <p className="text-xs text-cream-300">
                  {totalItems} article{totalItems > 1 ? 's' : ''} sélectionné{totalItems > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-cream-400 hover:text-white rounded-xl hover:bg-forest-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fermer le panier"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Bandeau d'information commerciale sans paiement */}
          <div className="bg-cream-100 border-b border-cream-300 px-4 py-2.5 text-xs text-earth-900 flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" aria-hidden="true" />
            <span className="leading-tight">
              <strong>Demande sans paiement en ligne</strong> : validation du stock et expédition directe par nos commerciaux.
            </span>
          </div>

          {/* Corps : Liste des produits ou État vide */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-cream-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-cream-100 text-forest-700 flex items-center justify-center border border-cream-200">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black text-forest-950">Votre panier est vide</h3>
                  <p className="text-sm text-earth-600 max-w-xs mt-1 leading-relaxed">
                    Sélectionnez vos denrées alimentaires dans notre catalogue pour créer votre demande de cotation ou de commande.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm transition-colors min-h-[48px] shadow-warm-xs"
                >
                  <span>Découvrir nos rayons</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {items.map((item) => {
                  const primaryImage =
                    item.product.images.find((img) => img.is_primary) || item.product.images[0];
                  const lineTotal = item.quantity * item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="pt-4 first:pt-0 flex gap-3.5 sm:gap-4 items-start"
                    >
                      {/* Miniature */}
                      <div className="w-20 h-20 rounded-xl bg-cream-100 border border-cream-200 overflow-hidden shrink-0 relative">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.alt_text || item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-earth-400 text-xs">
                            Sans photo
                          </div>
                        )}
                      </div>

                      {/* Détails Produit */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-forest-950 text-sm leading-snug truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-earth-400 hover:text-rose-600 p-1 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            aria-label={`Supprimer ${item.product.name} du panier`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Conditionnement et référence */}
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-earth-500 flex-wrap">
                          {item.product.packaging && (
                            <span className="font-semibold text-earth-800 bg-cream-100 px-2 py-0.5 rounded-md">
                              {item.product.packaging}
                            </span>
                          )}
                          {item.product.sku && (
                            <span className="text-[11px] font-mono text-earth-400">
                              {item.product.sku}
                            </span>
                          )}
                        </div>

                        {/* Prix unitaire */}
                        <p className="text-xs text-earth-500 mt-1">
                          Prix unitaire : <span className="font-bold text-forest-900">{formatFCFA(item.product.price)}</span>
                        </p>

                        {/* Contrôles de quantité et Sous-total */}
                        <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                          {/* Stepper de quantité */}
                          <div className="inline-flex items-center border border-cream-300 rounded-lg overflow-hidden bg-white shadow-warm-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-earth-700 hover:bg-cream-100 active:bg-cream-200 transition-colors disabled:opacity-30"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="9999"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                  updateQuantity(item.product.id, val);
                                }
                              }}
                              className="w-12 h-8 text-center text-sm font-bold text-forest-950 border-x border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              aria-label={`Quantité pour ${item.product.name}`}
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-earth-700 hover:bg-cream-100 active:bg-cream-200 transition-colors"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Sous-total de ligne */}
                          <div className="text-right">
                            <span className="text-[10px] text-earth-400 font-bold uppercase tracking-wider block">Sous-total</span>
                            <span className="text-base font-serif font-black text-forest-900">
                              {formatFCFA(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pied du panier avec Totaux et Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-cream-50/90 border-t border-cream-200 shrink-0 space-y-4">
              {/* Récapitulatif financier indicatif */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm text-earth-600">
                  <span>Nombre d'articles au total :</span>
                  <span className="font-black text-forest-950">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-base sm:text-lg pt-1 border-t border-cream-200">
                  <span className="font-bold text-forest-950">Total indicatif :</span>
                  <span className="text-2xl font-serif font-black text-forest-900 tracking-tight">
                    {formatFCFA(totalAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-earth-500 leading-tight italic">
                  * Montant indicatif en Francs CFA. Conditions de transport et confirmation des quantités établies avec notre commercial sur WhatsApp.
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={openOrderModal}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-black text-base transition-all duration-150 min-h-[50px] shadow-warm-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700"
                >
                  <span>Passer la demande de commande</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1.5 text-xs text-earth-500 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{confirmClear ? 'Confirmer : Vider le panier ?' : 'Vider le panier'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-xs text-forest-800 hover:text-forest-950 underline font-semibold p-1.5"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
