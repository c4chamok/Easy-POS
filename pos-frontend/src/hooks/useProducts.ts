import type { Product } from '@/types/pos';
import { useCallback, useEffect, useState } from 'react';
import useAxiosInstance from './axiosHooks';

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

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { axiosSecure } = useAxiosInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axiosSecure.get<
        ProductResponse>(`/products?limit=1000&page=1`);
      const items = res.data.map((item) => {
        const product: Product = {
          ...item,
          status: item.stockQty === 0 ? 'out-of-stock' : item.stockQty < 10 ? 'low-stock' : 'in-stock',
        };
        return product;
      });
      setProducts(items);
    } catch (e) {
      console.error('Failed to fetch products:', e);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
      fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
  };
};

export default useProducts;