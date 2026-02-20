import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type Product, type Order, type TabType, type User } from '@/types/pos';
import { products as initialProducts, orders as initialOrders, currentUser } from '@/data/mockData';

interface POSContextType {
  user: User;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderPayment: (id: string, amount: number) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addProduct = (product: Omit<Product, 'id' | 'status'>) => {
    const status: Product['status'] = 
      product.stockQty === 0 ? 'out-of-stock' : 
      product.stockQty < 10 ? 'low-stock' : 'in-stock';
    
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      status,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      if (updates.stockQty !== undefined) {
        updated.status = 
          updates.stockQty === 0 ? 'out-of-stock' : 
          updates.stockQty < 10 ? 'low-stock' : 'in-stock';
      }
      return updated;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Update product stock
    order.items.forEach(item => {
      updateProduct(item.productId, {
        stockQty: Math.max(0, (products.find(p => p.id === item.productId)?.stockQty || 0) - item.qty),
      });
    });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateOrderPayment = (id: string, amount: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const newPaidAmount = o.paidAmount + amount;
      return {
        ...o,
        paidAmount: newPaidAmount,
        fullPaid: newPaidAmount >= o.total,
      };
    }));
  };

  return (
    <POSContext.Provider
      value={{
        user: currentUser,
        activeTab,
        setActiveTab,
        products,
        setProducts,
        orders,
        setOrders,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updateOrderPayment,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
