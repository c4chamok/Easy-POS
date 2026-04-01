import type { IPagination } from '@/components/common/CustomPagination'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { statsApi } from './statsApi'
import { productsApi } from './productsApi'
import type { Product } from '@/types/pos'

export interface CheckoutDto {
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE'
  customerName?: string
  paidAmount: number
}

export interface CompletePaymentDto {
  paymentMethod?: 'CASH' | 'CARD' | 'MOBILE'
}

export interface SaleItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  product: Product
}

export interface Sale {
  id: string
  total: number
  paymentMethod: string
  customerName?: string
  status: 'PENDING' | 'COMPLETED'
  createdAt: string
  items: SaleItem[]
}

type OrderResponse = {
  success: boolean;
  message: string;
  data: Sale[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_UPL}/api`,
    credentials: 'include'
  }),

  tagTypes: ['Orders', 'Order'],

  endpoints: (builder) => ({

    checkout: builder.mutation<Sale, CheckoutDto>({
      query: (body) => ({
        url: '/orders/checkout',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Orders'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          // wait until API succeeds
          await queryFulfilled;

          // 🔥 manually invalidate stats
          dispatch(statsApi.util.invalidateTags(["Stats"]));
          dispatch(productsApi.util.invalidateTags(["Products"]));

        } catch (err) {
          console.log("failed", err);
        }
      }
    }),

    completePayment: builder.mutation<
      Sale,
      { orderId: string; body: CompletePaymentDto }>({
        query: ({ orderId, body }) => ({
          url: `/orders/${orderId}/payment`,
          method: 'PATCH',
          body
        }),
        invalidatesTags: (result, error, { orderId }) => {
          console.log(result, error);
          return [
            { type: 'Order', id: orderId },
            'Orders'
          ];
        }
      }),

    changeStatus: builder.mutation<Sale, {
      orderId: string;
      status: Sale['status']
    }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (result, error, { orderId }) => {
        console.log(result, error);
        return [
          { type: 'Order', id: orderId },
          'Orders',
        ];
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          // wait until API succeeds
          await queryFulfilled;

          // 🔥 manually invalidate stats
          dispatch(statsApi.util.invalidateTags(["Stats"]));

        } catch (err) {
          console.log("failed", err);
        }
      }
    }),

    getOrders: builder.query<{ orders: Sale[]; meta: OrderResponse['meta'] }, IPagination>({
      query: (dto) => `orders?page=${dto.currentPage}&limit=${dto.limit}`,
      providesTags: ['Orders'],
      transformResponse: (res: OrderResponse) => ({
        orders: res.data,
        meta: res.meta,
      }),
    }),

    getOrder: builder.query<Sale, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, id) => {
        console.log(result, error);
        return [{ type: 'Order', id }];
      }
    })
  })
})

export const {
  useCheckoutMutation,
  useCompletePaymentMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useChangeStatusMutation,
} = orderApi;