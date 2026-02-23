// src/store/slices/productsSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/pos';
import { products as initialProducts } from '@/data/mockData';

interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: initialProducts,
};

const getStatus = (qty: number): Product['status'] =>
  qty === 0 ? 'out-of-stock' : qty < 10 ? 'low-stock' : 'in-stock';

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Omit<Product, 'id' | 'status'>>) {
      const product = action.payload;
      state.products.push({
        ...product,
        id: `p${Date.now()}`,
        status: getStatus(product.stockQty),
      });
    },

    updateProduct(
      state,
      action: PayloadAction<{ id: string; updates: Partial<Product> }>
    ) {
      const product = state.products.find(p => p.id === action.payload.id);
      if (!product) return;

      Object.assign(product, action.payload.updates);

      if (action.payload.updates.stockQty !== undefined) {
        product.status = getStatus(product.stockQty);
      }
    },

    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },

    reduceStock(
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product) return;

      product.stockQty = Math.max(0, product.stockQty - action.payload.qty);
      product.status = getStatus(product.stockQty);
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  reduceStock,
} = productsSlice.actions;

export default productsSlice.reducer;