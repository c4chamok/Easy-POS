import { useAppDispatch, useAppSelector } from '@/store';
import { setCart, } from '@/store/slices/cartSlice';
import useAxiosInstance from './axiosHooks';
import { useEffect, useRef } from 'react';
import type { Product } from '@/types/pos';
import { toast } from 'sonner';



export const useCart = () => {
    const dispatch = useAppDispatch();
    const { axiosSecure } = useAxiosInstance();
    const items = useAppSelector(state => state.cart.items);

    const lastSyncedRef = useRef<string>('');
    const timerRef = useRef<number | null>(null);
    const channelRef = useRef<BroadcastChannel | null>(null);

    /**
     * 1️⃣ Fetch cart on mount
     */
    useEffect(() => {

        const fetchCart = async () => {
            try {
                const { data } = await axiosSecure.get<{ 
                    data: { 
                        id: string;
                        productId: string;
                        product: Product;
                        quantity: number;

                    }[]
                }>('/cart');

                const cartItems = data.data.map((item) => ({
                    productId: item.productId,
                    lineTotal: item.product.price * item.quantity,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                }));
                dispatch(setCart(cartItems));
                lastSyncedRef.current = JSON.stringify(cartItems);
            } catch (err) {
                console.error('Failed to fetch cart', err);
                toast.error('Failed to load cart. Please try again later.');
            }
        };

        fetchCart();
    }, [axiosSecure, dispatch]);

    /**
     * 2️⃣ Auto sync (debounced 1 second)
     */
    useEffect(() => {
        const currentSerialized = JSON.stringify(items);

        // Do nothing if nothing changed
        if (currentSerialized === lastSyncedRef.current) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
            try {
                await axiosSecure.post('/cart/sync', items);
                console.log(items);
                channelRef.current?.postMessage(items); // Broadcast updated cart items to other tabs

                lastSyncedRef.current = currentSerialized;
                console.log('Cart synced');
            } catch (err) {
                console.error('Cart sync failed', err);
                toast.error('Failed to sync cart. Please try again later.');
            }
        }, 1000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [axiosSecure, items]);

    /// 3️⃣ Listen for cart updates from other tabs

    useEffect(() => {
        channelRef.current = new BroadcastChannel('cart');

        channelRef.current.onmessage = (event) => {
            const incomingCart = event.data;

            dispatch(setCart(incomingCart));
            lastSyncedRef.current = JSON.stringify(incomingCart);
        };

        return () => {
            channelRef.current?.close();
        };
    }, [dispatch]);

};

export default useCart;