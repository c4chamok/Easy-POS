import { BrowserRouter, Routes, Route } from 'react-router';
import Index from './Index';
import NotFound from './NotFound';
import Login from './Login';
import Signup from './Signup';
import { AuthProvider } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';

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
                <Route path="/" element={<AuthProvider><Index /></AuthProvider>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;