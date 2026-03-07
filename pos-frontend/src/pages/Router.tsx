import { BrowserRouter, Routes, Route } from 'react-router';
import NotFound from './NotFound';
import Login from './Login';
import Signup from './Signup';
import { AuthProvider } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { POSProvider } from '@/context/POSContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { InventoryTab } from '@/components/tabs/InventoryTab';
import { OrdersTab } from '@/components/tabs/OrdersTab';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { SalesTab } from '@/components/tabs/SalesTab';

const Router = () => {
    const { fetchUser } = useAuth();
    useEffect(() => {
        fetchUser();
    }, [fetchUser])
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<AuthProvider>
                    <POSProvider>
                        <MainLayout />
                    </POSProvider>
                </AuthProvider>}>
                    <Route path="/" element={<OverviewTab />} />
                    <Route path="/sales" element={<SalesTab />} />
                    <Route path="/inventory" element={<InventoryTab />} />
                    <Route path="/orders" element={<OrdersTab />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;