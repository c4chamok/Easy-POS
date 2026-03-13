// POS Type Definitions

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'SELLER';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stockQty: number;
  image: string;
  description?: string;
  status?: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paidAmount: number;
  fullPaid: boolean;
  status: 'PENDING' | 'COMPLETED';
  paymentMethod?: 'cash' | 'card' | 'mobile';
  createdAt: string;
  customerName?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export type TabType = 'overview' | 'sales' | 'inventory' | 'orders';
