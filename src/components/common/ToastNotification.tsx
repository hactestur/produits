import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, openCart, hideToast } = useCart();

  if (!toast?.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] sm:w-auto bg-stone-900 text-white rounded-2xl shadow-2xl p-4 border border-stone-700/80 flex items-center justify-between gap-3 animate-bounce-in"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium leading-snug line-clamp-2 text-stone-100">
          {toast.message}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            hideToast();
            openCart();
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold transition-colors min-h-[36px]"
        >
          <span>Panier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={hideToast}
          className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

