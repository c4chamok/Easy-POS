import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types/pos';

interface CartState {
  items: CartItem[];
  subtotal: number;
  grandTotal: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  grandTotal: 0,
  itemCount: 0,
};

/**
 * Helper to recalculate derived values
 */
const recalc = (state: CartState) => {

  state.subtotal = state.items.reduce((sum, item) => sum + item.lineTotal, 0);
  state.grandTotal = state.subtotal; // taxes/discount later
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      recalc(state);
    },

    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find(item => item.productId === product.id);

      if (existing) {
        existing.quantity += 1;
        existing.lineTotal = existing.price * existing.quantity;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          lineTotal: product.price,
        });
      }

      recalc(state);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      //   delete state.items[action.payload];
      state.items = state.items.filter(item => item.productId !== action.payload);
      recalc(state);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) {
      const { productId, qty } = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (!item) return;

      if (qty <= 0) {
        state.items = state.items.filter(item => item.productId !== productId);
      } else {
        item.quantity = qty;
        item.lineTotal = item.price * qty;
      }

      recalc(state);
    },

    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.grandTotal = 0;
      state.itemCount = 0;
    },

  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;