// src/store/slices/ordersSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '@/types/pos';
import { orders as initialOrders } from '@/data/mockData';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: initialOrders,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Omit<Order, 'id' | 'createdAt'>>) {
      state.orders.unshift({
        ...action.payload,
        id: `ORD-${String(state.orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      });
    },

    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: Order['status'] }>
    ) {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) order.status = action.payload.status;
    },

    updateOrderPayment(
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (!order) return;

      order.paidAmount += action.payload.amount;
      order.fullPaid = order.paidAmount >= order.total;
    },
  },
});

export const {
  addOrder,
  updateOrderStatus,
  updateOrderPayment,
} = ordersSlice.actions;

export default ordersSlice.reducer;