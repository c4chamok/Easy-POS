// src/redux/features/products/productsApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '@/types/pos';
import type { IPagination } from '@/components/common/CustomPagination';

type ProductResponse = {
  success: boolean;
  message: string;
  data: Omit<Product, 'status'>[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_UPL}/api`, // change if needed
    credentials: 'include',
  }),

  tagTypes: ['Products'],

  endpoints: (builder) => ({

    // ✅ GET PRODUCTS
    getProducts: builder.query<ProductResponse, IPagination | void>({
      query: (dto) => `/products?page=${dto?.currentPage ?? 1}&limit=${dto?.limit ?? 1000}`,
      providesTags: ['Products'],
    }),

    // ✅ CREATE PRODUCT
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),

    // ✅ UPDATE PRODUCT
    updateProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }>({
        query: ({ id, data }) => ({
          url: `/products/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Products'],
      }),

    // ✅ DELETE PRODUCT
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;