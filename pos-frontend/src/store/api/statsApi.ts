import type { Product } from "@/types/pos";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type TopSellingData = {
    productId: string;
    name: string;
    unitsSold: number;
}

export type SaleByDayStat = {
    _sum: {
        total: number;
    },
    _count: {
        id: number;
    },
    createdAt: string;
}

export type StatsData = {
    totalSalesAmount: number;
    sales: SaleByDayStat[];
    topSellingProducts: TopSellingData[];
    pendingSales: number;
    lowStockProducts: Product[];
    totalProducts: number;

}

interface StatsQueryResponse {
    success: boolean;
    message: string;
    data: StatsData
}

export const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_UPL}/api`, // change if needed
        credentials: 'include',
    }),

    tagTypes: ['Stats'],

    endpoints: (builder) => ({

        // ✅ GET Stats
        getStats: builder.query<StatsQueryResponse, void>({
            query: () => `/stats?days=365`,
            providesTags: ['Stats'],
        }),
    }),
});

export const { useGetStatsQuery } = statsApi;
