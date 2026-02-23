import { setLoading, setUser, setError, setAuthStatus, logout } from '@/store/slices/authSlice'
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import useAxiosInstance from './axiosHooks';
import { useAppDispatch } from '@/store';
import type { User } from '@/types/pos';


const useAuth = () => {

    const dispatch = useAppDispatch();
    const { axiosSecure } = useAxiosInstance()
    // const { isAuthenticated } = useAppSelector(state=>state.auth);

    const userLogin = async (email: string, password: string) => {
        dispatch(setLoading(true));


        try {
            const { data } = await axiosSecure.post('/auth/signin', { email, password });
            if (data?.success) {           
                toast.success('successfully Signed In')
                await fetchUser();
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                // dispatch(setError(err));
                throw err;

            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchUser = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            // await axios.get('http://localhost:3000/log-cookies', { withCredentials: true });
            const { data } = await axiosSecure.get('/users/me') as { data: { success: boolean, user: User } };
            if (data?.success) {
                console.log(data);
                dispatch(setUser(data.user))
                dispatch(setAuthStatus({ isAuthenticated: true }));
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                dispatch(setAuthStatus({ isAuthenticated: false }));
                dispatch(setError({ message: err.message, code: err.code, status: err.status }));
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    const userLogout = async () => {
        const { data } = await axiosSecure.get('auth/signout');
        if (data?.success) {
            dispatch(logout());
            toast.success('Luccessfully Logout')

        } else {
            console.log('something went wrong');
            toast.error('something went wrong')
        }
    }


    return {
        userLogin,
        fetchUser,
        userLogout,
    };
};

export default useAuth;