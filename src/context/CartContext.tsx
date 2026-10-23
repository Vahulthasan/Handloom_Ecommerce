'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, OrderItem } from '@/types';

export interface CartItem extends OrderItem {
  product: Product;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number, size?: string, finish?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalContainerUnits: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vintage_collections_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  const showToast = (title: string, message: string, image?: string) => {
    const id = Date.now().toString();
    setToast({ id, title, message, image });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const dismissToast = () => {
    setToast(null);
  };

  const addToCart = (product: Product, qty: number = 1, size?: string, finish?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product_id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].qty + qty;
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: newQty,
          selected_size: size || updated[existingIndex].selected_size,
          selected_finish: finish || updated[existingIndex].selected_finish,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        order_id: '',
        product_id: product.id,
        product_name: product.name,
        product_image: product.images[0] || '/images/round-shade.jpg',
        qty,
        unit_price: product.price_eur,
        units_per_slot: product.units_per_container_slot,
        selected_size: size || product.size_approx,
        selected_finish: finish || 'Natural Honey Bamboo',
        product,
      };
      return [...prev, newItem];
    });

    showToast(
      'Added to Cart',
      `${product.name} (${qty}x) reserved for the next EU sea container.`,
      product.images[0]
    );

    // Optional: open drawer automatically or let toast guide user
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, qty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.qty, 0);

  const totalContainerUnits = items.reduce(
    (sum, item) => sum + item.qty * item.units_per_slot,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        totalContainerUnits,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
