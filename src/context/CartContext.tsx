import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '../types/product';
import type { CartItem } from '../types/cart';

const CART_STORAGE_KEY = 'amigo_cart_v1';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  isOrderModalOpen: boolean;
  toast: { message: string; visible: boolean } | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openOrderModal: () => void;
  closeOrderModal: () => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erreur lors de la lecture du panier local:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  // Sauvegarde dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Impossible de sauvegarder le panier dans localStorage:', e);
    }
  }, [items]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fermeture automatique du toast après 4 secondes
  useEffect(() => {
    if (!toast?.visible) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (quantity <= 0) return;

    // Ne pas autoriser l'ajout d'un produit en rupture de stock sauf si explicitement géré
    if (product.availability === 'out_of_stock') {
      alert("Ce produit est actuellement en rupture de stock. Contactez notre équipe commerciale pour connaître la prochaine date d'arrivage.");
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    const packagingInfo = product.packaging ? ` (${product.packaging})` : '';
    showToast(`✓ Ajouté au panier : ${quantity}x ${product.name}${packagingInfo}`);
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, 9999) } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openOrderModal = useCallback(() => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  }, []);

  const closeOrderModal = useCallback(() => setIsOrderModalOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalAmount,
      isCartOpen,
      isOrderModalOpen,
      toast,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openOrderModal,
      closeOrderModal,
      hideToast,
    }),
    [
      items,
      totalItems,
      totalAmount,
      isCartOpen,
      isOrderModalOpen,
      toast,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openOrderModal,
      closeOrderModal,
      hideToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

