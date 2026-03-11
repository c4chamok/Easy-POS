import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CheckoutDto {
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE'
  customerName?: string
  paidAmount: number
}

export interface CompletePaymentDto {
  paymentMethod?: 'CASH' | 'CARD' | 'ONLINE'
}

export interface SaleItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
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
      invalidatesTags: ['Orders']
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

    getOrders: builder.query<Sale[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
      transformResponse: (res: { success: boolean ; message: string; data: Sale[]})=> res.data,
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
  useGetOrderQuery
} = orderApi;