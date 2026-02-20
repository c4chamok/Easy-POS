import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types/pos';

interface CartContextType {
  items: Record<string, CartItem>;
  subtotal: number;
  grandTotal: number;
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});

  const calculateTotals = useCallback((cartItems: Record<string, CartItem>) => {
    const subtotal = Object.values(cartItems).reduce((sum, item) => sum + item.lineTotal, 0);
    return { subtotal, grandTotal: subtotal };
  }, []);

  const addToCart = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev[product.id];
      if (existing) {
        const newQty = existing.qty + 1;
        return {
          ...prev,
          [product.id]: {
            ...existing,
            qty: newQty,
            lineTotal: product.price * newQty,
          },
        };
      }
      return {
        ...prev,
        [product.id]: {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          lineTotal: product.price,
        },
      };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = { ...prev };
      delete newItems[productId];
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => {
      const item = prev[productId];
      if (!item) return prev;
      return {
        ...prev,
        [productId]: {
          ...item,
          qty,
          lineTotal: item.price * qty,
        },
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const { subtotal, grandTotal } = calculateTotals(items);
  const itemCount = Object.values(items).reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        grandTotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
